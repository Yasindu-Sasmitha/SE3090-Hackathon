using System.Text;
using BoilerplateApi.Data;
using BoilerplateApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using BoilerplateApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();

// Swagger with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Database
var rawConn = Environment.GetEnvironmentVariable("DATABASE_URL") 
              ?? builder.Configuration.GetConnectionString("Default");

string formattedConn = rawConn ?? "";
if (formattedConn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) || 
    formattedConn.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
{
    var uri = new Uri(formattedConn);
    var userInfo = uri.UserInfo.Split(':');
    var dbUser = userInfo[0];
    var dbPass = userInfo.Length > 1 ? userInfo[1] : "";
    var port = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');
    formattedConn = $"Host={uri.Host};Port={port};Database={database};Username={dbUser};Password={dbPass};SSL Mode=Require;Trust Server Certificate=true;";
}

builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(formattedConn));

// Dependency Injection
builder.Services.AddScoped<ISafetyReportService, SafetyReportService>();
// JWT Authentication
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "SuperSecretKeyMin32CharactersLong!");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

// CORS (allow any origin for hackathon)
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        await db.Database.MigrateAsync();
    }
    catch
    {
        await db.Database.EnsureCreatedAsync();
    }

    if (!await db.Users.AnyAsync(u => u.Email == "admin@safelk.gov.lk"))
    {
        db.Users.Add(new User
        {
            Name = "SafeLK Officer (Admin)",
            Email = "admin@safelk.gov.lk",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "Admin"
        });
        await db.SaveChangesAsync();
    }

    if (!await db.SafetyReports.AnyAsync())
    {
        db.SafetyReports.AddRange(
            new SafetyReport { Title = "Broken Streetlight", Category = "Light", Location = "Galle Road, Colombo 3", Severity = "High", Status = "Reported" },
            new SafetyReport { Title = "Open Drain", Category = "Drain", Location = "Kandy Road, Kadugannawa", Severity = "Medium", Status = "In Progress" },
            new SafetyReport { Title = "Fallen Tree", Category = "Tree", Location = "Havelock Road, Colombo 5", Severity = "High", Status = "Resolved" }
        );
        await db.SaveChangesAsync();
    }
}

// Enable Swagger in both Development and Production for hackathon grading
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SafeLK API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
