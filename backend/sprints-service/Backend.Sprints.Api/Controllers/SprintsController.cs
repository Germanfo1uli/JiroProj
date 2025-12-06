using Microsoft.AspNetCore.Mvc;
using Backend.Sprints.Api.Services;
using Backend.Sprints.Api.Models.Entities;

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

    [HttpPost("projects/{projectId}/sprints")]
    public async Task<IActionResult> CreateSprint(long projectId, [FromBody] CreateSprintRequest request)
    {
        try
        {
            var sprint = await _sprintService.CreateSprintAsync(projectId, request.Name, request.Goal, request.StartDate, request.EndDate);
            return CreatedAtAction(nameof(GetSprint), new { id = sprint.Id }, sprint);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSprint(long id, [FromBody] UpdateSprintRequest request)
    {
        try
        {
            var sprint = await _sprintService.UpdateSprintAsync(id, request.Name, request.Goal, request.StartDate, request.EndDate, request.Status);
            return Ok(sprint);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
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

