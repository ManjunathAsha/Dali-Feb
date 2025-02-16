using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Dali.DocumentService.Domain.Models
{
    [Table("Topics", Schema = "dbo")]
    public class Topic : BaseEntity
    {
        public Topic()
        {
            Subtopics = new HashSet<Subtopic>();
            DocumentTopics = new HashSet<DocumentTopic>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int OrderIndex { get; set; }

        [ForeignKey("Section")]
        public int? SectionId { get; set; }

        [Required]
        public int CollectionId { get; set; }

        // Navigation Properties
        public virtual Section Section { get; set; }
        public virtual Collection Collection { get; set; }
        public virtual ICollection<Subtopic> Subtopics { get; set; }
        public virtual ICollection<DocumentTopic> DocumentTopics { get; set; }
    }
}
