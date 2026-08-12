using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Helpers;
using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;

namespace EmployeeManagementSystem.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public EmployeeService(IEmployeeRepository employeeRepository, IDepartmentRepository departmentRepository)
    {
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
    }

    public async Task<PagedResult<EmployeeDto>> GetPagedAsync(
        int page, int pageSize, string? search, int? departmentId, string? sortBy, bool sortDescending,
        CancellationToken cancellationToken = default)
    {
        var result = await _employeeRepository.GetPagedAsync(
            page, pageSize, search, departmentId, sortBy, sortDescending, cancellationToken);

        return new PagedResult<EmployeeDto>
        {
            Items = result.Items.Select(e => e.ToDto()).ToList(),
            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems
        };
    }

    public async Task<IReadOnlyList<EmployeeDto>> SearchAsync(string query, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new List<EmployeeDto>();

        // Use the paged query with a large page to perform a full search.
        var result = await _employeeRepository.GetPagedAsync(
            1, int.MaxValue, query, null, "firstname", false, cancellationToken);

        return result.Items.Select(e => e.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<EmployeeDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var employees = await _employeeRepository.GetAllAsync(cancellationToken);
        return employees.Select(e => e.ToDto()).ToList();
    }

    public async Task<EmployeeDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var employee = await GetEmployeeOrThrowAsync(id, cancellationToken);
        return employee.ToDto();
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto, CancellationToken cancellationToken = default)
    {
        if (!await _departmentRepository.ExistsAsync(d => d.DepartmentId == dto.DepartmentId, cancellationToken))
            throw new AppException(400, "Selected department does not exist.");

        if (await _employeeRepository.ExistsByEmailAsync(dto.Email, null, cancellationToken))
            throw new AppException(409, "An employee with this email already exists.");

        var employee = new Employee
        {
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Email = dto.Email.Trim(),
            Phone = dto.Phone.Trim(),
            DepartmentId = dto.DepartmentId,
            Designation = dto.Designation.Trim(),
            Salary = dto.Salary,
            JoiningDate = dto.JoiningDate,
            CreatedAt = DateTime.UtcNow
        };

        await _employeeRepository.AddAsync(employee, cancellationToken);
        await _employeeRepository.SaveChangesAsync(cancellationToken);

        // Re-fetch (with department) so the DTO contains the department name.
        var created = await _employeeRepository.GetByIdWithDepartmentAsync(employee.EmployeeId, cancellationToken);
        return (created ?? employee).ToDto();
    }

    public async Task<EmployeeDto> UpdateAsync(int id, UpdateEmployeeDto dto, CancellationToken cancellationToken = default)
    {
        var employee = await GetEmployeeOrThrowAsync(id, cancellationToken, includeDepartment: true);

        if (!await _departmentRepository.ExistsAsync(d => d.DepartmentId == dto.DepartmentId, cancellationToken))
            throw new AppException(400, "Selected department does not exist.");

        if (await _employeeRepository.ExistsByEmailAsync(dto.Email, id, cancellationToken))
            throw new AppException(409, "An employee with this email already exists.");

        employee.FirstName = dto.FirstName.Trim();
        employee.LastName = dto.LastName.Trim();
        employee.Email = dto.Email.Trim();
        employee.Phone = dto.Phone.Trim();
        employee.DepartmentId = dto.DepartmentId;
        employee.Designation = dto.Designation.Trim();
        employee.Salary = dto.Salary;
        employee.JoiningDate = dto.JoiningDate;
        employee.UpdatedAt = DateTime.UtcNow;

        await _employeeRepository.UpdateAsync(employee, cancellationToken);
        await _employeeRepository.SaveChangesAsync(cancellationToken);

        var refreshed = await _employeeRepository.GetByIdWithDepartmentAsync(id, cancellationToken);
        return (refreshed ?? employee).ToDto();
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var employee = await GetEmployeeOrThrowAsync(id, cancellationToken);
        await _employeeRepository.DeleteAsync(employee, cancellationToken);
        await _employeeRepository.SaveChangesAsync(cancellationToken);
    }

    private async Task<Employee> GetEmployeeOrThrowAsync(int id, CancellationToken cancellationToken, bool includeDepartment = false)
    {
        Employee? employee;
        if (includeDepartment)
        {
            employee = await _employeeRepository.GetByIdWithDepartmentAsync(id, cancellationToken);
        }
        else
        {
            employee = await _employeeRepository.GetByIdAsync(id, cancellationToken);
        }

        if (employee is null)
            throw new AppException(404, "Employee not found.");

        return employee;
    }
}
