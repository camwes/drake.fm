"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { DeckGL } from "@deck.gl/react";
import { FlyToInterpolator } from "@deck.gl/core";
import Map from "react-map-gl/maplibre";
import runningHeatmapData from "@/data/running-heatmap-1yr.json";
import { MAP_STYLE, clampZoom, type AtlasViewState } from "@/lib/life-atlas-utils";

const INITIAL_VIEW: AtlasViewState = {
  longitude: -122.32,
  latitude: 37.68,
  zoom: 11.0,
  pitch: 0,
  bearing: 0,
};

export function RunningHeatmap() {
  const [viewState, setViewState] = useState<AtlasViewState>(INITIAL_VIEW);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapMountFrameRef = useRef<number | null>(null);

  useEffect(() => {
    mapMountFrameRef.current = requestAnimationFrame(() => {
      setIsMapReady(true);
    });
    return () => {
      if (mapMountFrameRef.current !== null) {
        cancelAnimationFrame(mapMountFrameRef.current);
      }
    };
  }, []);

  const adjustZoom = (delta: number) => {
    setViewState((current) => ({
      ...current,
      zoom: clampZoom(current.zoom + delta),
      transitionDuration: 250,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  };

  const layers = useMemo(
    () => [
      new HeatmapLayer<[number, number]>({
        id: "running-heatmap",
        data: runningHeatmapData as [number, number][],
        getPosition: (d) => d,
        getWeight: 1,
        radiusPixels: 28,
        intensity: 1.4,
        threshold: 0.03,
        colorRange: [
          [252, 100, 25, 30],
          [252, 140, 30, 120],
          [252, 200, 50, 200],
          [255, 240, 100, 240],
        ],
      }),
    ],
    [],
  );

  return (
    <section className="grid min-h-screen grid-cols-1 gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="relative flex flex-col border-b border-[#5d3827] bg-[#120c0b] shadow-[0_24px_80px_rgba(0,0,0,0.4)] lg:min-h-0 lg:border-b-0 lg:border-r">
        <div className="relative min-h-[52vh] overflow-hidden sm:min-h-[60vh] lg:min-h-0 lg:flex-1">
          {isMapReady ? (
            <DeckGL
              viewState={viewState}
              onViewStateChange={({ viewState: next }) =>
                setViewState(next as AtlasViewState)
              }
              controller
              layers={layers}
            >
              <Map mapStyle={MAP_STYLE} />
            </DeckGL>
          ) : (
            <div className="absolute inset-0 bg-[#120c0b]" aria-hidden="true" />
          )}

          <div className="absolute right-4 top-4 z-20 hidden flex-col overflow-hidden rounded-2xl border border-[#7a4a2b] bg-[#2a1812]/90 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur lg:flex">
            <button
              type="button"
              onClick={() => adjustZoom(1)}
              className="flex h-11 w-11 items-center justify-center border-b border-[#7a4a2b] text-xl font-semibold text-[#fff4df] transition hover:bg-[#3a2119]"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => adjustZoom(-1)}
              className="flex h-11 w-11 items-center justify-center text-xl font-semibold text-[#fff4df] transition hover:bg-[#3a2119]"
              aria-label="Zoom out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      <aside className="flex min-h-0 flex-col bg-[#130d0c] lg:max-h-screen">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f8d57e]">
            Running
          </p>
          <p className="mt-2 text-sm text-white/60">
            Last 12 months of miles.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8 text-sm leading-relaxed text-white/80">

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "5K PR", value: "6:42 / mi", sub: "Feb 2026" },
                { label: "Peak month", value: "104.9 mi", sub: "Mar 2026" },
                { label: "5K race", value: "~21:10", sub: "Mar 22, 2026" },
                { label: "Status", value: "Healthy", sub: "since Jan 2026" },
              ].map(({ label, value, sub }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">{label}</p>
                  <p className="mt-1 text-base font-semibold text-[#f8d57e]">{value}</p>
                  <p className="text-xs text-white/45">{sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p>
                I stopped running in late 2021. Three years went by — no injury, no reason, just stopped.
                When I picked it back up in October 2024, I didn&apos;t ease in.
              </p>
              <p>
                68 miles the first month, 43 the next. My body couldn&apos;t handle the ramp.
                By December, small muscle tears had me barely able to run. January 2025: 6 miles total.
                That was the floor.
              </p>
              <p>
                I rebuilt slowly, and by May 2025 things started clicking — 74 miles, the first real
                breakthrough month. August hit 92 miles before a bunion flare and achilles
                compensation forced another step back. Custom orthotics, eccentric heel drops,
                a podiatrist visit. The boring stuff that actually works.
              </p>
              <p>
                2026 has been different. Consistent, healthy, and actually fast. Career-best 5K in February,
                first organized race in years in March. The longest unbroken high-mileage streak since I
                started keeping records.
              </p>
              <p>
                The heatmap is where all of this happened: the Bay Trail between Foster City and San Mateo,
                the streets of San Francisco, the occasional park loop. Most of it looks the same
                from the outside — one foot in front of the other, early morning, orange glow on the bay.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                Mileage by month (2026)
              </p>
              {[
                { month: "Jan", miles: 102.9, max: 105 },
                { month: "Feb", miles: 81.1, max: 105 },
                { month: "Mar", miles: 104.9, max: 105 },
                { month: "Apr", miles: 21, max: 105, partial: true },
              ].map(({ month, miles, max, partial }) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="w-7 text-right text-xs text-white/45">{month}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#fc6419] to-[#f8d57e]"
                      style={{ width: `${(miles / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs text-white/55">
                    {miles} mi{partial ? "*" : ""}
                  </span>
                </div>
              ))}
              <p className="pt-1 text-xs text-white/30">* April in progress</p>
            </div>

            <p className="text-xs text-white/35">
              Working toward a half marathon. No target race yet — just stacking miles.
            </p>

          </div>
        </div>
      </aside>
    </section>
  );
}
