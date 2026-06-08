using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Services;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseWithTokens>> Login([FromBody] LoginRequest request)
    {
        // A03:2021 - Sanitize input
        request.Username = InputSanitizer.Sanitize(request.Username);

        var (success, message, accessToken, refreshToken, user) = await _authService.LoginAsync(
            request.Username, request.Password);

        if (!success || user == null)
            return Unauthorized(new { message });

        var response = new LoginResponseWithTokens
        {
            Token = accessToken ?? string.Empty,
            RefreshToken = refreshToken ?? string.Empty,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role
            }
        };

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterRequest request)
    {
        // A03:2021 - Sanitize all string inputs
        request.Username = InputSanitizer.Sanitize(request.Username);
        request.Email = InputSanitizer.Sanitize(request.Email);
        request.FullName = InputSanitizer.Sanitize(request.FullName);
        request.Role = InputSanitizer.Sanitize(request.Role);

        var (success, message, user) = await _authService.RegisterAsync(
            request.Username, request.Email, request.Password, request.FullName, request.Role);

        if (!success || user == null)
            return BadRequest(new { message });

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role
        });
    }

    // A07:2021 - Refresh token endpoint
    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> Refresh([FromBody] RefreshTokenRequest request)
    {
        var (success, message, accessToken, refreshToken) = await _authService.RefreshTokenAsync(
            request.AccessToken, request.RefreshToken);

        if (!success)
            return Unauthorized(new { message });

        return Ok(new TokenResponse
        {
            AccessToken = accessToken ?? string.Empty,
            RefreshToken = refreshToken ?? string.Empty,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        });
    }

    // A07:2021 - Logout / revoke refresh tokens
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        await _authService.RevokeRefreshTokenAsync(userId);
        return Ok(new { message = "Đăng xuất thành công." });
    }
}
