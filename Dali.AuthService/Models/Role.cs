using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.AuthService.Models;

[Table("Roles", Schema = "dbo")]
public class Role : IdentityRole
{
    public Role()
    {
        ConcurrencyStamp = Guid.NewGuid().ToString();
        CreatedDate = DateTime.UtcNow;
        IsActive = true;
    }

    [StringLength(1000)]
    public string? Description { get; set; }

    // Base Entity Properties
    [Required]
    public bool IsActive { get; set; }

    [StringLength(256)]
    public string? CreatedBy { get; set; }

    [Required]
    public DateTime CreatedDate { get; set; }

    [StringLength(256)]
    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    // Navigation Properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new HashSet<UserRole>();
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new HashSet<RolePermission>();
}
