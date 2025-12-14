using Refit;
using Backend.Shared.DTOs; 

namespace Backend.Sprints.Api.Clients
{
    public interface IUserClient
    {
        [Get("/api/internal/users/{id}")]
        Task<UserDto> GetUserById(long id);

        [Get("/api/internal/users")]
        Task<List<UserDto>> GetUsersByIds([Query(CollectionFormat.Multi)] IEnumerable<long> ids);
    }
}