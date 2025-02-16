using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.AuthService.Models;

[Table("Tenants", Schema = "dbo")]
public class Tenant
{
    public Tenant()
    {
        Id = Guid.NewGuid().ToString();
        UserTenants = new HashSet<UserTenant>();
        CreatedDate = DateTime.UtcNow;
        IsActive = true;
        Code = string.Empty;
        Name = string.Empty;
        ConnectionString = string.Empty;
        CreatedBy = string.Empty;
        ModifiedBy = string.Empty;
    }

    [Key]
    [StringLength(450)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Code { get; set; }

    [Required]
    [StringLength(256)]
    public string Name { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    [StringLength(256)]
    public string ConnectionString { get; set; }

    [Required]
    public bool IsDefault { get; set; }

    [Required]
    public bool IsEnabled { get; set; }

    [Required]
    public bool IsActive { get; set; }

    [Required]
    [StringLength(256)]
    public string CreatedBy { get; set; }

    [Required]
    public DateTime CreatedDate { get; set; }

    [Required]
    [StringLength(256)]
    public string ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    // Navigation Properties
    public virtual ICollection<UserTenant> UserTenants { get; set; }
} 