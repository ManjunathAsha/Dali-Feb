namespace Dali.AuthService.DTOs;

public class UserDetailsResponse
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public string Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public bool IsActive { get; set; }
} 