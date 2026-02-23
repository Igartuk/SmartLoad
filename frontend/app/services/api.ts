export interface Vehicle {
  name: string;
  templateType: string;
  width: number;
  height: number;
  depth: number;
  maxPayload: number;
}

export interface Box {
  name: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  quantity: number;
  isStackable: boolean;
  isFragile: boolean;
}

export interface PackingRequest {
  vehicle: Vehicle;
  boxes: Box[];
}

export interface PackedItem {
  boxId: string;
  name: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  rotation: string;
}

export interface PackingResponse {
  id: string;
  volumeUtilization: number;
  packedItems: PackedItem[];
  unpackedItems: any[];
}

const API_BASE_URL = "https://localhost:7039/api/packing";

export async function calculatePacking(
  request: PackingRequest,
): Promise<PackingResponse> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calculating packing:", error);
    throw error;
  }
}

export async function getPackingResult(id: string): Promise<PackingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting packing result:", error);
    throw error;
  }
}
