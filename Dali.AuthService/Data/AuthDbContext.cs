using Dali.AuthService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Dali.AuthService.Data;

public class AuthDbContext : IdentityDbContext<User, Role, string>
{
    private readonly string _tenantId;
    private readonly string _userId;

    public AuthDbContext(DbContextOptions<AuthDbContext> options, string tenantId = "", string userId = "")
        : base(options)
    {
        _tenantId = tenantId;
        _userId = userId;
    }

    public DbSet<Tenant> Tenants { get; set; } = null!;
    public DbSet<UserTenant> UserTenants { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Identity tables with schema
        builder.Entity<User>().ToTable("Users", "dbo");
        builder.Entity<Role>().ToTable("Roles", "dbo");
        builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims", "dbo");
        builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins", "dbo");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims", "dbo");
        builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens", "dbo");
        builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles", "dbo")
            .HasKey(r => new { r.UserId, r.RoleId });

        // Configure User
        builder.Entity<User>(b =>
        {
            b.ToTable("Users", "dbo");
            b.Property(u => u.TenantId).IsRequired();
            b.Property(u => u.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            b.HasMany(u => u.UserRoles).WithOne(ur => ur.User).HasForeignKey(ur => ur.UserId);
            b.HasMany(u => u.UserTenants).WithOne(ut => ut.User).HasForeignKey(ut => ut.UserId);
        });

        // Configure Role
        builder.Entity<Role>(b =>
        {
            b.ToTable("Roles", "dbo");
            b.Property(r => r.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            b.HasMany(r => r.UserRoles).WithOne(ur => ur.Role).HasForeignKey(ur => ur.RoleId);
            b.HasMany(r => r.RolePermissions).WithOne(rp => rp.Role).HasForeignKey(rp => rp.RoleId);
        });

        // Configure UserRole relationship (for our extended properties)
        builder.Entity<UserRole>(b =>
        {
            b.ToTable("UserRoles", "dbo");
            
            // Configure properties
            b.Property(ur => ur.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            b.Property(ur => ur.IsActive).HasDefaultValue(true);
            b.Property(ur => ur.CreatedBy).HasMaxLength(256).IsRequired();
            b.Property(ur => ur.ModifiedBy).HasMaxLength(256);
        });

        // Configure UserTenant relationship
        builder.Entity<UserTenant>(b =>
        {
            b.ToTable("UserTenants", "dbo");
            b.HasKey(ut => new { ut.UserId, ut.TenantId });
            
            // Configure properties
            b.Property(ut => ut.IsDefault)
                .IsRequired()
                .HasDefaultValue(true);
            
            b.Property(ut => ut.IsActive)
                .IsRequired()
                .HasDefaultValue(true);
            
            b.Property(ut => ut.CreatedDate)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");
            
            b.Property(ut => ut.CreatedBy)
                .IsRequired()
                .HasMaxLength(256);
            
            b.Property(ut => ut.ModifiedBy)
                .HasMaxLength(256);
            
            // Configure relationships
            b.HasOne(ut => ut.User)
                .WithMany(u => u.UserTenants)
                .HasForeignKey(ut => ut.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(ut => ut.Tenant)
                .WithMany(t => t.UserTenants)
                .HasForeignKey(ut => ut.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure RolePermission relationship
        builder.Entity<RolePermission>(b =>
        {
            b.ToTable("RolePermissions", "dbo");
            b.HasKey(rp => rp.Id);
            b.Property(rp => rp.Id).ValueGeneratedOnAdd();
        });

        // Configure Tenant
        builder.Entity<Tenant>(b =>
        {
            b.ToTable("Tenants", "dbo");
            b.HasKey(t => t.Id);
            b.Property(t => t.Id).ValueGeneratedOnAdd();
            b.HasIndex(t => t.Code).IsUnique();
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.TenantId = _tenantId;
                    entry.Entity.CreatedBy = _userId;
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                    entry.Entity.IsActive = true;
                    break;

                case EntityState.Modified:
                    entry.Entity.ModifiedBy = _userId;
                    entry.Entity.ModifiedDate = DateTime.UtcNow;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
} 