using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagement.Api.Models;
using UserManagement.Api.Services;

namespace UserManagement.Api.Controllers
{
    // Defect: [AllowAnonymous] sur tout le contrôleur (endpoints sensibles non protégés)
    [AllowAnonymous]
    // Defect: routing incohérent — mélange [Route] et [HttpGet("users")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        // Defect: appel bloquant (.Result) au lieu de await — risque de deadlock
        [HttpGet("users")]
        public IActionResult GetAll()
        {
            var users = _service.GetAllAsync().Result;

            // Defect: renvoie directement l'entité User (Password, InternalNotes, Email inclus)
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _service.GetByIdAsync(id);
            if (user == null) return NotFound();

            // Defect: exposition de l'entité de domaine complète
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
            // Defect: pas de vérification de ModelState.IsValid
            _service.CreateUser(request);
            return Ok(new { message = "User created" });
        }

        // Defect: DELETE exposé via HttpGet — suppression par simple appel GET (CSRF trivial)
        [HttpGet("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteUserAsync(id);
            return Ok(new { message = $"User {id} deleted" });
        }
    }
}
