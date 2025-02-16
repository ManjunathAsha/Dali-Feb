using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Dali.ImportExportService.Infrastructure.Data;
using Dali.ImportExportService.Models;
using File = Dali.ImportExportService.Models.File;

namespace Dali.ImportExportService.Repository
{
    public interface IImportRepository
    {
        Task<Collection> GetCollectionAsync(int collectionId, string tenantId);
        Task<Link> GetLinkByExternalIdAsync(string externalId, string tenantId);
        Task<File> GetFileByExternalIdAsync(string externalId, string tenantId);
        Task<Section> GetOrCreateSectionAsync(string name, int collectionId, string tenantId, string userId);
        Task<Stage> GetOrCreateStageAsync(string name, string tenantId, string userId);
        Task<Client> GetOrCreateClientAsync(string name, string tenantId, string userId);
        Task<Location> GetOrCreateLocationAsync(string name, string tenantId, string userId);
        Task<Area> GetOrCreateAreaAsync(string name, string tenantId, string userId);
        Task<Topic> GetOrCreateTopicAsync(string name, int collectionId, string tenantId, string userId);
        Task<Subtopic> GetOrCreateSubtopicAsync(string name, int topicId, string tenantId, string userId);
        Task<EnforcementLevel> GetOrCreateEnforcementLevelAsync(string name, string tenantId, string userId);
        Task<Document> CreateDocumentAsync(Document document);
        Task<DocumentVersion> CreateDocumentVersionAsync(DocumentVersion version);
        Task<DocumentLink> CreateDocumentLinkAsync(DocumentLink documentLink);
        Task<DocumentFile> CreateDocumentFileAsync(DocumentFile documentFile);
        Task SaveChangesAsync();
    }

    public class ImportRepository : IImportRepository
    {
        private readonly ApplicationDbContext _context;

        public ImportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Collection> GetCollectionAsync(int collectionId, string tenantId)
        {
            return await _context.Collections
                .FirstOrDefaultAsync(c => c.Id == collectionId && c.TenantId == tenantId);
        }

        public async Task<Link> GetLinkByExternalIdAsync(string externalId, string tenantId)
        {
            return await _context.Links
                .FirstOrDefaultAsync(l => l.ExternalId == externalId && l.TenantId == tenantId);
        }

        public async Task<File> GetFileByExternalIdAsync(string externalId, string tenantId)
        {
            return await _context.Files
                .FirstOrDefaultAsync(f => f.ExternalId == externalId && f.TenantId == tenantId);
        }

        public async Task<Section> GetOrCreateSectionAsync(string name, int collectionId, string tenantId, string userId)
        {
            var section = await _context.Sections
                .FirstOrDefaultAsync(s => s.Name == name && s.CollectionId == collectionId);

            if (section == null)
            {
                section = new Section
                {
                    Name = name,
                    CollectionId = collectionId,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Sections.Add(section);
                await _context.SaveChangesAsync();
            }

            return section;
        }

        public async Task<Stage> GetOrCreateStageAsync(string name, string tenantId, string userId)
        {
            var stage = await _context.Stages
                .FirstOrDefaultAsync(s => s.Name == name && s.TenantId == tenantId);

            if (stage == null)
            {
                stage = new Stage
                {
                    Name = name,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Stages.Add(stage);
                await _context.SaveChangesAsync();
            }

            return stage;
        }

        public async Task<Client> GetOrCreateClientAsync(string name, string tenantId, string userId)
        {
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Name == name && c.TenantId == tenantId);

            if (client == null)
            {
                client = new Client
                {
                    Name = name,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Clients.Add(client);
                await _context.SaveChangesAsync();
            }

            return client;
        }

        public async Task<Location> GetOrCreateLocationAsync(string name, string tenantId, string userId)
        {
            var location = await _context.Locations
                .FirstOrDefaultAsync(l => l.Name == name && l.TenantId == tenantId);

            if (location == null)
            {
                location = new Location
                {
                    Name = name,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Locations.Add(location);
                await _context.SaveChangesAsync();
            }

            return location;
        }

        public async Task<Area> GetOrCreateAreaAsync(string name, string tenantId, string userId)
        {
            var area = await _context.Areas
                .FirstOrDefaultAsync(a => a.Name == name && a.TenantId == tenantId);

            if (area == null)
            {
                area = new Area
                {
                    Name = name,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Areas.Add(area);
                await _context.SaveChangesAsync();
            }

            return area;
        }

        public async Task<Topic> GetOrCreateTopicAsync(string name, int collectionId, string tenantId, string userId)
        {
            var topic = await _context.Topics
                .FirstOrDefaultAsync(t => t.Name == name && t.TenantId == tenantId);

            if (topic == null)
            {
                topic = new Topic
                {
                    Name = name,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Topics.Add(topic);
                await _context.SaveChangesAsync();
            }

            return topic;
        }

        public async Task<Subtopic> GetOrCreateSubtopicAsync(string name, int topicId, string tenantId, string userId)
        {
            var subtopic = await _context.Subtopics
                .FirstOrDefaultAsync(s => s.Name == name && s.TopicId == topicId);

            if (subtopic == null)
            {
                subtopic = new Subtopic
                {
                    Name = name,
                    TopicId = topicId,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Subtopics.Add(subtopic);
                await _context.SaveChangesAsync();
            }

            return subtopic;
        }

        public async Task<EnforcementLevel> GetOrCreateEnforcementLevelAsync(string name, string tenantId, string userId)
        {
            var level = await _context.EnforcementLevels
                .FirstOrDefaultAsync(e => e.Name == name && e.TenantId == tenantId);

            if (level == null)
            {
                level = new EnforcementLevel
                {
                    Name = name,
                    TenantId = tenantId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };
                _context.EnforcementLevels.Add(level);
                await _context.SaveChangesAsync();
            }

            return level;
        }

        public async Task<Document> CreateDocumentAsync(Document document)
        {
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();
            return document;
        }

        public async Task<DocumentVersion> CreateDocumentVersionAsync(DocumentVersion version)
        {
            _context.DocumentVersions.Add(version);
            await _context.SaveChangesAsync();
            return version;
        }

        public async Task<DocumentLink> CreateDocumentLinkAsync(DocumentLink documentLink)
        {
            _context.DocumentLinks.Add(documentLink);
            await _context.SaveChangesAsync();
            return documentLink;
        }

        public async Task<DocumentFile> CreateDocumentFileAsync(DocumentFile documentFile)
        {
            _context.DocumentFiles.Add(documentFile);
            await _context.SaveChangesAsync();
            return documentFile;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
} 