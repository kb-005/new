using EmployeeManagementSystem.DTOs;

namespace EmployeeManagementSystem.Services;

public interface IReportService
{
    Task<IReadOnlyList<EmployeeReportRowDto>> GetEmployeesReportAsync(int? departmentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<DepartmentReportRowDto>> GetDepartmentsReportAsync(CancellationToken cancellationToken = default);
}
