"use client";

import type { Box } from "../model/types";
import { BOX_DIMENSION_FIELDS } from "../constants";
import { FormField } from "./form-field";

interface CargoItemProps {
  box: Box;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canRemove: boolean;
}

export function CargoItem({
  box,
  isExpanded,
  onToggle,
  onRemove,
  onChange,
  canRemove,
}: CargoItemProps) {
  const inputStyles =
    "w-full px-3 py-2 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className="flex items-center p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1">
          <span className="block text-sm font-bold text-gray-900">
            {box.name}
          </span>
          <span className="text-[11px] text-gray-400">
            {box.width}×{box.height}×{box.depth}mm • Qty: {box.quantity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
              aria-label="Remove box"
            >
              ✕
            </button>
          )}
          <span className="text-gray-400 text-sm">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 bg-gray-50 border-t grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="md:col-span-1">
            <FormField
              label="name"
              obj={box}
              onChange={onChange}
              type="text"
              className={inputStyles}
            />
          </div>
          {BOX_DIMENSION_FIELDS.map((field) => (
            <FormField
              key={field}
              label={field}
              obj={box}
              onChange={onChange}
              className={inputStyles}
            />
          ))}

          <div className="col-span-full flex gap-4 pt-2">
            {(["isStackable", "isFragile"] as const).map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={box[key]}
                  onChange={onChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                {key.replace("is", "").toUpperCase()}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
