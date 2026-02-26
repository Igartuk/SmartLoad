"use client";

import { useParams } from "next/navigation";
import PackingForm from "@/app/components/PackingForm";
import TruckVisualization from "@/app/components/TruckVisualization";
import PackingResultDisplayCompact from "@/app/components/PackingResultDisplayCompact";
import { usePackingPlan } from "@/app/hooks/usePackingPlan";

export default function PackingResultPage() {
  const params = useParams();
  const shortUrl = Array.isArray(params.shortUrl)
    ? params.shortUrl[0]
    : params.shortUrl;

  const { plan, loading, error, initialData, updatePlan } =
    usePackingPlan(shortUrl);

  const handleFormSubmit = async (data: any) => {
    try {
      await updatePlan(data.vehicle, data.boxes);
    } catch (err) {
      alert(
        "Update failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  if (loading && !plan) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!plan) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* LEFT: Input Form */}
      <aside className="w-full lg:w-1/3 bg-white shadow-xl overflow-y-auto p-6 z-10">
        <PackingForm
          onResult={handleFormSubmit}
          initialVehicle={initialData?.vehicle}
          initialBoxes={initialData?.boxes}
          shouldCallApi={true}
        />
      </aside>

      {/* RIGHT: Visualizer */}
      <main className="w-full lg:w-2/3 bg-slate-100 p-4 flex flex-col gap-4">
        <header className="bg-white rounded-xl shadow-sm p-4">
          <PackingResultDisplayCompact loadingPlan={plan} />
        </header>

        <section className="flex-1 bg-white rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="text-xl font-semibold text-slate-900">
              3D Cargo Layout
            </h2>
            <p className="text-xs text-slate-500">
              Live View • {plan.packedItems.length} Items
            </p>
          </div>

          <TruckVisualization
            key={plan.vehicle.width + plan.vehicle.depth} // Force fresh mount if truck size changes significantly
            vehicle={plan.vehicle}
            packedItems={plan.packedItems}
            volumeUtilization={plan.volumeUtilization}
          />
        </section>
      </main>
    </div>
  );
}

// --- Sub-components for cleaner render logic ---
const LoadingState = () => <div className="p-8">Loading Packing Plan...</div>;
const ErrorState = ({ message }: { message: string }) => (
  <div className="p-8 text-red-600">{message}</div>
);
const NotFoundState = () => <div className="p-8">Plan not found.</div>;
