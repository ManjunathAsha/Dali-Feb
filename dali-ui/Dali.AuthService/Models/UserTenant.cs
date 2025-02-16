using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.AuthService.Models;

[Table("UserTenants", Schema = "dbo")]
public class UserTenant
{
    public UserTenant()
    {
        CreatedDate = DateTime.UtcNow;
        IsActive = true;
        UserId = string.Empty;
        TenantId = string.Empty;
        CreatedBy = string.Empty;
        ModifiedBy = string.Empty;
    }

    [Required]
    [ForeignKey("User")]
    public string UserId { get; set; }

    [Required]
    [ForeignKey("Tenant")]
    [StringLength(450)]
    public string TenantId { get; set; }

   
    public bool IsDefault { get; set; }

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
    public virtual User User { get; set; } = null!;
    public virtual Tenant Tenant { get; set; } = null!;
}