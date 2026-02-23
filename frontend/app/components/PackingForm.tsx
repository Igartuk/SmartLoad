"use client";

import { useState } from "react";
import { calculatePacking } from "../services/api";

export default function PackingForm({
  onResult,
}: {
  onResult: (result: any) => void;
}) {
  const [vehicle, setVehicle] = useState({
    name: "Truck",
    templateType: "custom",
    width: 100,
    height: 100,
    depth: 100,
    maxPayload: 1000,
  });

  const truckPresets = [
    {
      name: "Small Truck",
      width: 50,
      height: 40,
      depth: 30,
      maxPayload: 500,
    },
    {
      name: "Medium Truck",
      width: 100,
      height: 80,
      depth: 60,
      maxPayload: 1000,
    },
    {
      name: "Large Truck",
      width: 150,
      height: 100,
      depth: 80,
      maxPayload: 2000,
    },
  ];

  const applyTruckPreset = (preset: any) => {
    setVehicle({
      name: preset.name,
      templateType: "preset",
      width: preset.width,
      height: preset.height,
      depth: preset.depth,
      maxPayload: preset.maxPayload,
    });
  };

  const [boxes, setBoxes] = useState([
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
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]:
        name === "width" ||
        name === "height" ||
        name === "depth" ||
        name === "maxPayload"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleBoxChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const newBoxes = [...boxes];
    newBoxes[index] = {
      ...newBoxes[index],
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "width" ||
              name === "height" ||
              name === "depth" ||
              name === "weight" ||
              name === "quantity"
            ? parseFloat(value) || 0
            : value,
    };
    setBoxes(newBoxes);
  };

  const addBox = () => {
    setBoxes([
      ...boxes,
      {
        name: `Box ${boxes.length + 1}`,
        width: 10,
        height: 10,
        depth: 10,
        weight: 1,
        quantity: 1,
        isStackable: true,
        isFragile: false,
      },
    ]);
  };

  const removeBox = (index: number) => {
    if (boxes.length > 1) {
      const newBoxes = [...boxes];
      newBoxes.splice(index, 1);
      setBoxes(newBoxes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await calculatePacking({ vehicle, boxes });
      onResult({ result, vehicle });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate packing",
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Truck Packing Calculator
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vehicle Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Vehicle Dimensions
          </h3>

          {/* Truck Presets */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Quick Select:
            </p>
            <div className="flex flex-wrap gap-2">
              {truckPresets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyTruckPreset(preset)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={vehicle.name}
                onChange={handleVehicleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Type
              </label>
              <input
                type="text"
                name="templateType"
                value={vehicle.templateType}
                onChange={handleVehicleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                name="width"
                value={vehicle.width}
                onChange={handleVehicleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                min="1"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                name="height"
                value={vehicle.height}
                onChange={handleVehicleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                min="1"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Depth
              </label>
              <input
                type="number"
                name="depth"
                value={vehicle.depth}
                onChange={handleVehicleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                min="1"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Payload
              </label>
              <input
                type="number"
                name="maxPayload"
                value={vehicle.maxPayload}
                onChange={handleVehicleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                min="1"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>

        {/* Boxes Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Boxes</h3>
          {boxes.map((box, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-100 rounded-lg relative"
            >
              <button
                type="button"
                onClick={() => removeBox(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                disabled={boxes.length <= 1}
              >
                ×
              </button>
              <h4 className="font-medium mb-3 text-gray-600">
                Box {index + 1}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={box.name}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={box.width}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={box.height}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depth
                  </label>
                  <input
                    type="number"
                    name="depth"
                    value={box.depth}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={box.weight}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={box.quantity}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    step="1"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isStackable"
                    checked={box.isStackable}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="mr-2"
                    id={`stackable-${index}`}
                  />
                  <label
                    htmlFor={`stackable-${index}`}
                    className="text-sm text-gray-700"
                  >
                    Stackable
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFragile"
                    checked={box.isFragile}
                    onChange={(e) => handleBoxChange(index, e)}
                    className="mr-2"
                    id={`fragile-${index}`}
                  />
                  <label
                    htmlFor={`fragile-${index}`}
                    className="text-sm text-gray-700"
                  >
                    Fragile
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addBox}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Another Box
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="mr-2">Calculating...</span>
                <span className="animate-spin">🌀</span>
              </>
            ) : (
              "Calculate Packing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
