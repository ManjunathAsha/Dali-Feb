using Dali.AuthService.DTOs;
using Dali.AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Dali.AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SystemAdmin,Admin")]
public class RolesController : ControllerBase
{
    private readonly RoleService _roleService;
    private readonly ILogger<RolesController> _logger;

    public RolesController(RoleService roleService, ILogger<RolesController> logger)
    {
        _roleService = roleService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<RoleDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<List<RoleDto>>> GetAllRoles()
    {
        var roles = await _roleService.GetAllRolesAsync();
        return Ok(roles);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RoleResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RoleResponseDto>> GetRoleById(string id)
    {
        var response = await _roleService.GetRoleByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "SystemAdmin,Admin")]
    [ProducesResponseType(typeof(RoleResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<RoleResponseDto>> CreateRole([FromBody] CreateRoleDto request)
    {
        try
        {
            _logger.LogInformation("Creating new role with name: {Name}", request.Name);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";
            var response = await _roleService.CreateRoleAsync(request, userId);
            
            if (!response.Success)
            {
                _logger.LogWarning("Failed to create role: {Message}", response.Message);
                return BadRequest(response);
            }

            _logger.LogInformation("Successfully created role with ID: {RoleId}", response.Role?.Id);
            return CreatedAtAction(nameof(GetRoleById), new { id = response.Role?.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating role with name: {Name}", request.Name);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { Message = "An error occurred while creating the role" });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SystemAdmin")]
    [ProducesResponseType(typeof(RoleResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RoleResponseDto>> UpdateRole(string id, [FromBody] UpdateRoleDto request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";
        var response = await _roleService.UpdateRoleAsync(id, request, userId);
        
        if (!response.Success)
        {
            return response.Message == "Role not found" ? NotFound(response) : BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SystemAdmin")]
    [ProducesResponseType(typeof(RoleResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RoleResponseDto>> DeleteRole(string id)
    {
        var response = await _roleService.DeleteRoleAsync(id);
        
        if (!response.Success)
        {
            return response.Message == "Role not found" ? NotFound(response) : BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("name/{roleName}/users")]
    [ProducesResponseType(typeof(IEnumerable<UserResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsersByRoleName(string roleName)
    {
        try
        {
            _logger.LogInformation("Received request to get users for role: {RoleName}", roleName);

            if (string.IsNullOrEmpty(roleName))
            {
                _logger.LogWarning("Role name is empty");
                return BadRequest(new { message = "Role name cannot be empty" });
            }

            var users = await _roleService.GetUsersByRoleAsync(roleName);
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users for role: {RoleName}", roleName);
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new 
                { 
                    message = "An error occurred while retrieving users",
                    error = ex.Message,
                    details = ex.InnerException?.Message
                }
            );
        }
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin,SystemAdmin")]
    [ProducesResponseType(typeof(IEnumerable<UserResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsersWithRoles()
    {
        try
        {
            var users = await _roleService.GetAllUsersWithRolesAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all users with roles");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new 
                { 
                    message = "An error occurred while retrieving users",
                    error = ex.Message,
                    details = ex.InnerException?.Message
                }
            );
        }
    }
} 