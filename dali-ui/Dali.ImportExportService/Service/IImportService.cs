using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Dali.ImportExportService.DTO;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Service;

public interface IImportService
{
    Task<ImportResult> ImportDocumentsAsync(IFormFile file, int collectionId, string tenantId, string userId);
    Task<Collection> GetCollectionAsync(int collectionId);
} 