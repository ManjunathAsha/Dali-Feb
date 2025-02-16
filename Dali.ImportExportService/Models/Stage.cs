using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("Stages", Schema = "dbo")]
    public class Stage : BaseEntity
    {
        public Stage()
        {
            DocumentStages = new HashSet<DocumentStage>();
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
        public virtual ICollection<DocumentStage> DocumentStages { get; set; }
    }
}
