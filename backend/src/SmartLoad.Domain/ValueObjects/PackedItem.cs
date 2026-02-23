using SmartLoad.Domain.Common;
using SmartLoad.Domain.Enums;

namespace SmartLoad.Domain.ValueObjects
{
    public record PackedItem(
    Guid BoxId,
    string Name,
    Position Position,
    Dimensions OrientedDimensions,
    RotationAxis Rotation,
    bool IsStackable,
    bool IsFragile);
}
