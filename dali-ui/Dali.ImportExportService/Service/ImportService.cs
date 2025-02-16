using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Dali.ImportExportService.DTO;
using Dali.ImportExportService.Helper;
using Dali.ImportExportService.Repository;
using Dali.ImportExportService.Validation;
using Dali.ImportExportService.Infrastructure.Data;
using Dali.ImportExportService.Models;
using FileModel = Dali.ImportExportService.Models.File;

using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using System.IO;

namespace Dali.ImportExportService.Service
{
 
 public class ImportService : IImportService
    {
        private readonly ILogger<ImportService> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IImportMappingHelper _mappingHelper;
        private readonly IImportRepository _repository;
        private readonly IImportValidator _validator;
        private readonly string _userId;
        private readonly string _tenantId;
        private readonly DateTime _importTimestamp;

        public ImportService(
            ILogger<ImportService> logger,
            ApplicationDbContext context,
            IImportMappingHelper mappingHelper,
            IImportRepository repository,
            IImportValidator validator,
            string userId,
            string tenantId)
        {
            _logger = logger;
            _context = context;
            _mappingHelper = mappingHelper;
            _repository = repository;
            _validator = validator;
            _userId = userId;
            _tenantId = tenantId;
            _importTimestamp = DateTime.UtcNow;
        }

