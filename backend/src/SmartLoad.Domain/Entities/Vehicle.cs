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

        public static Vehicle CreateSmall() => new("Small Van", VehicleType.Small, new Dimensions(1950, 2000, 3000), 1500);
        public static Vehicle CreateMedium() => new("7t Truck", VehicleType.Medium, new Dimensions(2450, 2200, 6000), 7000);
        public static Vehicle CreateLarge() => new("Standard Semi", VehicleType.Large, new Dimensions(2500, 2500, 13600), 20000);
        public static Vehicle CreateCustom(string name, Dimensions dim, double maxPayload)
            => new(name, VehicleType.Custom, dim, maxPayload);
        public static IEnumerable<Vehicle> GetStandardTemplates() => new List<Vehicle>
        {
            CreateSmall(),
            CreateMedium(),
            CreateLarge()
        }.OrderBy(v => v.InnerDimensions.Volume);
    }
}
