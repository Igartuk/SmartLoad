using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.DTOs
{
    public record PackedItemDto(Guid BoxId, string Name, double X, double Y, double Z, double W, double H, double D, string Rotation);
}
