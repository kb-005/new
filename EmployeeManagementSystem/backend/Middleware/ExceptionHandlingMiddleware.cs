using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace EmployeeManagementSystem.Middleware;

/// <summary>
/// Catches unhandled exceptions and returns a consistent JSON error envelope.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException appEx)
        {
            _logger.LogWarning("Handled application exception: {Message}", appEx.Message);
            await WriteJsonAsync(context, appEx.StatusCode, ApiResponse<object>.Fail(appEx.Message));
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database update error");
            await WriteJsonAsync(context, (int)HttpStatusCode.InternalServerError,
                ApiResponse<object>.Fail("A database error occurred while saving changes. Please verify the data and try again."));
        }
        catch (OperationCanceledException)
        {
            // Request aborted - nothing to do.
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await WriteJsonAsync(context, (int)HttpStatusCode.InternalServerError,
                ApiResponse<object>.Fail("An unexpected error occurred. Please try again later."));
        }
    }

    private static async Task WriteJsonAsync(HttpContext context, int statusCode, object payload)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));
    }
}
