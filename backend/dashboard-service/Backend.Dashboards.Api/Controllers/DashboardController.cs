using Microsoft.AspNetCore.Mvc;
using Backend.Dashboard.Api.Services;

namespace Backend.Dashboard.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId}/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard(long projectId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        try
        {
            var dashboardData = await _dashboardService.GetDashboardDataAsync(projectId, fromDate, toDate);
            return Ok(dashboardData);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("snapshots")]
    public async Task<IActionResult> CreateSnapshot(long projectId, [FromBody] CreateSnapshotRequest request)
    {
        try
        {
            var snapshot = await _dashboardService.CreateSnapshotAsync(projectId, request.MetricName, request.MetricValue, request.SnapshotDate);
            return Ok(snapshot);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("metrics/{metricName}/trend")]
    public async Task<IActionResult> GetMetricTrend(long projectId, string metricName, [FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
    {
        try
        {
            var trend = await _dashboardService.GetMetricTrendAsync(projectId, metricName, fromDate, toDate);
            return Ok(trend);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

public class CreateSnapshotRequest
{
    public string MetricName { get; set; } = string.Empty;
    public decimal MetricValue { get; set; }
    public DateTime SnapshotDate { get; set; } = DateTime.UtcNow;
}