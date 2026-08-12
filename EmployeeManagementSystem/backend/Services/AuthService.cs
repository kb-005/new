using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Helpers;
using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;
using Microsoft.Extensions.Configuration;

namespace EmployeeManagementSystem.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtHelper _jwtHelper;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, JwtHelper jwtHelper, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _jwtHelper = jwtHelper;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Identifier) || string.IsNullOrWhiteSpace(request.Password))
            throw new AppException(400, "Username/email and password are required.");

        var user = await _userRepository.GetByIdentifierAsync(request.Identifier);
        if (user is null || !PasswordHelper.VerifyPassword(request.Password, user.PasswordHash))
            throw new AppException(401, "Invalid username/email or password.");

        var token = _jwtHelper.GenerateToken(user);
        var durationMinutes = _configuration.GetValue<int>("Jwt:DurationInMinutes", 120);

        return new LoginResponseDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddMinutes(durationMinutes),
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            UserId = user.UserId
        };
    }
}
