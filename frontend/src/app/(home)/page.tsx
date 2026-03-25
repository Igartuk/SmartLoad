"use client";

import { PackingFormWidget } from "@/widgets/packing-form";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        <div className="w-full bg-white shadow-lg overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6 text-gray-900">
            SmartLoad - Truck Packing Calculator
          </h1>

          <PackingFormWidget />
        </div>
      </div>
    </div>
  );
}
