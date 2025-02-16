namespace Dali.ImportExportService.Infrastructure.Settings;

public class ImportSettings
{
    public int BatchSize { get; set; } = 100;
    public int CommandTimeout { get; set; } = 300;
    public bool EnableBatchOperations { get; set; } = true;
    public int MaxConcurrentOperations { get; set; } = 4;
    public long MaxFileSize { get; set; } = 10485760; // 10MB
    public string[] AllowedFileTypes { get; set; } = new[] { ".xlsx", ".xls", ".csv" };
    public bool EnableValidation { get; set; } = true;
    public string[] RequiredFields { get; set; } = new[] { "Title", "Description", "Section" };
} 