using Microsoft.AspNetCore.Mvc;
using Backend.Dashboard.Api.Services;

namespace Backend.Dashboard.Api.Controllers;

[ApiController]
[Route("api/dashboards/projects/{projectId}/[controller]")]
public class ActivityController : ControllerBase
{
    private readonly IActivityLogService _activityLogService;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<GatewayAuthenticationMiddleware> _logger;

    public ActivityController(IActivityLogService activityLogService, ICurrentUserService currentUser, ILogger<GatewayAuthenticationMiddleware> logger)
    {
        _activityLogService = activityLogService;
        _currentUser = currentUser;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjectActivity(long projectId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        _logger.LogInformation("User {UserId} accessing activity for project {ProjectId}", _currentUser.UserId, projectId);

        var activity = await _activityLogService.GetProjectActivityAsync(projectId, page, pageSize);
        return Ok(activity);
    }

    [HttpPost]
    public async Task<IActionResult> LogActivity(long projectId, [FromBody] LogActivityRequest request)
    {
        try
        {
            var log = await _activityLogService.LogActivityAsync(projectId, request.UserId, request.ActionType, request.EntityType, request.EntityId);
            return Ok(log);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

public class LogActivityRequest
{
    public long UserId { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public long EntityId { get; set; }
}