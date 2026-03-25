using Microsoft.EntityFrameworkCore;
using SmartLoad.Api.Endpoints;
using SmartLoad.Api.Filters;
using SmartLoad.Api.Middlewares;
using SmartLoad.Application.Packing.Commands;
using SmartLoad.Infrastructure.Persistence;
using static SmartLoad.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(CalculateLoadPlanCommand).Assembly));
builder.Services.AddScoped<RequestLoggingFilter>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Read CORS origins from configuration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
Console.WriteLine("Allowed origins:");
foreach (var o in allowedOrigins)
{
    Console.WriteLine(o);
}
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient",
        policy => policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowClient");
app.MapPackingEndpoints();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}
app.Run();
