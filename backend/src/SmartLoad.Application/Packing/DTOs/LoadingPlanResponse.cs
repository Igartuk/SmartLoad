using System;
using System.Collections.Generic;

namespace SmartLoad.Application.Packing.DTOs
{
    public record LoadingPlanResponse(
        string ShortUrl,
        double VolumeUtilization,
        VehicleDto Vehicle,
        List<PackedItemDto> PackedItems,
        List<BoxDto> UnpackedItems,
        string OriginalRequest,
        int UnpackedCount
    );

    public record VehicleDto(
        string Name,
        string TemplateType,
        double Width,
        double Height,
        double Depth
    );
}