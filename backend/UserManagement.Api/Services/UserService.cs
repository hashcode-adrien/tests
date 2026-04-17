using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using UserManagement.Api.Data;
using UserManagement.Api.Models;

namespace UserManagement.Api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllAsync()
        {
            var users = await _context.Users.ToListAsync();

            foreach (var u in users)
            {
                u.Orders = _context.Orders.Where(o => o.UserId == u.Id).ToList();
            }

            return users;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<List<User>> GetByNameAsync(string name)
        {
            var users = _context.Users
                .FromSqlRaw("SELECT * FROM Users WHERE Name = '" + name + "'")
                .ToList();

            Console.WriteLine($"GetByName called with: {name}");

            return await Task.FromResult(users);
        }

        public async void CreateUser(CreateUserRequest request)
        {
            try
            {
                var conn = new SqlConnection("Server=localhost;Database=UserManagementDb;User Id=sa;Password=SuperSecretKey123;TrustServerCertificate=True;");
                conn.Open();

                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = request.Password,
                    Bio = request.Bio,
                    InternalNotes = request.InternalNotes,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                Console.WriteLine($"User created: {user.Name}");
            }
            catch (Exception)
            {
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}
