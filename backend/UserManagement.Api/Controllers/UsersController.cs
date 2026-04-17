using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagement.Api.Models;
using UserManagement.Api.Services;

namespace UserManagement.Api.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [HttpGet("users")]
        public IActionResult GetAll()
        {
            var users = _service.GetAllAsync().Result;

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _service.GetByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string name)
        {
            var users = await _service.GetByNameAsync(name);
            return Ok(users);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateUserRequest request)
        {
            _service.CreateUser(request);
            return Ok(new { message = "User created" });
        }

        [HttpGet("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteUserAsync(id);
            return Ok(new { message = $"User {id} deleted" });
        }
    }
}
