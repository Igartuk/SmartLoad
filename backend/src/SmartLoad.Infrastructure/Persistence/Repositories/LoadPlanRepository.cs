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
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            return plan ?? throw new KeyNotFoundException($"LoadPlan {id} not found.");
        }

        public async Task<LoadPlan> GetByUrlAsync(string url)
        {
            var plan = await context.LoadPlans
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Url == url);

            return plan ?? throw new KeyNotFoundException($"LoadPlan with URL {url} not found.");
        }

        public async Task SaveAsync(LoadPlan plan)
        {
            await context.LoadPlans.AddAsync(plan);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(LoadPlan plan)
        {
            context.LoadPlans.Update(plan);
            await context.SaveChangesAsync();
        }
    }
}
