using MediatR;
using SmartLoad.Application.Packing.DTOs;

namespace SmartLoad.Application.Packing.Commands
{
    public record CalculateLoadPlanCommand(VehicleRequest? Vehicle, List<BoxRequest> Boxes)
    : IRequest<LoadPlanResponse>;
}
