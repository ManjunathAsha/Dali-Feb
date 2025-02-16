using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models
{
    [Table("CollectionMembers", Schema = "dbo")]
    public class CollectionMember : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Collection")]
        public int CollectionId { get; set; }

        [Required]
        [StringLength(256)]
        public string UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Role { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }

        // Navigation Properties
        public virtual Collection Collection { get; set; }
    }
}
