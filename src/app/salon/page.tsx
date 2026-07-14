import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import { SalonHub } from "@/components/salon-hub";
import { groupByDomain } from "@/lib/salon";

export const metadata: Metadata = {
  title: "Salon — Drake.fm",
  description: "Cameron Drake's curated recommendations.",
};

export default function SalonPage() {
  const prose = readFileSync(join(process.cwd(), "content/salon.md"), "utf8");
  const grouped = groupByDomain();

  return <SalonHub grouped={grouped} prose={prose} />;
}
