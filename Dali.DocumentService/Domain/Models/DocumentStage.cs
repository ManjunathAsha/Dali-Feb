using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models
{
    [Table("DocumentStages", Schema = "dbo")]
    public class DocumentStage : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        [ForeignKey("Stage")]
        public int StageId { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual Stage Stage { get; set; }
    }
}
