using MediatR;
using SmartLoad.Application.Packing.DTOs;

namespace SmartLoad.Application.Packing.Commands
{
    public record UpdatePackingCommand(
        string Url,
        VehicleRequest Vehicle,
        List<BoxRequest> Boxes
    ) : IRequest<LoadingPlanResponse>;
}