"use client";

import React, { useState } from "react";
import { usePackingForm } from "../hooks";
import { calculatePacking } from "../api";
import type { PackingRequest, Vehicle, Box } from "../model/types";
import { VehicleSection } from "./vehicle-section";
import { CargoSection } from "./cargo-section";

interface PackingFormProps {
  onResult: (data: {
    result: { success: boolean; url: string } | null;
    vehicle: Vehicle | null;
    boxes: Box[];
  }) => void;
  initialVehicle?: Vehicle | null;
  initialBoxes?: Box[];
  shouldCallApi?: boolean;
}

export function PackingForm({
  onResult,
  initialVehicle,
  initialBoxes,
  shouldCallApi = true,
}: PackingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    vehicle,
    setVehicle,
    boxes,
    addBox,
    removeBox,
    expandedBoxIndex,
    setExpandedBoxIndex,
    isAutoSelect,
    setIsAutoSelect,
    handleVehicleChange,
    handleBoxChange,
  } = usePackingForm(initialVehicle, initialBoxes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: PackingRequest = {
        vehicle: isAutoSelect ? null : vehicle,
        boxes,
      };
      const result = shouldCallApi ? await calculatePacking(payload) : null;
      onResult({ result, ...payload });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Calculation failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBox = (index: number) => {
    setExpandedBoxIndex(expandedBoxIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <VehicleSection
          vehicle={vehicle}
          isAutoSelect={isAutoSelect}
          onAutoSelectChange={setIsAutoSelect}
          onVehicleChange={setVehicle}
          onFieldChange={handleVehicleChange}
        />

        <CargoSection
          boxes={boxes}
          expandedBoxIndex={expandedBoxIndex}
          onAddBox={addBox}
          onRemoveBox={removeBox}
          onToggleBox={handleToggleBox}
          onBoxChange={handleBoxChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Optimizing..." : "Generate Plan"}
        </button>
      </form>
    </div>
  );
}
