using Backend.Dashboard.Api.Data.Repositories;
using Backend.Dashboard.Api.Models.Entities;

namespace Backend.Dashboard.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly DashboardSnapshotRepository _snapshotRepository;
    private readonly ActivityLogRepository _activityLogRepository;

    public DashboardService(DashboardSnapshotRepository snapshotRepository, ActivityLogRepository activityLogRepository)
    {
        _snapshotRepository = snapshotRepository;
        _activityLogRepository = activityLogRepository;
    }

    public async Task<DashboardSnapshot> CreateSnapshotAsync(long projectId, string metricName, decimal metricValue, DateTime snapshotDate)
    {
        var snapshot = new DashboardSnapshot
        {
            ProjectId = projectId,
            MetricName = metricName,
            MetricValue = metricValue,
            SnapshotDate = snapshotDate
        };

        return await _snapshotRepository.CreateAsync(snapshot);
    }

    public async Task<DashboardDataDto> GetDashboardDataAsync(long projectId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var dashboardData = new DashboardDataDto { ProjectId = projectId };

        // Получаем последние значения метрик
        var metrics = new[] { "total_issues", "completed_issues", "completion_rate", "avg_cycle_time" };
        foreach (var metric in metrics)
        {
            var latestSnapshot = await _snapshotRepository.GetLatestByProjectAndMetricAsync(projectId, metric);
            if (latestSnapshot != null)
            {
                dashboardData.CurrentMetrics[metric] = latestSnapshot.MetricValue;
            }
        }

        // Получаем последнюю активность
        var recentActivity = await _activityLogRepository.GetByProjectIdAsync(projectId, 1, 10);
        dashboardData.RecentActivity = recentActivity.Select(log => new ActivityLogDto
        {
            UserId = log.UserId,
            ActionType = log.ActionType,
            EntityType = log.EntityType,
            EntityId = log.EntityId,
            CreatedAt = log.CreatedAt
        }).ToList();

        // Получаем тренды для ключевых метрик
        if (fromDate.HasValue && toDate.HasValue)
        {
            foreach (var metric in metrics)
            {
                var dataPoints = await GetMetricTrendAsync(projectId, metric, fromDate.Value, toDate.Value);
                dashboardData.Trends[metric] = new MetricTrendDto
                {
                    MetricName = metric
                };
            }
        }

        return dashboardData;
    }

    public async Task<List<MetricTrendDto>> GetMetricTrendAsync(long projectId, string metricName, DateTime fromDate, DateTime toDate)
    {
        var snapshots = await _snapshotRepository.GetByProjectAndMetricAsync(projectId, metricName, fromDate, toDate);
        
        var trend = new MetricTrendDto
        {
            MetricName = metricName,
            DataPoints = snapshots.Select(s => new MetricDataPoint
            {
                Date = s.SnapshotDate,
                Value = s.MetricValue
            }).ToList()
        };

        return new List<MetricTrendDto> { trend };
    }
}