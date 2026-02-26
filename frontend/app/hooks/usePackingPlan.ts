import { useState, useEffect, useCallback } from "react";
import {
  getLoadingPlanByUrl,
  updatePacking,
  LoadingPlanResponse,
  Vehicle,
  Box,
} from "@/app/services/api";
import { parseOriginalRequest } from "../utils/packing-parser";

export function usePackingPlan(shortUrl: string) {
  const [plan, setPlan] = useState<LoadingPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{
    vehicle: Vehicle;
    boxes: Box[];
  } | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLoadingPlanByUrl(shortUrl);
      setPlan(data);

      const parsed = parseOriginalRequest(data.originalRequest);
      if (parsed) setInitialData(parsed);
    } catch (err) {
      setError("Failed to load packing plan.");
    } finally {
      setLoading(false);
    }
  }, [shortUrl]);

  const updatePlan = async (vehicle: Vehicle, boxes: any[]) => {
    setLoading(true);
    try {
      const response = await updatePacking(shortUrl, { vehicle, boxes });
      setPlan(response.loadingPlan); // This triggers the 3D re-render
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shortUrl) fetchPlan();
  }, [fetchPlan]);

  return { plan, loading, error, initialData, updatePlan, refresh: fetchPlan };
}
