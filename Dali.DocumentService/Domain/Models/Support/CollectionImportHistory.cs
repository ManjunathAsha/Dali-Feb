using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models.Support
{
    [Table("CollectionImportHistory", Schema = "dbo")]
    public class CollectionImportHistory : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CollectionId { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(1000)]
        public string Message { get; set; }

        public DateTime ImportDate { get; set; }

        [StringLength(256)]
        public string ImportedBy { get; set; }

        // Navigation Properties
        public virtual Collection Collection { get; set; }
    }
} 