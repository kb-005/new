using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Helpers;
using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;

namespace EmployeeManagementSystem.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IEmployeeRepository _employeeRepository;

    public DepartmentService(IDepartmentRepository departmentRepository, IEmployeeRepository employeeRepository)
    {
        _departmentRepository = departmentRepository;
        _employeeRepository = employeeRepository;
    }

    public async Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var departments = await _departmentRepository.GetAllAsync(cancellationToken);
        var result = new List<DepartmentDto>();
        foreach (var d in departments)
        {
            var count = await _departmentRepository.GetEmployeeCountAsync(d.DepartmentId, cancellationToken);
            result.Add(d.ToDto(count));
        }
        return result.OrderBy(d => d.DepartmentName).ToList();
    }

    public async Task<DepartmentDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var department = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (department is null)
            throw new AppException(404, "Department not found.");

        var count = await _departmentRepository.GetEmployeeCountAsync(id, cancellationToken);
        return department.ToDto(count);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto, CancellationToken cancellationToken = default)
    {
        if (await _departmentRepository.ExistsByNameAsync(dto.DepartmentName, null, cancellationToken))
            throw new AppException(409, "A department with this name already exists.");

        var department = new Department
        {
            DepartmentName = dto.DepartmentName.Trim(),
            Description = dto.Description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _departmentRepository.AddAsync(department, cancellationToken);
        await _departmentRepository.SaveChangesAsync(cancellationToken);

        return department.ToDto(0);
    }

    public async Task<DepartmentDto> UpdateAsync(int id, UpdateDepartmentDto dto, CancellationToken cancellationToken = default)
    {
        var department = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (department is null)
            throw new AppException(404, "Department not found.");

        if (await _departmentRepository.ExistsByNameAsync(dto.DepartmentName, id, cancellationToken))
            throw new AppException(409, "A department with this name already exists.");

        department.DepartmentName = dto.DepartmentName.Trim();
        department.Description = dto.Description?.Trim();

        await _departmentRepository.UpdateAsync(department, cancellationToken);
        await _departmentRepository.SaveChangesAsync(cancellationToken);

        var count = await _departmentRepository.GetEmployeeCountAsync(id, cancellationToken);
        return department.ToDto(count);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var department = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (department is null)
            throw new AppException(404, "Department not found.");

        // Prevent deletion when employees are still assigned (safe referential integrity).
        if (await _departmentRepository.HasEmployeesAsync(id, cancellationToken))
            throw new AppException(409, "Cannot delete department because employees are still assigned to it. Reassign or remove those employees first.");

        await _departmentRepository.DeleteAsync(department, cancellationToken);
        await _departmentRepository.SaveChangesAsync(cancellationToken);
    }
}
