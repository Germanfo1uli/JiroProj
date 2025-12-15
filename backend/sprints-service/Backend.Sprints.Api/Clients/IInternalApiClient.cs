using Refit;
using System.Threading.Tasks;
using Backend.Shared.DTOs;
using Backend.Sprints.Api.Cache;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Sprints.Api.Clients
{
    public interface IInternalApiClient
    {
        [Get("/api/internal/projects/{projectId}")]
        Task<ApiResponse<ProjectDto>> GetProjectByIdAsync(long projectId);
        
        [Get("/api/internal/issues/{issueId}")]
        Task<ApiResponse<InternalIssueResponse>> GetIssueByIdAsync(long issueId);

        [Get("/api/internal/permissions")]
        Task<UserPermissionsResponse> GetUserPermissions([FromQuery] long projectId, [FromQuery] long userId);
    }
}