namespace EmployeeManagementSystem.DTOs;

public class DashboardSummaryDto
{
    public int TotalEmployees { get; set; }
    public int TotalDepartments { get; set; }
    public int NewEmployeesThisMonth { get; set; }
    public decimal TotalSalaryExpense { get; set; }
    public List<EmployeesPerDepartmentDto> EmployeesPerDepartment { get; set; } = new();
    public List<RecentEmployeeDto> RecentlyJoined { get; set; } = new();
}

public class EmployeesPerDepartmentDto
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public int EmployeeCount { get; set; }
}

public class RecentEmployeeDto
{
    public int EmployeeId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
}
