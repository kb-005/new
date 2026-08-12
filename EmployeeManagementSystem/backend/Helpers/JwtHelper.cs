using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EmployeeManagementSystem.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeManagementSystem.Helpers;

/// <summary>
/// Generates and validates JWT tokens. Configuration is read from appsettings / environment variables.
/// </summary>
public class JwtHelper
{
    private readonly IConfiguration _configuration;

    public JwtHelper(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var key = GetSigningKey();
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var issuer = _configuration["Jwt:Issuer"] ?? "EmployeeManagementSystem";
        var audience = _configuration["Jwt:Audience"] ?? "EmployeeManagementSystemClient";
        var durationMinutes = _configuration.GetValue<int>("Jwt:DurationInMinutes", 120);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(durationMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public SymmetricSecurityKey GetSigningKey()
    {
        var secret = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key is not configured.");

        if (secret.Length < 16)
            throw new InvalidOperationException("JWT Key must be at least 16 characters long.");

        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }
}
