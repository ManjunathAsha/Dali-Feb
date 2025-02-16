namespace Dali.AuthService.Configuration;

public class ServiceSettings
{
    public string Name { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public bool EnableSwagger { get; set; }
    public bool RequireHttps { get; set; }
} 