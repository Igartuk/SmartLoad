using SmartLoad.Domain.ValueObjects;

namespace SmartLoad.Domain.Entities
{
    public class LoadPlan
    {
        public LoadPlan(Vehicle vehicle)
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
            Vehicle = vehicle;
        }

        private LoadPlan() { }
        public Guid Id { get; init; } = Guid.NewGuid();
        public string? Url { get; private set; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public Vehicle Vehicle { get; private set; }
        public List<PackedItem> PackedItems { get; private set; } = new();
        public List<Box> UnpackedItems { get; private set; } = new();
        public string OriginalRequest { get; private set; }
        public double TotalVolumeUtilization =>
            Vehicle.InnerDimensions.Volume == 0 ? 0 : (PackedItems.Sum(i => i.OrientedDimensions.Volume) / Vehicle.InnerDimensions.Volume) * 100;
        public void AddPackedItem(PackedItem item) => PackedItems.Add(item);
        public void AddUnpackedItem(Box box) => UnpackedItems.Add(box);
        public void SetUrl(string url) => Url = url;
        public void SetOriginalRequest(string request) => OriginalRequest = request;
        public void SetVehicle(Vehicle vehicle) => Vehicle = vehicle;
        
    }
}
