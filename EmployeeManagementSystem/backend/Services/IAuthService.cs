using EmployeeManagementSystem.DTOs;

namespace EmployeeManagementSystem.Services;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
