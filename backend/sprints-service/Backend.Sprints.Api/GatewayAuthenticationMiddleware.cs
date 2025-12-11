using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

public class GatewayAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GatewayAuthenticationMiddleware> _logger;

    public GatewayAuthenticationMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<GatewayAuthenticationMiddleware> logger)
    {
        _next = next;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path;
        var publicEndpoints = _configuration.GetSection("PublicEndpoints").Get<List<string>>() ?? new List<string>();

        Console.WriteLine("=== GATEWAY MIDDLEWARE START ===");

        // --- БЛОК ДИАГНОСТИКИ ---
        Console.WriteLine($"HttpContext is null: {context == null}");

        if (context != null)
        {
            Console.WriteLine($"HttpContext.Request is null: {context.Request == null}");

            if (context.Request != null)
            {
                var headers = context.Request.Headers;
                Console.WriteLine($"HttpContext.Request.Headers is null: {headers == null}");

                if (headers != null)
                {
                    Console.WriteLine($"Headers count: {headers.Count}");
                    foreach (var header in headers)
                    {
                        Console.WriteLine($"Header: {header.Key} = {string.Join(", ", header.Value)}");
                    }
                }
            }
        }
        Console.WriteLine("=== END OF DIAGNOSTIC BLOCK ===");
        // --- КОНЕЦ БЛОКА ДИАГНОСТИКИ ---

        if (context?.Request?.Headers == null)
    {
            _logger.LogError("CRITICAL ERROR: context.Request.Headers is null. Cannot proceed.");
            // Пытаемся отправить ответ, если это возможно
            if (context?.Response != null)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync("Internal server error: Request headers are missing.");
            }
            return;
        }

        // 1. Пропускаем публичные эндпоинты без всяких проверок
        if (IsPublicEndpoint(path, publicEndpoints))
        {
            _logger.LogDebug("Public endpoint accessed: {Path}", path);
            await _next(context);
            return;
        }

        // 2. Проверяем, что заголовки вообще существуют (защита от аномалии)
        if (context.Request?.Headers == null)
        {
            _logger.LogError("Request Headers collection is null for path: {Path}. Aborting.", path);
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsync("Internal server error: Request headers are missing.");
            return;
        }

        var gatewaySecretHeader = _configuration["ServiceAuth:GatewaySecretHeader"];
        var expectedSecret = _configuration["ServiceAuth:GatewaySecretValue"];

        // 3. Проверяем секретный ключ. Он должен быть и у запросов от шлюза, и у внутренних запросов.
        if (!context.Request.Headers.TryGetValue(gatewaySecretHeader, out var secretValue) || secretValue != expectedSecret)
        {
            _logger.LogWarning("UNAUTHORIZED: Request to {Path} without a valid secret.", path);
            await SendUnauthorizedResponse(context, "Invalid or missing secret");
            return;
        }

        var claims = new List<Claim>();

        // 4. Определяем тип запроса и создаем ClaimsPrincipal
        var userIdValue = context.Request.Headers["X-User-Id"].FirstOrDefault();
        var sourceService = context.Request.Headers["X-Source-Service"].FirstOrDefault();

        if (!string.IsNullOrEmpty(userIdValue))
        {
            // Запрос от шлюза для пользователя
            var role = context.Request.Headers["X-User-Role"].FirstOrDefault() ?? "User";
            var email = context.Request.Headers["X-User-Email"].FirstOrDefault() ?? "";

            claims.Add(new Claim(ClaimTypes.NameIdentifier, userIdValue));
            claims.Add(new Claim(ClaimTypes.Role, role));
            claims.Add(new Claim(ClaimTypes.Email, email));
            claims.Add(new Claim("AuthType", "User"));

            _logger.LogDebug("Authenticated USER: {UserId} ({Role})", userIdValue, role);
        }
        else if (!string.IsNullOrEmpty(sourceService))
        {
            // Внутренний запрос от другого сервиса
            claims.Add(new Claim(ClaimTypes.Name, sourceService));
            claims.Add(new Claim(ClaimTypes.Role, "System"));
            claims.Add(new Claim("AuthType", "System"));

            _logger.LogDebug("Authenticated SERVICE: {ServiceName}", sourceService);
        }
        else
        {
            // Запрос есть, секрет верный, но нет данных ни о пользователе, ни о сервисе.
            // Это подозрительная ситуация.
            _logger.LogWarning("UNAUTHORIZED: Request to {Path} has a valid secret but no user/service context.", path);
            await SendUnauthorizedResponse(context, "Invalid request context");
            return;
        }

        var identity = new ClaimsIdentity(claims, "GatewayAuth");
        var principal = new ClaimsPrincipal(identity);
        context.User = principal;

        await _next(context);
    }

    private bool IsPublicEndpoint(PathString path, List<string> publicEndpoints)
    {
        foreach (var endpoint in publicEndpoints)
        {
            if (endpoint.EndsWith("/**"))
            {
                var prefix = endpoint.Replace("/**", "");
                if (path.StartsWithSegments(new PathString(prefix)))
                {
                    return true;
                }
            }
            else if (path.Equals(new PathString(endpoint), StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }
        return false;
    }

    private async Task SendUnauthorizedResponse(HttpContext context, string message)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";

        var response = new { timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(), status = 401, error = message };
        var jsonResponse = JsonSerializer.Serialize(response);

        await context.Response.WriteAsync(jsonResponse);
    }
}

public static class GatewayAuthenticationMiddlewareExtensions
{
    public static IApplicationBuilder UseGatewayAuthentication(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<GatewayAuthenticationMiddleware>();
    }
}