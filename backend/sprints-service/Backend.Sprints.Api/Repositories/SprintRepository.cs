using Microsoft.EntityFrameworkCore;
using Backend.Sprints.Api.Models.Entities;
using Backend.Shared.DTOs;

namespace Backend.Sprints.Api.Data.Repositories;

public class SprintRepository
{
    private readonly SprintsDbContext _context;

    public SprintRepository(SprintsDbContext context)
    {
        _context = context;
    }

    public async Task<Sprint?> GetByIdAsync(long id)
    {
        return await _context.Sprints
            .Include(s => s.SprintIssues)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<Sprint>> GetByProjectIdAsync(long projectId)
    {
        return await _context.Sprints
            .Where(s => s.ProjectId == projectId)
            .Include(s => s.SprintIssues)
            .OrderBy(s => s.StartDate)
            .ToListAsync();
    }

    public async Task<List<Sprint>> GetByProjectIdAndStatusAsync(long projectId, SprintStatus status)
    {
        return await _context.Sprints
            .Where(s => s.ProjectId == projectId && s.Status == status)
            .Include(s => s.SprintIssues)
            .ToListAsync();
    }

    public async Task<Sprint> CreateAsync(Sprint sprint)
    {
        _context.Sprints.Add(sprint);
        await _context.SaveChangesAsync();
        return sprint;
    }

    public async Task<Sprint> UpdateAsync(Sprint sprint)
    {
        _context.Sprints.Update(sprint);
        await _context.SaveChangesAsync();
        return sprint;
    }

    public async Task DeleteAsync(long id)
    {
        var sprint = await GetByIdAsync(id);
        if (sprint != null)
        {
            _context.Sprints.Remove(sprint);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(long id)
    {
        return await _context.Sprints.AnyAsync(s => s.Id == id);
    }

    public async Task<bool> HasDateOverlapAsync(long projectId, DateTime startDate, DateTime endDate, long? excludeSprintId = null)
    {
        var query = _context.Sprints.Where(s => s.ProjectId == projectId);

        if (excludeSprintId.HasValue)
        {
            query = query.Where(s => s.Id != excludeSprintId.Value);
        }

        return await query
            .Where(s => s.StartDate <= endDate && s.EndDate >= startDate)
            .AnyAsync();
    }
}