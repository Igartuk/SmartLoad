import { Vehicle, Box } from "@/app/services/api";

export function parseOriginalRequest(
  originalRequest: string,
): { vehicle: Vehicle; boxes: Box[] } | null {
  try {
    if (!originalRequest) return null;
    const parsed = JSON.parse(originalRequest);

    const vehicle: Vehicle = {
      name: parsed.Vehicle?.Name || "Truck",
      templateType: parsed.Vehicle?.TemplateType || "custom",
      width: parsed.Vehicle?.Width || 100,
      height: parsed.Vehicle?.Height || 100,
      depth: parsed.Vehicle?.Depth || 100,
      maxPayload: parsed.Vehicle?.MaxPayload || 1000,
    };

    const boxes: Box[] =
      parsed.Boxes?.map((box: any) => ({
        name: box.Name || "Box",
        width: box.Width || 10,
        height: box.Height || 10,
        depth: box.Depth || 10,
        weight: box.Weight || 1,
        quantity: box.Quantity || 1,
        isStackable: box.IsStackable ?? true,
        isFragile: box.IsFragile ?? false,
      })) || [];

    return { vehicle, boxes };
  } catch (error) {
    console.error("Error parsing OriginalRequest:", error);
    return null;
  }
}
