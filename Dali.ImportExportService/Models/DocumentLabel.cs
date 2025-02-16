using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("DocumentLabels", Schema = "dbo")]
    public class DocumentLabel : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        [ForeignKey("Label")]
        public int LabelId { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual Label Label { get; set; }
    }
}
