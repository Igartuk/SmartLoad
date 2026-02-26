using SmartLoad.Domain.Entities;

namespace SmartLoad.Application.Interfaces
{
    public interface ILoadPlanRepository
    {
        Task<LoadPlan> GetByIdAsync(Guid id);
        Task<LoadPlan> GetByUrlAsync(string shortUrl);
        Task SaveAsync(LoadPlan plan);
        Task UpdateAsync(LoadPlan plan);
    }
}
