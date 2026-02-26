using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Domain.Common
{
    public record Dimensions(double Width, double Height, double Depth)
    {
        public double Volume => Width * Height * Depth;
        public bool FitsInside(Dimensions other)=>
            Width <= other.Width && Height <= other.Height && Depth <= other.Depth;
    }
}
