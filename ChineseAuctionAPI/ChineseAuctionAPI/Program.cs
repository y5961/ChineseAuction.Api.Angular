using System.Text;
using ChineseAuctionAPI.Data;
using ChineseAuctionAPI.Repositories;
using ChineseAuctionAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// 1. הגדרת הלוגר - בלי שימוש ב-LogEventLevel כדי למנוע קווים אדומים
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    // השתקת המערכת באמצעות מחרוזות (Strings) - ה-Visual Studio לא יעשה פה קווים אדומים
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/all_requests.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    Log.Information("Starting web host - Monitoring all requests");

    builder.Host.UseSerilog();

    // ===== Register Services (JWT, Auth, Scoped) =====
    var jwtSection = builder.Configuration.GetSection("Jwt");
    var key = Encoding.UTF8.GetBytes(jwtSection["Key"]);

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSection["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    });

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "ChineseAuctionAPI", Version = "v1" });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter 'Bearer' [space] and then your token"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                new string[] { }
            }
        });
    });

    // Register Repositories & Services
    builder.Services.AddScoped<IUserRepo, UserRepo>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IOrderRepo, OrderRepo>();
    builder.Services.AddScoped<IOrderService, OrderService>();
    builder.Services.AddScoped<IGiftCategoryRepo, GiftCategoryRepo>();
    builder.Services.AddScoped<IGiftCategoryService, GiftCategoryService>();
    builder.Services.AddScoped<IGiftRepo, GiftRepo>();
    builder.Services.AddScoped<IGiftService, GiftService>();
    builder.Services.AddScoped<IDonorRepository, DonorRepository>();
    builder.Services.AddScoped<IDonorService, DonorService>();
    builder.Services.AddScoped<IPackageRepo, PackageRepo>();
    builder.Services.AddScoped<IPackageService, PackageService>();
    builder.Services.AddScoped<IEmailService1, EmailService>();


    var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
    builder.Services.AddDbContext<SaleContextDB>(options =>
        options.UseSqlServer(connectionString));
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAngular",
            policy => policy.AllowAnyOrigin() // או להגביל ל-http://localhost:4200
                            .AllowAnyMethod()
                            .AllowAnyHeader());
    });
    var app = builder.Build();

    // 2. שורת המחץ - רישום כל קריאת HTTP בצורה נקייה
    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ChineseAuctionAPI v1"));
    }
    app.UseCors("AllowAngular");
    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}