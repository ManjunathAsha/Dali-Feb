using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Dali.DocumentService.Domain.Models
{
    [Table("DocumentLinks", Schema = "dbo")]
    public class DocumentLink : BaseEntity
    {
        public DocumentLink()
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
        [ForeignKey("Link")]
        public int LinkId { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual Link Link { get; set; }
    }
}
