using System.Text;
using ChineseAuctionAPI.Data;
using ChineseAuctionAPI.Repositories;
using ChineseAuctionAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// --- הגדרות Serilog ---
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/all_requests.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

try
{
    Log.Information("Starting web host - Monitoring all requests");

    // --- Database Configuration ---
    var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
    // קוד כפול שנשמר בהערה:
    // var connectionStringOld = "Server=DESKTOP-021APTL\\SQLEXPRESS;Database=3285461_SalesAPI;Integrated Security=True;TrustServerCertificate=True;";
    
    builder.Services.AddDbContext<SaleContextDB>(options =>
        options.UseSqlServer(connectionString));

    // --- JWT & Authentication Configuration ---
    var jwtSection = builder.Configuration.GetSection("Jwt");
    var key = Encoding.UTF8.GetBytes(jwtSection["Key"]);
    
    // נתונים נוספים שהיו בקוד המקורי נשמרו כאן:
    var jwtKey = "0O6SjqnvXHnZDPb1i6xEukyD3f8TP/JvHEvuZlYc6I8=";
    var jwtIssuer = "ChineseAuctionAPI";
    var jwtAudience = "ChineseAuctionClient";

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
            ValidIssuer = jwtIssuer, // שימוש במשתנה מהקוד הראשון
            ValidateAudience = true,
            ValidAudience = jwtAudience, // שימוש במשתנה מהקוד הראשון
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
        
        /* הגדרה כפולה מהבלוק השני שנשמרה בהערה:
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
        */
    });

    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    });

    // --- Services & Repositories Registration ---
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    
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

    // --- Swagger Configuration ---
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
                new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
                new string[] { }
            }
        });
    });

    // --- CORS ---
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAngular", policy => 
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader());
    });

    var app = builder.Build();

    // --- Middleware Pipeline ---
    
    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ChineseAuctionAPI v1"));
    }

    app.UseCors("AllowAngular");
    app.UseHttpsRedirection();

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(builder.Environment.ContentRootPath, "public")),
        RequestPath = ""
    });

    /* קוד כפול שנשמר בהערה:
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(builder.Environment.ContentRootPath, "public")),
        RequestPath = ""
    });
    */

    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "The application failed to start");
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}