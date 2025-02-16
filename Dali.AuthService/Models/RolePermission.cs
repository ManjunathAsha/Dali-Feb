using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.AuthService.Models;

[Table("RolePermissions", Schema = "dbo")]
public class RolePermission : BaseEntity
{
    public RolePermission()
    {
        Permission = string.Empty;
        RoleId = string.Empty;
    }

    [Key]
    [StringLength(450)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [StringLength(450)]
    [ForeignKey("Role")]
    public string RoleId { get; set; }

    [Required]
    [StringLength(50)]
    public string Permission { get; set; }

    [Required]
    public bool IsGranted { get; set; }

    [Required]
    public bool CanDelete { get; set; }

    // Navigation Properties
    public virtual Role Role { get; set; } = null!;
}