using Microsoft.EntityFrameworkCore;
using Backend.Dashboard.Api.Models.Entities;

namespace Backend.Dashboard.Api.Data.Repositories;

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

    public async Task<List<DashboardSnapshot>> GetByProjectIdAsync(long projectId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _context.DashboardSnapshots.Where(s => s.ProjectId == projectId);

        if (fromDate.HasValue)
            query = query.Where(s => s.SnapshotDate >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(s => s.SnapshotDate <= toDate.Value);

        return await query.OrderByDescending(s => s.SnapshotDate).ToListAsync();
    }

    public async Task<List<DashboardSnapshot>> GetByProjectAndMetricAsync(long projectId, string metricName, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _context.DashboardSnapshots
            .Where(s => s.ProjectId == projectId && s.MetricName == metricName);

        if (fromDate.HasValue)
            query = query.Where(s => s.SnapshotDate >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(s => s.SnapshotDate <= toDate.Value);

        return await query.OrderBy(s => s.SnapshotDate).ToListAsync();
    }

    public async Task<DashboardSnapshot?> GetLatestByProjectAndMetricAsync(long projectId, string metricName)
    {
        return await _context.DashboardSnapshots
            .Where(s => s.ProjectId == projectId && s.MetricName == metricName)
            .OrderByDescending(s => s.SnapshotDate)
            .FirstOrDefaultAsync();
    }
}