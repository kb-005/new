namespace EmployeeManagementSystem.Helpers;

/// <summary>
/// Application-specific exception carrying an HTTP status code so the centralized
/// exception middleware can translate it into a clean JSON error response.
/// </summary>
public class AppException : Exception
{
    public int StatusCode { get; }

    public AppException(int statusCode, string message) : base(message)
    {
        StatusCode = statusCode;
    }

    public AppException(int statusCode, string message, Exception inner) : base(message, inner)
    {
        StatusCode = statusCode;
    }
}
