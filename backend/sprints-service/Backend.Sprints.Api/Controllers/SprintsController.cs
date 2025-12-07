using Microsoft.AspNetCore.Mvc;
using Backend.Sprints.Api.Services;

namespace Backend.Sprints.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SprintsController : ControllerBase
{
    private readonly ISprintService _sprintService;

    public SprintsController(ISprintService sprintService)
    {
        _sprintService = sprintService;
    }


    [HttpGet("projects/{projectId}/sprints")]
    public async Task<IActionResult> GetSprintsByProject(long projectId)
    {
        var sprints = await _sprintService.GetSprintsByProjectIdAsync(projectId);
        return Ok(sprints);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSprint(long id)
    {
        var sprint = await _sprintService.GetSprintByIdAsync(id);
        if (sprint == null)
            return NotFound();
        return Ok(sprint);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSprint(long id)
    {
        try
        {
            await _sprintService.DeleteSprintAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{sprintId}/complete")]
    public async Task<IActionResult> CompleteSprint(long sprintId)
    {
        try
        {
            await _sprintService.CompleteSprintAsync(sprintId);
            return Ok(new { message = "Sprint completed successfully" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("{sprintId}/board")]
    public async Task<IActionResult> GetSprintBoard(long sprintId)
    {
        try
        {
            var board = await _sprintService.GetSprintBoardAsync(sprintId);
            return Ok(board);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

