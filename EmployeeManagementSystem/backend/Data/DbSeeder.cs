using EmployeeManagementSystem.Helpers;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Data;

/// <summary>
/// Seeds the database with demo users, departments and employees.
/// Idempotent: only inserts when tables are empty.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, CancellationToken cancellationToken = default)
    {
        if (!await context.Users.AnyAsync(cancellationToken))
        {
            var users = new List<User>
            {
                new()
                {
                    Username = "admin",
                    Email = "admin@ems.com",
                    PasswordHash = PasswordHelper.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Username = "user",
                    Email = "user@ems.com",
                    PasswordHash = PasswordHelper.HashPassword("User@123"),
                    Role = "User",
                    CreatedAt = DateTime.UtcNow
                }
            };
            await context.Users.AddRangeAsync(users, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        if (!await context.Departments.AnyAsync(cancellationToken))
        {
            var departments = new List<Department>
            {
                new() { DepartmentName = "IT", Description = "Information Technology and Infrastructure", CreatedAt = DateTime.UtcNow },
                new() { DepartmentName = "Human Resources", Description = "Recruitment, payroll and employee welfare", CreatedAt = DateTime.UtcNow },
                new() { DepartmentName = "Finance", Description = "Accounting, budgeting and financial planning", CreatedAt = DateTime.UtcNow },
                new() { DepartmentName = "Marketing", Description = "Branding, campaigns and market research", CreatedAt = DateTime.UtcNow },
                new() { DepartmentName = "Sales", Description = "Business development and client acquisition", CreatedAt = DateTime.UtcNow }
            };
            await context.Departments.AddRangeAsync(departments, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        if (!await context.Employees.AnyAsync(cancellationToken))
        {
            var deptMap = await context.Departments.ToDictionaryAsync(d => d.DepartmentName, d => d.DepartmentId, cancellationToken);

            int Id(string name) => deptMap[name];

            var employees = new List<Employee>
            {
                Make("Aarav", "Sharma", "aarav.sharma@ems.com", "+91-9876543210", Id("IT"), "Software Engineer", 75000, new DateTime(2023, 1, 15)),
                Make("Priya", "Patel", "priya.patel@ems.com", "+91-9820012345", Id("Human Resources"), "HR Manager", 68000, new DateTime(2022, 3, 10)),
                Make("Rohan", "Mehta", "rohan.mehta@ems.com", "+91-9811122233", Id("Finance"), "Financial Analyst", 62000, new DateTime(2023, 6, 1)),
                Make("Sneha", "Nair", "sneha.nair@ems.com", "+91-9700011223", Id("Marketing"), "Marketing Specialist", 58000, new DateTime(2024, 2, 20)),
                Make("Kunal", "Verma", "kunal.verma@ems.com", "+91-9900123456", Id("Sales"), "Sales Executive", 54000, new DateTime(2024, 5, 12)),
                Make("Ananya", "Rao", "ananya.rao@ems.com", "+91-9600123457", Id("IT"), "System Administrator", 70000, new DateTime(2022, 11, 5)),
                Make("Vikram", "Singh", "vikram.singh@ems.com", "+91-9555512348", Id("Finance"), "Accountant", 51000, new DateTime(2023, 9, 18)),
                Make("Neha", "Gupta", "neha.gupta@ems.com", "+91-9444412399", Id("Human Resources"), "Recruiter", 47000, new DateTime(2024, 7, 1)),
                Make("Aditya", "Joshi", "aditya.joshi@ems.com", "+91-9333312300", Id("Marketing"), "Content Strategist", 52000, new DateTime(2024, 8, 22)),
                Make("Isha", "Kapoor", "isha.kapoor@ems.com", "+91-9222212311", Id("Sales"), "Sales Manager", 82000, new DateTime(2021, 12, 9))
            };

            await context.Employees.AddRangeAsync(employees, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }
    }

    private static Employee Make(string first, string last, string email, string phone, int deptId, string designation, decimal salary, DateTime joining)
        => new()
        {
            FirstName = first,
            LastName = last,
            Email = email,
            Phone = phone,
            DepartmentId = deptId,
            Designation = designation,
            Salary = salary,
            JoiningDate = joining,
            CreatedAt = DateTime.UtcNow
        };
}
