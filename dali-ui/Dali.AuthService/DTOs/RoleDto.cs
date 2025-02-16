using System.ComponentModel.DataAnnotations;

namespace Dali.AuthService.DTOs;

public class RoleDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
}

public class CreateRoleDto
{
    [Required]
    [StringLength(256)]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }
}

public class UpdateRoleDto
{
    [StringLength(256)]
    public string? Name { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    public bool? IsActive { get; set; }
}

public class RoleResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public RoleDto? Role { get; set; }
    public IEnumerable<string>? Errors { get; set; }
} 