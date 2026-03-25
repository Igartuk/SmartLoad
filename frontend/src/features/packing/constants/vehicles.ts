import type { Box, Vehicle } from "../model/types";

export const TRUCK_DIMENSION_FIELDS = [
  "width",
  "height",
  "depth",
  "maxPayload",
] as const;

export const BOX_DIMENSION_FIELDS = [
  "width",
  "height",
  "depth",
  "weight",
  "quantity",
] as const;

export const TRUCK_PRESETS: Vehicle[] = [
  {
    name: "Small Truck",
    templateType: "small",
    width: 1950,
    height: 2000,
    depth: 3000,
    maxPayload: 1500,
  },
  {
    name: "Medium Truck",
    templateType: "medium",
    width: 2450,
    height: 2200,
    depth: 6000,
    maxPayload: 7000,
  },
  {
    name: "Large Truck",
    templateType: "large",
    width: 2500,
    height: 2500,
    depth: 13600,
    maxPayload: 20000,
  },
  {
    name: "Custom Truck",
    templateType: "custom",
    width: 1950,
    height: 2000,
    depth: 4000,
    maxPayload: 2000,
  },
];

export const DEFAULT_BOX: Box = {
  name: "New Box",
  width: 400,
  height: 400,
  depth: 400,
  weight: 5,
  quantity: 1,
  isStackable: true,
  isFragile: false,
};
