using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.ChangeRequest
{
    /// <summary>
    /// Represents an action taken on a document change request
    /// </summary>
    [Table("DocumentChangeRequestActions", Schema = "dbo")]
    public class DocumentChangeRequestAction : BaseEntity
    {
        public DocumentChangeRequestAction()
        {
            TenantId = string.Empty;
            Description = string.Empty;
            Type = 0;
            CreatedDate = DateTime.UtcNow;
            CreatedBy = string.Empty;
            ModifiedBy = string.Empty;
            IsActive = true;
        }

        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        public int ChangeRequestId { get; set; }

        [Required]
        public int Type { get; set; }  // Comment = 0, StatusChange = 1, Assignment = 2

        [Required]
        [StringLength(450)]
        public string TenantId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(256)]
        public string? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(256)]
        public string? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        [ForeignKey("ChangeRequestId")]
        public virtual DocumentChangeRequest ChangeRequest { get; set; }
    }
}
