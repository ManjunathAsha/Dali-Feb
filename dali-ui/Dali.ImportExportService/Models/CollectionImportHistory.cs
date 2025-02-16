using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;


namespace Dali.ImportExportService.Models
{
    [Table("CollectionImportHistory", Schema = "dbo")]
    public class CollectionImportHistory : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Collection")]
        public int CollectionId { get; set; }

        [Required]
        [StringLength(256)]
        public string FileName { get; set; }

        [Required]
        [StringLength(50)]
        public string ImportType { get; set; }

        [Required]
        public int TotalRecords { get; set; }

        public int SuccessCount { get; set; }

        public int ErrorCount { get; set; }

        public int WarningCount { get; set; }

        [Required]
        public ImportStatus Status { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        [StringLength(4000)]
        public string ErrorMessage { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string ImportData { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string ValidationResults { get; set; }

        // Navigation Properties
        public virtual Collection Collection { get; set; }
    }
}
