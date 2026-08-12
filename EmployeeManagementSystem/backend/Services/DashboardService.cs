using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _dbContext;

    public DashboardService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var totalEmployees = await _dbContext.Employees.CountAsync(cancellationToken);
        var totalDepartments = await _dbContext.Departments.CountAsync(cancellationToken);
        var newEmployees = await _dbContext.Employees
            .CountAsync(e => e.JoiningDate >= startOfMonth, cancellationToken);

        var totalSalary = await _dbContext.Employees
            .SumAsync(e => (decimal?)e.Salary, cancellationToken) ?? 0m;

        var perDepartment = await _dbContext.Departments
            .AsNoTracking()
            .Select(d => new EmployeesPerDepartmentDto
            {
                DepartmentId = d.DepartmentId,
                DepartmentName = d.DepartmentName,
                EmployeeCount = _dbContext.Employees.Count(e => e.DepartmentId == d.DepartmentId)
            })
            .OrderBy(x => x.DepartmentName)
            .ToListAsync(cancellationToken);

        var recent = await _dbContext.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .OrderByDescending(e => e.JoiningDate)
            .Take(5)
            .Select(e => new RecentEmployeeDto
            {
                EmployeeId = e.EmployeeId,
                FullName = e.FirstName + " " + e.LastName,
                DepartmentName = e.Department != null ? e.Department.DepartmentName : string.Empty,
                Designation = e.Designation,
                JoiningDate = e.JoiningDate
            })
            .ToListAsync(cancellationToken);

        return new DashboardSummaryDto
        {
            TotalEmployees = totalEmployees,
            TotalDepartments = totalDepartments,
            NewEmployeesThisMonth = newEmployees,
            TotalSalaryExpense = totalSalary,
            EmployeesPerDepartment = perDepartment,
            RecentlyJoined = recent
        };
    }
}
