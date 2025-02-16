using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Dali.ImportExportService.DTO;
using Dali.ImportExportService.Models;
using System.Linq.Expressions;
using Dali.ImportExportService.Infrastructure.Data;

namespace Dali.ImportExportService.Helper
{
    public interface IImportMappingHelper
    {
        Task<ImportResult> ProcessDocumentImport(Dictionary<string, string> rowData, Collection collection);
    }

    public class ImportMappingHelper : IImportMappingHelper
    {
        private readonly ILogger<ImportMappingHelper> _logger;
        private readonly ApplicationDbContext _context;
        private readonly string _tenantId;
        private readonly string _userId;

        public ImportMappingHelper(
            ILogger<ImportMappingHelper> logger,
            ApplicationDbContext context,
            string tenantId,
            string userId)
        {
            _logger = logger;
            _context = context;
            _tenantId = tenantId;
            _userId = userId;
        }

        public async Task<ImportResult> ProcessDocumentImport(Dictionary<string, string> rowData, Collection collection)
        {
            var result = new ImportResult();
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Check if document already exists
                var existingDocument = await FindExistingDocument(rowData, collection.Id);
                var document = existingDocument ?? new Document
                {
                    CollectionId = collection.Id,
                    TenantId = _tenantId,
                    CreatedBy = _userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true,
                    Status = DocumentStatus.Draft
                };

                // If existing document, create new version
                if (existingDocument != null)
                {
                    document.Version = existingDocument.Version + 1;
                    document.ModifiedBy = _userId;
                    document.ModifiedDate = DateTime.UtcNow;
                }
                else
                {
                    document.Version = 1;
                }

                // Map fields
                if (!await MapDocumentFields(document, rowData, result))
                {
                    await transaction.RollbackAsync();
                    return result;
                }

                // Save document
                if (existingDocument == null)
                {
                    _context.Documents.Add(document);
                }
                else
                {
                    _context.Documents.Update(document);
                }
                await _context.SaveChangesAsync();

                // Create version record
                var version = new DocumentVersion
                {
                    DocumentId = document.Id,
                    VersionNumber = document.Version,
                    TenantId = _tenantId,
                    CreatedBy = _userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true,
                    Status = document.Status.ToString(),
                    Description = document.Description
                };
                _context.DocumentVersions.Add(version);
                await _context.SaveChangesAsync();

                // Create relationships
                await CreateDocumentRelationships(document, rowData, result);

                await transaction.CommitAsync();
                result.Success = true;
                result.Messages.Add($"Successfully imported document: {document.Description} (Version {document.Version})");
                return result;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error processing document import");
                result.Errors.Add(new ImportError
                {
                    Field = "Processing",
                    Message = ex.Message,
                    Type = "Error"
                });
                return result;
            }
        }

        private async Task<Document> FindExistingDocument(Dictionary<string, string> rowData, int collectionId)
        {
            // Try to find by unique identifiers in your data
            // This is an example - adjust based on your business rules
            if (rowData.TryGetValue("DocumentId", out var documentId) && int.TryParse(documentId, out var id))
            {
                return await _context.Documents
                    .FirstOrDefaultAsync(d => d.Id == id && d.CollectionId == collectionId && d.TenantId == _tenantId);
            }

            // Or by combination of fields that uniquely identify a document
            if (rowData.TryGetValue("Hoofdstuk", out var section) &&
                rowData.TryGetValue("Eis", out var description))
            {
                return await _context.Documents
                    .Include(d => d.Sections)
                    .FirstOrDefaultAsync(d => 
                        d.CollectionId == collectionId && 
                        d.TenantId == _tenantId &&
                        d.Description == description &&
                        d.Sections.Any(s => s.Section.Name == section));
            }

            return null;
        }

