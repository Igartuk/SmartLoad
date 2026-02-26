"use client";

import { LoadingPlanResponse } from "../services/api";

interface PackingResultDisplayCompactProps {
  loadingPlan: LoadingPlanResponse;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export default function PackingResultDisplayCompact({
  loadingPlan,
}: PackingResultDisplayCompactProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Packing Summary
      </h2>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-xs text-gray-600">Volume</p>
          <p className="font-bold text-blue-600">
            {loadingPlan.volumeUtilization.toFixed(2)}%
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-gray-600">Packed</p>
          <p className="font-bold text-green-600">
            {loadingPlan.packedItems.length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-2">
          <p className="text-xs text-gray-600">Unpacked</p>
          <p className="font-bold text-yellow-600">
            {loadingPlan.unpackedCount}
          </p>
        </div>
      </div>
    </div>
  );
}
