using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dali.ImportExportService.DTO
{
    public class ExcelImportDto
    {
        [Required]
        public string Hoofdstuk { get; set; }  // Section

        [Required]
        public string Niveau { get; set; }  // Stage

        [Required]
        public string Gemeente { get; set; }  // Client

        [Required]
        public string Woonkern { get; set; }  // Location

        [Required]
        public string GebiedsoortStr { get; set; }  // Area

        [Required]
        public string Onderwerp { get; set; }  // Topic

        [Required]
        public string Subonderwerp { get; set; }  // Subtopic

        [Required]
        public string Hardheid { get; set; }  // EnforcementLevel

        [Required]
        public string Bronverwijzing { get; set; }  // Links

        [Required]
        public string Bijlagen { get; set; }  // Files

        [Required]
        public required string Eis { get; set; }  // Description

    }

    public class ExcelLinkDto
    {
        [Required]
        public string Description { get; set; }

        [Required]
        public string Url { get; set; }

        public int OrderIndex { get; set; }
    }

    public class ExcelFileDto
    {
        [Required]
        public string Description { get; set; }

        [Required]
        public string FileName { get; set; }

        public int OrderIndex { get; set; }
    }

    public class ImportResult
    {
        public bool Success { get; set; }
        public int TotalRecords { get; set; }
        public int SuccessfulRecords { get; set; }
        public int FailedRecords { get; set; }
        public List<string> Messages { get; set; } = new List<string>();
        public List<ImportError> Errors { get; set; } = new List<ImportError>();
    }

    public class ImportError
    {
        public string Field { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public string Severity { get; set; }
        public int RowNumber { get; set; }
    }
} 