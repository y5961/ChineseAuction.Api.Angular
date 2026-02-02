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

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

try
{
    // 2. מחרוזת חיבור ישירה - עוקף את הבעיה ב-appsettings.json
    // השתמשתי בשם השרת המעודכן מהתמונות שלך
    var connectionString = "Server=DESKTOP-021APTL\\SQLEXPRESS;Database=3285461_SalesAPI;Integrated Security=True;TrustServerCertificate=True;";

    // 3. רישום ה-DbContext
    builder.Services.AddDbContext<SaleContextDB>(options =>
        options.UseSqlServer(connectionString));

    // 4. הגדרות JWT - הזנה ישירה למניעת שגיאות טעינה
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
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true
        };
    });

    // 5. רישום כל ה-Services (הזרקת תלות)
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
                new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
                new string[] { }
            }
        });
    });

    // Repositories & Services
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

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAngular", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    });

    var app = builder.Build();

    // 6. Pipeline configuration
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors("AllowAngular");


    app.UseHttpsRedirection();
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(builder.Environment.ContentRootPath, "public")),
        RequestPath = ""
    });
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "The application failed to start");
}
finally
{
    Log.CloseAndFlush();
}