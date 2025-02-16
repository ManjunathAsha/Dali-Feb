using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("DocumentTopics", Schema = "dbo")]
    public class DocumentTopic : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        [ForeignKey("Topic")]
        public int TopicId { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual Topic Topic { get; set; }
    }
}
