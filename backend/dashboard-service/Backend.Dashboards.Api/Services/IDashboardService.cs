using Backend.Dashboard.Api.Models.Entities;
using Backend.Shared.DTOs;

namespace Backend.Dashboard.Api.Services;

public interface IDashboardService
{
    Task<DashboardDataDto> GetDashboardDataAsync(long projectId);
    Task<DashboardSnapshot> CreateSnapshotAsync(CreateSnapshotDto dto);
    Task<List<ActivityLogDto>> GetProjectActivityAsync(long projectId);
    Task<ActivityLog> LogActivityAsync(LogActivityDto dto);
}