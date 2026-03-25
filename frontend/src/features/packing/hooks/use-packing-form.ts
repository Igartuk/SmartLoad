import { useState } from "react";
import type { Box, Vehicle } from "../model/types";
import {
  BOX_DIMENSION_FIELDS,
  DEFAULT_BOX,
  TRUCK_DIMENSION_FIELDS,
  TRUCK_PRESETS,
} from "../constants";

export function usePackingForm(
  initialVehicle?: Vehicle | null,
  initialBoxes?: Box[],
) {
  const [vehicle, setVehicle] = useState<Vehicle>(
    initialVehicle || TRUCK_PRESETS[0],
  );
  const [boxes, setBoxes] = useState<Box[]>(
    initialBoxes?.length ? initialBoxes : [DEFAULT_BOX],
  );
  const [expandedBoxIndex, setExpandedBoxIndex] = useState<number | null>(0);
  const [isAutoSelect, setIsAutoSelect] = useState(false);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNum = (TRUCK_DIMENSION_FIELDS as readonly string[]).includes(name);
    setVehicle((prev) => ({
      ...prev,
      [name]: isNum ? parseFloat(value) || 0 : value,
    }));
  };

  const handleBoxChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    const isNum = (BOX_DIMENSION_FIELDS as readonly string[]).includes(name);

    setBoxes((prev) =>
      prev.map((box, i) =>
        i === index
          ? {
              ...box,
              [name]:
                type === "checkbox"
                  ? checked
                  : isNum
                    ? parseFloat(value) || 0
                    : value,
            }
          : box,
      ),
    );
  };

  const addBox = () => {
    const newBox = { ...DEFAULT_BOX, name: `Box ${boxes.length + 1}` };
    setBoxes([...boxes, newBox]);
    setExpandedBoxIndex(boxes.length);
  };

  const removeBox = (index: number) => {
    if (boxes.length > 1) {
      const updated = boxes.filter((_, i) => i !== index);
      setBoxes(updated);
      if (expandedBoxIndex === index) setExpandedBoxIndex(null);
    }
  };

  return {
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
  };
}