        private async Task<bool> MapDocumentFields(Document document, Dictionary<string, string> rowData, ImportResult result)
        {
            try
            {
                // Map Section (Hoofdstuk)
                if (rowData.TryGetValue("Hoofdstuk", out var section))
                {
                    var existingSection = await _context.Sections
                        .FirstOrDefaultAsync(s => s.Name == section && s.TenantId == _tenantId);

                    if (existingSection == null)
                    {
                        existingSection = new Section
                        {
                            Name = section,
                            Description = section,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.Sections.Add(existingSection);
                        await _context.SaveChangesAsync();
                    }

                    var documentSection = new DocumentSection
                    {
                        Document = document,
                        Section = existingSection,
                        TenantId = _tenantId,
                        CreatedBy = _userId,
                        CreatedDate = DateTime.UtcNow,
                        IsActive = true
                    };
                    _context.DocumentSections.Add(documentSection);
                }

                // Map Stage (Niveau)
                if (rowData.TryGetValue("Niveau", out var stage))
                {
                    var stageEntity = await GetOrCreateEntity<Stage>(
                        stage,
                        s => s.Name == stage && s.TenantId == _tenantId,
                        "Stage",
                        result);

                    if (stageEntity != null)
                    {
                        var documentStage = new DocumentStage
                        {
                            Document = document,
                            Stage = stageEntity,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.DocumentStages.Add(documentStage);
                    }
                }

                // Map Client (Gemeente)
                if (rowData.TryGetValue("Gemeente", out var client))
                {
                    var clientEntity = await GetOrCreateEntity<Client>(
                        client,
                        c => c.Name == client && c.TenantId == _tenantId,
                        "Client",
                        result);

                    if (clientEntity != null)
                    {
                        var documentClient = new DocumentClient
                        {
                            Document = document,
                            Client = clientEntity,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.DocumentClients.Add(documentClient);
                    }
                }

                // Map Location (Woonkern)
                if (rowData.TryGetValue("Woonkern", out var location))
                {
                    var locationEntity = await GetOrCreateEntity<Location>(
                        location,
                        l => l.Name == location && l.TenantId == _tenantId,
                        "Location",
                        result);

                    if (locationEntity != null)
                    {
                        var documentLocation = new DocumentLocation
                        {
                            Document = document,
                            Location = locationEntity,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.DocumentLocations.Add(documentLocation);
                    }
                }

                // Map Area (GebiedsoortStr)
                if (rowData.TryGetValue("GebiedsoortStr", out var area))
                {
                    var areaEntity = await GetOrCreateEntity<Area>(
                        area,
                        a => a.Name == area && a.TenantId == _tenantId,
                        "Area",
                        result);

                    if (areaEntity != null)
                    {
                        var documentArea = new DocumentArea
                        {
                            Document = document,
                            Area = areaEntity,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.DocumentAreas.Add(documentArea);
                    }
                }

                // Map Topic (Onderwerp)
                if (rowData.TryGetValue("Onderwerp", out var topic))
                {
                    var topicEntity = await GetOrCreateEntity<Topic>(
                        topic,
                        t => t.Name == topic && t.TenantId == _tenantId,
                        "Topic",
                        result);

                    if (topicEntity != null)
                    {
                        var documentTopic = new DocumentTopic
                        {
                            Document = document,
                            Topic = topicEntity,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.DocumentTopics.Add(documentTopic);
                    }
                }

                // Map Subtopic (Subonderwerp)
                if (rowData.TryGetValue("Subonderwerp", out var subtopic))
                {
                    var subtopicEntity = await GetOrCreateEntity<Subtopic>(
                        subtopic,
                        s => s.Name == subtopic && s.TenantId == _tenantId,
                        "Subtopic",
                        result);

                    if (subtopicEntity != null)
                    {
                        var documentSubtopic = new DocumentSubtopic
                        {
                            Document = document,
                            Subtopic = subtopicEntity,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.DocumentSubtopics.Add(documentSubtopic);
                    }
                }

                // Map EnforcementLevel (Hardheid)
                if (rowData.TryGetValue("Hardheid", out var enforcementLevel))
                {
                    var enforcementLevelEntity = await GetOrCreateEntity<EnforcementLevel>(
                        enforcementLevel,
                        e => e.Name == enforcementLevel && e.TenantId == _tenantId,
                        "EnforcementLevel",
                        result);

                    if (enforcementLevelEntity != null)
                    {
                        var documentEnforcementLevel = new DocumentEnforcementLevel
                        {
                            Document = document,
                            EnforcementLevel = enforcementLevelEntity,
                            TenantId = _tenantId,
                            CreatedBy = _userId,
                            CreatedDate = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.DocumentEnforcementLevels.Add(documentEnforcementLevel);
                    }
                }

                // Map Description (Eis)
                if (rowData.TryGetValue("Eis", out var description))
                {
                    document.Description = description;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error mapping document fields");
                result.Errors.Add(new ImportError { Field = "Mapping", Message = ex.Message });
                return false;
            }
        }

        private async Task<T> GetOrCreateEntity<T>(
            string name,
            Expression<Func<T, bool>> predicate,
            string entityType,
            ImportResult result,
            Action<T> additionalSetup = null) where T : class, new()
        {
            var entity = await _context.Set<T>().FirstOrDefaultAsync(predicate);
            
            if (entity == null)
            {
                entity = new T();
                var nameProperty = typeof(T).GetProperty("Name");
                var tenantIdProperty = typeof(T).GetProperty("TenantId");
                var createdByProperty = typeof(T).GetProperty("CreatedBy");
                var createdDateProperty = typeof(T).GetProperty("CreatedDate");
                var isActiveProperty = typeof(T).GetProperty("IsActive");
                var orderIndexProperty = typeof(T).GetProperty("OrderIndex");

                nameProperty?.SetValue(entity, name);
                tenantIdProperty?.SetValue(entity, _tenantId);
                createdByProperty?.SetValue(entity, _userId);
                createdDateProperty?.SetValue(entity, DateTime.UtcNow);
                isActiveProperty?.SetValue(entity, true);
                
                if (orderIndexProperty != null)
                {
                    var count = await _context.Set<T>().CountAsync();
                    orderIndexProperty.SetValue(entity, count + 1);
                }

                additionalSetup?.Invoke(entity);

                _context.Set<T>().Add(entity);
                await _context.SaveChangesAsync();
                result.Messages.Add($"Created new {entityType}: {name}");
            }

            return entity;
        }

        private async Task CreateDocumentRelationships(Document document, Dictionary<string, string> rowData, ImportResult result)
        {
            try
            {
                // Handle locations from rowData
                if (rowData.TryGetValue("Woonkern", out var location))
                {
                    var locationEntity = await GetOrCreateEntity<Location>(
                        location,
                        l => l.Name == location && l.TenantId == _tenantId,
                        "Location",
                        result);
                    
                    if (locationEntity != null)
                    {
                        await CreateDocumentRelationship<DocumentLocation>(document.Id, locationEntity.Id);
                    }
                }

                // Handle sections from rowData
                if (rowData.TryGetValue("Hoofdstuk", out var section))
                {
                    var sectionEntity = await GetOrCreateEntity<Section>(
                        section,
                        s => s.Name == section && s.TenantId == _tenantId,
                        "Section",
                        result);
                    
                    if (sectionEntity != null)
                    {
                        await CreateDocumentRelationship<DocumentSection>(document.Id, sectionEntity.Id);
                    }
                }

                // Handle stages from rowData
                if (rowData.TryGetValue("Niveau", out var stage))
                {
                    var stageEntity = await GetOrCreateEntity<Stage>(
                        stage,
                        s => s.Name == stage && s.TenantId == _tenantId,
                        "Stage",
                        result);
                    
                    if (stageEntity != null)
                    {
                        await CreateDocumentRelationship<DocumentStage>(document.Id, stageEntity.Id);
                    }
                }

                // Handle clients from rowData
                if (rowData.TryGetValue("Gemeente", out var client))
                {
                    var clientEntity = await GetOrCreateEntity<Client>(
                        client,
                        c => c.Name == client && c.TenantId == _tenantId,
                        "Client",
                        result);
                    
                    if (clientEntity != null)
                    {
                        await CreateDocumentRelationship<DocumentClient>(document.Id, clientEntity.Id);
                    }
                }

                // Handle areas from rowData
                if (rowData.TryGetValue("Gebiedsoort/Str", out var area))
                {
                    var areaEntity = await GetOrCreateEntity<Area>(
                        area,
                        a => a.Name == area && a.TenantId == _tenantId,
                        "Area",
                        result);
                    
                    if (areaEntity != null)
                    {
                        await CreateDocumentRelationship<DocumentArea>(document.Id, areaEntity.Id);
                    }
                }

                // Handle topics from rowData
                if (rowData.TryGetValue("Onderwerp", out var topic))
                {
                    var topicEntity = await GetOrCreateEntity<Topic>(
                        topic,
                        t => t.Name == topic && t.TenantId == _tenantId,
                        "Topic",
                        result);
                    
                    if (topicEntity != null)
                    {
                        await CreateDocumentRelationship<DocumentTopic>(document.Id, topicEntity.Id);

                        // Handle subtopics if topic exists
                        if (rowData.TryGetValue("Subonderwerp", out var subtopic))
                        {
                            var subtopicEntity = await GetOrCreateEntity<Subtopic>(
                                subtopic,
                                s => s.Name == subtopic && s.TopicId == topicEntity.Id && s.TenantId == _tenantId,
                                "Subtopic",
                                result,
                                entity => entity.TopicId = topicEntity.Id);
                            
                            if (subtopicEntity != null)
                            {
                                await CreateDocumentRelationship<DocumentSubtopic>(document.Id, subtopicEntity.Id);
                            }
                        }
                    }
                }

                // Handle enforcement levels from rowData
                if (rowData.TryGetValue("Hardheid", out var enforcementLevel))
                {
                    var enforcementLevelEntity = await GetOrCreateEntity<EnforcementLevel>(
                        enforcementLevel,
                        e => e.Name == enforcementLevel && e.TenantId == _tenantId,
                        "EnforcementLevel",
                        result);
                    
                    if (enforcementLevelEntity != null)
                    {
                        await CreateDocumentRelationship<DocumentEnforcementLevel>(document.Id, enforcementLevelEntity.Id);
                    }
                }

                // Create Link relationships
                if (rowData.TryGetValue("Bronv", out var links))
                {
                    var linkIds = links.Split(';', StringSplitOptions.RemoveEmptyEntries)
                        .Select(l => l.Trim())
                        .Where(l => !string.IsNullOrEmpty(l));

                    foreach (var linkId in linkIds)
                    {
                        var link = await _context.Links
                            .FirstOrDefaultAsync(l => 
                                (l.ExternalId == linkId || l.Id.ToString() == linkId) && 
                                l.TenantId == _tenantId);
                        
                        if (link != null)
                        {
                            await CreateDocumentRelationship<DocumentLink>(document.Id, link.Id);
                        }
                        else
                        {
                            result.Errors.Add(new ImportError 
                            { 
                                Field = "Links", 
                                Message = $"Link with reference {linkId} not found",
                                Type = "Validation" 
                            });
                        }
                    }
                }

                // Create File relationships
                if (rowData.TryGetValue("Bijlage(-n)", out var files))
                {
                    var fileIds = files.Split(';', StringSplitOptions.RemoveEmptyEntries)
                        .Select(f => f.Trim())
                        .Where(f => !string.IsNullOrEmpty(f));

                    foreach (var fileId in fileIds)
                    {
                        var file = await _context.Files
                            .FirstOrDefaultAsync(f => 
                                (f.ExternalId == fileId || f.Id.ToString() == fileId) && 
                                f.TenantId == _tenantId);
                        
                        if (file != null)
                        {
                            await CreateDocumentRelationship<DocumentFile>(document.Id, file.Id);
                        }
                        else
                        {
                            result.Errors.Add(new ImportError 
                            { 
                                Field = "Files", 
                                Message = $"File with reference {fileId} not found",
                                Type = "Validation" 
                            });
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating document relationships");
                result.Errors.Add(new ImportError { Field = "Relationships", Message = ex.Message });
            }
        }

        private async Task CreateDocumentRelationship<T>(int documentId, int entityId) where T : class, new()
        {
            var relationship = new T();
            var documentIdProperty = typeof(T).GetProperty("DocumentId");
            var entityIdProperty = typeof(T).GetProperty($"{typeof(T).Name.Replace("Document", "")}Id");
            var tenantIdProperty = typeof(T).GetProperty("TenantId");
            var createdByProperty = typeof(T).GetProperty("CreatedBy");
            var createdDateProperty = typeof(T).GetProperty("CreatedDate");
            var isActiveProperty = typeof(T).GetProperty("IsActive");

            documentIdProperty?.SetValue(relationship, documentId);
            entityIdProperty?.SetValue(relationship, entityId);
            tenantIdProperty?.SetValue(relationship, _tenantId);
            createdByProperty?.SetValue(relationship, _userId);
            createdDateProperty?.SetValue(relationship, DateTime.UtcNow);
            isActiveProperty?.SetValue(relationship, true);

            _context.Set<T>().Add(relationship);
        }
    }
} 