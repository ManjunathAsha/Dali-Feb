namespace Dali.DocumentService.Application.Services
{
    public interface IFileStorageService
    {
        Task<byte[]> GetFileAsync(string filePath);
        Task<string> SaveFileAsync(byte[] fileContent, string fileName);
        Task DeleteFileAsync(string filePath);
        Task<bool> FileExistsAsync(string filePath);
    }
} 