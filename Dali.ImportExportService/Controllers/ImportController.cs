using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Dali.ImportExportService.DTO;
using Dali.ImportExportService.Helper;
using Dali.ImportExportService.Service;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using OfficeOpenXml;
using System.Security.Claims;
using Dali.ImportExportService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Dali.ImportExportService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ImportController : ControllerBase
    {
        private readonly ILogger<ImportController> _logger;
        private readonly IImportService _importService;
        private readonly IImportMappingHelper _importMappingHelper;

        public ImportController(
            ILogger<ImportController> logger,
            IImportService importService,
            IImportMappingHelper importMappingHelper)
        {
            _logger = logger;
            _importService = importService;
            _importMappingHelper = importMappingHelper;
        }

        [HttpPost("documents")]
        [ProducesResponseType(typeof(ImportResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Policy = "ImportPermission")]
        public async Task<IActionResult> ImportDocuments([FromQuery] int collectionId, IFormFile file)
        {
            try
            {
                _logger.LogInformation("Starting document import for collection {CollectionId}", collectionId);

                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file was uploaded");
                }

                if (!Path.GetExtension(file.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("Only Excel files (.xlsx) are supported");
                }

                // Get user ID and tenant ID from claims
                var userId = User.FindFirstValue("userId");
                var tenantId = User.FindFirstValue("tenantId");

                _logger.LogInformation("Extracted claims - UserId: {UserId}, TenantId: {TenantId}", userId, tenantId);

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(tenantId))
                {
                    _logger.LogWarning("Missing required claims. Available claims: {@Claims}", 
                        User.Claims.Select(c => new { Type = c.Type, Value = c.Value }));
                    return BadRequest("User context is missing - required claims: userId, tenantId");
                }

                var result = await _importService.ImportDocumentsAsync(file, collectionId, tenantId, userId);

                _logger.LogInformation("Import service returned result - Success: {Success}, Total Records: {Total}, Successful: {Successful}, Failed: {Failed}", 
                    result.Success, result.TotalRecords, result.SuccessfulRecords, result.FailedRecords);

                if (!result.Success)
                {
                    _logger.LogWarning("Import failed. Errors: {@Errors}, Messages: {@Messages}", result.Errors, result.Messages);
                    var response = new { 
                        Success = false,
                        Messages = result.Messages,
                        Errors = result.Errors,
                        Details = "Import failed. Please ensure your Excel file has the required sheets: 'Specificaties', 'Bronverwijzingen', and 'Bijlagen'"
                    };
                    _logger.LogWarning("Returning BadRequest response: {@Response}", response);
                    return BadRequest(response);
                }

                _logger.LogInformation("Import completed successfully. Total: {Total}, Successful: {Successful}, Failed: {Failed}", 
                    result.TotalRecords, result.SuccessfulRecords, result.FailedRecords);

                return Ok(new { 
                    Success = true,
                    Message = result.Messages.FirstOrDefault() ?? "Import completed successfully",
                    ProcessedCount = result.TotalRecords,
                    SuccessCount = result.SuccessfulRecords,
                    ErrorCount = result.FailedRecords,
                    Messages = result.Messages,
                    Errors = result.Errors
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing documents for collection {CollectionId}", collectionId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing the import");
            }
        }

        private async Task<ImportResult> ProcessDocumentsSheet(ExcelWorksheet worksheet, int collectionId)
        {
            var result = new ImportResult();
            var rowCount = worksheet.Dimension?.Rows ?? 0;
            var colCount = worksheet.Dimension?.Columns ?? 0;

            if (rowCount < 2)
            {
                result.Errors.Add(new ImportError { Message = "Specifications sheet contains no data rows" });
                return result;
            }

            // Get headers
            var headers = GetSheetHeaders(worksheet, colCount);

            // Validate required columns for specifications
            var requiredColumns = new[] { "Hoofdstuk", "Eis" };
            if (!ValidateRequiredColumns(headers, requiredColumns, result))
            {
                return result;
            }

            // Process each row
            for (int row = 2; row <= rowCount; row++)
            {
                var rowData = GetRowData(worksheet, row, headers);
                if (rowData.Count > 0)
                {
                    var collection = await _importService.GetCollectionAsync(collectionId);
                    if (collection == null)
                    {
                        result.Errors.Add(new ImportError { Message = $"Collection with ID {collectionId} not found" });
                        return result;
                    }

                    // Map the Excel column names to Document model properties
                    var mappedData = new Dictionary<string, string>
                    {
                        { "SectionId", rowData["Hoofdstuk"] },
                        { "StageId", rowData["Niveau"] },
                        { "ClientId", rowData["Gemeente"] },
                        { "LocationId", rowData["Woonkern"] },
                        { "AreaId", rowData["Gebiedsoort/Str"] },
                        { "TopicId", rowData["Onderwerp"] },
                        { "SubtopicId", rowData["Subonderwerp"] },
                        { "EnforcementLevelId", rowData["Hardheid"] },
                        { "Links", rowData["Bronv"] },
                        { "Files", rowData["Bijlage(-n)"] },
                        { "Description", rowData["Eis"] }
                    };

                    var rowResult = await _importMappingHelper.ProcessDocumentImport(mappedData, collection);
                    result.Errors.AddRange(rowResult.Errors);
                    result.Messages.AddRange(rowResult.Messages);
                    result.Success = result.Success && rowResult.Success;
                }
            }

            return result;
        }

        private async Task<ImportResult> ProcessLinksSheet(ExcelWorksheet worksheet, int collectionId)
        {
            var result = new ImportResult();
            var rowCount = worksheet.Dimension?.Rows ?? 0;
            var colCount = worksheet.Dimension?.Columns ?? 0;

            if (rowCount < 2)
            {
                result.Errors.Add(new ImportError { Message = "References sheet contains no data rows" });
                return result;
            }

            // Get headers
            var headers = GetSheetHeaders(worksheet, colCount);

            // Validate required columns for references
            var requiredColumns = new[] { "It", "Omschrijving", "Url" };
            if (!ValidateRequiredColumns(headers, requiredColumns, result))
            {
                return result;
            }

            // Process each row
            for (int row = 2; row <= rowCount; row++)
            {
                var rowData = GetRowData(worksheet, row, headers);
                if (rowData.Count > 0)
                {
                    // Map the Excel column names
                    var mappedData = new Dictionary<string, string>
                    {
                        { "ExternalId", rowData["It"] },
                        { "Description", rowData["Omschrijving"] },
                        { "Url", rowData["Url"] }
                    };

                    // TODO: Implement reference processing logic with mapped data
                    result.Messages.Add($"Processed reference in row {row}");
                }
            }

            return result;
        }

        private async Task<ImportResult> ProcessFilesSheet(ExcelWorksheet worksheet, int collectionId)
        {
            var result = new ImportResult();
            var rowCount = worksheet.Dimension?.Rows ?? 0;
            var colCount = worksheet.Dimension?.Columns ?? 0;

            if (rowCount < 2)
            {
                result.Errors.Add(new ImportError { Message = "Attachments sheet contains no data rows" });
                return result;
            }

            // Get headers
            var headers = GetSheetHeaders(worksheet, colCount);

            // Validate required columns for attachments
            var requiredColumns = new[] { "It", "Omschrijving", "Bestandspad", "Bestandstype" };
            if (!ValidateRequiredColumns(headers, requiredColumns, result))
            {
                return result;
            }

            // Process each row
            for (int row = 2; row <= rowCount; row++)
            {
                var rowData = GetRowData(worksheet, row, headers);
                if (rowData.Count > 0)
                {
                    // Map the Excel column names
                    var mappedData = new Dictionary<string, string>
                    {
                        { "ExternalId", rowData["It"] },
                        { "Description", rowData["Omschrijving"] },
                        { "FilePath", rowData["Bestandspad"] },
                        { "FileType", rowData["Bestandstype"] }
                    };

                    // TODO: Implement attachment processing logic with mapped data
                    result.Messages.Add($"Processed attachment in row {row}");
                }
            }

            return result;
        }

        private Dictionary<string, int> GetSheetHeaders(ExcelWorksheet worksheet, int colCount)
        {
            var headers = new Dictionary<string, int>();
            for (int col = 1; col <= colCount; col++)
            {
                var headerValue = worksheet.Cells[1, col].Text?.Trim();
                if (!string.IsNullOrEmpty(headerValue))
                {
                    headers[headerValue] = col;
                }
            }
            return headers;
        }

        private bool ValidateRequiredColumns(Dictionary<string, int> headers, string[] requiredColumns, ImportResult result)
        {
            var missingColumns = requiredColumns.Where(col => !headers.ContainsKey(col)).ToList();
            if (missingColumns.Any())
            {
                result.Success = false;
                result.Errors.Add(new ImportError
                {
                    Field = "Headers",
                    Message = $"Missing required columns: {string.Join(", ", missingColumns)}",
                    Type = "Validation"
                });
                return false;
            }
            return true;
        }

        private Dictionary<string, string> GetRowData(ExcelWorksheet worksheet, int row, Dictionary<string, int> headers)
        {
            var rowData = new Dictionary<string, string>();
            foreach (var header in headers)
            {
                var cellValue = worksheet.Cells[row, header.Value].Text?.Trim();
                if (!string.IsNullOrEmpty(cellValue))
                {
                    rowData[header.Key] = cellValue;
                }
            }
            return rowData;
        }

        [HttpGet("template")]
        public IActionResult DownloadTemplate()
        {
            try
            {
                using (var package = new ExcelPackage())
                {
                    // Specifications sheet
                    var specificationsSheet = package.Workbook.Worksheets.Add("Specificaties");
                    var specificationHeaders = new[]
                    {
                        "Hoofdstuk",         // Maps to Document.SectionId
                        "Niveau",            // Maps to Document.StageId
                        "Gemeente",          // Maps to Document.ClientId
                        "Woonkern",          // Maps to Document.LocationId
                        "Gebiedsoort/Str",   // Maps to Document.AreaId
                        "Onderwerp",         // Maps to Document.TopicId
                        "Subonderwerp",      // Maps to Document.SubtopicId
                        "Hardheid",          // Maps to Document.EnforcementLevelId
                        "Bronv",             // Maps to DocumentLinks
                        "Bijlage(-n)",       // Maps to DocumentFiles
                        "Eis"                // Maps to Document.Description
                    };
                    AddHeadersToSheet(specificationsSheet, specificationHeaders);

                    // Links sheet
                    var linksSheet = package.Workbook.Worksheets.Add("Bronverwijzingen");
                    var linkHeaders = new[]
                    {
                        "It",
                        "Omschrijving",
                        "Url"
                    };
                    AddHeadersToSheet(linksSheet, linkHeaders);

                    // Files sheet
                    var filesSheet = package.Workbook.Worksheets.Add("Bijlagen");
                    var fileHeaders = new[]
                    {
                        "It",
                        "Omschrijving",
                        "Bestandspad",
                        "Bestandstype"
                    };
                    AddHeadersToSheet(filesSheet, fileHeaders);

                    // Return the Excel file
                    var content = package.GetAsByteArray();
                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "ImportTemplate.xlsx"
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating template");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error generating template");
            }
        }

        private void AddHeadersToSheet(ExcelWorksheet worksheet, string[] headers)
        {
            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cells[1, i + 1].Value = headers[i];
                worksheet.Cells[1, i + 1].Style.Font.Bold = true;
            }
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
        }

        [HttpGet("validate")]
        [ProducesResponseType(typeof(ImportResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ValidateImport(IFormFile file, [FromQuery] int collectionId)
        {
            try
            {
                _logger.LogInformation("Starting import validation for collection {CollectionId}", collectionId);

                if (file == null || file.Length == 0)
                {
                    _logger.LogWarning("No file uploaded");
                    return BadRequest("No file uploaded");
                }

                if (!Path.GetExtension(file.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("Invalid file type: {FileName}", file.FileName);
                    return BadRequest("Only Excel files (.xlsx) are supported");
                }

                var result = new ImportResult();

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        _logger.LogInformation("Excel file loaded. Found sheets: {Sheets}", 
                            string.Join(", ", package.Workbook.Worksheets.Select(w => w.Name)));

                        // Validate Specifications sheet
                        var specificationsSheet = package.Workbook.Worksheets.FirstOrDefault(w => w.Name == "Specificaties");
                        if (specificationsSheet != null)
                        {
                            _logger.LogInformation("Found Specificaties sheet");
                            ValidateSheet(specificationsSheet, new[] { "Hoofdstuk", "Eis" }, "Specificaties", result);
                        }
                        else
                        {
                            _logger.LogWarning("Missing required sheet: Specificaties");
                            result.Errors.Add(new ImportError { Field = "Sheets", Message = "Missing required sheet: Specificaties", Type = "Validation" });
                        }

                        // Validate Links sheet
                        var linksSheet = package.Workbook.Worksheets.FirstOrDefault(w => w.Name == "Bronverwijzingen");
                        if (linksSheet != null)
                        {
                            _logger.LogInformation("Found Bronverwijzingen sheet");
                            ValidateSheet(linksSheet, new[] { "It", "Omschrijving", "Url" }, "Bronverwijzingen", result);
                        }
                        else
                        {
                            _logger.LogWarning("Missing required sheet: Bronverwijzingen");
                            result.Errors.Add(new ImportError { Field = "Sheets", Message = "Missing required sheet: Bronverwijzingen", Type = "Validation" });
                        }

                        // Validate Files sheet
                        var filesSheet = package.Workbook.Worksheets.FirstOrDefault(w => w.Name == "Bijlagen");
                        if (filesSheet != null)
                        {
                            _logger.LogInformation("Found Bijlagen sheet");
                            ValidateSheet(filesSheet, new[] { "It", "Omschrijving", "Bestandspad", "Bestandstype" }, "Bijlagen", result);
                        }
                        else
                        {
                            _logger.LogWarning("Missing required sheet: Bijlagen");
                            result.Errors.Add(new ImportError { Field = "Sheets", Message = "Missing required sheet: Bijlagen", Type = "Validation" });
                        }

                        result.Success = result.Errors.Count == 0;
                        if (result.Success)
                        {
                            result.Messages.Add("Validation successful for all sheets");
                            _logger.LogInformation("Validation successful for all sheets");
                        }
                        else
                        {
                            _logger.LogWarning("Validation failed. Errors: {@Errors}", result.Errors);
                        }
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating import file");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error validating import file");
            }
        }

        private void ValidateSheet(ExcelWorksheet worksheet, string[] requiredColumns, string sheetName, ImportResult result)
        {
            var rowCount = worksheet.Dimension?.Rows ?? 0;
            var colCount = worksheet.Dimension?.Columns ?? 0;

            if (rowCount < 2)
            {
                result.Errors.Add(new ImportError
                {
                    Field = sheetName,
                    Message = $"{sheetName} sheet contains no data rows",
                    Type = "Validation"
                });
                return;
            }

            // Validate headers
            var headers = GetSheetHeaders(worksheet, colCount);
            var missingColumns = requiredColumns.Where(col => !headers.ContainsKey(col)).ToList();
            if (missingColumns.Any())
            {
                result.Errors.Add(new ImportError
                {
                    Field = $"{sheetName} Headers",
                    Message = $"Missing required columns in {sheetName} sheet: {string.Join(", ", missingColumns)}",
                    Type = "Validation"
                });
            }

            // Validate data rows
            for (int row = 2; row <= rowCount; row++)
            {
                foreach (var requiredColumn in requiredColumns)
                {
                    if (headers.ContainsKey(requiredColumn))
                    {
                        var cellValue = worksheet.Cells[row, headers[requiredColumn]].Text?.Trim();
                        if (string.IsNullOrEmpty(cellValue))
                        {
                            result.Errors.Add(new ImportError
                            {
                                Field = requiredColumn,
                                Message = $"Missing required value in {sheetName} sheet, row {row}",
                                Type = "Validation"
                            });
                        }
                    }
                }
            }

            result.Messages.Add($"Found {rowCount - 1} records in {sheetName} sheet");
        }
    }
} 