using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using RecruitmentAPI.Data;
using RecruitmentAPI.Middleware;
using RecruitmentAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== Services =====
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database - MySQL with EF Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ===== A07:2021 - JWT Authentication with full validation =====
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key is not configured. Set 'Jwt:Key' in appsettings.json (min 32 chars).");

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "RecruitmentAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "RecruitmentApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // No tolerance for expired tokens
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    context.Response.Headers["Token-Expired"] = "true";
                }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CandidateOnly", policy => policy.RequireRole("candidate"));
    options.AddPolicy("EmployerOnly", policy => policy.RequireRole("employer"));
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("EmployerOrAdmin", policy => policy.RequireRole("employer", "admin"));
});

// DI - Services
builder.Services.AddScoped<IAuthService, AuthService>();

// ===== CORS - Restrict to Frontend domain only =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendOnly", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ===== App Pipeline =====
var app = builder.Build();

// Security Headers Middleware
app.UseMiddleware<SecurityHeadersMiddleware>();

// Rate Limiting cho auth endpoints
app.UseMiddleware<RateLimitMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS must be before Auth
app.UseCors("FrontendOnly");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-migrate database on startup
try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
    // Seed data
    DbSeeder.SeedAsync(dbContext).GetAwaiter().GetResult();
}
catch (Exception ex)
{
    Console.WriteLine($"Database migration skipped: {ex.Message}");
    Console.WriteLine("Run migrations manually with: dotnet ef database update");
}

app.Run();
