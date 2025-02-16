using Dali.AuthService.Data;
using Dali.AuthService.Models;
using Dali.AuthService.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace Dali.AuthService.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly JwtService _jwtService;
    private readonly ILogger<AuthService> _logger;
    private readonly AuthDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public AuthService(
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        JwtService jwtService,
        ILogger<AuthService> logger,
        AuthDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration,
        IEmailService emailService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
        _logger = logger;
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        try
        {
            _logger.LogInformation("Starting login process for email: {Email}", request.Email);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                _logger.LogWarning("Login failed: User not found for email: {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            if (!user.IsActive)
            {
                _logger.LogWarning("Login failed: User account is deactivated for {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Your account is deactivated"
                };
            }

            if (!user.EmailConfirmed)
            {
                _logger.LogWarning("Login failed: Email not confirmed for {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Please confirm your email before logging in"
                };
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!passwordValid)
            {
                _logger.LogWarning("Login failed: Invalid password for user {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.GenerateToken(user, roles);
            var refreshToken = Guid.NewGuid().ToString();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            user.LastLoginDate = DateTime.UtcNow;

            await _userManager.UpdateAsync(user);

            var tenant = await _dbContext.Tenants.FirstOrDefaultAsync(t => t.Id == user.TenantId);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                TenantId = user.TenantId,
                TenantName = tenant?.Name,
                Roles = roles.ToList()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user: {Email}", request.Email);
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred during login",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        try
        {
            _logger.LogInformation("Starting registration process for email: {Email}", request.Email);

            // 1. Validate all inputs first
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.UserName) || 
                string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.TenantName) || 
                string.IsNullOrEmpty(request.Role))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "All fields (Email, UserName, Password, TenantName, Role) are required"
                };
            }

            // Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("User with email {Email} already exists", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User with this email already exists"
                };
            }

            // Check if username is taken
            var existingUsername = await _userManager.FindByNameAsync(request.UserName);
            if (existingUsername != null)
            {
                _logger.LogWarning("Username {Username} is already taken", request.UserName);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Username is already taken"
                };
            }

            // Get the current admin user's ID from HttpContext
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? "system";

            // 2. Validate tenant
            var tenant = await _dbContext.Tenants
                .FirstOrDefaultAsync(t => t.Name.ToLower() == request.TenantName.ToLower());

            if (tenant == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Tenant '{request.TenantName}' not found"
                };
            }

            // 3. Validate role
            var role = await _dbContext.Roles
                .FirstOrDefaultAsync(r => r.Name == request.Role && r.IsActive);
            if (role == null)
            {
                _logger.LogError("Requested role '{Role}' does not exist or is not active", request.Role);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Requested role '{request.Role}' does not exist in the system or is not active"
                };
            }

            // 4. Prepare all objects
            var refreshToken = Guid.NewGuid().ToString();
            var azureAdUserId = Guid.NewGuid().ToString();
            var now = DateTime.UtcNow;

            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                IsActive = true,
                CreatedDate = now,
                TenantId = tenant.Id,
                EmailConfirmed = false,
                CreatedBy = currentUserId,
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = now.AddDays(7),
                AzureAdUserId = azureAdUserId
            };

            // Create UserRole with all required fields
            var userRole = new UserRole
            {
                RoleId = role.Id,
                IsActive = true,
                CreatedBy = currentUserId,
                CreatedDate = now,
                ModifiedBy = currentUserId
            };

            // Create UserTenant with all required fields
            var userTenant = new UserTenant
            {
                TenantId = tenant.Id,
                IsActive = true,
                CreatedBy = currentUserId,
                CreatedDate = now,
                ModifiedBy = currentUserId,
                ModifiedDate = now
            };

            // 5. Execute everything in a transaction
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            IdentityResult? result = null;

            try
            {
                await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _dbContext.Database.BeginTransactionAsync();
                    try
                    {
                        // First create the user with UserManager (this internally uses the same DbContext)
                        result = await _userManager.CreateAsync(user, request.Password);
                        if (!result.Succeeded)
                        {
                            throw new InvalidOperationException($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                        }

                        // Set IDs after user is created
                        userRole.UserId = user.Id;
                        userTenant.UserId = user.Id;

                        // Add relationships directly to their respective tables
                        await _dbContext.Set<UserRole>().AddAsync(userRole);
                        await _dbContext.Set<UserTenant>().AddAsync(userTenant);

                        // Save changes to persist UserRole and UserTenant
                        await _dbContext.SaveChangesAsync();

                        // Generate confirmation email
                        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));
                        _logger.LogDebug("Generated token: {Token}", encodedToken);
                        var encodedEmail = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Email));

                        var confirmationLink = $"{_configuration["AppSettings:BaseUrl"]}/api/auth/confirm-email?token={encodedToken}&email={encodedEmail}";

                        var emailSubject = "Welcome to DALI - Confirm Your Email";
                        var emailBody = $@"
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                                <h2 style='color: #333;'>Welcome to {tenant.Name}!</h2>
                                <p>Thank you for registering with DALI. To complete your registration and activate your account, please click the button below to confirm your email address.</p>
                                
                                <div style='margin: 30px 0; text-align: center;'>
                                    <a href='{confirmationLink}' 
                                       style='background-color: #007bff; 
                                              color: white; 
                                              padding: 12px 24px; 
                                              text-decoration: none; 
                                              border-radius: 4px;
                                              display: inline-block;'>
                                        Confirm Email Address
                                    </a>
                                </div>

                                <p>If the button doesn't work, copy and paste this link in your browser:</p>
                                <p style='word-break: break-all; color: #666;'>{confirmationLink}</p>

                                <p style='color: #666; font-size: 14px; margin-top: 30px;'>
                                    If you did not create this account, please ignore this email.<br>
                                    This link will expire in 24 hours for security reasons.
                                </p>

                                <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>
                                <p style='color: #999; font-size: 12px;'>
                                    This is an automated message, please do not reply to this email.
                                </p>
                            </div>";

                        await _emailService.SendEmailAsync(user.Email, emailSubject, emailBody);
                        _logger.LogInformation("Confirmation email sent to {Email}", user.Email);

                        await transaction.CommitAsync();
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                });

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Registration successful",
                    UserName = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    TenantId = tenant.Id,
                    TenantName = tenant.Name,
                    Roles = new List<string> { request.Role },
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddHours(1)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred during registration",
                    Errors = result?.Errors.Select(e => e.Description).ToArray() ?? new[] { ex.Message }
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred during registration",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid refresh token"
                };
            }

            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Refresh token has expired"
                };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var newToken = _jwtService.GenerateToken(user, roles);
            var newRefreshToken = Guid.NewGuid().ToString();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userManager.UpdateAsync(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Token refreshed successfully",
                Token = newToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(1)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while refreshing the token",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<TenantResponseDto> CreateTenantAsync(CreateTenantRequestDto request, string createdBy)
    {
        try
        {
            _logger.LogInformation("Creating new tenant with name: {Name}", request.Name);

            // Generate a unique tenant code based on the name
            var tenantCode = GenerateUniqueTenantCode(request.Name);

            // Check if tenant code already exists
            var existingTenant = await _dbContext.Tenants
                .FirstOrDefaultAsync(t => t.Code == tenantCode);

            if (existingTenant != null)
            {
                throw new InvalidOperationException($"Tenant with code {tenantCode} already exists");
            }

            // Generate connection string based on tenant code
            var connectionString = $"Server=185.84.140.118,1433;Database=DaliV6DT_{tenantCode};User Id=sa;Password=DaliV6!Passw0rd;TrustServerCertificate=true;MultipleActiveResultSets=true";

            var tenant = new Tenant
            {
                Code = tenantCode,
                Name = request.Name,
                Description = request.Description,
                IsDefault = false,
                IsEnabled = request.IsEnabled,
                IsActive = true,
                CreatedBy = createdBy,
                CreatedDate = DateTime.UtcNow,
                ConnectionString = connectionString
            };

            _dbContext.Tenants.Add(tenant);
            await _dbContext.SaveChangesAsync();

            return new TenantResponseDto
            {
                Id = tenant.Id,
                Name = tenant.Name,
                TenantCode = tenant.Code,
                Description = tenant.Description,
                IsActive = tenant.IsActive,
                CreatedDate = tenant.CreatedDate,
                LastModifiedDate = tenant.ModifiedDate,
                UserCount = 0
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tenant with name: {Name}", request.Name);
            throw;
        }
    }

    public async Task<AuthResponseDto> ToggleUserStatusAsync(string userId)
    {
        try
        {
            if (string.IsNullOrEmpty(userId))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User ID cannot be empty"
                };
            }

            _logger.LogInformation("Attempting to toggle status for specific user ID: {UserId}", userId);

            // Find user directly from UserManager
            var selectedUser = await _userManager.FindByIdAsync(userId);
            if (selectedUser == null)
            {
                _logger.LogWarning("Selected user not found with ID: {UserId}", userId);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Selected user not found"
                };
            }

            // Get current user roles to ensure we're not blocking an admin
            var userRoles = await _userManager.GetRolesAsync(selectedUser);
            if (userRoles.Contains("SystemAdmin"))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Cannot modify System Administrator status"
                };
            }

            // Toggle status
            selectedUser.IsActive = !selectedUser.IsActive;

            // Update user using UserManager
            var result = await _userManager.UpdateAsync(selectedUser);
            if (!result.Succeeded)
            {
                _logger.LogError("Failed to update user status: {Errors}", 
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Failed to update user status",
                    Errors = result.Errors.Select(e => e.Description).ToArray()
                };
            }

            var statusText = selectedUser.IsActive ? "active" : "blocked";
            _logger.LogInformation("User {UserId} status has been set to: {Status}", userId, statusText);

            return new AuthResponseDto
            {
                Success = true,
                Message = $"User has been {(selectedUser.IsActive ? "unblocked" : "blocked")} successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling status for user ID: {UserId}", userId);
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while updating user status",
                Errors = new[] { ex.Message }
            };
        }
    }

    private string GenerateUniqueTenantCode(string tenantName)
    {
        var baseCode = new string(tenantName.Where(c => char.IsLetterOrDigit(c)).ToArray())
            .ToUpper()
            .Take(3)
            .Aggregate("", (current, c) => current + c);

        return $"{baseCode}_{DateTime.UtcNow:yyyyMMddHHmmss}";
    }

    public async Task<AuthResponseDto> ConfirmEmailAsync(string token, string email)
    {
        try
        {
            _logger.LogInformation("Starting email confirmation process for email: {Email}", email);

            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Invalid token or email provided for confirmation");
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid token or email"
                };
            }

            // Create execution strategy
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            
            return await strategy.ExecuteAsync(async () =>
            {
                try
                {
                    _logger.LogDebug("Original token: {Token}", token);
                    
                    // Clean up the token from URL encoding
                    token = token.Split('&')[0];  // Remove any trailing parameters
                    _logger.LogDebug("Cleaned token: {Token}", token);

                    var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
                    _logger.LogDebug("Successfully decoded token");

                    // For email, we'll use the plain email parameter
                    var decodedEmail = email;
                    _logger.LogDebug("Using email: {Email}", decodedEmail);

                    _logger.LogInformation("Looking up user with email: {Email}", decodedEmail);
                    var user = await _userManager.FindByEmailAsync(decodedEmail);
                    
                    if (user == null)
                    {
                        _logger.LogWarning("User not found for email: {Email}", decodedEmail);
                        return new AuthResponseDto
                        {
                            Success = false,
                            Message = "User not found"
                        };
                    }

                    if (user.EmailConfirmed)
                    {
                        _logger.LogInformation("Email already confirmed for user: {Email}", decodedEmail);
                        return new AuthResponseDto
                        {
                            Success = true,
                            Message = "Email already confirmed"
                        };
                    }

                    // Begin transaction
                    using var transaction = await _dbContext.Database.BeginTransactionAsync();
                    
                    try
                    {
                        _logger.LogInformation("Confirming email for user: {Email}", decodedEmail);
                        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                        
                        if (!result.Succeeded)
                        {
                            _logger.LogError("Failed to confirm email for user: {Email}. Errors: {Errors}", 
                                decodedEmail, string.Join(", ", result.Errors.Select(e => e.Description)));
                                
                            return new AuthResponseDto
                            {
                                Success = false,
                                Message = "Failed to confirm email",
                                Errors = result.Errors.Select(e => e.Description).ToArray()
                            };
                        }

                        // Update user in Identity
                        user.EmailConfirmed = true;
                        var updateResult = await _userManager.UpdateAsync(user);
                        if (!updateResult.Succeeded)
                        {
                            throw new Exception("Failed to update user email confirmation status");
                        }

                        // Update user in DbContext
                        var dbUser = await _dbContext.Users
                            .FirstOrDefaultAsync(u => u.Id == user.Id);
                        if (dbUser != null)
                        {
                            dbUser.EmailConfirmed = true;
                            await _dbContext.SaveChangesAsync();
                        }

                        await transaction.CommitAsync();
                        
                        _logger.LogInformation("Successfully confirmed email for user: {Email}", decodedEmail);
                        return new AuthResponseDto
                        {
                            Success = true,
                            Message = "Email confirmed successfully"
                        };
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogError(ex, "Failed to update email confirmation status for user: {Email}", decodedEmail);
                        throw; // Let the outer catch handle the error response
                    }
                }
                catch (FormatException ex)
                {
                    _logger.LogError(ex, "Invalid token format. Token: {Token}", token);
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid confirmation link format",
                        Errors = new[] { "The confirmation link appears to be malformed. Please request a new confirmation email." }
                    };
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during email confirmation for email: {Email}", email);
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while confirming email",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<IEnumerable<UserDetailsResponse>> GetAllUsersDetailsAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        
        return users.Select(user => new UserDetailsResponse
        {
            Id = user.Id,
            Username = user.UserName,
            Email = user.Email,
            Role = _userManager.GetRolesAsync(user).Result.FirstOrDefault() ?? "No Role",
            Status = user.EmailConfirmed ? "Verified" : "Pending",
            CreatedDate = user.CreatedDate,
            LastLoginDate = user.LastLoginDate,
            IsActive = user.IsActive
        });
    }

    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new ForgotPasswordResponse
                {
                    Success = true,
                    Message = "If your email is registered, you will receive a password reset link"
                };
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            
            // Log the token to console for testing
            Console.WriteLine("\n=== Password Reset Token ===");
            Console.WriteLine($"Email: {request.Email}");
            Console.WriteLine($"Token: {encodedToken}");
            Console.WriteLine("===========================\n");
            
            // Use the resetUrl from the request instead of hardcoding it
            var resetLink = $"{request.ResetUrl}{encodedToken}";

            try
            {
                await _emailService.SendPasswordResetEmailAsync(user.Email!, resetLink);
                _logger.LogInformation("Password reset email sent to {Email}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", user.Email);
                return new ForgotPasswordResponse
                {
                    Success = false,
                    Message = "Failed to send password reset email",
                    Errors = new[] { ex.Message }
                };
            }

            return new ForgotPasswordResponse
            {
                Success = true,
                Message = "Password reset link has been sent to your email"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ForgotPasswordAsync for email: {Email}", request.Email);
            return new ForgotPasswordResponse
            {
                Success = false,
                Message = "An error occurred while processing your request",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = "Invalid request"
            };
        }

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
        var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

        if (!result.Succeeded)
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = string.Join(", ", result.Errors.Select(e => e.Description))
            };
        }

        return new ResetPasswordResponse
        {
            Success = true,
            Message = "Password has been reset successfully"
        };
    }

    public async Task<IdentityResult> UpdateUserRoleAsync(string userId, string newRole)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "UserNotFound",
                    Description = "User not found"
                });
            }

            // Get current roles
            var currentRoles = await _userManager.GetRolesAsync(user);

            // Remove all current roles
            if (currentRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                {
                    return removeResult;
                }
            }

            // Add the new role
            var addResult = await _userManager.AddToRoleAsync(user, newRole);
            if (!addResult.Succeeded)
            {
                // If adding new role fails, try to restore previous roles
                if (currentRoles.Any())
                {
                    await _userManager.AddToRolesAsync(user, currentRoles);
                }
                return addResult;
            }

            return IdentityResult.Success;
        }
        catch (Exception)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "UpdateFailed",
                Description = "Failed to update user role"
            });
        }
    }

    public async Task<List<TenantResponseDto>> GetAllTenantsAsync()
    {
        try
        {
            var tenants = await _dbContext.Tenants
                .AsNoTracking()
                .Select(t => new TenantResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    TenantCode = t.Code,
                    Description = t.Description,
                    IsActive = t.IsActive,
                    CreatedDate = t.CreatedDate,
                    LastModifiedDate = t.ModifiedDate,
                    UserCount = _dbContext.UserTenants.Count(ut => ut.TenantId == t.Id && ut.IsActive)
                })
                .ToListAsync();

            return tenants;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all tenants");
            throw;
        }
    }

    public async Task<TenantResponseDto?> GetTenantByIdAsync(string id)
    {
        try
        {
            var tenant = await _dbContext.Tenants
                .AsNoTracking()
                .Where(t => t.Id == id)
                .Select(t => new TenantResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    TenantCode = t.Code,
                    Description = t.Description,
                    IsActive = t.IsActive,
                    CreatedDate = t.CreatedDate,
                    LastModifiedDate = t.ModifiedDate,
                    UserCount = _dbContext.UserTenants.Count(ut => ut.TenantId == t.Id && ut.IsActive)
                })
                .FirstOrDefaultAsync();

            return tenant;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tenant with ID: {Id}", id);
            throw;
        }
    }

    public async Task<bool> DeleteTenantAsync(string id)
    {
        try
        {
            _logger.LogInformation("Attempting to delete tenant with ID: {Id}", id);

            var tenant = await _dbContext.Tenants.FindAsync(id);
            if (tenant == null)
            {
                _logger.LogWarning("Tenant with ID {Id} not found", id);
                return false;
            }

            // Check if this is the default tenant
            if (tenant.IsDefault)
            {
                _logger.LogWarning("Cannot delete default tenant with ID {Id}", id);
                throw new InvalidOperationException("Cannot delete the default tenant");
            }

            // Check if there are any active users in this tenant
            var hasUsers = await _dbContext.UserTenants
                .AnyAsync(ut => ut.TenantId == id && ut.IsActive);
            if (hasUsers)
            {
                _logger.LogWarning("Cannot delete tenant {Id} because it has active users", id);
                throw new InvalidOperationException("Cannot delete tenant that has active users");
            }

            _dbContext.Tenants.Remove(tenant);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Successfully deleted tenant with ID: {Id}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tenant with ID: {Id}", id);
            throw;
        }
    }

    public async Task<bool> DeleteTenantByNameAsync(string name)
    {
        try
        {
            _logger.LogInformation("Attempting to delete tenant with name: {Name}", name);

            var tenant = await _dbContext.Tenants
                .FirstOrDefaultAsync(t => t.Name.ToLower() == name.ToLower());
            
            if (tenant == null)
            {
                _logger.LogWarning("Tenant with name {Name} not found", name);
                return false;
            }

            // Check if this is the default tenant
            if (tenant.IsDefault)
            {
                _logger.LogWarning("Cannot delete default tenant with name {Name}", name);
                throw new InvalidOperationException("Cannot delete the default tenant");
            }

            // Create execution strategy
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            
            await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    // Get all users associated with this tenant
                    var userTenants = await _dbContext.UserTenants
                        .Where(ut => ut.TenantId == tenant.Id)
                        .Include(ut => ut.User)
                        .ToListAsync();

                    foreach (var userTenant in userTenants)
                    {
                        if (userTenant.User != null)
                        {
                            // Get user roles
                            var user = userTenant.User;
                            var userRoles = await _userManager.GetRolesAsync(user);

                            // Remove user roles
                            if (userRoles.Any())
                            {
                                await _userManager.RemoveFromRolesAsync(user, userRoles);
                            }

                            // Delete the user
                            await _userManager.DeleteAsync(user);
                        }
                    }

                    // Remove the tenant
                    _dbContext.Tenants.Remove(tenant);
                    await _dbContext.SaveChangesAsync();

                    await transaction.CommitAsync();
                    _logger.LogInformation("Successfully deleted tenant with name: {Name} and its associated users", name);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error during tenant and user deletion transaction");
                    throw;
                }
            });

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tenant with name: {Name}", name);
            throw;
        }
    }

    public async Task<AuthResponseDto> DeleteUserAsync(string userId)
    {
        try
        {
            _logger.LogInformation("Attempting to delete user with ID: {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found", userId);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            // Check if trying to delete a SystemAdmin
            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Contains("SystemAdmin"))
            {
                _logger.LogWarning("Cannot delete a SystemAdmin user: {UserId}", userId);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Cannot delete a SystemAdmin user"
                };
            }

            // Create execution strategy
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            
            return await strategy.ExecuteAsync(async () =>
            {
                // Begin transaction
                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    // Remove user roles
                    if (userRoles.Any())
                    {
                        var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, userRoles);
                        if (!removeRolesResult.Succeeded)
                        {
                            throw new InvalidOperationException("Failed to remove user roles");
                        }
                    }

                    // Remove user tenants
                    var userTenants = await _dbContext.UserTenants
                        .Where(ut => ut.UserId == userId)
                        .ToListAsync();
                    if (userTenants.Any())
                    {
                        _dbContext.UserTenants.RemoveRange(userTenants);
                        await _dbContext.SaveChangesAsync();
                    }

                    // Delete the user
                    var deleteResult = await _userManager.DeleteAsync(user);
                    if (!deleteResult.Succeeded)
                    {
                        throw new InvalidOperationException($"Failed to delete user: {string.Join(", ", deleteResult.Errors.Select(e => e.Description))}");
                    }

                    await transaction.CommitAsync();

                    _logger.LogInformation("Successfully deleted user with ID: {UserId}", userId);
                    return new AuthResponseDto
                    {
                        Success = true,
                        Message = "User deleted successfully"
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Failed to delete user during transaction");
                    throw;
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with ID: {UserId}", userId);
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while deleting the user",
                Errors = new[] { ex.Message }
            };
        }
    }

    public async Task<IEnumerable<UserDetailsResponse>> GetUsersByTenantNameAsync(string tenantName)
    {
        try
        {
            _logger.LogInformation("Fetching users for tenant: {TenantName}", tenantName);

            // Find the tenant first
            var tenant = await _dbContext.Tenants
                .FirstOrDefaultAsync(t => t.Name.ToLower() == tenantName.ToLower());

            if (tenant == null)
            {
                _logger.LogWarning("Tenant not found: {TenantName}", tenantName);
                return Enumerable.Empty<UserDetailsResponse>();
            }

            // Get all users associated with this tenant
            var users = await _dbContext.Users
                .Include(u => u.UserTenants)
                .Where(u => u.UserTenants.Any(ut => ut.TenantId == tenant.Id))
                .ToListAsync();

            var userResponses = new List<UserDetailsResponse>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userResponses.Add(new UserDetailsResponse
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    Role = roles.FirstOrDefault() ?? "No Role",
                    Status = user.EmailConfirmed ? "Verified" : "Pending",
                    CreatedDate = user.CreatedDate,
                    LastLoginDate = user.LastLoginDate,
                    IsActive = user.IsActive
                });
            }

            _logger.LogInformation("Found {Count} users for tenant {TenantName}", userResponses.Count, tenantName);
            return userResponses;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users for tenant: {TenantName}", tenantName);
            throw;
        }
    }
} 