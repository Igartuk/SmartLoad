using MediatR;
using SmartLoad.Application.Common;
using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Application.Services;
using SmartLoad.Domain.Common;
using SmartLoad.Domain.Entities;
using SmartLoad.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.Commands
{
    public class UpdatePackingCommandHandler : IRequestHandler<UpdatePackingCommand, LoadingPlanResponse>
    {
        private readonly IPackingStrategy _packingStrategy;
        private readonly ILoadPlanRepository _repository;
        private readonly UrlShortenerService _urlShortener;

        public UpdatePackingCommandHandler(IPackingStrategy packingStrategy, ILoadPlanRepository repository, UrlShortenerService urlShortener)
        {
            _packingStrategy = packingStrategy;
            _repository = repository;
            _urlShortener = urlShortener;
        }

        public async Task<LoadingPlanResponse> Handle(UpdatePackingCommand request, CancellationToken cancellationToken)
        {
            // Get the existing load plan by URL
            var existingPlan = await _repository.GetByUrlAsync(request.Url);
            
            // Create new vehicle based on request
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

            // Create new boxes from request
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

            // Recalculate the packing plan
            var recalculatedPlan = _packingStrategy.Calculate(vehicle, domainBoxes);
            existingPlan.SetOriginalRequest(JsonSerializer.Serialize(new { request.Vehicle, request.Boxes }));
            // Clear existing items and add recalculated ones
            existingPlan.PackedItems.Clear();
            existingPlan.UnpackedItems.Clear();
            existingPlan.SetVehicle(vehicle);
            foreach (var item in recalculatedPlan.PackedItems)
            {
                existingPlan.AddPackedItem(item);
            }

            foreach (var box in recalculatedPlan.UnpackedItems)
            {
                existingPlan.AddUnpackedItem(box);
            }

            // Update the plan in database
            await _repository.UpdateAsync(existingPlan);

            return existingPlan.ToLoadingPlanResponse();
        }
    }
}