using SmartLoad.Domain.Common;
using SmartLoad.Domain.Entities;
using SmartLoad.Domain.Enums;
using SmartLoad.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Domain.Services
{
    public class GreedyPackingStrategy : IPackingStrategy
    {
        public LoadPlan Calculate(Vehicle vehicle, List<Box> boxes)
        {
            var plan = new LoadPlan(vehicle);

            var sortedBoxes = boxes
                .OrderBy(b => b.IsFragile)
                .ThenByDescending(b => !b.IsStackable)
                .ThenByDescending(b => b.Weight)
                .ThenByDescending(b => b.Dimensions.Volume)
                .ToList();

            foreach (var box in sortedBoxes)
            {
                if (TryPlace(box, plan, out var packedItem))
                {
                    plan.AddPackedItem(packedItem!);
                }
                else
                {
                    plan.AddUnpackedItem(box);
                }
            }

            return plan;
        }

        private bool TryPlace(Box box, LoadPlan plan, out PackedItem? result)
        {
            var truck = plan.Vehicle.InnerDimensions;
            var orientations = GetValidOrientations(box);

            var points = GetCandidatePoints(plan.PackedItems, truck);

            foreach (var point in points)
            {
                foreach (var (orientedDim, axis) in orientations)
                {
                    if (point.X + orientedDim.Width > truck.Width ||
                        point.Y + orientedDim.Height > truck.Height ||
                        point.Z + orientedDim.Depth > truck.Depth)
                        continue;

                    if (HasCollision(point, orientedDim, plan.PackedItems))
                        continue;

                    if (PassesLogisticsRules(point, orientedDim, box, plan.PackedItems))
                    {
                        result = new PackedItem(
                            box.Id,
                            box.Name,
                            point,
                            orientedDim,
                            axis,
                            box.IsStackable,
                            box.IsFragile);
                        return true;
                    }
                }
            }

            result = null;
            return false;
        }

        private List<Position> GetCandidatePoints(List<PackedItem> packedItems, Dimensions truck)
        {
            var points = new List<Position> { new Position(0, 0, 0) };

            foreach (var item in packedItems)
            {
                points.Add(new Position(item.Position.X + item.OrientedDimensions.Width, item.Position.Y, item.Position.Z));
                points.Add(new Position(item.Position.X, item.Position.Y + item.OrientedDimensions.Height, item.Position.Z));
                points.Add(new Position(item.Position.X, item.Position.Y, item.Position.Z + item.OrientedDimensions.Depth));
            }

            return points
                .Where(p => p.X < truck.Width && p.Y < truck.Height && p.Z < truck.Depth)
                .Distinct()
                .OrderBy(p => p.Y)
                .ThenBy(p => p.Z)
                .ThenBy(p => p.X)
                .ToList();
        }

        private List<(Dimensions Dim, RotationAxis Axis)> GetValidOrientations(Box box)
        {
            var orientations = new List<(Dimensions Dim, RotationAxis Axis)>
            {
                (box.Dimensions, RotationAxis.None)
            };

            if (box.Orientations.HasFlag(AllowedOrientations.UprightOnly) ||
                box.Orientations.HasFlag(AllowedOrientations.FullyFlexible))
            {
                orientations.Add((new Dimensions(box.Dimensions.Depth, box.Dimensions.Height, box.Dimensions.Width), RotationAxis.Yaw));
            }

            if (box.Orientations.HasFlag(AllowedOrientations.FullyFlexible))
            {
                orientations.Add((new Dimensions(box.Dimensions.Width, box.Dimensions.Depth, box.Dimensions.Height), RotationAxis.Pitch));
                orientations.Add((new Dimensions(box.Dimensions.Height, box.Dimensions.Width, box.Dimensions.Depth), RotationAxis.Roll));
            }

            return orientations.DistinctBy(o => o.Dim).ToList();
        }

        private bool HasCollision(Position pos, Dimensions dim, List<PackedItem> others)
        {
            const double epsilon = 0.001;
            return others.Any(other =>
                pos.X < other.Position.X + other.OrientedDimensions.Width - epsilon &&
                pos.X + dim.Width > other.Position.X + epsilon &&
                pos.Y < other.Position.Y + other.OrientedDimensions.Height - epsilon &&
                pos.Y + dim.Height > other.Position.Y + epsilon &&
                pos.Z < other.Position.Z + other.OrientedDimensions.Depth - epsilon &&
                pos.Z + dim.Depth > other.Position.Z + epsilon);
        }

        private bool PassesLogisticsRules(Position pos, Dimensions dim, Box box, List<PackedItem> others)
        {
            // Floor is always stable
            if (pos.Y > 0)
            {
                if (!HasSufficientSupport(pos, dim, others))
                    return false;
            }

            var itemsBelow = others.Where(other => IsDirectlyUnder(pos, dim, other)).ToList();

            foreach (var lowerItem in itemsBelow)
            {
                if (!lowerItem.IsStackable) return false;
                if (lowerItem.IsFragile) return false;
            }

            return true;
        }

        private bool IsDirectlyUnder(Position topPos, Dimensions topDim, PackedItem lowerItem)
        {
            bool isAtCorrectHeight = Math.Abs((lowerItem.Position.Y + lowerItem.OrientedDimensions.Height) - topPos.Y) < 0.001;
            if (!isAtCorrectHeight) return false;

            return topPos.X < lowerItem.Position.X + lowerItem.OrientedDimensions.Width &&
                   topPos.X + topDim.Width > lowerItem.Position.X &&
                   topPos.Z < lowerItem.Position.Z + lowerItem.OrientedDimensions.Depth &&
                   topPos.Z + topDim.Depth > lowerItem.Position.Z;
        }

        private bool HasSufficientSupport(Position pos, Dimensions dim, List<PackedItem> others)
        {
            const double supportThreshold = 0.70;
            double boxBottomArea = dim.Width * dim.Depth;
            double supportedArea = 0;

            var itemsBelow = others.Where(other => IsDirectlyUnder(pos, dim, other));

            foreach (var lower in itemsBelow)
            {
                double intersectX = Math.Max(0, Math.Min(pos.X + dim.Width, lower.Position.X + lower.OrientedDimensions.Width) - Math.Max(pos.X, lower.Position.X));
                double intersectZ = Math.Max(0, Math.Min(pos.Z + dim.Depth, lower.Position.Z + lower.OrientedDimensions.Depth) - Math.Max(pos.Z, lower.Position.Z));
                supportedArea += (intersectX * intersectZ);
            }

            return (supportedArea / boxBottomArea) >= supportThreshold;
        }
    }
}
