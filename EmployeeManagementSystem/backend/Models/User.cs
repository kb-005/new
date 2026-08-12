namespace EmployeeManagementSystem.Models;

/// <summary>
/// Represents an application user (Admin or regular User) who can authenticate
/// and use the Employee Management System.
/// </summary>
public class User
{
    public int UserId { get; set; }

    /// <summary>Unique login name used alongside the email to authenticate.</summary>
    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    /// <summary>BCrypt hashed password. Plaintext is never stored.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>Role of the user: "Admin" or "User".</summary>
    public string Role { get; set; } = "User";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
