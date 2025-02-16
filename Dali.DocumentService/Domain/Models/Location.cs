using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Dali.DocumentService.Domain.Models
{
    [Table("Locations", Schema = "dbo")]
    public class Location : BaseEntity
    {
        public Location()
        {
            DocumentLocations = new HashSet<DocumentLocation>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int OrderIndex { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        public int CollectionId { get; set; }

        [ForeignKey("CollectionId")]
        public virtual Collection Collection { get; set; }

        // Navigation Properties
        public virtual ICollection<DocumentLocation> DocumentLocations { get; set; }
    }
}
