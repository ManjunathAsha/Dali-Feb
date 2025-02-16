using Dali.ImportExportService.Infrastructure.Data;
using Dali.ImportExportService.Infrastructure.Settings;
using Dali.ImportExportService.Service;
using Dali.ImportExportService.Repository;
using Dali.ImportExportService.Helper;
using Dali.ImportExportService.Validation;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using OfficeOpenXml;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(80, listenOptions => 
    {
        // HTTP only
    });
});

// Configure strongly typed settings
builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.Configure(options =>
{
    options.ActivityTrackingOptions = ActivityTrackingOptions.SpanId
                                    | ActivityTrackingOptions.TraceId
                                    | ActivityTrackingOptions.ParentId;
});

// Set EPPlus license context
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = "userId",
            ClockSkew = TimeSpan.Zero
        };

        // Add events for debugging
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                var identity = context.Principal?.Identity as ClaimsIdentity;
                
                if (identity != null)
                {
                    var userId = identity.FindFirst("userId")?.Value;
                    var tenantId = identity.FindFirst("tenantId")?.Value;
                    var roles = identity.Claims
                        .Where(c => c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToList();
                    
                    logger.LogInformation(
                        "User authenticated - UserId: {UserId}, TenantId: {TenantId}, Roles: {Roles}", 
                        userId, tenantId, string.Join(", ", roles));
                }
            }
        };
    });

// Add basic authorization
builder.Services.AddAuthorization();

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Dali Import Export Service API", 
        Version = "v1",
        Description = "API for Dali Import Export Service"
    });

    // Add JWT Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// Add Azure AD Authentication
builder.Services.AddAuthentication()
    .AddJwtBearer("AzureAd", options =>
    {
        options.Authority = $"{builder.Configuration["AzureAd:Instance"]}{builder.Configuration["AzureAd:TenantId"]}";
        options.Audience = builder.Configuration["AzureAd:ClientId"];
    });

// Add DbContext configuration with resilient SQL connection
builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
        sqlOptions.CommandTimeout(60); // Increase command timeout for large imports
        sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
    });

    // Add command interceptor for SQL logging
    options.AddInterceptors(serviceProvider.GetRequiredService<DatabaseCommandInterceptor>());
});

// Register DatabaseCommandInterceptor
builder.Services.AddScoped<DatabaseCommandInterceptor>();

// Configure import settings
builder.Services.Configure<ImportSettings>(builder.Configuration.GetSection("ImportSettings"));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add HTTP client
builder.Services.AddHttpClient();

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

// Register application services
builder.Services.AddScoped<IImportRepository, ImportRepository>();
builder.Services.AddScoped<IImportValidator, ImportValidator>();
builder.Services.AddScoped<IImportMappingHelper, ImportMappingHelper>();
builder.Services.AddScoped<IImportService, ImportService>();

// Add HttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Configure scoped DbContext with tenant and user info
builder.Services.AddScoped(sp =>
{
    var options = sp.GetRequiredService<DbContextOptions<ApplicationDbContext>>();
    var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
    var httpContext = httpContextAccessor.HttpContext;

    string tenantId = string.Empty;
    string userId = string.Empty;

    if (httpContext?.User != null)
    {
        tenantId = httpContext.User.FindFirst("tenantId")?.Value ?? string.Empty;
        userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    }

    return new ApplicationDbContext(options, tenantId, userId);
});

// Configure scoped ImportMappingHelper with tenant and user info
builder.Services.AddScoped<IImportMappingHelper>(sp =>
{
    var logger = sp.GetRequiredService<ILogger<ImportMappingHelper>>();
    var context = sp.GetRequiredService<ApplicationDbContext>();
    var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
    var httpContext = httpContextAccessor.HttpContext;

    string tenantId = string.Empty;
    string userId = string.Empty;

    if (httpContext?.User != null)
    {
        tenantId = httpContext.User.FindFirst("tenantId")?.Value ?? string.Empty;
        userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    }

    return new ImportMappingHelper(logger, context, tenantId, userId);
});

// Configure scoped ImportService with tenant and user info
builder.Services.AddScoped<IImportService>(sp =>
{
    var logger = sp.GetRequiredService<ILogger<ImportService>>();
    var context = sp.GetRequiredService<ApplicationDbContext>();
    var mappingHelper = sp.GetRequiredService<IImportMappingHelper>();
    var repository = sp.GetRequiredService<IImportRepository>();
    var validator = sp.GetRequiredService<IImportValidator>();
    var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
    var httpContext = httpContextAccessor.HttpContext;

    string tenantId = string.Empty;
    string userId = string.Empty;

    if (httpContext?.User != null)
    {
        tenantId = httpContext.User.FindFirst("tenantId")?.Value ?? string.Empty;
        userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    }

    return new ImportService(logger, context, mappingHelper, repository, validator, userId, tenantId);
});

// Add Authorization Policies
builder.Services.AddAuthorization(options =>
{
    // Add import-related policies
    options.AddPolicy("ImportPermission", policy =>
        policy.RequireRole("SystemAdmin", "Admin", "Publisher"));
    
    options.AddPolicy("ExportPermission", policy =>
        policy.RequireRole("SystemAdmin", "Admin", "Publisher", "Reader"));
});

// Add memory cache for better performance
builder.Services.AddMemoryCache();

var app = builder.Build();

// Enable CORS
app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("ServiceSettings:EnableSwagger"))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Dali Import Export Service API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseDeveloperExceptionPage();

app.UseRouting();

// Add request logging with performance tracking
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    var sw = System.Diagnostics.Stopwatch.StartNew();
    
    try
    {
        // Log the incoming request
        logger.LogInformation(
            "Incoming Request: {Method} {Path} {QueryString}",
            context.Request.Method,
            context.Request.Path,
            context.Request.QueryString);
        
        await next();
        
        sw.Stop();
        
        // Log the response time
        logger.LogInformation(
            "Request completed in {ElapsedMilliseconds}ms - Status: {StatusCode}",
            sw.ElapsedMilliseconds,
            context.Response.StatusCode);
    }
    catch (Exception ex)
    {
        sw.Stop();
        logger.LogError(
            ex,
            "Request failed after {ElapsedMilliseconds}ms - {Method} {Path}",
            sw.ElapsedMilliseconds,
            context.Request.Method,
            context.Request.Path);
        throw;
    }
});

// Add authentication middleware
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Map health checks
app.MapHealthChecks("/health");

// Add database migration check
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();
        
        logger.LogInformation("Checking database migrations...");
        if ((await context.Database.GetPendingMigrationsAsync()).Any())
        {
            logger.LogWarning("There are pending migrations that need to be applied");
        }
        else
        {
            logger.LogInformation("Database is up to date");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while checking the database migrations");
    }
}

await app.RunAsync(); 