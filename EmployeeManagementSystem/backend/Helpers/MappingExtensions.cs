using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Helpers;

/// <summary>
/// Centralizes entity -> DTO mapping so controllers never expose raw entities.
/// </summary>
public static class MappingExtensions
{
    public static EmployeeDto ToDto(this Employee e) => new()
    {
        EmployeeId = e.EmployeeId,
        FirstName = e.FirstName,
        LastName = e.LastName,
        Email = e.Email,
        Phone = e.Phone,
        DepartmentId = e.DepartmentId,
        DepartmentName = e.Department?.DepartmentName ?? string.Empty,
        Designation = e.Designation,
        Salary = e.Salary,
        JoiningDate = e.JoiningDate,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    public static DepartmentDto ToDto(this Department d, int employeeCount) => new()
    {
        DepartmentId = d.DepartmentId,
        DepartmentName = d.DepartmentName,
        Description = d.Description,
        CreatedAt = d.CreatedAt,
        EmployeeCount = employeeCount
    };

    public static UserDto ToDto(this User u) => new()
    {
        UserId = u.UserId,
        Username = u.Username,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = u.CreatedAt
    };
}
