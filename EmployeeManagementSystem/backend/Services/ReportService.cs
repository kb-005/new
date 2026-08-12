using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _dbContext;

    public ReportService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<EmployeeReportRowDto>> GetEmployeesReportAsync(int? departmentId, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Employees.AsNoTracking().Include(e => e.Department).AsQueryable();

        if (departmentId.HasValue)
            query = query.Where(e => e.DepartmentId == departmentId.Value);

        return await query
            .OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
            .Select(e => new EmployeeReportRowDto
            {
                EmployeeId = e.EmployeeId,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                DepartmentName = e.Department != null ? e.Department.DepartmentName : string.Empty,
                Designation = e.Designation,
                Salary = e.Salary,
                JoiningDate = e.JoiningDate
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DepartmentReportRowDto>> GetDepartmentsReportAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Departments
            .AsNoTracking()
            .Select(d => new DepartmentReportRowDto
            {
                DepartmentId = d.DepartmentId,
                DepartmentName = d.DepartmentName,
                Description = d.Description,
                EmployeeCount = _dbContext.Employees.Count(e => e.DepartmentId == d.DepartmentId),
                TotalSalary = _dbContext.Employees
                    .Where(e => e.DepartmentId == d.DepartmentId)
                    .Sum(e => (decimal?)e.Salary) ?? 0m,
                AverageSalary = _dbContext.Employees
                    .Where(e => e.DepartmentId == d.DepartmentId)
                    .Average(e => (decimal?)e.Salary) ?? 0m
            })
            .OrderBy(x => x.DepartmentName)
            .ToListAsync(cancellationToken);
    }
}
