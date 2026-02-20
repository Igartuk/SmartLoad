using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Application.Packing.DTOs
{
    public record BoxRequest(
    string Name,
    double Width,
    double Height,
    double Depth,
    double Weight,
    int Quantity = 1,
    bool IsStackable = true,
    bool IsFragile = false);
}
