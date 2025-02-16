using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("DocumentVersions", Schema = "dbo")]
    public class DocumentVersion : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        public int VersionNumber { get; set; }

        [Required]
        [StringLength(256)]
        public string Title { get; set; }

        [Required]
        [StringLength(4000)]
        public string Description { get; set; }

        public string Content { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }

        [StringLength(256)]
        public string PublishedBy { get; set; }

        public DateTime? PublishedDate { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
    }
}
