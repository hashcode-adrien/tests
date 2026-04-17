namespace UserManagement.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string InternalNotes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Bio { get; set; } = string.Empty;

        public List<Order> Orders { get; set; } = new();
    }

    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }
}
