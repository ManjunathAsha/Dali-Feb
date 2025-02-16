using System.ComponentModel.DataAnnotations;

namespace Dali.ImportExportService.DTO;

public class FileModel
{
    [Required]
    public string FileName { get; set; } = string.Empty;

    [Required]
    public string ContentType { get; set; } = string.Empty;

    [Required]
    public byte[] Content { get; set; } = Array.Empty<byte>();

    public string? ExternalId { get; set; }

    public string? Description { get; set; }
} 