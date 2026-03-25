using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.DTOs
{
    public record LoadPlanResponse(
    Guid Id,
    string Url,
    double VolumeUtilization,
    List<PackedItemDto> PackedItems,
    List<BoxDto> UnpackedItems);
}
