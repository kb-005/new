using BCrypt.Net;

namespace EmployeeManagementSystem.Helpers;

/// <summary>
/// Wrapper around BCrypt for secure password hashing and verification.
/// Plaintext passwords are never stored.
/// </summary>
public static class PasswordHelper
{
    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12));
    }

    public static bool VerifyPassword(string password, string passwordHash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
        catch
        {
            return false;
        }
    }
}
