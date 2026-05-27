import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import { RunningHeatmap } from "@/components/running-heatmap";

export const metadata: Metadata = {
  title: "Running — Drake.fm",
  description: "Cameron Drake's running journey in the Bay Area.",
};

export default function RunningPage() {
  const prose = readFileSync(
    join(process.cwd(), "content/running.md"),
    "utf8",
  );

  return (
    <main className="min-h-screen bg-bg text-fg lg:h-screen lg:overflow-hidden">
      <div className="min-h-screen lg:h-full">
        <RunningHeatmap prose={prose} />
      </div>
    </main>
  );
}
