"use client";

import { LoadingPlanResponse, UnpackedBox } from "../services/api";

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
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Packing Summary
      </h2>
      {/* Compact Summary Stats */}
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

      {/* Unpacked Items in compact form */}
      {loadingPlan.unpackedItems.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Unpacked Boxes:
          </p>
          {loadingPlan.unpackedItems
            .slice(0, 3)
            .map((box: UnpackedBox, index: number) => (
              <div
                key={index}
                className="bg-gray-100 p-1 rounded text-xs flex justify-between"
              >
                <span className="font-medium">{box.name}</span>
                <span className="text-gray-600">
                  {box.width.toFixed(1)}×{box.height.toFixed(1)}×
                  {box.depth.toFixed(1)}
                </span>
              </div>
            ))}
          {loadingPlan.unpackedItems.length > 3 && (
            <p className="text-xs text-gray-500 mt-1">
              +{loadingPlan.unpackedItems.length - 3} more boxes
            </p>
          )}
        </div>
      )}
    </div>
  );
}
