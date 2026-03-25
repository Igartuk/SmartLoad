"use client";

import type { Vehicle } from "../model/types";
import { TRUCK_PRESETS, TRUCK_DIMENSION_FIELDS } from "../constants";
import { FormField } from "./form-field";

interface VehicleSectionProps {
  vehicle: Vehicle;
  isAutoSelect: boolean;
  onAutoSelectChange: (value: boolean) => void;
  onVehicleChange: (vehicle: Vehicle) => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function VehicleSection({
  vehicle,
  isAutoSelect,
  onAutoSelectChange,
  onVehicleChange,
  onFieldChange,
}: VehicleSectionProps) {
  const isReadOnly = vehicle.templateType !== "custom" || isAutoSelect;

  const getInputStyles = (readOnly: boolean) =>
    `w-full px-3 py-2 border rounded-md transition-all focus:outline-none ${
      readOnly
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`;

  return (
    <div
      className={`border rounded-xl ${isAutoSelect ? "border-blue-400 bg-blue-50/20" : "border-gray-200"}`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="font-bold text-gray-700 text-sm uppercase">
          Vehicle Setup
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs text-gray-500">Auto-select</span>
          <input
            type="checkbox"
            checked={isAutoSelect}
            onChange={(e) => onAutoSelectChange(e.target.checked)}
            className="w-4 h-4"
          />
        </label>
      </div>

      <div
        className={`p-5 space-y-5 ${isAutoSelect ? "opacity-40 pointer-events-none" : ""}`}
      >
        <div className="flex flex-wrap gap-2">
          {TRUCK_PRESETS.map((preset) => (
            <button
              key={preset.templateType}
              type="button"
              onClick={() => onVehicleChange(preset)}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-colors ${
                vehicle.templateType === preset.templateType
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-4">
            <FormField
              label="name"
              obj={vehicle}
              onChange={onFieldChange}
              isReadOnly={isReadOnly}
              type="text"
              className={getInputStyles(isReadOnly)}
            />
          </div>
          {TRUCK_DIMENSION_FIELDS.map((field) => (
            <FormField
              key={field}
              label={field}
              obj={vehicle}
              onChange={onFieldChange}
              isReadOnly={isReadOnly}
              className={getInputStyles(isReadOnly)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
