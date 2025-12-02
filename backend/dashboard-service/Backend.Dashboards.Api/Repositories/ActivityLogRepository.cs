using Microsoft.EntityFrameworkCore;
using Backend.Dashboard.Api.Data;
using Backend.Dashboard.Api.Models.Entities;

namespace Backend.Dashboard.Api.Repositories;

public class ActivityLogRepository
{
    private readonly DashboardDbContext _context;

    public ActivityLogRepository(DashboardDbContext context)
    {
        _context = context;
    }

    public async Task<ActivityLog> CreateAsync(ActivityLog log)
    {
        _context.ActivityLogs.Add(log);
        await _context.SaveChangesAsync();
        return log;
    }

    public async Task<ActivityLog?> GetByIdAsync(long id)
    {
        return await _context.ActivityLogs.FindAsync(id);
    }

    public async Task<List<ActivityLog>> GetByProjectIdAsync(long projectId, int limit = 50)
    {
        return await _context.ActivityLogs
            .Where(l => l.ProjectId == projectId)
            .OrderByDescending(l => l.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<ActivityLog>> GetByUserIdAsync(long userId, int limit = 50)
    {
        return await _context.ActivityLogs
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<ActivityLog>> GetByEntityAsync(string entityType, long entityId, int limit = 20)
    {
        return await _context.ActivityLogs
            .Where(l => l.EntityType == entityType && l.EntityId == entityId)
            .OrderByDescending(l => l.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }
}