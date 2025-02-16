using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.ImportExportService.Models.Support;

[Table("CollectionPermissionMatrix", Schema = "dbo")]
public class CollectionPermissionMatrix : BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CollectionId { get; set; }

    [Required]
    [StringLength(50)]
    public string RoleId { get; set; } = string.Empty;

    [Required]
    public bool CanView { get; set; }

    [Required]
    public bool CanEdit { get; set; }

    [Required]
    public bool CanDelete { get; set; }

    [Required]
    public bool CanShare { get; set; }

    [Required]
    public bool CanImport { get; set; }

    [Required]
    public bool CanExport { get; set; }

    // Navigation Properties
    [ForeignKey("CollectionId")]
    public virtual Collection Collection { get; set; } = null!;
} 