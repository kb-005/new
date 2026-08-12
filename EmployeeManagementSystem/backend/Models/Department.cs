using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagementSystem.Models;

/// <summary>
/// Represents a department to which employees are assigned (1-to-many).
/// </summary>
public class Department
{
    public int DepartmentId { get; set; }

    [Required]
    [MaxLength(100)]
    public string DepartmentName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Navigation property to the employees in this department.</summary>
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
