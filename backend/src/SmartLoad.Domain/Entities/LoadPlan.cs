using SmartLoad.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public Vehicle Vehicle { get; init; }
        public List<PackedItem> PackedItems { get; private set; } = new();
        public List<Box> UnpackedItems { get; private set; } = new();
        public double TotalVolumeUtilization =>
            Vehicle.InnerDimensions.Volume == 0 ? 0 :
            (PackedItems.Sum(i => i.OrientedDimensions.Volume) / Vehicle.InnerDimensions.Volume) * 100;
        public void AddPackedItem(PackedItem item) => PackedItems.Add(item);
        public void AddUnpackedItem(Box box) => UnpackedItems.Add(box);
    }
}
