using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Microsoft.Extensions.Logging;
using Dali.AuthService.Configuration;

namespace Dali.AuthService.Services;

public class AzureAdService
{
    private readonly IConfidentialClientApplication _app;
    private readonly ILogger<AzureAdService> _logger;
    private readonly AzureAdSettings _settings;

    public AzureAdService(IOptions<AzureAdSettings> settings, ILogger<AzureAdService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        _app = ConfidentialClientApplicationBuilder
            .Create(_settings.ClientId)
            .WithTenantId(_settings.TenantId)
            .WithClientSecret(_settings.ClientSecret)
            .WithAuthority(new Uri($"{_settings.Instance}{_settings.TenantId}"))
            .Build();
    }

    public async Task<string?> GetAccessTokenAsync(string[] scopes)
    {
        try
        {
            _logger.LogInformation("Attempting to acquire token for scopes: {Scopes}", string.Join(", ", scopes));

            var result = await _app.AcquireTokenForClient(scopes)
                .ExecuteAsync();

            _logger.LogInformation("Successfully acquired token");
            return result.AccessToken;
        }
        catch (MsalException ex)
        {
            _logger.LogError(ex, "Error acquiring token from Azure AD");
            return null;
        }
    }

    public async Task<bool> ValidateUserAsync(string azureAdUserId)
    {
        try
        {
            _logger.LogInformation("Validating Azure AD user: {UserId}", azureAdUserId);

            var graphScopes = new[] { "https://graph.microsoft.com/.default" };
            var accessToken = await GetAccessTokenAsync(graphScopes);

            if (string.IsNullOrEmpty(accessToken))
            {
                _logger.LogWarning("Failed to get access token for Graph API");
                return false;
            }

            // Here you would typically make a call to Microsoft Graph API to validate the user
            // For now, we'll just return true if we got a valid token
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating Azure AD user: {UserId}", azureAdUserId);
            return false;
        }
    }
} 