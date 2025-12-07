using Microsoft.AspNetCore.Mvc;
using Backend.Dashboard.Api.Services;

namespace Backend.Dashboard.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId}/[controller]")]
public class ActivityController : ControllerBase
{
    private readonly IActivityLogService _activityLogService;

    public ActivityController(IActivityLogService activityLogService)
    {
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjectActivity(long projectId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
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