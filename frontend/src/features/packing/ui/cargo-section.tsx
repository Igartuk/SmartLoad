"use client";

import type { Box } from "../model/types";
import { CargoItem } from "./cargo-item";

interface CargoSectionProps {
  boxes: Box[];
  expandedBoxIndex: number | null;
  onAddBox: () => void;
  onRemoveBox: (index: number) => void;
  onToggleBox: (index: number) => void;
  onBoxChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CargoSection({
  boxes,
  expandedBoxIndex,
  onAddBox,
  onRemoveBox,
  onToggleBox,
  onBoxChange,
}: CargoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700 text-sm uppercase">
          Cargo Items ({boxes.length})
        </h3>
        <button
          type="button"
          onClick={onAddBox}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          + ADD BOX
        </button>
      </div>

      <div className="space-y-3">
        {boxes.map((box, index) => (
          <CargoItem
            key={index}
            box={box}
            isExpanded={expandedBoxIndex === index}
            onToggle={() => onToggleBox(index)}
            onRemove={() => onRemoveBox(index)}
            onChange={(e) => onBoxChange(index, e)}
            canRemove={boxes.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
