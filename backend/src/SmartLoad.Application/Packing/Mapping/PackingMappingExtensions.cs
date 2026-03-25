using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Domain.Common;
using SmartLoad.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.Mapping
{
    public static class PackingMappingExtensions
    {
        public static Vehicle ToDomain(this VehicleRequest request)
        {
            return request.TemplateType?.ToLower() switch
            {
                "small" => Vehicle.CreateSmall(),
                "medium" => Vehicle.CreateMedium(),
                "large" => Vehicle.CreateLarge(),
                _ => Vehicle.CreateCustom(
                    request.Name ?? "Custom",
                    new Dimensions(request.Width!.Value, request.Height!.Value, request.Depth!.Value),
                    request.MaxPayload ?? 0)
            };
        }
        public static VehicleRequest DomainToDto(this Vehicle vehicle)
        {
            return new VehicleRequest
            (
                vehicle.Name,
                vehicle.Type.ToString(),
                 vehicle.InnerDimensions.Width,
                 vehicle.InnerDimensions.Height,
                 vehicle.InnerDimensions.Depth,
                 vehicle.MaxPayload
            );
        }
        public static List<Box> ToDomainList(this IEnumerable<BoxRequest> requests)
        {
            return requests.SelectMany(req =>
                Enumerable.Range(0, req.Quantity).Select(_ => new Box(
                    req.Name,
                    new Dimensions(req.Width, req.Height, req.Depth),
                    req.Weight)
                {
                    IsStackable = req.IsStackable,
                    IsFragile = req.IsFragile
                })).ToList();
        }
    }
}
