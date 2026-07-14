"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Map, { Layer, Source } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import { mapStyleForTheme } from "@/lib/life-atlas-utils";
import {
  collectionView,
  collectionBounds,
  colorFromDifficultyScore,
  difficultySpectrumGradient,
  DIFFICULTY_LABELS,
  DIFFICULTY_ORDER,
} from "@/lib/salon-map";
import { type Collection, type Pick, type RouteDifficulty } from "@/lib/salon";
import { useTheme } from "@drake/ui";
import { PickCard } from "@/components/pick-card";

function routeLineColor(pick: Pick): string {
  const score = pick.route.difficultyScore ?? 0.5;
  return colorFromDifficultyScore(score);
}

function DifficultyLegend({ tiers }: { tiers: RouteDifficulty[] }) {
  if (tiers.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      <div
        className="h-2 w-full max-w-xs rounded-full"
        style={{ background: difficultySpectrumGradient() }}
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-center gap-4 text-xs text-fg-soft">
        {tiers.map((tier) => (
          <span key={tier}>{DIFFICULTY_LABELS[tier]}</span>
        ))}
      </div>
    </div>
  );
}

export function SalonCollection({ collection }: { collection: Collection }) {
  const { theme } = useTheme();
  const mapStyle = mapStyleForTheme(theme);
  const [isMapReady, setIsMapReady] = useState(false);
  const mountFrameRef = useRef<number | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  const view = collection.area ? collectionView(collection.area) : null;
  const bounds = collectionBounds(collection);
  const routePicks = collection.picks.filter((p) => p.route.path && p.route.path.length > 0);

  const legendTiers = useMemo(() => {
    const present = new Set(
      routePicks.map((p) => p.route.difficultyTier ?? "moderate"),
    );
    return DIFFICULTY_ORDER.filter((tier) => present.has(tier));
  }, [routePicks]);

  useEffect(() => {
    mountFrameRef.current = requestAnimationFrame(() => setIsMapReady(true));
    return () => {
      if (mountFrameRef.current !== null) cancelAnimationFrame(mountFrameRef.current);
    };
  }, []);

  const fitToRoutes = () => {
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 48, duration: 0 });
    }
  };

  return (
    <main className="min-h-screen bg-bg px-6 pb-16 pt-28 text-fg lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/salon"
          className="inline-flex rounded-full border border-warm bg-surface px-4 py-2 text-xs uppercase tracking-[0.24em] text-fg-cream transition hover:bg-surface-hi"
        >
          Back to salon
        </Link>

        <header className="mt-8 border-b border-[var(--c-muted-3)] pb-8">
          {collection.area ? (
            <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">
              {collection.area.label}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-fg sm:text-5xl">
            {collection.title}
          </h1>
          {collection.description ? (
            <p className="mt-5 text-lg leading-8 text-fg-soft">{collection.description}</p>
          ) : null}
        </header>

        {view ? (
          <div className="mt-8">
            <div className="h-72 overflow-hidden rounded-2xl border border-warm-soft shadow-[var(--c-shadow-soft)]">
              {isMapReady ? (
                <Map
                  ref={mapRef}
                  initialViewState={view}
                  mapStyle={mapStyle}
                  interactive={false}
                  onLoad={fitToRoutes}
                  style={{ width: "100%", height: "100%" }}
                >
                  {routePicks.map((pick) => (
                    <Source
                      key={pick.id}
                      id={`route-${pick.id}`}
                      type="geojson"
                      data={{
                        type: "Feature",
                        properties: {},
                        geometry: { type: "LineString", coordinates: pick.route.path! },
                      }}
                    >
                      <Layer
                        id={`route-line-${pick.id}`}
                        type="line"
                        layout={{ "line-join": "round", "line-cap": "round" }}
                        paint={{
                          "line-color": routeLineColor(pick),
                          "line-width": 4,
                          "line-opacity": 0.9,
                        }}
                      />
                    </Source>
                  ))}
                </Map>
              ) : (
                <div className="h-full w-full bg-bg" aria-hidden="true" />
              )}
            </div>
            <DifficultyLegend tiers={legendTiers} />
          </div>
        ) : null}

        {collection.picks.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {collection.picks.map((pick) => (
              <PickCard
                key={pick.id}
                pick={pick}
                color={
                  pick.route.path && pick.route.path.length > 0
                    ? routeLineColor(pick)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm italic text-[var(--c-muted-5)]">
            No picks here yet.
          </p>
        )}
      </div>
    </main>
  );
}
