export type VehicleTemplateType = "small" | "medium" | "large" | "custom";

export interface Vehicle {
  name: string;
  templateType: VehicleTemplateType;
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

export interface PackedItem {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  rotation: string;
}

export interface UnpackedBox {
  name: string;
  width: number;
  height: number;
  depth: number;
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

export interface PackingRequest {
  vehicle: Vehicle | null;
  boxes: Box[];
}

export interface ContainerDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface TruckConfig {
  type: "SMALL" | "MEDIUM" | "LARGE";
  wheels: number;
  cabinScale: number;
  cabinOffset: number;
}

export interface SubComponentProps extends ContainerDimensions {
  config: TruckConfig;
}
