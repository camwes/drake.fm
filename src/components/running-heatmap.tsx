"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { DeckGL } from "@deck.gl/react";
import { FlyToInterpolator } from "@deck.gl/core";
import Map from "react-map-gl/maplibre";
import ReactMarkdown from "react-markdown";
import runningHeatmap from "@/data/running-heatmap-1yr.json";
import upcomingRaces from "@/data/race-calendar.json";
import runningStats from "@/data/running-stats.json";
import { PickCard } from "@/components/pick-card";
import { mapStyleForTheme, clampZoom, type AtlasViewState } from "@/lib/life-atlas-utils";
import { colorFromDifficultyScore } from "@/lib/salon-map";
import { getRoutePickGroups } from "@/lib/salon";
import { useTheme } from "@drake/ui";

type Area = {
  id: string;
  label: string;
  center: [number, number];
  zoom: number;
  bounds: [[number, number], [number, number]];
  runCount: number;
  points: [number, number][];
};

const AREAS = (runningHeatmap as { areas: Area[] }).areas;

function areaView(area: Area): AtlasViewState {
  return {
    longitude: area.center[0],
    latitude: area.center[1],
    zoom: area.zoom,
    pitch: 0,
    bearing: 0,
  };
}

const INITIAL_AREA_ID = AREAS[0]?.id ?? "";
const INITIAL_VIEW: AtlasViewState = AREAS[0]
  ? areaView(AREAS[0])
  : { longitude: -122.4845, latitude: 37.7694, zoom: 13.5, pitch: 0, bearing: 0 };

type LatestRace = { name: string; time: string; sub: string; url: string };

const LATEST_RACE = (runningStats as { latestRace?: LatestRace | null }).latestRace ?? null;

const STRAVA_PROFILE_URL = "https://www.strava.com/athletes/4689756";

const ROUTE_GROUPS = getRoutePickGroups();

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Format "2026-07-26" -> "Jul 26, 2026" without timezone drift.
function formatRaceDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

export function RunningHeatmap({ prose }: { prose: string }) {
  const { theme } = useTheme();
  const mapStyle = mapStyleForTheme(theme);
  const [viewState, setViewState] = useState<AtlasViewState>(INITIAL_VIEW);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeAreaId, setActiveAreaId] = useState<string>(INITIAL_AREA_ID);
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

  const flyTo = (area: Area) => {
    setActiveAreaId(area.id);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setIsTransitioning(true);
    setViewState({
      ...areaView(area),
      transitionDuration: 1600,
      transitionInterpolator: new FlyToInterpolator(),
    });
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, 1800);
  };

  const activePoints = useMemo(
    () => AREAS.find((a) => a.id === activeAreaId)?.points ?? [],
    [activeAreaId],
  );

  const layers = useMemo(
    () => [
      new HeatmapLayer<[number, number]>({
        id: "running-heatmap",
        data: activePoints,
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
    [isTransitioning, activePoints],
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

          {/* Area toggle */}
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 max-w-[calc(100%-2rem)]">
            <div className="flex flex-wrap justify-center overflow-hidden rounded-2xl border border-warm bg-surface/90 shadow-[var(--c-shadow-soft)] backdrop-blur">
              {AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => flyTo(area)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide transition ${
                    activeAreaId === area.id
                      ? "bg-accent-orange text-fg"
                      : "text-[var(--c-muted-9)] hover:bg-surface-hi hover:text-fg"
                  }`}
                >
                  {area.label}
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
              {runningStats.stats.map((stat) => {
                const cardClass =
                  "rounded-2xl border border-[var(--c-muted-2)] bg-[var(--c-muted-1)] px-4 py-3";
                const inner = (
                  <>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--c-muted-5)]">{stat.label}</p>
                    <p className="mt-1 text-base font-semibold text-accent">{stat.value}</p>
                    <p className="text-xs text-[var(--c-muted-6)]">{stat.sub}</p>
                  </>
                );
                return stat.url ? (
                  <a
                    key={stat.label}
                    href={stat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cardClass} block transition hover:border-accent hover:bg-[var(--c-muted-2)]`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={stat.label} className={cardClass}>
                    {inner}
                  </div>
                );
              })}
            </div>

            {LATEST_RACE && (
              <a
                href={LATEST_RACE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--c-muted-2)] bg-[var(--c-muted-1)] px-4 py-3 transition hover:border-accent hover:bg-[var(--c-muted-2)]"
              >
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--c-muted-5)]">Latest race</p>
                  <p className="mt-1 truncate text-base font-semibold text-fg">{LATEST_RACE.name}</p>
                  <p className="text-xs text-[var(--c-muted-6)]">{LATEST_RACE.sub}</p>
                </div>
                <p className="shrink-0 text-lg font-semibold text-accent">{LATEST_RACE.time}</p>
              </a>
            )}

            {upcomingRaces.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--c-muted-5)]">
                  Upcoming races
                </p>
                <div className="space-y-2">
                  {upcomingRaces.map((race) => (
                    <div
                      key={race.name}
                      className="rounded-2xl border border-[var(--c-muted-2)] bg-[var(--c-muted-1)] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-fg">{race.name}</p>
                      <p className="mt-1 text-xs text-[var(--c-muted-6)]">
                        {formatRaceDate(race.date)} · {race.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 text-sm leading-relaxed text-[var(--c-muted-9)] [&>p]:mb-0">
              <ReactMarkdown>{prose}</ReactMarkdown>
            </div>

            {ROUTE_GROUPS.length > 0 ? (
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--c-muted-5)]">
                  Favorite routes
                </p>
                {ROUTE_GROUPS.map((group) => (
                  <div key={group.collectionId} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--c-muted-5)]">
                      {group.areaLabel ?? group.title}
                    </p>
                    <div className="space-y-3">
                      {group.picks.map((pick) => (
                        <PickCard
                          key={pick.id}
                          pick={pick}
                          color={colorFromDifficultyScore(pick.route.difficultyScore ?? 0.5)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <a
              href={STRAVA_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FC4C02] px-4 py-3 text-sm font-semibold text-white shadow-[var(--c-shadow-soft)] transition hover:brightness-110"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
              >
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              Follow on Strava
            </a>

          </div>
        </div>
      </aside>
    </section>
  );
}
