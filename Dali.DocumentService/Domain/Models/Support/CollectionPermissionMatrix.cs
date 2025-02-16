using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models.Support
{
    [Table("CollectionPermissionMatrix", Schema = "dbo")]
    public class CollectionPermissionMatrix : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CollectionId { get; set; }

        [Required]
        [StringLength(256)]
        public string UserOrGroup { get; set; }

        [Required]
        [StringLength(50)]
        public string Permission { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual Collection Collection { get; set; }
    }
} 