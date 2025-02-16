using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Logging;
using Dali.AuthService.Configuration;

namespace Dali.AuthService.Services;

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtpSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<SmtpSettings> smtpSettings, ILogger<EmailService> logger)
    {
        _smtpSettings = smtpSettings.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var message = new MailMessage
            {
                From = new MailAddress(_smtpSettings.FromEmail, _smtpSettings.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(to);

            using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
            {
                Credentials = new NetworkCredential(_smtpSettings.UserName, _smtpSettings.Password),
                EnableSsl = _smtpSettings.EnableSsl
            };

            await client.SendMailAsync(message);
            _logger.LogInformation("Email sent successfully to {Email}", to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", to);
            throw;
        }
    }

    public async Task SendPasswordResetEmailAsync(string to, string resetLink)
    {
        var subject = "Password Reset Instructions - DALI System";
        var body = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #d64b4b; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
                    .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }}
                    .button-container {{ text-align: center; margin: 30px 0; }}
                    .button {{ 
                        display: inline-block; 
                        padding: 15px 35px; 
                        background-color: #d64b4b; 
                        color: white !important; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px;
                        font-weight: bold;
                        border: 2px solid #d64b4b;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }}
                    .button:hover {{ 
                        background-color: #e05e5e !important; 
                        border-color: #e05e5e !important;
                        box-shadow: 0 6px 8px rgba(0,0,0,0.15);
                        transform: translateY(-2px);
                    }}
                    .button-hint {{
                        display: block;
                        margin-top: 10px;
                        color: #666;
                        font-size: 13px;
                    }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>Password Reset Request</h2>
                    </div>
                    <div class='content'>
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your DALI account. To proceed with the password reset, please click the button below:</p>
                        <div class='button-container'>
                            <a href='{resetLink}' class='button' style='color: white !important;'>
                                <span style='display: inline-block; vertical-align: middle;'>🔐</span> 
                                Reset Password
                            </a>
                            <span class='button-hint'>Click the button above to set a new password</span>
                        </div>
                        <p>This link will expire in 24 hours for security reasons. If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
                        <p>For your security:</p>
                        <ul>
                            <li>The link can only be used once</li>
                            <li>Make sure to choose a strong, unique password</li>
                            <li>Never share your password with anyone</li>
                        </ul>
                        <p>Best regards,<br>The DALI Team</p>
                    </div>
                    <div class='footer'>
                        <p>This is an automated message, please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>";

        await SendEmailAsync(to, subject, body);
    }

    public async Task SendEmailConfirmationAsync(string to, string confirmationLink)
    {
        var subject = "Confirm Your Email";
        var body = $@"
            <h2>Welcome to DALI.V6!</h2>
            <p>Please confirm your email address by clicking the link below:</p>
            <p><a href='{confirmationLink}'>Confirm Email</a></p>
            <p>If you did not create an account, please ignore this email.</p>";

        await SendEmailAsync(to, subject, body);
    }
}