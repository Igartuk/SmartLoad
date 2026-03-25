import { useState, useEffect, useCallback } from "react";
import { getLoadingPlanByUrl, updatePacking } from "../api";
import { parseOriginalRequest } from "@/shared/utils";
import type {
  Box,
  LoadingPlanResponse,
  PackedItem,
  Vehicle,
} from "../model/types";

export function usePackingPlan(shortUrl?: string) {
  const [plan, setPlan] = useState<LoadingPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{
    vehicle: Vehicle | null;
    boxes: Box[];
  } | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!shortUrl) return;

    try {
      setLoading(true);
      const data = await getLoadingPlanByUrl(shortUrl);
      setPlan({
        ...data,
        packedItems: data.packedItems,
      });

      const parsed = parseOriginalRequest(data.originalRequest);
      if (parsed) setInitialData(parsed);
    } catch {
      setError("Failed to load packing plan.");
    } finally {
      setLoading(false);
    }
  }, [shortUrl]);

  const updatePlan = async (vehicle: Vehicle | null, boxes: Box[]) => {
    if (!shortUrl) return;

    setLoading(true);
    try {
      const response = await updatePacking(shortUrl, { vehicle, boxes });
      setPlan({
        ...response.loadingPlan,
        packedItems: response.loadingPlan.packedItems,
      });
      return response;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return { plan, loading, error, initialData, updatePlan, refresh: fetchPlan };
}
