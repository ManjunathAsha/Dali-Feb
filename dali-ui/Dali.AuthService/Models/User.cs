using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.AuthService.Models;

[Table("Users", Schema = "dbo")]
public class User : IdentityUser
{
    public User()
    {
        TenantId = string.Empty;
        UserName = string.Empty;
        Email = string.Empty;
        NormalizedEmail = string.Empty;
        NormalizedUserName = string.Empty;
        SecurityStamp = string.Empty;
        ConcurrencyStamp = Guid.NewGuid().ToString();
        CreatedDate = DateTime.UtcNow;
        CreatedBy = string.Empty;
        ModifiedBy = string.Empty;
        IsActive = true;
        NotifyByEmail = false;
    }

    [Required]
    [StringLength(256)]
    [Display(Name = "Username")]
    public override string? UserName 
    { 
        get => base.UserName; 
        set => base.UserName = value; 
    }

    [Required]
    [StringLength(256)]
    public override string? Email 
    { 
        get => base.Email; 
        set => base.Email = value; 
    }

    [Required]
    [StringLength(50)]
    public string TenantId { get; set; }

    [StringLength(256)]
    [Display(Name = "First Name")]
    public string? FirstName { get; set; }

    [StringLength(256)]
    [Display(Name = "Last Name")]
    public string? LastName { get; set; }

    [StringLength(256)]
    public string? Address { get; set; }

    [StringLength(256)]
    public string? City { get; set; }

    [StringLength(256)]
    public string? State { get; set; }

    [StringLength(20)]
    [Display(Name = "Postal Code")]
    public string? PostalCode { get; set; }

    [StringLength(4000)]
    [Display(Name = "Azure AD User ID")]
    public string? AzureAdUserId { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiryTime { get; set; }

    [Display(Name = "Last Login")]
    public DateTime? LastLoginDate { get; set; }

    [Required]
    [Display(Name = "Email Notifications")]
    public bool NotifyByEmail { get; set; }

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
    public virtual ICollection<UserTenant> UserTenants { get; set; } = new HashSet<UserTenant>();
}
