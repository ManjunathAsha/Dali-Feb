using Dali.DocumentService.Application.DTOs;

namespace Dali.DocumentService.Application.Services
{
    public interface IDocumentDetailsService
    {
        Task<IEnumerable<FileDto>> GetFiles(string documentId);
        Task<IEnumerable<LinkDto>> GetLinks(string documentId);
        Task<LocationDto> GetLocation(string documentId);
        Task<FileResultDto> DownloadFile(string documentId, string externalId);
        Task<FileResultDto> GetFile(string documentId, string externalId);
    }
} 