using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("Labels", Schema = "dbo")]
    public class Label : BaseEntity
    {
        public Label()
        {
            DocumentLabels = new HashSet<DocumentLabel>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        [StringLength(50)]
        public string Color { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual ICollection<DocumentLabel> DocumentLabels { get; set; }
    }
}
