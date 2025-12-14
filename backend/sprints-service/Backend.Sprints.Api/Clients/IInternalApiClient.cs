using Refit;
using System.Threading.Tasks;

namespace Backend.Sprints.Api.Clients
{
    public interface IInternalApiClient
    {
        [Get("/api/internal/projects/{projectId}")]
        Task<InternalProjectResponse> GetProjectByIdAsync(long projectId);
    }
}