import type { Metadata } from "next";
import { RunningHeatmap } from "@/components/running-heatmap";

export const metadata: Metadata = {
  title: "Running — Drake.fm",
  description: "Cameron Drake's running journey in the Bay Area.",
};

export default function RunningPage() {
  return (
    <main className="min-h-screen bg-[#120b0a] text-white lg:h-screen lg:overflow-hidden">
      <div className="min-h-screen lg:h-full">
        <RunningHeatmap />
      </div>
    </main>
  );
}
