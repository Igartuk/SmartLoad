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
  unpackedItems: UnpackedBox[];
}

export interface PackingResultSimple {
  success: boolean;
  url: string;
}

export interface PackingResultWithPlan {
  success: boolean;
  url: string;
  loadingPlan: LoadingPlanResponse;
}

export interface UnpackedBox {
  name: string;
  width: number;
  height: number;
  depth: number;
}

export interface LoadingPlanResponse {
  shortUrl: string;
  volumeUtilization: number;
  vehicle: {
    width: number;
    height: number;
    depth: number;
  };
  packedItems: PackedItem[];
  unpackedItems: UnpackedBox[];
  originalBoxes: Box[];
  originalRequest: string;
  unpackedCount: number;
}

import FetchWrapper from "./FetchWrapper";

const API_BASE_URL = "https://localhost:7039/api/packing";

export async function calculatePacking(
  request: PackingRequest,
): Promise<PackingResultSimple> {
  return FetchWrapper.post<PackingResultSimple>(API_BASE_URL, request);
}

export async function getLoadingPlanByUrl(
  shortUrl: string,
): Promise<LoadingPlanResponse> {
  return FetchWrapper.get<LoadingPlanResponse>(`${API_BASE_URL}/${shortUrl}`);
}

export async function updatePacking(
  shortUrl: string,
  request: PackingRequest,
): Promise<PackingResultWithPlan> {
  return FetchWrapper.put<PackingResultWithPlan>(
    `${API_BASE_URL}/${shortUrl}`,
    request,
  );
}

// Backward compatibility - keep old function
export async function getPackingResult(id: string): Promise<PackingResponse> {
  try {
    const data = await FetchWrapper.get<LoadingPlanResponse>(
      `${API_BASE_URL}/${id}`,
    );
    // Convert to old format for backward compatibility
    return {
      id: id,
      volumeUtilization: data.volumeUtilization,
      packedItems: data.packedItems,
      unpackedItems: data.unpackedItems,
    };
  } catch (error) {
    console.error("Error getting packing result:", error);
    throw error;
  }
}
