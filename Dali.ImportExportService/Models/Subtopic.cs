using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("Subtopics", Schema = "dbo")]
    public class Subtopic : BaseEntity
    {
        public Subtopic()
        {
            DocumentSubtopics = new HashSet<DocumentSubtopic>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int OrderIndex { get; set; }

        [Required]
        [ForeignKey("Topic")]
        public int TopicId { get; set; }

        // Navigation Properties
        public virtual Topic Topic { get; set; }
        public virtual ICollection<DocumentSubtopic> DocumentSubtopics { get; set; }
    }
}
