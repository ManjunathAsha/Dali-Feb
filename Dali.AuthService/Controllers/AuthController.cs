using Dali.AuthService.DTOs;
using Dali.AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dali.AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, ILogger<AuthController> logger, IConfiguration configuration)
    {
        _authService = authService;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        var response = await _authService.LoginAsync(request);
        if (!response.Success)
        {
            return Unauthorized(response);
        }
        return Ok(response);
    }

    [HttpPost("register")]
    [Authorize(Roles = "SystemAdmin,Admin")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request)
    {
        var response = await _authService.RegisterAsync(request);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest(new AuthResponseDto 
            { 
                Success = false, 
                Message = "Refresh token is required" 
            });
        }

        var response = await _authService.RefreshTokenAsync(refreshToken);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string token, [FromQuery] string email)
    {
        try
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Invalid token or email provided for confirmation");
                return Redirect($"{_configuration["AppSettings:BaseUrl"]}/auth/email-confirmation-failed");
            }

            _logger.LogInformation("Processing email confirmation for email: {Email}", email);
            var result = await _authService.ConfirmEmailAsync(token, email);
            
            if (result.Success)
            {
                _logger.LogInformation("Email confirmation successful for {Email}", email);
                return Redirect($"{_configuration["AppSettings:BaseUrl"]}/auth/login?emailConfirmed=true");
            }
            
            _logger.LogWarning("Email confirmation failed for {Email}: {Message}", email, result.Message);
            return Redirect($"{_configuration["AppSettings:BaseUrl"]}/auth/email-confirmation-failed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during email confirmation for email: {Email}", email);
            return Redirect($"{_configuration["AppSettings:BaseUrl"]}/auth/email-confirmation-failed");
        }
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ForgotPasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ForgotPasswordResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new ForgotPasswordResponse 
            { 
                Success = false, 
                Message = "Email address is required" 
            });
        }

        var response = await _authService.ForgotPasswordAsync(request);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        
        return Ok(response);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ResetPasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResetPasswordResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var response = await _authService.ResetPasswordAsync(request);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("users")]
    [Authorize]
    [ProducesResponseType(typeof(List<UserDetailsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _authService.GetAllUsersDetailsAsync();
        var response = users.Select(u => new UserDetailsResponse
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role,
            Status = u.Status,
            CreatedDate = u.CreatedDate,
            LastLoginDate = u.LastLoginDate,
            IsActive = u.IsActive
        }).ToList();
        
        return Ok(response);
    }

    [HttpPost("users/{userId}/toggle-status")]
    [Authorize(Policy = "RequireAdminRole")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AuthResponseDto>> ToggleUserStatus([FromRoute] string userId)
    {
        var response = await _authService.ToggleUserStatusAsync(userId);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpPut("users/{userId}/role")]
    [Authorize(Roles = "Admin,SystemAdmin")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateUserRole(string userId, [FromBody] UpdateUserRoleRequest request)
    {
        if (string.IsNullOrEmpty(request.NewRole))
        {
            return BadRequest(new { message = "New role must be specified" });
        }

        var result = await _authService.UpdateUserRoleAsync(userId, request.NewRole);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Failed to update user role", errors = result.Errors });
        }

        return Ok(new { message = "User role updated successfully" });
    }

    [HttpDelete("users/{userId}")]
    [Authorize(Roles = "SystemAdmin,Admin")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AuthResponseDto>> DeleteUser(string userId)
    {
        try
        {
            _logger.LogInformation("Attempting to delete user with ID: {UserId}", userId);

            var response = await _authService.DeleteUserAsync(userId);
            if (!response.Success)
            {
                if (response.Message == "User not found")
                {
                    return NotFound(response);
                }
                return BadRequest(response);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with ID: {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred while deleting the user",
                    Errors = new[] { ex.Message }
                });
        }
    }

    public class UpdateUserRoleRequest
    {
        public string NewRole { get; set; } = string.Empty;
    }
} 