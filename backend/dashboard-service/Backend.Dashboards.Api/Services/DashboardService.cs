using Backend.Dashboard.Api.Data.Repositories;
using Backend.Dashboard.Api.Models.Entities;
using Backend.Shared.DTOs;

namespace Backend.Dashboard.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly DashboardSnapshotRepository _snapshotRepository;
    private readonly ActivityLogRepository _activityLogRepository;

    public DashboardService(
        DashboardSnapshotRepository snapshotRepository,
        ActivityLogRepository activityLogRepository)
    {
        _snapshotRepository = snapshotRepository;
        _activityLogRepository = activityLogRepository;
    }

    public async Task<DashboardDataDto> GetDashboardDataAsync(long projectId)
    {
        var dashboardData = new DashboardDataDto
        {
            project_id = projectId
        };

        var metricNames = new[] { "issue_total", "issues_done", "issues_in_progress", "issues_todo", "dead_issues" };
        
        foreach (var metricName in metricNames)
        {
            var latestSnapshot = await _snapshotRepository.GetLatestByProjectAndMetricAsync(projectId, metricName);
            if (latestSnapshot != null)
            {
                switch (metricName)
                {
                    case "issue_total":
                        dashboardData.issue_total = latestSnapshot.MetricValue;
                        break;
                    case "issues_done":
                        dashboardData.issues_done = latestSnapshot.MetricValue;
                        break;
                    case "issues_in_progress":
                        dashboardData.issues_in_progress = latestSnapshot.MetricValue;
                        break;
                    case "issues_todo":
                        dashboardData.issues_todo = latestSnapshot.MetricValue;
                        break;
                    case "dead_issues":
                        dashboardData.dead_issues = latestSnapshot.MetricValue;
                        break;
                }
            }
        }

        return dashboardData;
    }

    public async Task<DashboardSnapshot> CreateSnapshotAsync(CreateSnapshotDto dto)
    {
        var snapshot = new DashboardSnapshot
        {
            ProjectId = dto.project_id,
            MetricName = dto.metric_name,
            MetricValue = dto.metric_value,
            SnapshotDate = dto.snapshot_date ?? DateTime.UtcNow
        };

        return await _snapshotRepository.CreateAsync(snapshot);
    }

    public async Task<List<ActivityLogDto>> GetProjectActivityAsync(long projectId)
    {
        var activities = await _activityLogRepository.GetByProjectIdAsync(projectId, 50);
        
        return activities.Select(log => new ActivityLogDto
        {
            Id = log.Id,
            project_id = log.ProjectId,
            user_id = log.UserId,
            action_type = log.ActionType,
            entity_type = log.EntityType,
            entity_id = log.EntityId,
            created_at = log.CreatedAt
        }).ToList();
    }

    public async Task<ActivityLog> LogActivityAsync(LogActivityDto dto)
    {
        var log = new ActivityLog
        {
            ProjectId = dto.project_id,
            UserId = dto.user_id,
            ActionType = dto.action_type,
            EntityType = dto.entity_type,
            EntityId = dto.entity_id
        };

        return await _activityLogRepository.CreateAsync(log);
    }
}