using Microsoft.EntityFrameworkCore;
using Backend.Dashboard.Api.Data;
using Backend.Dashboard.Api.Models.Entities;

namespace Backend.Dashboard.Api.Repositories;

public class DashboardSnapshotRepository
{
    private readonly DashboardDbContext _context;

    public DashboardSnapshotRepository(DashboardDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSnapshot> CreateAsync(DashboardSnapshot snapshot)
    {
        _context.DashboardSnapshots.Add(snapshot);
        await _context.SaveChangesAsync();
        return snapshot;
    }

    public async Task<DashboardSnapshot?> GetByIdAsync(long id)
    {
        return await _context.DashboardSnapshots.FindAsync(id);
    }

    public async Task<List<DashboardSnapshot>> GetByProjectIdAsync(long projectId)
    {
        return await _context.DashboardSnapshots
            .Where(s => s.ProjectId == projectId)
            .OrderByDescending(s => s.SnapshotDate)
            .ToListAsync();
    }

    public async Task<List<DashboardSnapshot>> GetByProjectIdAndMetricAsync(long projectId, string metricName)
    {
        return await _context.DashboardSnapshots
            .Where(s => s.ProjectId == projectId && s.MetricName == metricName)
            .OrderByDescending(s => s.SnapshotDate)
            .ToListAsync();
    }

    public async Task<DashboardSnapshot?> GetLatestByProjectAndMetricAsync(long projectId, string metricName)
    {
        return await _context.DashboardSnapshots
            .Where(s => s.ProjectId == projectId && s.MetricName == metricName)
            .OrderByDescending(s => s.SnapshotDate)
            .FirstOrDefaultAsync();
    }

    public async Task DeleteAsync(long id)
    {
        var snapshot = await GetByIdAsync(id);
        if (snapshot != null)
        {
            _context.DashboardSnapshots.Remove(snapshot);
            await _context.SaveChangesAsync();
        }
    }
}