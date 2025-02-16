using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models
{
    [Table("DocumentChangeRequests", Schema = "dbo")]
    public class DocumentChangeRequest : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DocumentId { get; set; }

        [Required]
        [StringLength(256)]
        public required string Title { get; set; }

        [Required]
        [StringLength(4000)]
        public required string Description { get; set; }

        [Required]
        [StringLength(50)]
        public required string Status { get; set; }

        [Required]
        [StringLength(256)]
        public required string RequestedBy { get; set; }

        [Required]
        public required DateTime RequestedDate { get; set; }

        [StringLength(256)]
        public string? ApprovedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        // Navigation Properties
        [Required]
        public required Document Document { get; set; }
    }
} 