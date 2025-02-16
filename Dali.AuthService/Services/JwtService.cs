using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dali.AuthService.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using Dali.AuthService.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Dali.AuthService.Data;

namespace Dali.AuthService.Services;

public class JwtService
{
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<JwtService> _logger;
    private readonly AuthDbContext _dbContext;

    public JwtService(IOptions<JwtSettings> jwtSettings, ILogger<JwtService> logger, AuthDbContext dbContext)
    {
        _jwtSettings = jwtSettings.Value;
        _logger = logger;
        _dbContext = dbContext;
    }

    public string GenerateToken(User user, IList<string> roles)
    {
        ArgumentNullException.ThrowIfNull(user);
        ArgumentNullException.ThrowIfNull(roles);

        _logger.LogInformation("Generating token for user {UserId} with roles: {Roles}", user.Id, string.Join(", ", roles));

        var claims = new List<Claim>
        {
            // User identification
            new("userId", user.Id),
            
            // Email
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            
            // Token specific claims
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            
            // User info
            new(ClaimTypes.GivenName, user.FirstName ?? string.Empty),
            new(ClaimTypes.Surname, user.LastName ?? string.Empty),
            
            // Tenant
            new("tenantId", user.TenantId),
            
            // Status
            new("isActive", user.IsActive.ToString())
        };

        // Add roles with their IDs
        if (roles.Any())
        {
            _logger.LogInformation("Found {Count} roles to add to token", roles.Count);
            
            // Get role IDs from database
            var roleIds = _dbContext.Roles
                .Where(r => r.Name != null && roles.Contains(r.Name))
                .Select(r => new { r.Id, r.Name })
                .ToList();

            _logger.LogInformation("Found {Count} matching roles in database", roleIds.Count);

            foreach (var roleInfo in roleIds.Where(r => r.Name != null))
            {
                _logger.LogInformation("Adding role claim: {RoleName} with ID: {RoleId}", roleInfo.Name, roleInfo.Id);
                claims.Add(new Claim(ClaimTypes.Role, roleInfo.Name));
                claims.Add(new Claim("roleId", roleInfo.Id));
            }
        }
        else
        {
            _logger.LogWarning("No roles provided for user {UserId}", user.Id);
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.GetExpiryMinutes());

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme),
            Expires = expires,
            SigningCredentials = creds,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            NotBefore = DateTime.UtcNow
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        if (token is JwtSecurityToken jwtToken)
        {
            jwtToken.Header.Add("kid", Guid.NewGuid().ToString());
            
            // Log all claims in the token for verification
            _logger.LogInformation("Generated token with claims: {@Claims}", 
                jwtToken.Claims.Select(c => new { Type = c.Type, Value = c.Value }));
        }

        return tokenHandler.WriteToken(token);
    }

    public bool ValidateToken(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            _logger.LogWarning("Token validation failed: Token is null or empty");
            return false;
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidAudience = _jwtSettings.Audience,
                ClockSkew = TimeSpan.Zero,
                RoleClaimType = "role"
            }, out var validatedToken);

            _logger.LogInformation("Token validated successfully");
            return true;
        }
        catch (SecurityTokenExpiredException ex)
        {
            _logger.LogWarning("Token validation failed: Token has expired. {Error}", ex.Message);
            return false;
        }
        catch (SecurityTokenInvalidSignatureException ex)
        {
            _logger.LogWarning("Token validation failed: Invalid token signature. {Error}", ex.Message);
            return false;
        }
        catch (SecurityTokenValidationException ex)
        {
            _logger.LogWarning("Token validation failed: {Error}", ex.Message);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError("Unexpected error during token validation: {Error}", ex.Message);
            return false;
        }
    }
} 