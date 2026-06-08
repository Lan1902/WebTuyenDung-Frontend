namespace RecruitmentAPI.Middleware;

/// <summary>
/// Adds OWASP-recommended security headers to every HTTP response.
/// Covers: Clickjacking, MIME sniffing, XSS protection, Referrer Policy, HSTS, Permissions Policy, and more.
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        // Prevent MIME type sniffing
        headers["X-Content-Type-Options"] = "nosniff";

        // Prevent clickjacking
        headers["X-Frame-Options"] = "DENY";

        // Enable browser XSS filter
        headers["X-XSS-Protection"] = "1; mode=block";

        // Referrer Policy - only send referrer for same origin
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

        // Content Security Policy (CSP)
        // Adjust these values based on your frontend framework requirements
        headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' http://localhost:3000 http://localhost:5000";

        // Permissions Policy (formerly Feature Policy)
        headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()";

        // X-Permitted-Cross-Domain-Policies
        headers["X-Permitted-Cross-Domain-Policies"] = "none";

        // X-Download-Options for IE8+
        headers["X-Download-Options"] = "noopen";

        // HSTS - only over HTTPS, enable in production
        if (context.Request.IsHttps)
        {
            headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
        }

        // Cache Control for sensitive pages
        if (context.Request.Path.StartsWithSegments("/api/auth") || context.Request.Path.StartsWithSegments("/api/account"))
        {
            headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
            headers["Pragma"] = "no-cache";
        }

        await _next(context);
    }
}