        private async Task<int> GetNextOrderIndex<T>(IQueryable<T> query) where T : class
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                var maxOrder = await query.MaxAsync(e => EF.Property<int?>(e, "OrderIndex")) ?? 0;
                return maxOrder == 0 ? 1 : maxOrder + 1;
            });
        }

        public async Task<Collection> GetCollectionAsync(int collectionId)
        {
            return await _context.Collections
                .FirstOrDefaultAsync(c => c.Id == collectionId && c.TenantId == _tenantId);
        }

        public async Task<ImportResult> ImportDocumentsAsync(IFormFile file, int collectionId, string tenantId, string userId)
        {
            var result = new ImportResult();

            try
            {
                if (file == null || file.Length == 0)
                {
                    result.Errors.Add(new ImportError { Field = "File", Message = "No file was uploaded", Type = "Validation" });
                    return result;
                }

                var collection = await _context.Collections
                    .FirstOrDefaultAsync(c => c.Id == collectionId && c.TenantId == tenantId);

                if (collection == null)
                {
                    result.Errors.Add(new ImportError { Field = "Collection", Message = "Collection not found", Type = "Validation" });
                    return result;
                }

                using var stream = new MemoryStream();
                await file.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);

                _logger.LogInformation("Starting import process for collection {CollectionId}", collectionId);

                // Process sheets in order
                var attachmentsSheet = package.Workbook.Worksheets["Bijlagen"];
                var referencesSheet = package.Workbook.Worksheets["Bronverwijzingen"];
                var specificationsSheet = package.Workbook.Worksheets["Specificaties"];

                // First process attachments (Sheet 1)
                if (attachmentsSheet != null)
                {
                    await ProcessAttachmentsSheet(attachmentsSheet, result);
                    _logger.LogInformation("Completed processing attachments sheet. Successful records: {SuccessfulRecords}", result.SuccessfulRecords);
                }

                // Then process references (Sheet 2)
                if (referencesSheet != null)
                {
                    await ProcessReferencesSheet(referencesSheet, result);
                    _logger.LogInformation("Completed processing references sheet. Successful records: {SuccessfulRecords}", result.SuccessfulRecords);
                }

                // Finally process specifications (Sheet 3) and create relationships
                if (specificationsSheet != null)
                {
                    _logger.LogInformation("Starting to process specifications sheet");
                    await ProcessSpecificationsSheet(specificationsSheet, collection, result);
                    _logger.LogInformation("Completed processing specifications sheet. Successful records: {SuccessfulRecords}", result.SuccessfulRecords);

                    // After specifications are processed, process file and link relationships
                    await ProcessFileRelationships(collection.Id, result);
                    await ProcessLinkRelationships(collection.Id, result);
                }

                result.Success = result.FailedRecords == 0 && result.SuccessfulRecords > 0;
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing documents for tenant {TenantId}", tenantId);
                result.Errors.Add(new ImportError { Field = "System", Message = $"System error: {ex.Message}", Type = "System" });
                return result;
            }
        }

        private async Task ProcessAttachmentsSheet(ExcelWorksheet sheet, ImportResult result)
        {
            if (sheet == null || sheet.Dimension == null)
            {
                _logger.LogWarning("Attachments sheet not found or empty - skipping");
                return;
            }

            try
            {
                _logger.LogInformation("Starting to process attachments sheet with {Rows} rows", sheet.Dimension.End.Row - 1);

                var headers = sheet.Cells[1, 1, 1, sheet.Dimension.End.Column]
                    .Select(cell => cell.Text?.Trim())
                    .ToList();

                _logger.LogInformation("Found headers in attachments sheet: {Headers}", string.Join(", ", headers));

                var requiredColumns = new[]
                {
                    "ID",               // ID (Required)
                    "Omschrijving"      // Description (Required)
                    // "Bestandsnaam" is now optional
                };

                if (!ValidateRequiredColumns(headers, requiredColumns, result))
                {
                    return;
                }

           

                var filesToAdd = new List<FileModel>();
                var filesToUpdate = new List<FileModel>();
                var processedIds = new HashSet<string>();

                for (int row = 2; row <= sheet.Dimension.End.Row; row++)
                {
                    try
                    {
                        var rowData = GetRowData(sheet, row, headers);
                        if (!ValidateRowData(rowData, requiredColumns, row, result)) continue;

                        var externalId = rowData["ID"];  // Keep original ID without trimming

                        // Check for duplicate IDs in current sheet
                        if (processedIds.Contains(externalId))
                        {
                            _logger.LogWarning("Duplicate ID {ExternalId} found in row {Row} - skipping", externalId, row);
                            result.Errors.Add(new ImportError
                            {
                                Field = "ID",
                                Message = $"Duplicate ID '{externalId}' found in row {row}",
                                Type = "Warning",
                                RowNumber = row
                            });
                            continue;
                        }

                        processedIds.Add(externalId);

                        var filePath = rowData["Bestandsnaam"] ?? string.Empty;
                        var fileType = !string.IsNullOrWhiteSpace(filePath) 
                            ? Path.GetExtension(filePath)?.TrimStart('.')?.ToLower() ?? "unknown"
                            : "unknown";
                        const long defaultSize = 0;

                            // Check for existing link by ExternalId only
                        var existingFile = await _context.Files
                            .FirstOrDefaultAsync(l => l.ExternalId == externalId);

                        if (existingFile != null)
                        {
                            _logger.LogInformation("Updating existing file - ID: {ExternalId}, Old FilePath: {OldFilePath}, New FilePath: {NewFilePath}, Old Description: {OldDescription}, New Description: {NewDescription}",
                                externalId,
                                existingFile.FilePath,
                                filePath,
                                existingFile.Description,
                                rowData["Omschrijving"]);

                            // Update existing file
                            existingFile.Name = rowData["Omschrijving"] ?? string.Empty;
                            existingFile.Description = rowData["Omschrijving"] ?? string.Empty;
                            existingFile.FilePath = filePath;
                            existingFile.FileType = fileType;
                            existingFile.Size = defaultSize;
                            existingFile.ModifiedBy = _userId;
                            existingFile.ModifiedDate = _importTimestamp;
                            filesToUpdate.Add(existingFile);
                        }
                        else
                        {
                            _logger.LogInformation("Creating new file - ID: {ExternalId}, FilePath: {FilePath}, Description: {Description}",
                                externalId, filePath, rowData["Omschrijving"]);

                            // Create new file
                            var file = new FileModel
                            {
                                ExternalId = externalId,
                                Name = !string.IsNullOrWhiteSpace(filePath) ? Path.GetFileName(filePath) : string.Empty,
                                Description = rowData["Omschrijving"] ?? string.Empty,
                                FilePath = filePath,
                                FileType = fileType,
                                Size = defaultSize,
                                TenantId = _tenantId,
                                CreatedBy = _userId,
                                CreatedDate = _importTimestamp,
                                ModifiedBy = _userId,
                                ModifiedDate = _importTimestamp,
                                IsActive = true
                            };
                            filesToAdd.Add(file);
                        }

                        // Process in batches of 1000
                        if (filesToAdd.Count >= 1000 || filesToUpdate.Count >= 1000)
                        {
                            await SaveFilesBatchAsync(filesToAdd, filesToUpdate);
                            result.SuccessfulRecords += filesToAdd.Count + filesToUpdate.Count;
                            filesToAdd.Clear();
                            filesToUpdate.Clear();
                        }
                    }
                    catch (Exception ex)
                    {
                        LogAndAddError(ex, row, result);
                    }
                }

                // Save any remaining files
                if (filesToAdd.Any() || filesToUpdate.Any())
                {
                    await SaveFilesBatchAsync(filesToAdd, filesToUpdate);
                    result.SuccessfulRecords += filesToAdd.Count + filesToUpdate.Count;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Attachments sheet");
                throw;
            }
        }

        private async Task SaveFilesBatchAsync(List<FileModel> filesToAdd, List<FileModel> filesToUpdate)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    if (filesToAdd.Any())
                    {
                        await _context.Files.AddRangeAsync(filesToAdd);
                    }
                    if (filesToUpdate.Any())
                    {
                        _context.Files.UpdateRange(filesToUpdate);
                    }
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        private async Task ProcessReferencesSheet(ExcelWorksheet sheet, ImportResult result)
        {
            if (sheet == null || sheet.Dimension == null)
            {
                _logger.LogWarning("References sheet not found or empty - skipping");
                return;
            }

            try
            {
                _logger.LogInformation("Starting to process references sheet with {Rows} rows", sheet.Dimension.End.Row - 1);

                var headers = sheet.Cells[1, 1, 1, sheet.Dimension.End.Column]
                    .Select(cell => cell.Text?.Trim())
                    .ToList();

                _logger.LogInformation("Found headers in references sheet: {Headers}", string.Join(", ", headers));

                var requiredColumns = new[]
                {
                    "ID",               // ID (Required)
                    "Omschrijving"      // Description (Required)
                    // "Url" is now optional
                };

                if (!ValidateRequiredColumns(headers, requiredColumns, result))
                {
                    return;
                }

                var linksToAdd = new List<Link>();
                var linksToUpdate = new List<Link>();
                var processedIds = new HashSet<string>();

                for (int row = 2; row <= sheet.Dimension.End.Row; row++)
                {
                    try
                    {
                        var rowData = GetRowData(sheet, row, headers);
                        if (!ValidateRowData(rowData, requiredColumns, row, result)) continue;

                        var externalId = rowData["ID"];

                        // Check for duplicate IDs in current sheet
                        if (processedIds.Contains(externalId))
                        {
                            _logger.LogWarning("Duplicate ID {ExternalId} found in row {Row} - skipping", externalId, row);
                            result.Errors.Add(new ImportError
                            {
                                Field = "ID",
                                Message = $"Duplicate ID '{externalId}' found in row {row}",
                                Type = "Warning",
                                RowNumber = row
                            });
                            continue;
                        }

                        processedIds.Add(externalId);

                        var url = rowData["Url"] ?? string.Empty;
                        var description = rowData["Omschrijving"] ?? string.Empty;
                        var titleText = description.Length > 50 ? description.Substring(0, 47) + "..." : description;

                        // Check for existing link by ExternalId only
                        var existingLink = await _context.Links
                            .FirstOrDefaultAsync(l => l.ExternalId == externalId);

                        if (existingLink != null)
                        {
                            _logger.LogInformation("Updating existing link - ID: {ExternalId}, Old URL: {OldURL}, New URL: {NewURL}",
                                externalId, existingLink.Url, url);

                            // Update existing link
                            existingLink.Url = url;
                            existingLink.Description = description;
                            existingLink.Title = titleText;
                            existingLink.ModifiedBy = _userId;
                            existingLink.ModifiedDate = _importTimestamp;
                            existingLink.IsActive = true;
                            linksToUpdate.Add(existingLink);
                        }
                        else
                        {
                            _logger.LogInformation("Creating new link - ID: {ExternalId}, URL: {URL}", externalId, url);

                            // Create new link
                            var link = new Link
                            {
                                ExternalId = externalId,
                                Url = url,
                                Description = description,
                                Title = titleText,
                                TenantId = _tenantId,
                                CreatedBy = _userId,
                                CreatedDate = _importTimestamp,
                                ModifiedBy = _userId,
                                ModifiedDate = _importTimestamp,
                                IsActive = true
                            };
                            linksToAdd.Add(link);
                        }

                        // Process in batches of 1000
                        if (linksToAdd.Count >= 1000 || linksToUpdate.Count >= 1000)
                        {
                            await SaveLinksBatchAsync(linksToAdd, linksToUpdate);
                            result.SuccessfulRecords += linksToAdd.Count + linksToUpdate.Count;
                            linksToAdd.Clear();
                            linksToUpdate.Clear();
                        }
                    }
                    catch (Exception ex)
                    {
                        LogAndAddError(ex, row, result);
                    }
                }

                // Save any remaining links
                if (linksToAdd.Any() || linksToUpdate.Any())
                {
                    await SaveLinksBatchAsync(linksToAdd, linksToUpdate);
                    result.SuccessfulRecords += linksToAdd.Count + linksToUpdate.Count;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing References sheet");
                throw;
            }
        }

        private async Task SaveLinksBatchAsync(List<Link> linksToAdd, List<Link> linksToUpdate)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    if (linksToAdd.Any())
                    {
                        await _context.Links.AddRangeAsync(linksToAdd);
                    }
                    if (linksToUpdate.Any())
                    {
                        _context.Links.UpdateRange(linksToUpdate);
                    }
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        private async Task ProcessSpecificationsSheet(ExcelWorksheet sheet, Collection collection, ImportResult result)
        {
            if (sheet == null || sheet.Dimension == null)
            {
                _logger.LogWarning("Specifications sheet not found or empty - skipping");
                return;
            }

            try
            {
                _logger.LogInformation("Starting to process specifications sheet with {Rows} rows", sheet.Dimension.End.Row - 1);
                
                var headers = sheet.Cells[1, 1, 1, sheet.Dimension.End.Column]
                    .Select(cell => cell.Text?.Trim())
                    .ToList();

                _logger.LogInformation("Found headers: {Headers}", string.Join(", ", headers));

                var requiredColumns = new[]
                {
                    "Hoofdstuk",         // Section (Required)
                    "Niveau",            // Stage (Required)
                    "Gemeente",          // Client (Required)
                    "Woonkern",          // Location (Required)
                    "Gebiedsoort/Straatsoort/Elementsoort",   // Area (Required)
                    "Onderwerp",         // Topic (Required)
                    "Subonderwerp",      // Subtopic (Optional)
                    "Hardheid",          // EnforcementLevel (Required)
                    "Bronverwijzing",    // Links (Optional)
                    "Bijlage(-n)",       // Files (Optional)
                    "Eis",               // Document Description (Required)
                    "ID"                 // External ID (Required)
                };

                if (!ValidateRequiredColumns(headers, requiredColumns, result))
                {
                    _logger.LogWarning("Missing required columns in specifications sheet");
                    foreach (var error in result.Errors.Where(e => e.Field == "Headers"))
                    {
                        _logger.LogWarning("Validation error: {Message}", error.Message);
                    }
                    return;
                }

                _logger.LogInformation("Starting to process {RowCount} rows in specifications sheet", sheet.Dimension.End.Row - 1);
                var processedRows = 0;

                for (int row = 2; row <= sheet.Dimension.End.Row; row++)
                {
                    try
                    {
                        _logger.LogInformation("Processing row {Row}", row);
                        var rowData = GetRowData(sheet, row, headers);
                        
                        // Skip empty rows
                        if (rowData.Values.All(string.IsNullOrWhiteSpace))
                        {
                            _logger.LogInformation("Skipping empty row {Row}", row);
                            continue;
                        }

                        // Log all values in the row for debugging
                        foreach (var kvp in rowData)
                        {
                            _logger.LogInformation("Row {Row} - {Column}: {Value}", row, kvp.Key, kvp.Value);
                        }

                        // Validate required fields
                        var missingFields = new List<string>();
                        foreach (var col in requiredColumns)
                        {
                            if (!IsOptionalField(col) && string.IsNullOrWhiteSpace(rowData.GetValueOrDefault(col)))
                            {
                                missingFields.Add(col);
                                _logger.LogWarning("Required field {Field} is missing in row {Row}", col, row);
                            }
                        }

                        if (missingFields.Any())
                        {
                            foreach (var field in missingFields)
                            {
                                result.Errors.Add(new ImportError
                                {
                                    Field = field,
                                    Message = $"Required value for '{field}' is missing in row {row}",
                                    Type = "Validation",
                                    RowNumber = row
                                });
                            }
                            result.FailedRecords++;
                            continue;
                        }

                        // Create document with proper OrderIndex
                        var documentOrderIndex = await GetNextOrderIndex(
                            _context.Documents.Where(d => d.CollectionId == collection.Id)
                        );

                        var description = rowData["Eis"];
                        var titleText = description?.Length > 50 ? description.Substring(0, 47) + "..." : description;

                        // Always create a new document for each row
                        var document = new Document
                        {
                            CollectionId = collection.Id,
                            Title = rowData["Hoofdstuk"],
                            Description = description,
                            DescriptionAsHtml = rowData["Eis"],
                            Content = string.Empty,
                            Status = DocumentStatus.Draft,
                            Version = 1,
                            OrderIndex = documentOrderIndex,
                            Owner = string.Empty,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = _importTimestamp,
                            ModifiedBy = _userId,
                            ModifiedDate = _importTimestamp,
                            IsActive = true,
                            Type = DocumentType.Standard // Set default type
                        };

                        _context.Documents.Add(document);
                        await _context.SaveChangesAsync();
                        _logger.LogInformation("Created new document with ID {DocumentId} for row {Row}", document.Id, row);

                        try
                        {
                            // Process Section (Required) - Reuse existing or create new
                            var section = await ProcessSection(collection, rowData["Hoofdstuk"]);
                            if (section != null)
                            {
                                var documentSection = new DocumentSection
                                {
                                    DocumentId = document.Id,
                                    SectionId = section.Id,
                                    TenantId = _tenantId,
                                    CreatedBy = _userId,
                                    CreatedDate = _importTimestamp,
                                    ModifiedBy = _userId,
                                    ModifiedDate = _importTimestamp,
                                    IsActive = true
                                };
                                _context.DocumentSections.Add(documentSection);
                                await _context.SaveChangesAsync();

                                // Process Stage (Required) - Reuse existing or create new
                                var stage = await ProcessStage(collection, rowData["Niveau"]);
                                if (stage != null)
                                {
                                    var documentStage = new DocumentStage
                                    {
                                        DocumentId = document.Id,
                                        StageId = stage.Id,
                                        TenantId = _tenantId,
                                        CreatedBy = _userId,
                                        CreatedDate = _importTimestamp,
                                        ModifiedBy = _userId,
                                        ModifiedDate = _importTimestamp,
                                        IsActive = true
                                    };
                                    _context.DocumentStages.Add(documentStage);
                                    await _context.SaveChangesAsync();
                                }

                                // Process Client (Required)
                                var client = await ProcessClient(collection, rowData["Gemeente"]);
                                if (client != null)
                                {
                                    var documentClient = new DocumentClient
                                    {
                                        DocumentId = document.Id,
                                        ClientId = client.Id,
                                        TenantId = _tenantId,
                                        CreatedBy = _userId,
                                        CreatedDate = _importTimestamp,
                                        ModifiedBy = _userId,
                                        ModifiedDate = _importTimestamp,
                                        IsActive = true
                                    };
                                    _context.DocumentClients.Add(documentClient);
                                    await _context.SaveChangesAsync();
                                }

                                // Process Location (Required)
                                var location = await ProcessLocation(collection, rowData["Woonkern"]);
                                if (location != null)
                                {
                                    var documentLocation = new DocumentLocation
                                    {
                                        DocumentId = document.Id,
                                        LocationId = location.Id,
                                        TenantId = _tenantId,
                                        CreatedBy = _userId,
                                        CreatedDate = _importTimestamp,
                                        ModifiedBy = _userId,
                                        ModifiedDate = _importTimestamp,
                                        IsActive = true
                                    };
                                    _context.DocumentLocations.Add(documentLocation);
                                    await _context.SaveChangesAsync();
                                }

                                // Process Area (Required)
                                var area = await ProcessArea(collection, rowData["Gebiedsoort/Straatsoort/Elementsoort"]);
                                if (area != null)
                                {
                                    var documentArea = new DocumentArea
                                    {
                                        DocumentId = document.Id,
                                        AreaId = area.Id,
                                        TenantId = _tenantId,
                                        CreatedBy = _userId,
                                        CreatedDate = _importTimestamp,
                                        ModifiedBy = _userId,
                                        ModifiedDate = _importTimestamp,
                                        IsActive = true
                                    };
                                    _context.DocumentAreas.Add(documentArea);
                                    await _context.SaveChangesAsync();
                                }

                                // Process Topic (Required)
                                var topic = await ProcessTopic(collection, section, rowData["Onderwerp"]);
                                if (topic != null)
                                {
                                    var documentTopic = new DocumentTopic
                                    {
                                        DocumentId = document.Id,
                                        TopicId = topic.Id,
                                        TenantId = _tenantId,
                                        CreatedBy = _userId,
                                        CreatedDate = _importTimestamp,
                                        ModifiedBy = _userId,
                                        ModifiedDate = _importTimestamp,
                                        IsActive = true
                                    };
                                    _context.DocumentTopics.Add(documentTopic);
                                    await _context.SaveChangesAsync();

                                    // Process Subtopic if exists
                                    if (!string.IsNullOrWhiteSpace(rowData["Subonderwerp"]))
                                    {
                                        var subtopic = await ProcessSubtopic(topic, rowData["Subonderwerp"]);
                                        if (subtopic != null)
                                        {
                                            var documentSubtopic = new DocumentSubtopic
                                            {
                                                DocumentId = document.Id,
                                                SubtopicId = subtopic.Id,
                                                TenantId = _tenantId,
                                                CreatedBy = _userId,
                                                CreatedDate = _importTimestamp,
                                                ModifiedBy = _userId,
                                                ModifiedDate = _importTimestamp,
                                                IsActive = true
                                            };
                                            _context.DocumentSubtopics.Add(documentSubtopic);
                                            await _context.SaveChangesAsync();
                                        }
                                    }
                                }

                                // Process EnforcementLevel (Required)
                                var enforcementLevel = await ProcessEnforcementLevel(collection, rowData["Hardheid"]);
                                if (enforcementLevel != null)
                                {
                                    var documentEnforcementLevel = new DocumentEnforcementLevel
                                    {
                                        DocumentId = document.Id,
                                        EnforcementLevelId = enforcementLevel.Id,
                                        TenantId = _tenantId,
                                        CreatedBy = _userId,
                                        CreatedDate = _importTimestamp,
                                        ModifiedBy = _userId,
                                        ModifiedDate = _importTimestamp,
                                        IsActive = true
                                    };
                                    _context.DocumentEnforcementLevels.Add(documentEnforcementLevel);
                                    await _context.SaveChangesAsync();
                                }
                            }

                            // Process Links (Required)
                            if (!string.IsNullOrWhiteSpace(rowData["Bronverwijzing"]))
                            {
                                var linkIds = rowData["Bronverwijzing"].Split(',', StringSplitOptions.RemoveEmptyEntries)
                                    .Select(l => l.Trim())
                                    .Where(l => !string.IsNullOrWhiteSpace(l))
                                    .Distinct()
                                    .ToList();

                                if (linkIds.Any())
                                {
                                    var existingLinks = await _context.Links
                                        .Where(l => linkIds.Contains(l.ExternalId) && l.IsActive)
                                        .ToListAsync();

                                    foreach (var link in existingLinks)
                                    {
                                        var documentLink = new DocumentLink
                                        {
                                            DocumentId = document.Id,
                                            LinkId = link.Id,
                                            TenantId = _tenantId,
                                            CreatedBy = _userId,
                                            CreatedDate = _importTimestamp,
                                            ModifiedBy = _userId,
                                            ModifiedDate = _importTimestamp,
                                            IsActive = true
                                        };
                                        _context.DocumentLinks.Add(documentLink);
                                    }
                                    await _context.SaveChangesAsync();
                                }
                            }

                            // Process Files (Required)
                            if (!string.IsNullOrWhiteSpace(rowData["Bijlage(-n)"]))
                            {
                                var fileIds = rowData["Bijlage(-n)"].Split(',', StringSplitOptions.RemoveEmptyEntries)
                                    .Select(f => f.Trim())
                                    .Where(f => !string.IsNullOrWhiteSpace(f))
                                    .Distinct()
                                    .ToList();

                                if (fileIds.Any())
                                {
                                    var existingFiles = await _context.Files
                                        .Where(f => fileIds.Contains(f.ExternalId))
                                        .ToListAsync();

                                    foreach (var file in existingFiles)
                                    {
                                        var documentFile = new DocumentFile
                                        {
                                            DocumentId = document.Id,
                                            FileId = file.Id,
                                            TenantId = _tenantId,
                                            CreatedBy = _userId,
                                            CreatedDate = _importTimestamp,
                                            ModifiedBy = _userId,
                                            ModifiedDate = _importTimestamp,
                                            IsActive = true
                                        };
                                        _context.DocumentFiles.Add(documentFile);
                                    }
                                    await _context.SaveChangesAsync();
                                }
                            }

                            processedRows++;
                            result.SuccessfulRecords++;
                            _logger.LogInformation("Successfully processed row {Row}", row);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error processing related data for document {DocumentId} in row {Row}", document.Id, row);
                            result.FailedRecords++;
                            result.Errors.Add(new ImportError
                            {
                                Field = "RelatedData",
                                Message = $"Error processing related data in row {row}: {ex.Message}",
                                Type = "Error",
                                RowNumber = row
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        LogAndAddError(ex, row, result);
                    }
                }

                _logger.LogInformation("Completed processing specifications sheet. Processed {ProcessedRows} rows successfully", processedRows);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Specifications sheet");
                throw;
            }
        }

        private async Task<Section> ProcessSection(Collection collection, string sectionName)
        {
            try
            {
                // First try to find existing section with exact name match
                var section = await _context.Sections
                    .FirstOrDefaultAsync(s => s.Name == sectionName && 
                                            s.CollectionId == collection.Id);

                if (section == null)
                {
                    _logger.LogInformation("Creating new section: {SectionName}", sectionName);
                    
                    var sectionOrderIndex = await GetNextOrderIndex(
                        _context.Sections.Where(s => s.CollectionId == collection.Id)
                    );

                    section = new Section
                    {
                        Name = sectionName,
                        CollectionId = collection.Id,
                        Description = string.Empty,
                        OrderIndex = sectionOrderIndex,
                        Owner = string.Empty,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.Sections.Add(section);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Created new section with ID: {SectionId}", section.Id);
                }
                else
                {
                    _logger.LogInformation("Using existing section: {SectionName} with ID: {SectionId}", section.Name, section.Id);
                }

                return section;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing section {SectionName}", sectionName);
                throw;
            }
        }

        private async Task<Stage> ProcessStage(Collection collection, string stageName)
        {
            try
            {
                var stage = await _context.Stages
                    .FirstOrDefaultAsync(s => s.Name == stageName && 
                                            s.CollectionId == collection.Id);

                if (stage == null)
                {
                    var stageOrderIndex = await GetNextOrderIndex(
                        _context.Stages.Where(s => s.CollectionId == collection.Id)
                    );

                    stage = new Stage
                    {
                        Name = stageName,
                        CollectionId = collection.Id,
                        Description = string.Empty,
                        OrderIndex = stageOrderIndex,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.Stages.Add(stage);
                    await _context.SaveChangesAsync();
                }

                return stage;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing stage {StageName}", stageName);
                throw;
            }
        }

        private async Task<Client> ProcessClient(Collection collection, string clientName)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(clientName))
                {
                    _logger.LogWarning("Client name is null or empty");
                    return null;
                }

                // First try to find existing client with exact name match
                var client = await _context.Clients
                    .FirstOrDefaultAsync(c => c.Name == clientName && 
                                            c.CollectionId == collection.Id 
                                            );

                if (client == null)
                {
                    var clientOrderIndex = await GetNextOrderIndex(
                        _context.Clients.Where(c => c.CollectionId == collection.Id)
                    );

                    // Generate a code if not provided (using first 50 chars of name, uppercase)
                    var code = clientName.Length > 50 ? clientName.Substring(0, 50) : clientName;
                    code = code.ToUpperInvariant().Replace(" ", "_");

                    client = new Client
                    {
                        Name = clientName,
                        CollectionId = collection.Id,
                        Description = clientName, // Use name as description if not provided
                        Code = code,
                        OrderIndex = clientOrderIndex,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.Clients.Add(client);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Created new client with ID: {ClientId}", client.Id);
                }
                else
                {
                    _logger.LogInformation("Using existing client: {ClientName} with ID: {ClientId}", client.Name, client.Id);
                }

                return client;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing client {ClientName}", clientName);
                throw;
            }
        }

        private async Task<Location> ProcessLocation(Collection collection, string locationName)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(locationName))
                {
                    _logger.LogWarning("Location name is null or empty");
                    return null;
                }

                // First try to find existing location with exact name match
                var location = await _context.Locations
                    .FirstOrDefaultAsync(l => l.Name == locationName && 
                                            l.CollectionId == collection.Id
                                            );

                if (location == null)
                {
                    var locationOrderIndex = await GetNextOrderIndex(
                        _context.Locations.Where(l => l.CollectionId == collection.Id)
                    );

                    // Generate a code if not provided (using first 50 chars of name, uppercase)
                    var code = locationName.Length > 50 ? locationName.Substring(0, 50) : locationName;
                    code = code.ToUpperInvariant().Replace(" ", "_");

                    location = new Location
                    {
                        Name = locationName,
                        CollectionId = collection.Id,
                        Description = locationName, // Use name as description if not provided
                        Code = code,
                        OrderIndex = locationOrderIndex,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.Locations.Add(location);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Created new location with ID: {LocationId}", location.Id);
                }
                else
                {
                    _logger.LogInformation("Using existing location: {LocationName} with ID: {LocationId}", location.Name, location.Id);
                }

                return location;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing location {LocationName}", locationName);
                throw;
            }
        }

        private async Task<Area> ProcessArea(Collection collection, string areaName)
        {
            try
            {
                var area = await _context.Areas
                    .FirstOrDefaultAsync(a => a.Name == areaName && 
                                            a.CollectionId == collection.Id);

                if (area == null)
                {
                    var areaOrderIndex = await GetNextOrderIndex(
                        _context.Areas.Where(a => a.CollectionId == collection.Id)
                    );

                    area = new Area
                    {
                        Name = areaName,
                        CollectionId = collection.Id,
                        Description = string.Empty,
                        OrderIndex = areaOrderIndex,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.Areas.Add(area);
                    await _context.SaveChangesAsync();
                }

                return area;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing area {AreaName}", areaName);
                throw;
            }
        }

        private async Task<Topic> ProcessTopic(Collection collection, Section section, string topicName)
        {
            try
            {
                var topic = await _context.Topics
                    .FirstOrDefaultAsync(t => t.Name == topicName && 
                                            t.CollectionId == collection.Id && 
                                            t.SectionId == section.Id);

                if (topic == null)
                {
                    var topicOrderIndex = await GetNextOrderIndex(
                        _context.Topics.Where(t => t.CollectionId == collection.Id)
                    );

                    topic = new Topic
                    {
                        Name = topicName,
                        CollectionId = collection.Id,
                        SectionId = section.Id,
                        Description = string.Empty,
                        OrderIndex = topicOrderIndex,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.Topics.Add(topic);
                    await _context.SaveChangesAsync();
                }

                return topic;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing topic {TopicName} for section {SectionId}", topicName, section.Id);
                throw;
            }
        }

        private async Task<EnforcementLevel> ProcessEnforcementLevel(Collection collection, string enforcementLevelName)
        {
            try
            {
                var enforcementLevel = await _context.EnforcementLevels
                    .FirstOrDefaultAsync(e => e.Name == enforcementLevelName && 
                                            e.CollectionId == collection.Id);

                if (enforcementLevel == null)
                {
                    var enforcementLevelOrderIndex = await GetNextOrderIndex(
                        _context.EnforcementLevels.Where(e => e.CollectionId == collection.Id)
                    );

                    enforcementLevel = new EnforcementLevel
                    {
                        Name = enforcementLevelName,
                        CollectionId = collection.Id,
                        Description = string.Empty,
                        OrderIndex = enforcementLevelOrderIndex,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.EnforcementLevels.Add(enforcementLevel);
                    await _context.SaveChangesAsync();
                }

                return enforcementLevel;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing enforcement level {EnforcementLevelName}", enforcementLevelName);
                throw;
            }
        }

        private async Task ProcessFileRelationships(int collectionId, ImportResult result)
        {
            try
            {
                // Get all documents with file references
                var documents = await _context.Documents
                    .Where(d => d.CollectionId == collectionId)
                    .ToListAsync();

                foreach (var document in documents)
                {
                    // Get the file IDs directly from the Bijlage(-n) column
                    var fileIds = document.Content; // Using the correct field for file IDs

                    var fileIdList = fileIds?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(f => f.Trim())
                        .Where(f => !string.IsNullOrWhiteSpace(f))
                        .Distinct()
                        .ToList() ?? new List<string>();

                    if (!fileIdList.Any())
                    {
                        continue; // Skip if no file IDs found
                    }

                    // Get existing files by ExternalId
                    var existingFiles = await _context.Files
                        .Where(f => fileIdList.Contains(f.ExternalId))
                        .ToListAsync();

                    // Get existing document files to avoid duplicates
                    var existingDocumentFiles = await _context.DocumentFiles
                        .Where(df => df.DocumentId == document.Id)
                        .Select(df => df.FileId)
                        .ToListAsync();

                    foreach (var file in existingFiles)
                    {
                        if (!existingDocumentFiles.Contains(file.Id))
                        {
                            var documentFile = new DocumentFile
                            {
                                DocumentId = document.Id,
                                FileId = file.Id,
                                TenantId = _tenantId,
                                CreatedBy = _userId,
                                CreatedDate = _importTimestamp,
                                ModifiedBy = _userId,
                                ModifiedDate = _importTimestamp,
                                IsActive = true
                            };
                            _context.DocumentFiles.Add(documentFile);
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing file relationships");
                throw;
            }
        }

        private async Task ProcessLinkRelationships(int collectionId, ImportResult result)
        {
            try
            {
                // Get all documents with link references
                var documents = await _context.Documents
                    .Where(d => d.CollectionId == collectionId)
                    .ToListAsync();

                foreach (var document in documents)
                {
                    // Get the link IDs directly from the Bronverwijzing column
                    var linkIds = document.Content; // Using the correct field for link IDs

                    var linkIdList = linkIds?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(l => l.Trim())
                        .Where(l => !string.IsNullOrWhiteSpace(l))
                        .Distinct()
                        .ToList() ?? new List<string>();

                    if (!linkIdList.Any())
                    {
                        continue; // Skip if no link IDs found
                    }

                    // Get existing links by ExternalId
                    var existingLinks = await _context.Links
                        .Where(l => linkIdList.Contains(l.ExternalId))
                        .ToListAsync();

                    // Get existing document links to avoid duplicates
                    var existingDocumentLinks = await _context.DocumentLinks
                        .Where(dl => dl.DocumentId == document.Id)
                        .Select(dl => dl.LinkId)
                        .ToListAsync();

                    foreach (var link in existingLinks)
                    {
                        if (!existingDocumentLinks.Contains(link.Id))
                        {
                            var documentLink = new DocumentLink
                            {
                                DocumentId = document.Id,
                                LinkId = link.Id,
                                TenantId = _tenantId,
                                CreatedBy = _userId,
                                CreatedDate = _importTimestamp,
                                ModifiedBy = _userId,
                                ModifiedDate = _importTimestamp,
                                IsActive = true
                            };
                            _context.DocumentLinks.Add(documentLink);
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing link relationships");
                throw;
            }
        }

        private async Task<Subtopic> ProcessSubtopic(Topic topic, string subtopicName)
        {
            try
            {
                var subtopic = await _context.Subtopics
                    .FirstOrDefaultAsync(s => s.Name == subtopicName && 
                                            s.TopicId == topic.Id);

                if (subtopic == null)
                {
                    var subtopicOrderIndex = await GetNextOrderIndex(
                        _context.Subtopics.Where(s => s.TopicId == topic.Id)
                    );

                    subtopic = new Subtopic
                    {
                        Name = subtopicName,
                        TopicId = topic.Id,
                        Description = string.Empty,
                        OrderIndex = subtopicOrderIndex,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = _importTimestamp,
                        ModifiedBy = _userId,
                        ModifiedDate = _importTimestamp,
                        IsActive = true
                    };

                    _context.Subtopics.Add(subtopic);
                    await _context.SaveChangesAsync();
                }

                return subtopic;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing subtopic {SubtopicName} for topic {TopicId}", subtopicName, topic.Id);
                throw;
            }
        }

        private Dictionary<string, string> GetRowData(ExcelWorksheet sheet, int row, List<string> headers)
        {
            var rowData = new Dictionary<string, string>();
            for (int col = 1; col <= headers.Count; col++)
            {
                var header = headers[col - 1];
                if (!string.IsNullOrEmpty(header))
                {
                    // Don't trim the cell value to preserve exact data from Excel
                    rowData[header] = sheet.Cells[row, col].Text ?? string.Empty;
                }
            }
            return rowData;
        }

        private bool ValidateRequiredColumns(List<string> headers, string[] requiredColumns, ImportResult result)
        {
            var missingColumns = requiredColumns.Where(rc => !headers.Contains(rc)).ToList();
            if (missingColumns.Any())
            {
                foreach (var column in missingColumns)
                {
                    result.Errors.Add(new ImportError
                    {
                        Field = "Headers",
                        Message = $"Required column '{column}' is missing",
                        Type = "Validation"
                    });
                }
                return false;
            }
            return true;
        }

        private bool ValidateRowData(Dictionary<string, string> rowData, string[] requiredColumns, int row, ImportResult result)
        {
            var isValid = true;
            foreach (var column in requiredColumns)
            {
                // Skip validation for optional fields
                if (IsOptionalField(column))
                {
                    continue;
                }

                if (!rowData.ContainsKey(column) || string.IsNullOrWhiteSpace(rowData[column]))
                {
                    result.Errors.Add(new ImportError
                    {
                        Field = column,
                        Message = $"Required value for '{column}' is missing in row {row}",
                        Type = "Validation",
                        RowNumber = row
                    });
                    isValid = false;
                }
            }
            return isValid;
        }

        private bool IsOptionalField(string columnName)
        {
            var optionalFields = new[]
            {
                "Subonderwerp",     // Optional subtopic
                "Bronverwijzing",   // Optional reference links
                "Bijlage(-n)",      // Optional attachments
                "Url",              // Optional URL
                "Bestandsnaam"      // Optional filename
            };

            return optionalFields.Contains(columnName);
        }

        private void LogAndAddError(Exception ex, int row, ImportResult result)
        {
            _logger.LogError(ex, "Error processing row {Row}", row);
            result.Errors.Add(new ImportError
            {
                Field = "Row",
                Message = $"Error processing row {row}: {ex.Message}",
                Type = "Error",
                RowNumber = row
            });
            result.FailedRecords++;
        }
    }
} 
