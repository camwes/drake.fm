import { LifeAtlas } from "@/components/life-atlas";
import { lifeEvents } from "@/data/life-events";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#120b0a] text-white lg:h-screen lg:overflow-hidden">
      <div className="min-h-screen lg:h-full">
        <LifeAtlas events={lifeEvents} />
      </div>
    </main>
  );
}
