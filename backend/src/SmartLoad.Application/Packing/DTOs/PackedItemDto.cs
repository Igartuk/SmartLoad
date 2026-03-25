using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.DTOs
{
    public record PackedItemDto(Guid Id, string Name, double X, double Y, double Z, double Width, double Height, double Depth, string Rotation);
}
