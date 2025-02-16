using Dali.AuthService.DTOs;
using Dali.AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dali.AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SystemAdmin,Admin")]
public class TenantController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<TenantController> _logger;

    public TenantController(IAuthService authService, ILogger<TenantController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<TenantResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<List<TenantResponseDto>>> GetAllTenants()
    {
        try
        {
            _logger.LogInformation("Retrieving all tenants");
            var tenants = await _authService.GetAllTenantsAsync();
            return Ok(tenants);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tenants");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = "An error occurred while retrieving tenants" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TenantResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TenantResponseDto>> GetTenantById(string id)
    {
        try
        {
            _logger.LogInformation("Retrieving tenant with ID: {Id}", id);
            var tenant = await _authService.GetTenantByIdAsync(id);

            if (tenant == null)
            {
                return NotFound(new { Message = "Tenant not found" });
            }

            return Ok(tenant);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tenant with ID: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = "An error occurred while retrieving the tenant" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "SystemAdmin,Admin")]
    [ProducesResponseType(typeof(TenantResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(TenantResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<TenantResponseDto>> CreateTenant([FromBody] CreateTenantRequestDto request)
    {
        try
        {
            _logger.LogInformation("Creating new tenant with name: {Name}", request.Name);

            var createdBy = User.Identity?.Name ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value ?? "System";
            var result = await _authService.CreateTenantAsync(request, createdBy);
            
            _logger.LogInformation("Successfully created tenant with ID: {TenantId}", result.Id);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation while creating tenant");
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tenant");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { Message = "An error occurred while creating the tenant" });
        }
    }

    [HttpDelete("name/{name}")]
    [Authorize(Roles = "SystemAdmin,Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTenantByName(string name)
    {
        try
        {
            _logger.LogInformation("Attempting to delete tenant with name: {Name}", name);
            var result = await _authService.DeleteTenantByNameAsync(name);
            
            if (!result)
            {
                return NotFound(new { message = $"Tenant with name '{name}' not found" });
            }

            return Ok(new { message = $"Tenant '{name}' and its associated users have been successfully deleted" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation while deleting tenant: {Name}", name);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tenant: {Name}", name);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "An error occurred while deleting the tenant", error = ex.Message });
        }
    }

    [HttpGet("name/{tenantName}/users")]
    [ProducesResponseType(typeof(IEnumerable<UserDetailsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<UserDetailsResponse>>> GetUsersByTenantName(string tenantName)
    {
        try
        {
            _logger.LogInformation("Retrieving users for tenant: {TenantName}", tenantName);
            var users = await _authService.GetUsersByTenantNameAsync(tenantName);

            if (!users.Any())
            {
                return NotFound(new { message = $"No users found for tenant '{tenantName}' or tenant does not exist" });
            }

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users for tenant: {TenantName}", tenantName);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "An error occurred while retrieving users", error = ex.Message });
        }
    }
} 