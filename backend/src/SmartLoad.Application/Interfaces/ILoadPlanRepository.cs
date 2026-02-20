using SmartLoad.Domain.Entities;

namespace SmartLoad.Application.Interfaces
{
    public interface ILoadPlanRepository
    {
        Task<LoadPlan> GetByIdAsync(Guid id);
        Task SaveAsync(LoadPlan plan);
    }
}
