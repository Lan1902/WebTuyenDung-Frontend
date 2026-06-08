using System.Collections.Concurrent;

namespace RecruitmentAPI.Middleware;

public class RateLimitMiddleware
{
    private static readonly ConcurrentDictionary<string, RateLimitEntry> _clients = new();
    private readonly RequestDelegate _next;

    public RateLimitMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value?.ToLowerInvariant();
        if (path == null || !path.StartsWith("/api/auth/"))
        {
            await _next(context);
            return;
        }

        var clientIp = context.Connection.RemoteIpAddress?.ToString()
            ?? context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
            ?? "unknown";

        var now = DateTime.UtcNow;
        var entry = _clients.GetOrAdd(clientIp, _ => new RateLimitEntry { LastRequest = now, RequestCount = 0 });

        lock (entry)
        {
            if ((now - entry.LastRequest).TotalSeconds >= 1)
            {
                entry.LastRequest = now;
                entry.RequestCount = 1;
            }
            else
            {
                entry.RequestCount++;
                if (entry.RequestCount > 5)
                {
                    context.Response.StatusCode = 429;
                    context.Response.Headers["Retry-After"] = "1";
                    context.Response.ContentType = "application/json";
                    context.Response.WriteAsync("{\"error\":\"Too many requests. Try again in 1 second.\"}");
                    return;
                }
            }
        }

        await _next(context);
    }

    private class RateLimitEntry
    {
        public DateTime LastRequest { get; set; }
        public int RequestCount { get; set; }
    }
}
