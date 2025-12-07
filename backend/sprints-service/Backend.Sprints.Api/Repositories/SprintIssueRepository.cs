using Microsoft.EntityFrameworkCore;
using Backend.Sprints.Api.Models.Entities;

namespace Backend.Sprints.Api.Data.Repositories;

public class SprintIssueRepository
{
    private readonly SprintsDbContext _context;

    public SprintIssueRepository(SprintsDbContext context)
    {
        _context = context;
    }

    public async Task AddIssueToSprintAsync(long sprintId, long issueId)
    {
        var sprintIssue = new SprintIssue
        {
            SprintId = sprintId,
            IssueId = issueId
        };

        _context.SprintIssues.Add(sprintIssue);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveIssueFromSprintAsync(long sprintId, long issueId)
    {
        await _context.SprintIssues
            .Where(si => si.SprintId == sprintId && si.IssueId == issueId)
            .ExecuteDeleteAsync();
    }

    public async Task RemoveIssueFromAllSprintsAsync(long issueId)
    {
        await _context.SprintIssues
            .Where(si => si.IssueId == issueId)
            .ExecuteDeleteAsync();
    }

    public async Task<List<long>> GetIssueIdsBySprintIdAsync(long sprintId)
    {
        return await _context.SprintIssues
            .Where(si => si.SprintId == sprintId)
            .Select(si => si.IssueId)
            .ToListAsync();
    }

    public async Task<List<long>> GetSprintIdsByIssueIdAsync(long issueId)
    {
        return await _context.SprintIssues
            .Where(si => si.IssueId == issueId)
            .Select(si => si.SprintId)
            .ToListAsync();
    }

    public async Task<bool> IsIssueInSprintAsync(long sprintId, long issueId)
    {
        return await _context.SprintIssues
            .AnyAsync(si => si.SprintId == sprintId && si.IssueId == issueId);
    }
}