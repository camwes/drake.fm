"use client";

import { useCallback, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const USERNAME = "cdrake757";
const API_URL = `https://api.chess.com/pub/player/${USERNAME}/games`;

type DailyGame = {
  url: string;
  fen: string;
  turn: "white" | "black";
  move_by: number;
  pgn: string;
  time_control: string;
  white: string; // profile URL
  black: string; // profile URL
};

function parsePgn(pgn: string, key: string): string {
  const m = pgn.match(new RegExp(`\\[${key} "([^"]+)"\\]`));
  return m ? m[1] : "";
}

function formatDeadline(ts: number): string {
  const d = new Date(ts * 1000);
  const now = new Date();
  const diffH = Math.round((d.getTime() - now.getTime()) / 3600000);
  if (diffH < 0) return "Overdue";
  if (diffH < 1) return "< 1 hour";
  if (diffH < 24) return `${diffH}h left`;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = d.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  const h = hours % 12 || 12;
  return `${days[d.getDay()]} ${h}${ampm}`;
}

function myColor(game: DailyGame): "white" | "black" {
  return parsePgn(game.pgn, "White").toLowerCase() === USERNAME.toLowerCase()
    ? "white"
    : "black";
}

function myTurn(game: DailyGame): boolean {
  return game.turn === myColor(game);
}

function opponent(game: DailyGame): { username: string; rating: string } {
  const color = myColor(game) === "white" ? "Black" : "White";
  return {
    username: parsePgn(game.pgn, color),
    rating: parsePgn(game.pgn, `${color}Elo`),
  };
}

function gameId(game: DailyGame): string {
  return game.url;
}

export function ChessGames() {
  const [games, setGames] = useState<DailyGame[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready" | "empty">("loading");
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [explorationFen, setExplorationFen] = useState<string>("");
  const [isExploring, setIsExploring] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => {
        const list: DailyGame[] = data.games ?? [];
        if (list.length === 0) {
          setStatus("empty");
        } else {
          setGames(list);
          setSelectedUrl(list[0].url);
          setExplorationFen(list[0].fen);
          setStatus("ready");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  const selectedGame = games.find((g) => g.url === selectedUrl) ?? null;

  const selectGame = useCallback((game: DailyGame) => {
    setSelectedUrl(game.url);
    setExplorationFen(game.fen);
    setIsExploring(false);
  }, []);

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { piece: { pieceType: string; position: string; isSparePiece: boolean }; sourceSquare: string; targetSquare: string | null }): boolean => {
      if (!targetSquare) return false;
      try {
        const chess = new Chess(explorationFen);
        const move = chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        if (!move) return false;
        setExplorationFen(chess.fen());
        setIsExploring(true);
        return true;
      } catch {
        return false;
      }
    },
    [explorationFen],
  );

  const resetPosition = useCallback(() => {
    if (selectedGame) {
      setExplorationFen(selectedGame.fen);
      setIsExploring(false);
    }
  }, [selectedGame]);

  return (
    <section className="grid min-h-screen grid-cols-1 gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Board area */}
      <div className="relative flex flex-col items-center justify-center border-b border-[#5d3827] bg-[#120c0b] px-4 py-8 lg:min-h-0 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
        {status === "loading" && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="aspect-square w-full max-w-[540px] animate-pulse rounded-2xl bg-[#1a100d]" />
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-white/60">Couldn&apos;t load games.</p>
            <a
              href={`https://www.chess.com/member/${USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-[#7a4a2b] bg-[#2a1812] px-5 py-3 text-sm text-[#f8d57e] transition hover:bg-[#3a2119]"
            >
              Open chess.com profile ↗
            </a>
          </div>
        )}

        {status === "empty" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-white/60">No active daily games.</p>
            <a
              href="https://www.chess.com/play/online"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-[#7a4a2b] bg-[#2a1812] px-5 py-3 text-sm text-[#f8d57e] transition hover:bg-[#3a2119]"
            >
              Start a game ↗
            </a>
          </div>
        )}

        {status === "ready" && selectedGame && (
          <>
            <div className="w-full max-w-[540px]">
              <Chessboard
                options={{
                  position: explorationFen,
                  onPieceDrop: handlePieceDrop,
                  boardOrientation: myColor(selectedGame),
                  darkSquareStyle: { backgroundColor: "#3d2410" },
                  lightSquareStyle: { backgroundColor: "#c4956a" },
                  boardStyle: {
                    borderRadius: "0.75rem",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                  },
                }}
              />
            </div>

            <div className="mt-5 flex w-full max-w-[540px] items-center justify-between gap-3">
              <div className="text-xs text-white/35">
                {isExploring ? "Exploring · not submitted to chess.com" : "Drag pieces to explore moves"}
              </div>
              <div className="flex gap-2">
                {isExploring && (
                  <button
                    type="button"
                    onClick={resetPosition}
                    className="rounded-xl border border-[#7a4a2b] bg-[#2a1812] px-4 py-2 text-xs text-white/70 transition hover:bg-[#3a2119] hover:text-white"
                  >
                    Reset
                  </button>
                )}
                <a
                  href={selectedGame.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#7a4a2b] bg-[#2a1812] px-4 py-2 text-xs text-[#f8d57e] transition hover:bg-[#3a2119]"
                >
                  Play on chess.com ↗
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sidebar */}
      <aside className="flex min-h-0 flex-col bg-[#130d0c] lg:max-h-screen">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f8d57e]">Chess</p>
          <p className="mt-2 text-sm text-white/60">
            {status === "ready"
              ? `${games.length} active daily game${games.length !== 1 ? "s" : ""}`
              : "Active daily games"}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {status === "loading" && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-white/8 bg-white/4 p-4"
                  style={{ opacity: 1 - i * 0.2 }}
                >
                  <div className="mb-3 h-3 w-1/3 rounded bg-white/10" />
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                </div>
              ))}
            </div>
          )}

          {status === "ready" && (
            <div className="space-y-2">
              {games.map((game) => {
                const isSelected = gameId(game) === selectedUrl;
                const opp = opponent(game);
                const isMine = myTurn(game);
                const color = myColor(game);

                return (
                  <button
                    key={gameId(game)}
                    type="button"
                    onClick={() => selectGame(game)}
                    className={`relative w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#f8d57e] bg-[#2a1812] shadow-[0_0_0_1px_rgba(248,213,126,0.35)]"
                        : "border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="mt-0.5 h-3 w-3 shrink-0 rounded-full border-2"
                          style={{
                            backgroundColor: color === "white" ? "#f5f0e8" : "#1a100d",
                            borderColor: color === "white" ? "#c4956a" : "#7a4a2b",
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{opp.username}</p>
                          {opp.rating && <p className="text-xs text-white/45">{opp.rating} rating</p>}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-lg px-2 py-1 text-xs font-medium ${
                          isMine
                            ? "bg-[#f8d57e]/15 text-[#f8d57e]"
                            : "bg-white/6 text-white/40"
                        }`}
                      >
                        {isMine ? "Your turn" : "Waiting"}
                      </span>
                    </div>

                    {isMine && (
                      <p className="mt-2 text-xs text-white/35">
                        Move by {formatDeadline(game.move_by)}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}
