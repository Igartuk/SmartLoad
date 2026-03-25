using MediatR;
using SmartLoad.Application.Common;
using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Packing.Commands.Base;
using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Application.Packing.Mapping;
using SmartLoad.Domain.Services;
using System.Text.Json;

namespace SmartLoad.Application.Packing.Commands
{
    public class UpdatePackingCommandHandler : PackingHandlerBase, IRequestHandler<UpdatePackingCommand, LoadingPlanResponse>
    {
        public UpdatePackingCommandHandler(IPackingStrategy strategy, ILoadPlanRepository repo)
        : base(strategy, repo) { }

        public async Task<LoadingPlanResponse> Handle(UpdatePackingCommand request, CancellationToken ct)
        {
            var existingPlan = await _repository.GetByUrlAsync(request.Url)
            ?? throw new InvalidOperationException($"Load plan with URL '{request.Url}' not found.");

            var newCalculation = PerformCalculation(request.Vehicle, request.Boxes);
            var vehicle = request.Vehicle == null ? newCalculation.Vehicle.DomainToDto() : request.Vehicle;
            existingPlan.UpdateFrom(newCalculation, JsonSerializer.Serialize(new { vehicle, request.Boxes }));

            await _repository.UpdateAsync(existingPlan);
            return existingPlan.ToLoadingPlanResponse();
        }
    }
}