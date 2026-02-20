using SmartLoad.Domain.Common;
using SmartLoad.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Domain.Entities
{
    public class Box(string name, Dimensions dimensions, double weight)
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Name { get; init; } = name;
        public Dimensions Dimensions { get; init; } = dimensions;
        public double Weight { get; init; } = weight;

        public bool IsStackable { get; init; } = true;
        public bool IsFragile { get; init; } = false;
        public AllowedOrientations Orientations { get; init; } = AllowedOrientations.FullyFlexible;
    }
}
