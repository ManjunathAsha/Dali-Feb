using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.AuthService.Models;

[Table("UserRoles", Schema = "dbo")]
public class UserRole : IdentityUserRole<string>
{
    public UserRole() : base()
    {
        CreatedDate = DateTime.UtcNow;
        IsActive = true;
        CreatedBy = string.Empty;
        ModifiedBy = string.Empty;
    }

    [Required]
    public bool IsActive { get; set; }

    [Required]
    [StringLength(256)]
    public string CreatedBy { get; set; }

    [Required]
    public DateTime CreatedDate { get; set; }

    [StringLength(256)]
    public string ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    // Navigation Properties
    public virtual User? User { get; set; }
    public virtual Role? Role { get; set; }
} 