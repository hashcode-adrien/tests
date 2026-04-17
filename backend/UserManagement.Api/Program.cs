using Microsoft.EntityFrameworkCore;
using UserManagement.Api.Data;
using UserManagement.Api.Services;

var builder = WebApplication.CreateBuilder(args);

const string ConnectionString = "Server=localhost;Database=UserManagementDb;User Id=sa;Password=SuperSecretKey123;TrustServerCertificate=True;";
const string JwtSecretKey = "SuperSecretKey123";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<AppDbContext>(sp =>
{
    var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseSqlServer(ConnectionString)
        .Options;
    return new AppDbContext(options);
});

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
