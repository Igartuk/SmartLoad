"use client";

import { TruckVisualization, PackingResultDisplay } from "@/features/packing/ui";
import type { LoadingPlanResponse } from "@/features/packing/model/types";

interface TruckVisualizerWidgetProps {
  plan: LoadingPlanResponse;
}

export function TruckVisualizerWidget({ plan }: TruckVisualizerWidgetProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Stats Header */}
      <header className="bg-white rounded-xl shadow-sm p-4">
        <PackingResultDisplay loadingPlan={plan} />
      </header>

      {/* 3D Visualization */}
      <section className="flex-1 bg-white rounded-xl shadow-sm relative overflow-hidden min-h-[500px]">
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-xl font-semibold text-slate-900">
            3D Cargo Layout
          </h2>
          <p className="text-xs text-slate-500">
            Live View • {plan.packedItems.length} Items
          </p>
        </div>

        <TruckVisualization
          key={`${plan.vehicle.width}-${plan.vehicle.depth}`}
          vehicle={plan.vehicle}
          packedItems={plan.packedItems}
        />
      </section>
    </div>
  );
}
