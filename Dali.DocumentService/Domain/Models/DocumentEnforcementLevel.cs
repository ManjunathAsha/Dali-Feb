using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Dali.DocumentService.Domain.Models
{
    [Table("DocumentEnforcementLevels", Schema = "dbo")]
    public class DocumentEnforcementLevel : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        [ForeignKey("EnforcementLevel")]
        public int EnforcementLevelId { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual EnforcementLevel EnforcementLevel { get; set; }
    }
}
