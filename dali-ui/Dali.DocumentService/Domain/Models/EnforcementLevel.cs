using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models
{
    [Table("EnforcementLevels", Schema = "dbo")]
    public class EnforcementLevel : BaseEntity
    {
        public EnforcementLevel()
        {
            DocumentEnforcementLevels = new HashSet<DocumentEnforcementLevel>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int OrderIndex { get; set; }

          public int CollectionId { get; set; }

        [ForeignKey("CollectionId")]
        public virtual Collection Collection { get; set; }

        // Navigation Properties
        public virtual ICollection<DocumentEnforcementLevel> DocumentEnforcementLevels { get; set; }
    }
}
