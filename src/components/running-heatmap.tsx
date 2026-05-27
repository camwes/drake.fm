"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { DeckGL } from "@deck.gl/react";
import { FlyToInterpolator } from "@deck.gl/core";
import Map from "react-map-gl/maplibre";
import ReactMarkdown from "react-markdown";
import runningHeatmapData from "@/data/running-heatmap-1yr.json";
import { mapStyleForTheme, clampZoom, type AtlasViewState } from "@/lib/life-atlas-utils";
import { useTheme } from "@drake/ui";

type Location = "sf" | "foster-city";

const LOCATIONS: Record<Location, { label: string; view: AtlasViewState }> = {
  sf: {
    label: "San Francisco",
    view: {
      longitude: -122.4845,
      latitude: 37.7694,
      zoom: 13.5,
      pitch: 0,
      bearing: 0,
    },
  },
  "foster-city": {
    label: "Foster City",
    view: {
      longitude: -122.2677,
      latitude: 37.563,
      zoom: 13.5,
      pitch: 0,
      bearing: 0,
    },
  },
};

const INITIAL_VIEW: AtlasViewState = LOCATIONS.sf.view;

const STATS = [
  { label: "5K PR", value: "6:42 / mi", sub: "Feb 2026" },
  { label: "Peak month", value: "104.9 mi", sub: "Mar 2026" },
  { label: "5K race", value: "~21:10", sub: "Mar 22, 2026" },
  { label: "Status", value: "Healthy", sub: "since Jan 2026" },
];

const MONTHLY = [
  { month: "Jan", miles: 102.9, max: 105 },
  { month: "Feb", miles: 81.1, max: 105 },
  { month: "Mar", miles: 104.9, max: 105 },
  { month: "Apr", miles: 21, max: 105, partial: true },
];

export function RunningHeatmap({ prose }: { prose: string }) {
  const { theme } = useTheme();
  const mapStyle = mapStyleForTheme(theme);
  const [viewState, setViewState] = useState<AtlasViewState>(INITIAL_VIEW);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeLocation, setActiveLocation] = useState<Location>("sf");
  const [isMapReady, setIsMapReady] = useState(false);
  const mapMountFrameRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mapMountFrameRef.current = requestAnimationFrame(() => {
      setIsMapReady(true);
    });
    return () => {
      if (mapMountFrameRef.current !== null) cancelAnimationFrame(mapMountFrameRef.current);
      if (transitionTimerRef.current !== null) clearTimeout(transitionTimerRef.current);
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

  const flyTo = (location: Location) => {
    setActiveLocation(location);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setIsTransitioning(true);
    setViewState({
      ...LOCATIONS[location].view,
      transitionDuration: 1600,
      transitionInterpolator: new FlyToInterpolator(),
    });
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, 1800);
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
        visible: !isTransitioning,
        colorRange: [
          [252, 100, 25, 30],
          [252, 140, 30, 120],
          [252, 200, 50, 200],
          [255, 240, 100, 240],
        ],
      }),
    ],
    [isTransitioning],
  );

  return (
    <section className="grid min-h-screen grid-cols-1 gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="relative flex flex-col border-b border-warm-soft bg-bg shadow-[var(--c-shadow-strong)] lg:min-h-0 lg:border-b-0 lg:border-r">
        <div className="relative min-h-[52vh] overflow-hidden sm:min-h-[60vh] lg:min-h-0 lg:flex-1">
          {isMapReady ? (
            <DeckGL
              viewState={viewState}
              onViewStateChange={({ viewState: next }) => {
                setViewState(next as AtlasViewState);
              }}
              controller
              layers={layers}
            >
              <Map mapStyle={mapStyle} />
            </DeckGL>
          ) : (
            <div className="absolute inset-0 bg-bg" aria-hidden="true" />
          )}

          {/* Location toggle */}
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
            <div className="flex overflow-hidden rounded-2xl border border-warm bg-surface/90 shadow-[var(--c-shadow-soft)] backdrop-blur">
              {(Object.keys(LOCATIONS) as Location[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => flyTo(loc)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide transition ${
                    activeLocation === loc
                      ? "bg-accent-orange text-fg"
                      : "text-[var(--c-muted-9)] hover:bg-surface-hi hover:text-fg"
                  }`}
                >
                  {LOCATIONS[loc].label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute right-4 top-4 z-20 hidden flex-col overflow-hidden rounded-2xl border border-warm bg-surface/90 shadow-[var(--c-shadow-soft)] backdrop-blur lg:flex">
            <button
              type="button"
              onClick={() => adjustZoom(1)}
              className="flex h-11 w-11 items-center justify-center border-b border-warm text-xl font-semibold text-fg transition hover:bg-surface-hi"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => adjustZoom(-1)}
              className="flex h-11 w-11 items-center justify-center text-xl font-semibold text-fg transition hover:bg-surface-hi"
              aria-label="Zoom out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      <aside className="flex min-h-0 flex-col bg-surface-card lg:max-h-screen">
        <div className="border-b border-[var(--c-muted-3)] px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Running
          </p>
          <p className="mt-2 text-sm text-[var(--c-muted-6)]">Last 12 months of miles.</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8 text-sm leading-relaxed text-[var(--c-muted-9)]">

            <div className="grid grid-cols-2 gap-3">
              {STATS.map(({ label, value, sub }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[var(--c-muted-2)] bg-[var(--c-muted-1)] px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--c-muted-5)]">{label}</p>
                  <p className="mt-1 text-base font-semibold text-accent">{value}</p>
                  <p className="text-xs text-[var(--c-muted-6)]">{sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-[var(--c-muted-9)] [&>p]:mb-0">
              <ReactMarkdown>{prose}</ReactMarkdown>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--c-muted-5)]">
                Mileage by month (2026)
              </p>
              {MONTHLY.map(({ month, miles, max, partial }) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="w-7 text-right text-xs text-[var(--c-muted-6)]">{month}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-[var(--c-muted-2)]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--c-accent-orange)] to-[var(--c-accent)]"
                      style={{ width: `${(miles / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs text-[var(--c-muted-7)]">
                    {miles} mi{partial ? "*" : ""}
                  </span>
                </div>
              ))}
              <p className="pt-1 text-xs text-[var(--c-muted-5)]">* April in progress</p>
            </div>

          </div>
        </div>
      </aside>
    </section>
  );
}
