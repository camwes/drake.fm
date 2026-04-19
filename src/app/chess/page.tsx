import type { Metadata } from "next";
import { ChessGames } from "@/components/chess-games";

export const metadata: Metadata = {
  title: "Chess — Drake.fm",
  description: "Active daily chess games.",
};

export default function ChessPage() {
  return (
    <main className="min-h-screen bg-[#120b0a] text-white lg:h-screen lg:overflow-hidden">
      <div className="min-h-screen lg:h-full">
        <ChessGames />
      </div>
    </main>
  );
}
