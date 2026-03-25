"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackingForm } from "@/features/packing/ui";
import type { Vehicle, Box } from "@/features/packing/model/types";

interface PackingFormWidgetProps {
  initialVehicle?: Vehicle | null;
  initialBoxes?: Box[];
  redirectOnSuccess?: boolean;
  onSubmit?: (vehicle: Vehicle | null, boxes: Box[]) => Promise<void>;
}

export function PackingFormWidget({
  initialVehicle,
  initialBoxes,
  redirectOnSuccess = true,
  onSubmit,
}: PackingFormWidgetProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResult = async (data: {
    result: { success: boolean; url: string } | null;
    vehicle: Vehicle | null;
    boxes: Box[];
  }) => {
    if (onSubmit) {
      setIsLoading(true);
      try {
        await onSubmit(data.vehicle, data.boxes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!data.result?.success || !data.result.url) {
      setError("Failed to get packing URL");
      return;
    }

    if (redirectOnSuccess) {
      router.push(data.result.url);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <PackingForm
        onResult={handleResult}
        initialVehicle={initialVehicle}
        initialBoxes={initialBoxes}
        shouldCallApi={true}
      />
    </div>
  );
}
