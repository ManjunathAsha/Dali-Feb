using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models
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
        public int DocumentId { get; set; }

        [Required]
        public int FileId { get; set; }

        public int OrderIndex { get; set; }

        public new bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual File File { get; set; }
    }
}
