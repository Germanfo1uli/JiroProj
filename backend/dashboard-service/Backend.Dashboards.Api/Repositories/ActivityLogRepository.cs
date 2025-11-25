using Microsoft.EntityFrameworkCore;
using Backend.Dashboard.Api.Models.Entities;

namespace Backend.Dashboard.Api.Data.Repositories;

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

    public async Task<List<ActivityLog>> GetByProjectIdAsync(long projectId, int page = 1, int pageSize = 50)
    {
        return await _context.ActivityLogs
            .Where(l => l.ProjectId == projectId)
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<ActivityLog>> GetByUserIdAsync(long userId, int page = 1, int pageSize = 50)
    {
        return await _context.ActivityLogs
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<ActivityLog>> GetByEntityAsync(string entityType, long entityId, int page = 1, int pageSize = 50)
    {
        return await _context.ActivityLogs
            .Where(l => l.EntityType == entityType && l.EntityId == entityId)
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
}