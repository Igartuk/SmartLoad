"use client";

import { useState } from "react";
import PackingForm from "./components/PackingForm";
import TruckVisualization from "./components/TruckVisualization";
import { PackingResponse } from "./services/api";

export default function Home() {
  const [result, setResult] = useState<PackingResponse | null>(null);
  const [vehicleData, setVehicleData] = useState<{
    width: number;
    height: number;
    depth: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormResult = (data: {
    result: PackingResponse;
    vehicle: {
      width: number;
      height: number;
      depth: number;
      maxPayload: number;
      name: string;
      templateType: string;
    };
  }) => {
    setResult(data.result);
    setVehicleData({
      width: data.vehicle.width,
      height: data.vehicle.height,
      depth: data.vehicle.depth,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        {/* Form on the left side - takes about 30% of screen width */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg overflow-y-auto p-6">
          <PackingForm onResult={handleFormResult} />
        </div>

        {/* Visualization on the right side - takes about 70% of screen width */}
        <div className="w-full lg:w-2/3 bg-gray-100 relative">
          {result ? (
            <div className="h-full">
              <TruckVisualization
                vehicle={{
                  width: vehicleData?.width || 100,
                  height: vehicleData?.height || 100,
                  depth: vehicleData?.depth || 100,
                }}
                packedItems={result.packedItems || []}
                volumeUtilization={result.volumeUtilization || 0}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Welcome to SmartLoad
                </h2>
                <p className="text-gray-600 mb-6">
                  Submit the form on the left to see 3D visualization of your
                  truck packing
                </p>
                <div className="text-blue-500 text-sm">
                  📦 Optimize your cargo loading with our intelligent packing
                  algorithm
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
