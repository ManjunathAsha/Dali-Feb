using Dali.DocumentService.Application.DTOs;
using Dali.DocumentService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Dali.DocumentService.Application.Services
{
    public class DocumentDetailsService : IDocumentDetailsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileStorageService _fileStorage;

        public DocumentDetailsService(ApplicationDbContext context, IFileStorageService fileStorage)
        {
            _context = context;
            _fileStorage = fileStorage;
        }

        public async Task<IEnumerable<FileDto>> GetFiles(string documentId)
        {
            var parsedId = int.Parse(documentId);
            var files = await _context.DocumentFiles
                .Where(df => df.DocumentId == parsedId &&
                            df.IsActive &&
                            df.File.IsActive)
                .Select(df => new FileDto
                {
                    ExternalId = df.File.ExternalId,
                    FileName = df.File.Name,
                    FilePath = df.File.FilePath,
                    FileType = df.File.FileType
                })
                .ToListAsync();

            return files;
        }

        public async Task<IEnumerable<LinkDto>> GetLinks(string documentId)
        {
            var parsedId = int.Parse(documentId);
            var links = await _context.DocumentLinks
                .Where(dl => dl.DocumentId == parsedId &&
                            dl.IsActive &&
                            dl.Link.IsActive)
                .Select(dl => new LinkDto
                {
                    ExternalId = dl.Link.ExternalId,
                    FileName = dl.Link.Title,
                    Url = dl.Link.Url
                })
                .ToListAsync();

            return links;
        }

        public async Task<LocationDto> GetLocation(string documentId)
        {
            var parsedId = int.Parse(documentId);
            
            // Simplified query without explicit Include statements
            var locations = await _context.Documents
                .Where(d => d.Id == parsedId)
                .Select(d => new LocationDto
                {
                    Section = d.Sections
                        .Where(s => s.IsActive)
                        .Select(s => s.Section.Name)
                        .FirstOrDefault(),
                    Stage = d.Stages
                        .Where(s => s.IsActive)
                        .Select(s => s.Stage.Name)
                        .FirstOrDefault(),
                    Area = d.Areas
                        .Where(a => a.IsActive)
                        .Select(a => a.Area.Name)
                        .FirstOrDefault(),
                    Topic = d.Topics
                        .Where(t => t.IsActive)
                        .Select(t => t.Topic.Name)
                        .FirstOrDefault(),
                    Subtopic = d.Subtopics
                        .Where(s => s.IsActive)
                        .Select(s => s.Subtopic.Name)
                        .FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            return locations;
        }

        public async Task<FileResultDto> DownloadFile(string documentId, string externalId)
        {
            var parsedDocId = int.Parse(documentId);
            var documentFile = await _context.DocumentFiles
                .Include(df => df.File)
                .Where(df => df.DocumentId == parsedDocId && 
                            df.File.ExternalId == externalId &&
                            df.IsActive &&
                            df.File.IsActive)
                .FirstOrDefaultAsync();

            if (documentFile == null)
                return null;

            try 
            {
                var fileContent = await _fileStorage.GetFileAsync(documentFile.File.FilePath);
                
                return new FileResultDto
                {
                    Content = fileContent,
                    ContentType = documentFile.File.FileType,
                    FileName = documentFile.File.Name
                };
            }
            catch (FileNotFoundException)
            {
                // Log that the physical file is missing
                throw new FileNotFoundException(
                    $"Physical file not found. DocumentId: {documentId}, ExternalId: {externalId}, FilePath: {documentFile.File.FilePath}");
            }
        }

        public async Task<FileResultDto> GetFile(string documentId, string externalId)
        {
            var parsedDocId = int.Parse(documentId);
            var documentFile = await _context.DocumentFiles
                .Include(df => df.File)
                .Where(df => df.DocumentId == parsedDocId && 
                            df.File.ExternalId == externalId &&
                            df.IsActive &&
                            df.File.IsActive)
                .FirstOrDefaultAsync();

            if (documentFile == null)
                return null;

            try 
            {
                var fileContent = await _fileStorage.GetFileAsync(documentFile.File.FilePath);
                
                return new FileResultDto
                {
                    Content = fileContent,
                    ContentType = documentFile.File.FileType,
                    FileName = documentFile.File.Name
                };
            }
            catch (FileNotFoundException)
            {
                // Log that the physical file is missing
                throw new FileNotFoundException(
                    $"Physical file not found. DocumentId: {documentId}, ExternalId: {externalId}, FilePath: {documentFile.File.FilePath}");
            }
        }
    }
} 