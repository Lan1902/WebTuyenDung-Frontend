using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Services;

public interface IAuthService
{
    Task<(bool success, string message, User? user)> RegisterAsync(string username, string email, string password, string fullName, string role);
    Task<(bool success, string message, string? accessToken, string? refreshToken, User? user)> LoginAsync(string username, string password);
    Task<(bool success, string message, string? accessToken, string? refreshToken)> RefreshTokenAsync(string accessToken, string refreshToken);
    Task RevokeRefreshTokenAsync(Guid userId);
    string GenerateJwtToken(User user);
    string GenerateRefreshToken();
}

public class AuthService : IAuthService
{
    private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        nameof(UserRole.Candidate).ToLowerInvariant(),
        nameof(UserRole.Employer).ToLowerInvariant(),
        nameof(UserRole.Admin).ToLowerInvariant()
    };

    // A07:2021 - Lockout configuration
    private const int MaxFailedAttempts = 5;
    private const int LockoutDurationMinutes = 15;

    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _dbContext;

    public AuthService(IConfiguration configuration, ApplicationDbContext dbContext)
    {
        _configuration = configuration;
        _dbContext = dbContext;
    }

    public async Task<(bool success, string message, User? user)> RegisterAsync(
        string username, string email, string password, string fullName, string role)
    {
        // A03:2021 - Sanitize all inputs
        username = InputSanitizer.Sanitize(username);
        email = InputSanitizer.Sanitize(email);
        fullName = InputSanitizer.Sanitize(fullName);
        role = string.IsNullOrWhiteSpace(role) ? "candidate" : role.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(email)
            || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(fullName))
            return (false, "Vui lòng điền đầy đủ thông tin đăng ký.", null);

        if (password.Length < 6)
            return (false, "Mật khẩu phải có ít nhất 6 ký tự.", null);

        if (!AllowedRoles.Contains(role))
            return (false, "Role không hợp lệ.", null);

        var existingUser = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username || u.Email == email);

        if (existingUser != null)
            return (false, "Username hoặc email đã tồn tại.", null);

        // A07:2021 - BCrypt with strong work factor (default 11)
        var user = new User
        {
            Username = username,
            Email = email,
            FullName = fullName,
            Role = role,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12),
            IsActive = true,
            FailedLoginAttempts = 0,
            LockoutEndAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return (true, "Registration successful", user);
    }

    public async Task<(bool success, string message, string? accessToken, string? refreshToken, User? user)> LoginAsync(
        string username, string password)
    {
        username = InputSanitizer.Sanitize(username);

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
            return (false, "Tài khoản không tồn tại.", null, null, null);

        // A07:2021 - Check lockout
        if (user.LockoutEndAt.HasValue && user.LockoutEndAt.Value > DateTime.UtcNow)
        {
            var remainingMinutes = (int)(user.LockoutEndAt.Value - DateTime.UtcNow).TotalMinutes + 1;
            return (false, $"Tài khoản đã bị khóa. Vui lòng thử lại sau {remainingMinutes} phút.", null, null, null);
        }

        if (!user.IsActive)
            return (false, "Tài khoản đã bị vô hiệu hóa.", null, null, null);

        // A07:2021 - Verify password with BCrypt
        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            // Increment failed attempts
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= MaxFailedAttempts)
            {
                user.LockoutEndAt = DateTime.UtcNow.AddMinutes(LockoutDurationMinutes);
                user.FailedLoginAttempts = 0;
                await _dbContext.SaveChangesAsync();
                return (false, $"Tài khoản đã bị khóa do nhập sai mật khẩu quá nhiều lần. Vui lòng thử lại sau {LockoutDurationMinutes} phút.", null, null, null);
            }
            await _dbContext.SaveChangesAsync();
            return (false, $"Sai mật khẩu. Còn {MaxFailedAttempts - user.FailedLoginAttempts} lần thử.", null, null, null);
        }

        // Reset failed attempts on successful login
        user.FailedLoginAttempts = 0;
        user.LockoutEndAt = null;
        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Store refresh token in DB
        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = HashToken(refreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            IsRevoked = false
        });

        await _dbContext.SaveChangesAsync();

        return (true, "Login successful", accessToken, refreshToken, user);
    }

    public async Task<(bool success, string message, string? accessToken, string? refreshToken)> RefreshTokenAsync(
        string accessToken, string refreshToken)
    {
        // Validate the expired access token (just decode without lifetime validation)
        var principal = GetPrincipalFromExpiredToken(accessToken);
        if (principal == null)
            return (false, "Access token không hợp lệ.", null, null);

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return (false, "Access token không hợp lệ.", null, null);

        // Hash the incoming refresh token and compare with stored hash
        var hashedRefreshToken = HashToken(refreshToken);
        var storedToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.UserId == userId && rt.Token == hashedRefreshToken && !rt.IsRevoked);

        if (storedToken == null || storedToken.ExpiresAt <= DateTime.UtcNow)
            return (false, "Refresh token không hợp lệ hoặc đã hết hạn.", null, null);

        // Revoke old refresh token (rotation)
        storedToken.IsRevoked = true;
        _dbContext.RefreshTokens.Update(storedToken);

        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null || !user.IsActive)
            return (false, "Tài khoản không tồn tại hoặc đã bị khóa.", null, null);

        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = HashToken(newRefreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            IsRevoked = false
        });

        await _dbContext.SaveChangesAsync();

        return (true, "Token refreshed", newAccessToken, newRefreshToken);
    }

    public async Task RevokeRefreshTokenAsync(Guid userId)
    {
        var tokens = await _dbContext.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.IsRevoked = true;
        }

        if (tokens.Count > 0)
            await _dbContext.SaveChangesAsync();
    }

    public string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];

        if (string.IsNullOrEmpty(jwtKey))
            throw new InvalidOperationException("JWT Key is not configured");

        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15), // Short-lived access token
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    /// <summary>
    /// Hash the refresh token before storing in DB (never store raw tokens).
    /// </summary>
    private static string HashToken(string token)
    {
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(hashBytes);
    }

    /// <summary>
    /// Decode expired JWT without validating lifetime to extract user claims.
    /// </summary>
    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
            return null;

        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey));

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = false // Allow expired tokens for refresh
        };

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

            if (securityToken is not JwtSecurityToken jwtToken
                || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                return null;

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
