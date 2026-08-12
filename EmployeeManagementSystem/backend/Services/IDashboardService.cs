using EmployeeManagementSystem.DTOs;

namespace EmployeeManagementSystem.Services;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
}
