"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PackingForm from "@/app/components/PackingForm";
import TruckVisualization from "@/app/components/TruckVisualization";
import PackingResultDisplayCompact from "@/app/components/PackingResultDisplayCompact";
import {
  getLoadingPlanByUrl,
  updatePacking,
  LoadingPlanResponse,
  Vehicle,
  Box,
} from "@/app/services/api";

// Utility function to parse OriginalRequest
function parseOriginalRequest(
  originalRequest: string,
): { vehicle: Vehicle; boxes: Box[] } | null {
  try {
    if (!originalRequest) return null;

    const parsed = JSON.parse(originalRequest);
    console.log(parsed);
    // Extract vehicle data
    const vehicle = {
      name: parsed.Vehicle?.Name || "Truck",
      templateType: parsed.Vehicle?.TemplateType || "custom",
      width: parsed.Vehicle?.Width || 100,
      height: parsed.Vehicle?.Height || 100,
      depth: parsed.Vehicle?.Depth || 100,
      maxPayload: parsed.Vehicle?.MaxPayload || 1000,
    };

    // Extract boxes data
    const boxes =
      parsed.Boxes?.map((box: any) => ({
        name: box.Name || `Box ${boxes.length + 1}`,
        width: box.Width || 10,
        height: box.Height || 10,
        depth: box.Depth || 10,
        weight: box.Weight || 1,
        quantity: box.Quantity || 1,
        isStackable: box.IsStackable !== undefined ? box.isStackable : true,
        isFragile: box.IsFragile !== undefined ? box.isFragile : false,
      })) || [];

    return { vehicle, boxes };
  } catch (error) {
    console.error("Error parsing OriginalRequest:", error);
    return null;
  }
}

export default function PackingResultPage() {
  const { shortUrl } = useParams<{ shortUrl: string | string[] }>();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<LoadingPlanResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | undefined>(
    undefined,
  );
  const [originalBoxes, setOriginalBoxes] = useState<Box[]>([]);

  useEffect(() => {
    if (shortUrl) {
      fetchLoadingPlan();
    }
  }, [shortUrl]);

  const fetchLoadingPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert shortUrl from object to string (Next.js quirk)
      const url = Array.isArray(shortUrl) ? shortUrl[0] : shortUrl;
      const plan = await getLoadingPlanByUrl(url);
      setLoadingPlan(plan);

      // Parse OriginalRequest to get vehicle and boxes
      const parsedRequest = parseOriginalRequest(plan.originalRequest);

      if (parsedRequest) {
        // Set initial edit vehicle data from OriginalRequest
        setEditVehicle({
          name: parsedRequest.vehicle.name,
          templateType: parsedRequest.vehicle.templateType,
          width: parsedRequest.vehicle.width,
          height: parsedRequest.vehicle.height,
          depth: parsedRequest.vehicle.depth,
          maxPayload: parsedRequest.vehicle.maxPayload,
        });

        // Set original boxes from OriginalRequest
        setOriginalBoxes(parsedRequest.boxes);
      } else {
        // Fallback to old approach if parsing fails
        setEditVehicle({
          name: "Loaded Truck",
          templateType: "loaded",
          width: plan.vehicle.width,
          height: plan.vehicle.height,
          depth: plan.vehicle.depth,
          maxPayload: 1000, // Default value, not available in loading plan
        });

        // Store original boxes for form loading
        if (plan.originalBoxes && plan.originalBoxes.length > 0) {
          setOriginalBoxes(plan.originalBoxes);
        }
      }
    } catch (err) {
      console.error("Error fetching loading plan:", err);
      setError("Failed to load packing plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  interface PackingFormData {
    result: { success: boolean; url: string };
    vehicle: Vehicle;
    boxes: {
      name: string;
      width: number;
      height: number;
      depth: number;
      weight: number;
      quantity: number;
      isStackable: boolean;
      isFragile: boolean;
    }[];
  }

  const handleUpdatePacking = async (data: PackingFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Convert shortUrl from object to string (Next.js quirk)
      const url = Array.isArray(shortUrl) ? shortUrl[0] : shortUrl;

      // Call the update API
      const updateResponse = await updatePacking(url, {
        vehicle: data.vehicle,
        boxes: data.boxes,
      });

      // Update the loading plan with new data
      setLoadingPlan(updateResponse.loadingPlan);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating packing plan:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update packing plan",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !loadingPlan) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Loading Packing Plan
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Loading your packing plan...</p>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Packing Plan Error
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={fetchLoadingPlan}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!loadingPlan) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Packing Plan Not Found
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              The requested packing plan could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        {/* Form on the left side - takes about 30% of screen width */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg overflow-y-auto p-6">
          <>
            <PackingForm
              onResult={handleUpdatePacking}
              initialVehicle={editVehicle}
              initialBoxes={originalBoxes}
              shouldCallApi={true}
            />
          </>
        </div>

        {/* Visualization on the right side - takes about 70% of screen width */}
        <div className="w-full lg:w-2/3 bg-gray-100 relative">
          {loadingPlan ? (
            <div className="h-full p-6 flex flex-col">
              {/* Compact PackingResultDisplay at the top */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <PackingResultDisplayCompact
                  loadingPlan={loadingPlan}
                  onEdit={isEditing ? undefined : handleEdit}
                  showEditButton={!isEditing}
                />
              </div>

              {/* 3D Visualization below */}
              <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    3D Packing Visualization
                  </h2>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                  <TruckVisualization
                    vehicle={{
                      width: loadingPlan.vehicle.width,
                      height: loadingPlan.vehicle.height,
                      depth: loadingPlan.vehicle.depth,
                    }}
                    packedItems={loadingPlan.packedItems}
                    volumeUtilization={loadingPlan.volumeUtilization}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Loading Visualization
                </h2>
                <p className="text-gray-600 mb-6">
                  Preparing your 3D packing visualization...
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
