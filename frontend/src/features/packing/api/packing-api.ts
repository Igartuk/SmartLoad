import { FetchWrapper } from "@/shared/api";
import type {
  LoadingPlanResponse,
  PackingRequest,
  PackingResultSimple,
  PackingResultWithPlan,
} from "../model/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/packing";

export async function calculatePacking(
  request: PackingRequest,
): Promise<PackingResultSimple> {
  return FetchWrapper.post<PackingResultSimple>(API_BASE_URL, request);
}

export async function getLoadingPlanByUrl(
  shortUrl: string,
): Promise<LoadingPlanResponse> {
  return FetchWrapper.get<LoadingPlanResponse>(`${API_BASE_URL}/${shortUrl}`);
}

export async function updatePacking(
  shortUrl: string,
  request: PackingRequest,
): Promise<PackingResultWithPlan> {
  return FetchWrapper.put<PackingResultWithPlan>(
    `${API_BASE_URL}/${shortUrl}`,
    request,
  );
}
