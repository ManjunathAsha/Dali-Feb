using Dali.DocumentService.Application.Services;
using Microsoft.Extensions.Configuration;

namespace Dali.DocumentService.Infrastructure.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _storageBasePath;

        public FileStorageService(IConfiguration configuration)
        {
            _storageBasePath = configuration["FileStorage:BasePath"] ?? Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "FileStorage");
            if (!Directory.Exists(_storageBasePath))
            {
                Directory.CreateDirectory(_storageBasePath);
            }
        }

        public async Task<byte[]> GetFileAsync(string filePath)
        {
            var fullPath = Path.Combine(_storageBasePath, filePath);
            if (!File.Exists(fullPath))
            {
                throw new FileNotFoundException($"File not found at path: {filePath}");
            }

            return await File.ReadAllBytesAsync(fullPath);
        }

        public async Task<string> SaveFileAsync(byte[] fileContent, string fileName)
        {
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var filePath = Path.Combine(_storageBasePath, uniqueFileName);

            await File.WriteAllBytesAsync(filePath, fileContent);
            return uniqueFileName;
        }

        public async Task DeleteFileAsync(string filePath)
        {
            var fullPath = Path.Combine(_storageBasePath, filePath);
            if (File.Exists(fullPath))
            {
                await Task.Run(() => File.Delete(fullPath));
            }
        }

        public Task<bool> FileExistsAsync(string filePath)
        {
            var fullPath = Path.Combine(_storageBasePath, filePath);
            return Task.FromResult(File.Exists(fullPath));
        }
    }
} 