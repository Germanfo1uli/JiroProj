using Backend.Sprints.Api.Clients;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Sprints.Api.Controllers
{
    [ApiController]
    [Route("api/debug")]
    public class DebugController : ControllerBase
    {
        private readonly IUserClient _userClient;

        public DebugController(IUserClient userClient)
        {
            _userClient = userClient;
        }

        [HttpGet("test-user/{id}")]
        public async Task<IActionResult> TestUserClient(long id)
        {
            try
            {
                var user = await _userClient.GetUserById(id);

                if (user == null)
                {
                    return NotFound($"User with ID {id} not found.");
                }

                return Ok($"Successfully fetched user from user-service! Username: {user.Username}, Tag: {user.Tag}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to call user-service. Error: {ex.Message}");
            }
        }
    }
}