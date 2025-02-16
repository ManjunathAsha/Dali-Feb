using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Dali.DocumentService.Domain.Models
{
    [Table("DocumentReviews", Schema = "dbo")]
    public class DocumentReview : BaseEntity
    {
        public DocumentReview()
        {
            TenantId = string.Empty;
            ReviewerName = string.Empty;
            Comments = string.Empty;
            Status = ReviewStatus.Pending;
            CreatedDate = DateTime.UtcNow;
            CreatedBy = string.Empty;
            ModifiedBy = string.Empty;
            IsActive = true;
        }

        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        public int VersionId { get; set; }

        [Required]
        [StringLength(256)]
        public string ReviewerName { get; set; }

        [Required]
        public ReviewStatus Status { get; set; }

        [StringLength(4000)]
        public string Comments { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        [StringLength(256)]
        public string CompletedBy { get; set; }

        [StringLength(256)]
        public string AssignedBy { get; set; }

        public DateTime AssignedDate { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
    }

    public enum ReviewStatus
    {
        Pending = 0,
        InProgress = 1,
        Completed = 2,
        Rejected = 3
    }
} 