using Microsoft.EntityFrameworkCore;
using SmartLoad.Application.Interfaces;
using SmartLoad.Domain.Entities;

namespace SmartLoad.Infrastructure.Persistence.Repositories
{
    public class LoadPlanRepository(AppDbContext context) : ILoadPlanRepository
    {
        public async Task<LoadPlan> GetByIdAsync(Guid id)
        {
            var plan = await context.LoadPlans
                .AsNoTracking() // Performance boost for read-only 3D rendering
                .FirstOrDefaultAsync(x => x.Id == id);

            return plan ?? throw new KeyNotFoundException($"LoadPlan {id} not found.");
        }

        public async Task SaveAsync(LoadPlan plan)
        {
            await context.LoadPlans.AddAsync(plan);
            await context.SaveChangesAsync();
        }
    }
}
