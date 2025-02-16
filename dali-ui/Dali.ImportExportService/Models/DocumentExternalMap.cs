using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("DocumentExternalMaps", Schema = "dbo")]
    public class DocumentExternalMap : BaseEntity
    {
        public DocumentExternalMap()
        {
            TenantId = string.Empty;
            Description = string.Empty;
            Value = string.Empty;
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
        [StringLength(256)]
        public string Description { get; set; }

        [Required]
        [StringLength(1000)]
        public string Value { get; set; }

        public virtual Document Document { get; set; }
    }
} 