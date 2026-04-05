import { LifeAtlas } from "@/components/life-atlas";
import { lifeEvents } from "@/data/life-events";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-[#120b0a] text-white">
      <div className="h-full">
        <LifeAtlas events={lifeEvents} />
      </div>
    </main>
  );
}
