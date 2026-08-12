using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>Complete employee list report (optionally filtered by department).</summary>
    [HttpGet("employees")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> EmployeesReport([FromQuery] int? departmentId = null, CancellationToken cancellationToken = default)
    {
        var result = await _reportService.GetEmployeesReportAsync(departmentId, cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<EmployeeReportRowDto>>.Ok(result));
    }

    /// <summary>Department-wise report with employee counts and salary aggregates.</summary>
    [HttpGet("departments")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DepartmentsReport(CancellationToken cancellationToken = default)
    {
        var result = await _reportService.GetDepartmentsReportAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<DepartmentReportRowDto>>.Ok(result));
    }
}
