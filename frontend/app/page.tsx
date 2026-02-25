"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PackingForm from "./components/PackingForm";
import { calculatePacking } from "./services/api";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormResult = async (data: {
    result: { success: boolean; url: string };
    vehicle: {
      width: number;
      height: number;
      depth: number;
      maxPayload: number;
      name: string;
      templateType: string;
    };
    boxes: any[];
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // The PackingForm already called the API, just handle the result
      if (data.result.success && data.result.url) {
        // Redirect to the packing result page with the short URL
        router.push(`${data.result.url}`);
      } else {
        throw new Error("Failed to get packing URL");
      }
    } catch (err) {
      console.error("Error submitting packing form:", err);
      setError(
        err instanceof Error ? err.message : "Failed to submit packing form",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        {/* Form takes full width on initial page */}
        <div className="w-full bg-white shadow-lg overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            SmartLoad - Truck Packing Calculator
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          <PackingForm onResult={handleFormResult} shouldCallApi={true} />

          {isLoading && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                Processing your packing request...
              </p>
              <div className="mt-2 h-1 w-full bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
