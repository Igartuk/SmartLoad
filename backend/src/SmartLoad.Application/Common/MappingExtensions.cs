using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Common
{
    public static class MappingExtensions
    {
        public static LoadPlanResponse ToResponse(this LoadPlan plan)
        {
            return new LoadPlanResponse(
                plan.Id,
                plan.TotalVolumeUtilization,
                plan.PackedItems.Select(pi => new PackedItemDto(
                    pi.BoxId,
                    pi.Name,
                    pi.Position.X, pi.Position.Y, pi.Position.Z,
                    pi.OrientedDimensions.Width, pi.OrientedDimensions.Height, pi.OrientedDimensions.Depth,
                    pi.Rotation.ToString()
                )).ToList(),
                plan.UnpackedItems.Select(u => new BoxDto(
                    u.Name, u.Dimensions.Width, u.Dimensions.Height, u.Dimensions.Depth
                )).ToList()
            );
        }
    }
}
