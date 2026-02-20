using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartLoad.Application.Interfaces;
using SmartLoad.Domain.Services;
using SmartLoad.Infrastructure.Persistence;
using SmartLoad.Infrastructure.Persistence.Repositories;

namespace SmartLoad.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            services.AddScoped<ILoadPlanRepository, LoadPlanRepository>();

            services.AddScoped<IPackingStrategy, GreedyPackingStrategy>();

            return services;
        }
    }
}
