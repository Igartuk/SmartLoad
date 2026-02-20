using MediatR;
using SmartLoad.Application.Common;
using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Domain.Common;
using SmartLoad.Domain.Entities;
using SmartLoad.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.Commands
{
    public class CalculateLoadPlanHandler : IRequestHandler<CalculateLoadPlanCommand, LoadPlanResponse>
    {
        private readonly IPackingStrategy _packingStrategy;
        private readonly ILoadPlanRepository _repository;

        public CalculateLoadPlanHandler(IPackingStrategy packingStrategy, ILoadPlanRepository repository)
        {
            _packingStrategy = packingStrategy;
            _repository = repository;
        }

        public async Task<LoadPlanResponse> Handle(CalculateLoadPlanCommand request, CancellationToken cancellationToken)
        {
            var vehicle = request.Vehicle.TemplateType?.ToLower() switch
            {
                "small" => Vehicle.CreateSmall(),
                "medium" => Vehicle.CreateMedium(),
                "large" => Vehicle.CreateLarge(),
                _ => Vehicle.CreateCustom(
                    request.Vehicle.Name ?? "Custom",
                    new Dimensions(request.Vehicle.Width!.Value, request.Vehicle.Height!.Value, request.Vehicle.Depth!.Value),
                    request.Vehicle.MaxPayload ?? 0)
            };

            var domainBoxes = new List<Box>();
            foreach (var req in request.Boxes)
            {
                for (int i = 0; i < req.Quantity; i++)
                {
                    domainBoxes.Add(new Box(req.Name, new Dimensions(req.Width, req.Height, req.Depth), req.Weight)
                    {
                        IsStackable = req.IsStackable,
                        IsFragile = req.IsFragile
                    });
                }
            }

            var loadPlan = _packingStrategy.Calculate(vehicle, domainBoxes);

            await _repository.SaveAsync(loadPlan);

            return loadPlan.ToResponse();
        }
    }
}
