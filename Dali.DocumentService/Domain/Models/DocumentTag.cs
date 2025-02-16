using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Dali.DocumentService.Domain.Models
{
    [Table("DocumentTags", Schema = "dbo")]
    public class DocumentTag : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        public int DocumentId { get; set; }

        [Required]
        public int VersionId { get; set; }

        [Required]
        [StringLength(100)]
        public string Tag { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
    }
} 