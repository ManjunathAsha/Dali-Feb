using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.ImportExportService.Models;

[Table("DocumentReviews", Schema = "dbo")]
public class DocumentReview : BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int DocumentId { get; set; }

    [Required]
    [StringLength(50)]
    public string ReviewType { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Comments { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = "Pending";

    public DateTime? ReviewDate { get; set; }

    [StringLength(256)]
    public string? ReviewedBy { get; set; }

    [StringLength(1000)]
    public string? ReviewNotes { get; set; }

    // Navigation Properties
    [ForeignKey("DocumentId")]
    public virtual Document Document { get; set; } = null!;
} 