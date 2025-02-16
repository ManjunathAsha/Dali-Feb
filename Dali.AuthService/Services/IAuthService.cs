using Dali.AuthService.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Dali.AuthService.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    Task<AuthResponseDto> ConfirmEmailAsync(string token, string email);
    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);
    Task<IEnumerable<UserDetailsResponse>> GetAllUsersDetailsAsync();
    Task<AuthResponseDto> ToggleUserStatusAsync(string userId);
    Task<IdentityResult> UpdateUserRoleAsync(string userId, string newRole);
    Task<TenantResponseDto> CreateTenantAsync(CreateTenantRequestDto request, string createdBy);
    Task<List<TenantResponseDto>> GetAllTenantsAsync();
    Task<TenantResponseDto?> GetTenantByIdAsync(string id);
    Task<bool> DeleteTenantAsync(string id);
    Task<bool> DeleteTenantByNameAsync(string name);
    Task<AuthResponseDto> DeleteUserAsync(string userId);
    Task<IEnumerable<UserDetailsResponse>> GetUsersByTenantNameAsync(string tenantName);
} 