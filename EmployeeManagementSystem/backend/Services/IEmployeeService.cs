using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Services;

public interface IEmployeeService
{
    Task<PagedResult<EmployeeDto>> GetPagedAsync(int page, int pageSize, string? search, int? departmentId, string? sortBy, bool sortDescending, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EmployeeDto>> SearchAsync(string query, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EmployeeDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<EmployeeDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto, CancellationToken cancellationToken = default);
    Task<EmployeeDto> UpdateAsync(int id, UpdateEmployeeDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
