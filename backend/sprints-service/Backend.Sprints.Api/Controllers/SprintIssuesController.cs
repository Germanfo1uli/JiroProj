using Microsoft.AspNetCore.Mvc;
using Backend.Sprints.Api.Services;

namespace Backend.Sprints.Api.Controllers;

[ApiController]
[Route("api/sprints/{sprintId}/[controller]")]
public class SprintIssuesController : ControllerBase
{
    private readonly ISprintIssueService _sprintIssueService;

    public SprintIssuesController(ISprintIssueService sprintIssueService)
    {
        _sprintIssueService = sprintIssueService;
    }

    [HttpPost]
    public async Task<IActionResult> AddIssueToSprint(long sprintId, [FromBody] AddIssueRequest request)
    {
        try
        {
            await _sprintIssueService.AddIssueToSprintAsync(sprintId, request.IssueId);
            return Ok(new { message = "Issue added to sprint successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{issueId}")]
    public async Task<IActionResult> RemoveIssueFromSprint(long sprintId, long issueId)
    {
        await _sprintIssueService.RemoveIssueFromSprintAsync(sprintId, issueId);
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetSprintIssues(long sprintId)
    {
        var issueIds = await _sprintIssueService.GetIssueIdsBySprintIdAsync(sprintId);
        return Ok(new { SprintId = sprintId, IssueIds = issueIds });
    }
}

public class AddIssueRequest
{
    public long IssueId { get; set; }
}