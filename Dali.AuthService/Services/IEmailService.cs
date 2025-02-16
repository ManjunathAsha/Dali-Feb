namespace Dali.AuthService.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendPasswordResetEmailAsync(string to, string resetLink);
    Task SendEmailConfirmationAsync(string to, string confirmationLink);
}