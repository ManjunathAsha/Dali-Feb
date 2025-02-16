using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;


namespace Dali.ImportExportService.ChangeRequest
{
    /// <summary>
    /// Represents a change request for a document
    /// </summary>
    [Table("DocumentChangeRequests", Schema = "dbo")]
    public class DocumentChangeRequest : BaseEntity
    {
        public DocumentChangeRequest()
        {
            TenantId = string.Empty;
            Description = string.Empty;
            Type = 0;
            StatusId = 0;
            CreatedDate = DateTime.UtcNow;
            CreatedBy = string.Empty;
            ModifiedBy = string.Empty;
            IsActive = true;
            IsApproved = false;
            Actions = new List<DocumentChangeRequestAction>();
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
        [StringLength(50)]
        public string RequestType { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Notes { get; set; }

        [Required]
        public int Type { get; set; }  // New = 0, Update = 1, Delete = 2

        [Required]
        public int StatusId { get; set; }  // New = 0, InProgress = 1, Rejected = 2

        [Required]
        public bool IsApproved { get; set; }

        [Required]
        [StringLength(450)]
        public string TenantId { get; set; }

        public string? Justification { get; set; }

        public string? RejectMessage { get; set; }

        [StringLength(256)]
        public string? AssignedTo { get; set; }

        public DateTime? DueDate { get; set; }

        [StringLength(256)]
        public string? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(256)]
        public string? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public DateTime? ApprovedDate { get; set; }

        [StringLength(256)]
        public string? ApprovedBy { get; set; }

        public DateTime? RejectedDate { get; set; }

        [StringLength(256)]
        public string? RejectedBy { get; set; }

        [StringLength(1000)]
        public string? RejectionReason { get; set; }

        public virtual Document Document { get; set; }

        public virtual ICollection<DocumentChangeRequestAction> Actions { get; set; }
    }
}
