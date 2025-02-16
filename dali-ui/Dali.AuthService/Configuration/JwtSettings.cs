namespace Dali.AuthService.Configuration;

public class JwtSettings
{
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string ExpiryMinutes { get; set; } = "60"; // Changed to string to match appsettings.json
    
    public int GetExpiryMinutes()
    {
        return int.TryParse(ExpiryMinutes, out int minutes) ? minutes : 60;
    }
} 