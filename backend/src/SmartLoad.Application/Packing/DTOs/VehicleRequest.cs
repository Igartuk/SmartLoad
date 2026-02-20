using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.DTOs
{
    public record VehicleRequest(
    string? Name,
    string? TemplateType,
    double? Width,
    double? Height,
    double? Depth,
    double? MaxPayload);
}
