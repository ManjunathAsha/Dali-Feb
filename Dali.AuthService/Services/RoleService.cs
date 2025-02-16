using Dali.AuthService.Data;
using Dali.AuthService.DTOs;
using Dali.AuthService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Dali.AuthService.Services;

public class RoleService
{
    private readonly RoleManager<Role> _roleManager;
    private readonly UserManager<User> _userManager;
    private readonly ILogger<RoleService> _logger;
    private readonly AuthDbContext _dbContext;

    public RoleService(
        RoleManager<Role> roleManager,
        UserManager<User> userManager,
        ILogger<RoleService> logger,
        AuthDbContext dbContext)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _logger = logger;
        _dbContext = dbContext;
    }

    public async Task<List<RoleDto>> GetAllRolesAsync()
    {
        var roles = await _roleManager.Roles.ToListAsync();
        return roles.Select(r => new RoleDto
        {
            Id = r.Id,
            Name = r.Name ?? string.Empty,
            Description = r.Description,
            IsActive = r.IsActive,
            CreatedDate = r.CreatedDate,
            ModifiedDate = r.ModifiedDate
        }).ToList();
    }

    public async Task<RoleResponseDto> GetRoleByIdAsync(string id)
    {
        var role = await _roleManager.FindByIdAsync(id);
        if (role == null)
        {
            return new RoleResponseDto
            {
                Success = false,
                Message = "Role not found"
            };
        }

        return new RoleResponseDto
        {
            Success = true,
            Role = new RoleDto
            {
                Id = role.Id,
                Name = role.Name ?? string.Empty,
                Description = role.Description,
                IsActive = role.IsActive,
                CreatedDate = role.CreatedDate,
                ModifiedDate = role.ModifiedDate
            }
        };
    }

    public async Task<RoleResponseDto> CreateRoleAsync(CreateRoleDto request, string userId)
    {
        try
        {
            var existingRole = await _roleManager.FindByNameAsync(request.Name);
            if (existingRole != null)
            {
                return new RoleResponseDto
                {
                    Success = false,
                    Message = "Role with this name already exists"
                };
            }

            var role = new Role
            {
                Name = request.Name,
                Description = request.Description,
                CreatedBy = userId,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _roleManager.CreateAsync(role);
            if (!result.Succeeded)
            {
                return new RoleResponseDto
                {
                    Success = false,
                    Message = "Failed to create role",
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            return new RoleResponseDto
            {
                Success = true,
                Message = "Role created successfully",
                Role = new RoleDto
                {
                    Id = role.Id,
                    Name = role.Name ?? string.Empty,
                    Description = role.Description,
                    IsActive = role.IsActive,
                    CreatedDate = role.CreatedDate,
                    ModifiedDate = role.ModifiedDate
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating role: {Name}", request.Name);
            return new RoleResponseDto
            {
                Success = false,
                Message = "An error occurred while creating the role",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<RoleResponseDto> UpdateRoleAsync(string id, UpdateRoleDto request, string userId)
    {
        try
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return new RoleResponseDto
                {
                    Success = false,
                    Message = "Role not found"
                };
            }

            if (!string.IsNullOrEmpty(request.Name) && role.Name != request.Name)
            {
                var existingRole = await _roleManager.FindByNameAsync(request.Name);
                if (existingRole != null)
                {
                    return new RoleResponseDto
                    {
                        Success = false,
                        Message = "Role with this name already exists"
                    };
                }
                role.Name = request.Name;
            }

            if (request.Description != null)
            {
                role.Description = request.Description;
            }

            if (request.IsActive.HasValue)
            {
                role.IsActive = request.IsActive.Value;
            }

            role.ModifiedBy = userId;
            role.ModifiedDate = DateTime.UtcNow;

            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
            {
                return new RoleResponseDto
                {
                    Success = false,
                    Message = "Failed to update role",
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            return new RoleResponseDto
            {
                Success = true,
                Message = "Role updated successfully",
                Role = new RoleDto
                {
                    Id = role.Id,
                    Name = role.Name ?? string.Empty,
                    Description = role.Description,
                    IsActive = role.IsActive,
                    CreatedDate = role.CreatedDate,
                    ModifiedDate = role.ModifiedDate
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating role: {Id}", id);
            return new RoleResponseDto
            {
                Success = false,
                Message = "An error occurred while updating the role",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<RoleResponseDto> DeleteRoleAsync(string id)
    {
        try
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return new RoleResponseDto
                {
                    Success = false,
                    Message = "Role not found"
                };
            }

            if (role.Name == "SystemAdmin")
            {
                return new RoleResponseDto
                {
                    Success = false,
                    Message = "Cannot delete the SystemAdmin role"
                };
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
            {
                return new RoleResponseDto
                {
                    Success = false,
                    Message = "Failed to delete role",
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            return new RoleResponseDto
            {
                Success = true,
                Message = "Role deleted successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting role: {Id}", id);
            return new RoleResponseDto
            {
                Success = false,
                Message = "An error occurred while deleting the role",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<List<UserResponse>> GetUsersByRoleAsync(string roleName)
    {
        try
        {
            _logger.LogInformation("Getting users for role: {RoleName}", roleName);

            // Find the role first
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                _logger.LogWarning("Role not found: {RoleName}", roleName);
                return new List<UserResponse>();
            }

            // Get users in this role using UserManager
            var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);
            
            // Get detailed user information
            var userIds = usersInRole.Select(u => u.Id).ToList();
            var users = await _dbContext.Users
                .AsNoTracking()
                .Where(u => userIds.Contains(u.Id))
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .Include(u => u.UserTenants)
                    .ThenInclude(ut => ut.Tenant)
                .ToListAsync();

            _logger.LogInformation("Found {Count} users with role {RoleName}", users.Count, roleName);

            var userResponses = new List<UserResponse>();

            foreach (var user in users)
            {
                try
                {
                    // Get the active tenant for this user
                    var activeTenant = user.UserTenants
                        .FirstOrDefault(ut => ut.TenantId == user.TenantId)?
                        .Tenant;

                    // Get all roles for the user
                    var userRoles = await _userManager.GetRolesAsync(user);

                    userResponses.Add(new UserResponse
                    {
                        Id = user.Id,
                        UserName = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        FirstName = user.FirstName ?? string.Empty,
                        LastName = user.LastName ?? string.Empty,
                        IsActive = user.IsActive,
                        CreatedDate = user.CreatedDate,
                        LastLoginDate = user.LastLoginDate,
                        TenantId = user.TenantId,
                        TenantName = activeTenant?.Name ?? string.Empty,
                        Roles = userRoles.ToList()
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing user {UserId}", user.Id);
                    continue;
                }
            }

            _logger.LogInformation("Successfully processed {Count} users", userResponses.Count);
            return userResponses;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users for role: {RoleName}", roleName);
            throw;
        }
    }

    public async Task<List<UserResponse>> GetAllUsersWithRolesAsync()
    {
        try
        {
            _logger.LogInformation("Getting all users with their roles");

            // Get all users with their roles and tenant information
            var users = await _dbContext.Users
                .AsNoTracking()
                .Include(u => u.UserRoles.Where(ur => ur.IsActive))
                    .ThenInclude(ur => ur.Role)
                .Include(u => u.UserTenants.Where(ut => ut.IsActive))
                    .ThenInclude(ut => ut.Tenant)
                .ToListAsync();

            _logger.LogInformation("Found {Count} total users", users.Count);

            var userResponses = new List<UserResponse>();

            foreach (var user in users)
            {
                try
                {
                    // Get the active tenant for this user
                    var activeTenant = user.UserTenants
                        .FirstOrDefault(ut => ut.IsActive && ut.TenantId == user.TenantId)?
                        .Tenant;

                    // Get all active roles for the user
                    var userRoles = user.UserRoles
                        .Where(ur => ur.IsActive && ur.Role != null)
                        .Select(ur => ur.Role.Name)
                        .Where(name => !string.IsNullOrEmpty(name))
                        .ToList();

                    userResponses.Add(new UserResponse
                    {
                        Id = user.Id,
                        UserName = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        FirstName = user.FirstName ?? string.Empty,
                        LastName = user.LastName ?? string.Empty,
                        IsActive = user.IsActive,
                        CreatedDate = user.CreatedDate,
                        LastLoginDate = user.LastLoginDate,
                        TenantId = user.TenantId,
                        TenantName = activeTenant?.Name ?? string.Empty,
                        Roles = userRoles
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing user {UserId}", user.Id);
                    // Continue processing other users even if one fails
                    continue;
                }
            }

            _logger.LogInformation("Successfully processed {Count} users", userResponses.Count);
            return userResponses;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all users with roles");
            throw new Exception("Failed to retrieve users with roles", ex);
        }
    }
} 