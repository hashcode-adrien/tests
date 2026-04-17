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
            // Defect: pas de pagination (toute la table)
            var users = await _context.Users.ToListAsync();

            // Defect: N+1 — chargement des Orders dans une boucle au lieu de Include()
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
            // Defect: injection SQL — concaténation directe de la variable name
            var users = _context.Users
                .FromSqlRaw("SELECT * FROM Users WHERE Name = '" + name + "'")
                .ToList();

            Console.WriteLine($"GetByName called with: {name}");

            return await Task.FromResult(users);
        }

        // Defect: async void au lieu de async Task
        public async void CreateUser(CreateUserRequest request)
        {
            // Defect: exceptions avalées silencieusement
            try
            {
                // Defect: SqlConnection instancié sans using, jamais disposé
                var conn = new SqlConnection("Server=localhost;Database=UserManagementDb;User Id=sa;Password=SuperSecretKey123;TrustServerCertificate=True;");
                conn.Open();

                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    // Defect: mot de passe stocké en clair, sans hash
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
                // Defect: exception avalée silencieusement
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
