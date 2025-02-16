using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using File = Dali.ImportExportService.Models.File;

namespace Dali.ImportExportService.Models
{
    [Table("DocumentFiles", Schema = "dbo")]
    public class DocumentFile : BaseEntity
    {
        public DocumentFile()
        {
            TenantId = string.Empty;
            CreatedBy = string.Empty;
            ModifiedBy = string.Empty;
            IsActive = true;
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        public int VersionId { get; set; }

        [Required]
        [ForeignKey("File")]
        public int FileId { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; } = null!;

        [ForeignKey("FileId")]
        public virtual File File { get; set; } = null!;
    }
}
