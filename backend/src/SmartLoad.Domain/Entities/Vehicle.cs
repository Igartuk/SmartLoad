using SmartLoad.Domain.Common;
using SmartLoad.Domain.Enums;

namespace SmartLoad.Domain.Entities
{
    public class Vehicle
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Name { get; init; }
        public VehicleType Type { get; init; }
        public Dimensions InnerDimensions { get; init; }
        public double MaxPayload { get; init; }
        private Vehicle() { }
        private Vehicle(string name, VehicleType type, Dimensions dim, double maxPayload)
        {
            Name = name;
            Type = type;
            InnerDimensions = dim;
            MaxPayload = maxPayload;
        }

        public static Vehicle CreateSmall() => new("Small Van", VehicleType.Small, new Dimensions(1.7, 1.5, 2.4), 1000);
        public static Vehicle CreateMedium() => new("7.5t Truck", VehicleType.Medium, new Dimensions(2.3, 2.2, 6.0), 3000);
        public static Vehicle CreateLarge() => new("Standard Semi", VehicleType.Large, new Dimensions(2.45, 2.6, 13.6), 24000);
        public static Vehicle CreateCustom(string name, Dimensions dim, double maxPayload)
            => new(name, VehicleType.Custom, dim, maxPayload);
    }
}
