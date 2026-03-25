import type { Box, Vehicle } from "@/features/packing/model/types";

interface ParsedRequest {
  vehicle: Vehicle | null;
  boxes: Box[];
}

interface ParsedApiRequest {
  Vehicle?: {
    Name?: string;
    Width?: number;
    Height?: number;
    Depth?: number;
    MaxPayload?: number;
  };
  Boxes?: Array<{
    Name?: string;
    Width?: number;
    Height?: number;
    Depth?: number;
    Weight?: number;
    Quantity?: number;
    IsStackable?: boolean;
    IsFragile?: boolean;
  }>;
}

export function parseOriginalRequest(
  originalRequest: string,
): ParsedRequest | null {
  try {
    const parsed: ParsedApiRequest = JSON.parse(originalRequest);
    let vehicle: Vehicle | null = null;

    if (parsed.Vehicle) {
      vehicle = {
        name: parsed.Vehicle.Name || "Custom Truck",
        templateType: "custom",
        width: parsed.Vehicle.Width || 0,
        height: parsed.Vehicle.Height || 0,
        depth: parsed.Vehicle.Depth || 0,
        maxPayload: parsed.Vehicle.MaxPayload || 0,
      };
    }
    let boxes: Box[] = [];
    if (parsed.Boxes) {
      boxes = parsed.Boxes.map((b, index: number) => ({
        name: b.Name || `Box ${index + 1}`,
        width: b.Width || 0,
        height: b.Height || 0,
        depth: b.Depth || 0,
        weight: b.Weight || 0,
        quantity: b.Quantity || 1,
        isStackable: b.IsStackable ?? true,
        isFragile: b.IsFragile ?? false,
      }));
    }
    return { vehicle, boxes };
  } catch {
    console.error("Failed to parse original request");
    return null;
  }
}
