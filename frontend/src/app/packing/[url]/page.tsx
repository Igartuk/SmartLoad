"use client";

import { useParams } from "next/navigation";
import { usePackingPlan } from "@/features/packing/hooks";
import { PackingFormWidget } from "@/widgets/packing-form";
import { TruckVisualizerWidget } from "@/widgets/truck-visualizer";
import type { Vehicle, Box } from "@/features/packing/model/types";

export default function PackingResultPage() {
  const params = useParams();
  const url = Array.isArray(params.url) ? params.url[0] : params.url;
  console.log(url);
  const { plan, loading, error, initialData, updatePlan } = usePackingPlan(url);

  if (loading && !plan) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!plan) return <NotFoundState />;

  const handleSubmit = async (vehicle: Vehicle | null, boxes: Box[]) => {
    await updatePlan(vehicle, boxes);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row h-screen overflow-hidden">
      <aside className="w-full lg:w-1/3 bg-white shadow-xl overflow-y-auto p-6 z-10">
        <PackingFormWidget
          initialVehicle={initialData?.vehicle}
          initialBoxes={initialData?.boxes}
          redirectOnSuccess={false}
          onSubmit={handleSubmit}
        />
      </aside>
      <main className="w-full lg:w-2/3 bg-slate-100 p-4">
        <TruckVisualizerWidget plan={plan} />
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading Packing Plan...</p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <p className="text-gray-600">Plan not found.</p>
      </div>
    </div>
  );
}
