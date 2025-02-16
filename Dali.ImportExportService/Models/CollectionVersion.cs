using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;


namespace Dali.ImportExportService.Models
{
    [Table("CollectionVersions", Schema = "dbo")]
    public class CollectionVersion : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Collection")]
        public int CollectionId { get; set; }

        [Required]
        public int VersionNumber { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public CollectionStatus Status { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }

        [StringLength(256)]
        public string PublishedBy { get; set; }

        public DateTime? PublishedDate { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public DateTime? ExpiryDate { get; set; }

        // Navigation Properties
        public virtual Collection Collection { get; set; }
    }
}
