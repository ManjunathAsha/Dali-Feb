using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models
{
    [Table("DocumentAreas", Schema = "dbo")]
    public class DocumentArea : BaseEntity
    {
         [Key]
        public int Id { get; set; }

          [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }
        
          [Required]
        [ForeignKey("Area")]
        public int AreaId { get; set; }
        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual Area Area { get; set; }
    }
}
