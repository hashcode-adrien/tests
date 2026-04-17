using UserManagement.Api.Models;

namespace UserManagement.Api.Services
{
    public interface IUserService
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<List<User>> GetByNameAsync(string name);
        void CreateUser(CreateUserRequest request);
        Task DeleteUserAsync(int id);
    }
}
