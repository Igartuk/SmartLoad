"use client";

import { useState } from "react";
import { calculatePacking } from "../services/api";

const TRUCK_PRESETS = [
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

export default function PackingForm({
  onResult,
  initialVehicle,
  initialBoxes,
  shouldCallApi = true,
}: {
  onResult: (result: any) => void;
  initialVehicle?: any;
  initialBoxes?: any[];
  shouldCallApi?: boolean;
}) {
  const defaultVehicle =
    initialVehicle || TRUCK_PRESETS.find((p) => p.templateType === "custom");

  const [vehicle, setVehicle] = useState(defaultVehicle);
  const [boxes, setBoxes] = useState(
    initialBoxes && initialBoxes.length > 0
      ? initialBoxes
      : [
          {
            name: "Box 1",
            width: 10,
            height: 10,
            depth: 10,
            weight: 1,
            quantity: 10,
            isStackable: true,
            isFragile: false,
          },
        ],
  );

  // --- COLLAPSE STATE ---
  const [isVehicleCollapsed, setIsVehicleCollapsed] = useState(true);
  const [expandedBoxIndex, setExpandedBoxIndex] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReadOnly = vehicle.templateType !== "custom";

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicle((prev: any) => ({
      ...prev,
      [name]: ["width", "height", "depth", "maxPayload"].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleBoxChange = (index: number, e: any) => {
    const { name, value, type, checked } = e.target;
    const newBoxes = [...boxes];
    newBoxes[index] = {
      ...newBoxes[index],
      [name]:
        type === "checkbox"
          ? checked
          : ["width", "height", "depth", "weight", "quantity"].includes(name)
            ? parseFloat(value) || 0
            : value,
    };
    setBoxes(newBoxes);
  };

  const addBox = () => {
    const nextIndex = boxes.length;
    setBoxes([
      ...boxes,
      {
        name: `Box ${nextIndex + 1}`,
        width: 10,
        height: 10,
        depth: 10,
        weight: 1,
        quantity: 1,
        isStackable: true,
        isFragile: false,
      },
    ]);
    setExpandedBoxIndex(nextIndex); // Auto-expand new box
  };

  const removeBox = (index: number) => {
    if (boxes.length > 1) {
      setBoxes(boxes.filter((_, i) => i !== index));
      if (expandedBoxIndex === index) setExpandedBoxIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = { vehicle, boxes };
      if (shouldCallApi) {
        const result = await calculatePacking(data);
        onResult({ result, ...data });
      } else {
        onResult(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate packing",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyles = (readOnly: boolean) =>
    `w-full px-3 py-2 border rounded-md transition-colors focus:outline-none ${
      readOnly
        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Packing Configuration
        </h2>
        <div className="text-xs text-gray-500">
          Dimensions in millimeters / kilograms
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- VEHICLE SECTION --- */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setIsVehicleCollapsed(!isVehicleCollapsed)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-blue-600">
                Vehicle Setup
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {vehicle.name}
              </span>
            </div>
            <span
              className={`transform transition-transform ${isVehicleCollapsed ? "" : "rotate-180"}`}
            >
              ▼
            </span>
          </button>

          {!isVehicleCollapsed && (
            <div className="p-4 border-t border-gray-200 space-y-6 animate-in slide-in-from-top-2 duration-200">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-3">
                  Quick Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRUCK_PRESETS.map((preset) => (
                    <button
                      key={preset.templateType}
                      type="button"
                      onClick={() => setVehicle(preset)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        vehicle.templateType === preset.templateType
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={vehicle.name}
                    onChange={handleVehicleChange}
                    readOnly={isReadOnly}
                    className={getInputStyles(isReadOnly)}
                    required
                  />
                </div>
                {["width", "height", "depth", "maxPayload"].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                      {field.replace("max", "Max ")}
                    </label>
                    <input
                      type="number"
                      name={field}
                      value={vehicle[field]}
                      onChange={handleVehicleChange}
                      readOnly={isReadOnly}
                      className={getInputStyles(isReadOnly)}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- BOXES SECTION --- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-medium text-gray-600">
              Cargo Items ({boxes.length})
            </h3>
          </div>

          {boxes.map((box, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedBoxIndex(
                      expandedBoxIndex === index ? null : index,
                    )
                  }
                  className="flex-1 flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {box.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {box.width}x{box.height}x{box.depth}mm • {box.quantity}{" "}
                      units
                    </span>
                  </div>
                  <span
                    className={`text-gray-400 transform transition-transform ${expandedBoxIndex === index ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeBox(index)}
                  className="p-4 text-gray-300 hover:text-red-500 transition-colors border-l border-gray-100"
                  disabled={boxes.length <= 1}
                >
                  ✕
                </button>
              </div>

              {expandedBoxIndex === index && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-top-1">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={box.name}
                      onChange={(e) => handleBoxChange(index, e)}
                      className={getInputStyles(false)}
                    />
                  </div>
                  {["width", "height", "depth", "weight", "quantity"].map(
                    (f) => (
                      <div key={f}>
                        <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                          {f}
                        </label>
                        <input
                          type="number"
                          name={f}
                          value={box[f]}
                          onChange={(e) => handleBoxChange(index, e)}
                          className={getInputStyles(false)}
                        />
                      </div>
                    ),
                  )}
                  <div className="flex gap-4 col-span-2 md:col-span-3 pt-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isStackable"
                        checked={box.isStackable}
                        onChange={(e) => handleBoxChange(index, e)}
                        className="w-4 h-4 rounded text-blue-600 mr-2"
                      />
                      Stackable
                    </label>
                    <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFragile"
                        checked={box.isFragile}
                        onChange={(e) => handleBoxChange(index, e)}
                        className="w-4 h-4 rounded text-red-600 mr-2"
                      />
                      Fragile
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addBox}
            className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 font-medium rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <span>+</span> Add Box Type
          </button>
        </div>

        {/* --- SUBMIT --- */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-lg hover:shadow-green-200 disabled:opacity-50 transition-all"
          >
            {isLoading ? "Processing..." : "Calculate Packing"}
          </button>
        </div>
      </form>
    </div>
  );
}
