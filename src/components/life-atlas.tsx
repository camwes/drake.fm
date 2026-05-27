"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { DeckGL } from "@deck.gl/react";
import { FlyToInterpolator, type PickingInfo } from "@deck.gl/core";
import Map from "react-map-gl/maplibre";
import runningHeatmapData from "@/data/running-heatmap.json";
import { FocusCard } from "@/components/focus-card";
import type { LifeEvent } from "@/data/life-events";
import {
  SHORT_ROUTE_DISTANCE_METERS,
  SHORT_ROUTE_DURATION,
  SHORT_ROUTE_LEAD_IN_DURATION,
  mapStyleForTheme,
  EMPTY_EVENT,
  buildDirectViewState,
  buildDrivePath,
  buildRoutePulsePoints,
  buildShortRouteFollowViewState,
  buildShortRouteIntroViewState,
  buildViewState,
  clampZoom,
  haversineDistanceMeters,
  hexToRgb,
  type AtlasViewState,
  type LifeRoute,
  type RoutePulsePoint,
} from "@/lib/life-atlas-utils";
import { useTheme } from "@drake/ui";

type LifeAtlasProps = {
  events: LifeEvent[];
};

const SELECTED_ACCENT_HEX = { dark: "#f8d57e", light: "#b07429" } as const;
const ROUTE_PULSE_RGB = { dark: [248, 213, 126], light: [176, 116, 41] } as const;

export function LifeAtlas({ events }: Readonly<LifeAtlasProps>) {
  const { theme } = useTheme();
  const mapStyle = mapStyleForTheme(theme);
  const selectedAccent = SELECTED_ACCENT_HEX[theme];
  const routePulseRgb = ROUTE_PULSE_RGB[theme];
  const fallbackEvent = events.at(-1) ?? events[0] ?? EMPTY_EVENT;
  const [selectedId, setSelectedId] = useState(fallbackEvent?.id ?? "");
  const [isMapReady, setIsMapReady] = useState(false);
  const selectedEvent =
    events.find((event) => event.id === selectedId) ?? fallbackEvent;
  const selectedIndex = events.findIndex((event) => event.id === selectedEvent.id);
  const [viewState, setViewState] = useState<AtlasViewState>(() =>
    buildViewState(selectedEvent),
  );
  const [activeRoute, setActiveRoute] = useState<LifeRoute | null>(null);
  const [routeProgress, setRouteProgress] = useState(1);
  const [isHeatmapHidden, setIsHeatmapHidden] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const routeLeadInTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(
    null,
  );
  const heatmapTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
  const mapMountFrameRef = useRef<number | null>(null);

  const adjustZoom = (delta: number) => {
    setViewState((current) => ({
      ...current,
      zoom: clampZoom(current.zoom + delta),
      transitionDuration: 250,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  };

  const layers = useMemo(() => {
    const heatmap = new HeatmapLayer<[number, number]>({
      id: "running-heatmap",
      data: runningHeatmapData as [number, number][],
      getPosition: (d) => d,
      getWeight: 1,
      radiusPixels: 25,
      intensity: 1.2,
      threshold: 0.03,
      visible: heatmapVisible && !isHeatmapHidden,
      colorRange: [
        [252, 100, 25, 30],
        [252, 140, 30, 120],
        [252, 200, 50, 200],
        [255, 240, 100, 240],
      ],
    });

    const points = new ScatterplotLayer<LifeEvent>({
      id: "life-events",
      data: events,
      pickable: true,
      radiusUnits: "pixels",
      getPosition: (event) => event.coordinates,
      getRadius: (event) => (event.id === selectedEvent.id ? 16 : 11),
      getFillColor: (event) =>
        hexToRgb(event.id === selectedEvent.id ? selectedAccent : event.accent),
      getLineColor: () => [255, 248, 230, 220],
      lineWidthUnits: "pixels",
      getLineWidth: (event) => (event.id === selectedEvent.id ? 3 : 2),
      updateTriggers: {
        getRadius: [selectedEvent.id],
        getFillColor: [selectedEvent.id, selectedAccent],
        getLineWidth: [selectedEvent.id],
      },
      onClick: (info: PickingInfo<LifeEvent>) => {
        if (info.object) {
          setSelectedId(info.object.id);
          setViewState(buildViewState(info.object));
        }
      },
    });

    if (!activeRoute) {
      return [heatmap, points];
    }

    const pulsePoints = buildRoutePulsePoints(activeRoute, routeProgress);
    const marker = new ScatterplotLayer<RoutePulsePoint>({
      id: "life-path-marker",
      data: pulsePoints,
      pickable: false,
      radiusUnits: "pixels",
      getPosition: (point) => point.coordinates,
      getRadius: (point) => point.radius,
      getFillColor: (point) => [routePulseRgb[0], routePulseRgb[1], routePulseRgb[2], point.alpha],
      getLineColor: () => [255, 244, 223, 180],
      lineWidthUnits: "pixels",
      getLineWidth: 1,
      updateTriggers: {
        getPosition: [routeProgress],
        getRadius: [routeProgress],
        getFillColor: [routeProgress],
      },
    });

    return [heatmap, marker, points];
  }, [activeRoute, events, heatmapVisible, isHeatmapHidden, routeProgress, selectedAccent, routePulseRgb, selectedEvent.id]);

  useEffect(() => {
    // In Next dev, DeckGL + MapLibre can log a harmless luma.gl resize error
    // before the WebGL device fully settles. Delaying mount by one frame avoids
    // flashing during hydration, but the dev-only console noise may still appear.
    mapMountFrameRef.current = globalThis.requestAnimationFrame(() => {
      setIsMapReady(true);
      mapMountFrameRef.current = null;
    });

    return () => {
      if (mapMountFrameRef.current !== null) {
        globalThis.cancelAnimationFrame(mapMountFrameRef.current);
      }
      if (animationFrameRef.current !== null) {
        globalThis.cancelAnimationFrame(animationFrameRef.current);
      }
      if (routeLeadInTimeoutRef.current !== null) {
        globalThis.clearTimeout(routeLeadInTimeoutRef.current);
      }
      if (heatmapTimerRef.current !== null) {
        globalThis.clearTimeout(heatmapTimerRef.current);
      }
    };
  }, []);

  const hideHeatmapFor = (duration: number) => {
    if (heatmapTimerRef.current) globalThis.clearTimeout(heatmapTimerRef.current);
    setIsHeatmapHidden(true);
    heatmapTimerRef.current = globalThis.setTimeout(() => {
      setIsHeatmapHidden(false);
      heatmapTimerRef.current = null;
    }, duration + 300);
  };

  const stopRouteAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      globalThis.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (routeLeadInTimeoutRef.current !== null) {
      globalThis.clearTimeout(routeLeadInTimeoutRef.current);
      routeLeadInTimeoutRef.current = null;
    }

    setActiveRoute(null);
    setRouteProgress(1);
  }, []);

  const startRouteAnimation = useCallback(
    (route: LifeRoute, onComplete: () => void) => {
    stopRouteAnimation();

    setActiveRoute(route);
    setRouteProgress(0);

    const isShortRoute = route.distanceMeters <= SHORT_ROUTE_DISTANCE_METERS;

    const runAnimation = () => {
      let startedAt: number | null = null;

      const step = (now: number) => {
        startedAt ??= now;

        const progress = Math.min((now - startedAt) / SHORT_ROUTE_DURATION, 1);
        setRouteProgress(progress);

        if (isShortRoute) {
          setViewState(buildShortRouteFollowViewState(route, progress));
        }

        if (progress < 1) {
      animationFrameRef.current = globalThis.requestAnimationFrame(step);
          return;
        }

        animationFrameRef.current = null;
        setActiveRoute(null);
        onComplete();
      };

      animationFrameRef.current = globalThis.requestAnimationFrame(step);
    };

    if (!isShortRoute) {
      setActiveRoute(null);
      onComplete();
      return;
    }

    setViewState(buildShortRouteIntroViewState(route));
    routeLeadInTimeoutRef.current = globalThis.setTimeout(() => {
      routeLeadInTimeoutRef.current = null;
      runAnimation();
    }, SHORT_ROUTE_LEAD_IN_DURATION);
    },
    [stopRouteAnimation],
  );

  const selectEvent = useCallback(
    (event: LifeEvent) => {
      if (event.id === selectedEvent.id) {
        return;
      }

      const targetIndex = events.findIndex((item) => item.id === event.id);
      const isSpecialDriveTransition =
        selectedEvent.id === "school" && event.id === "coast";
      const shouldAnimateRoute =
        targetIndex === selectedIndex + 1 && isSpecialDriveTransition;

      if (shouldAnimateRoute) {
        const route = {
          id: `${selectedEvent.id}-${event.id}`,
          source: selectedEvent.coordinates,
          target: event.coordinates,
          sourceAccent: selectedEvent.accent,
          targetAccent: event.accent,
          distanceMeters: haversineDistanceMeters(
            selectedEvent.coordinates,
            event.coordinates,
          ),
          path: buildDrivePath(selectedEvent.id, event.id),
        };

        hideHeatmapFor(SHORT_ROUTE_LEAD_IN_DURATION + SHORT_ROUTE_DURATION + 2000);
        startRouteAnimation(route, () => {
          setViewState(buildViewState(event));
        });
      } else {
        stopRouteAnimation();
        const nextViewState = buildDirectViewState(selectedEvent, event);
        hideHeatmapFor(nextViewState.transitionDuration ?? 3000);
        setViewState(nextViewState);
      }

      setSelectedId(event.id);
    },
    [events, selectedEvent, selectedIndex, startRouteAnimation, stopRouteAnimation],
  );

  return (
    <section className="grid min-h-screen grid-cols-1 gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative flex flex-col border-b border-warm-soft bg-bg shadow-[var(--c-shadow-strong)] lg:min-h-0 lg:border-b-0 lg:border-r">
        <div className="relative min-h-[52vh] overflow-hidden sm:min-h-[60vh] lg:min-h-0 lg:flex-1">
          {isMapReady ? (
            <DeckGL
              viewState={viewState}
              onViewStateChange={({ viewState: nextViewState }) =>
                setViewState(nextViewState as AtlasViewState)
              }
              controller
              layers={layers}
              getTooltip={({ object }) =>
                object
                  ? {
                      html: `<strong>${object.title}</strong><div>${object.year} / ${object.city}</div>`,
                    }
                  : null
              }
            >
              <Map mapStyle={mapStyle} />
            </DeckGL>
          ) : (
            <div className="absolute inset-0 bg-bg" aria-hidden="true" />
          )}

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
              className="flex h-11 w-11 items-center justify-center border-b border-warm text-xl font-semibold text-fg transition hover:bg-surface-hi"
              aria-label="Zoom out"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setHeatmapVisible((v) => !v)}
              className={`flex h-11 w-11 items-center justify-center transition hover:bg-surface-hi ${heatmapVisible ? "text-accent-orange" : "text-[var(--c-muted-5)]"}`}
              aria-label="Toggle running heatmap"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
              </svg>
            </button>
          </div>

          <FocusCard
            event={selectedEvent}
            className="absolute inset-x-4 bottom-4 z-20 hidden max-w-2xl rounded-[1.75rem] border border-[var(--c-muted-3)] bg-surface/75 p-5 backdrop-blur md:inset-x-6 md:bottom-6 md:p-6 lg:block"
          />
        </div>

        <div className="border-t border-[var(--c-muted-3)] bg-surface-card px-4 py-5 lg:hidden">
          <FocusCard
            event={selectedEvent}
            className="rounded-[1.5rem] border border-[var(--c-muted-3)] bg-surface/60 p-5"
            headingClassName="text-2xl"
          />
        </div>
      </div>

      <div className="absolute right-4 top-[26vh] z-30 flex -translate-y-1/2 flex-col gap-3 sm:top-[30vh] lg:hidden">
        {events.map((event) => {
          const isSelected = event.id === selectedEvent.id;

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => selectEvent(event)}
              className={`h-4 w-4 rounded-full border-2 transition ${
                isSelected
                  ? "border-accent-warm bg-accent shadow-[0_0_20px_var(--c-accent-glow-strong)]"
                  : "border-warm bg-surface-deep/90 hover:border-accent-soft hover:bg-surface"
              }`}
              aria-label={`Select ${event.title}`}
            />
          );
        })}
      </div>

      <aside className="hidden min-h-0 flex-col bg-surface-card lg:flex lg:max-h-screen">
        <div className="border-b border-[var(--c-muted-3)] px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Timeline
          </p>
          <p className="mt-2 text-sm text-[var(--c-muted-6)]">
            Select a chapter to move the map to that place.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="relative pl-8">
            <div className="absolute bottom-0 left-[0.6875rem] top-0 w-px bg-gradient-to-b from-[color-mix(in_srgb,var(--c-accent)_70%,transparent)] via-[var(--c-border-warm)] to-transparent" />
            <div className="space-y-2">
              {events.map((event) => {
              const isSelected = event.id === selectedEvent.id;

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectEvent(event)}
                  className={`relative w-full rounded-[1.5rem] border p-4 text-left transition ${
                    isSelected
                      ? "border-accent bg-surface shadow-[0_0_0_1px_var(--c-accent-ring)]"
                      : "border-[var(--c-muted-2)] bg-[var(--c-muted-1)] hover:border-[var(--c-muted-4)] hover:bg-[var(--c-muted-2)]"
                  }`}
                >
                  <span
                    className={`absolute left-[-2rem] top-6 h-5 w-5 rounded-full border-4 ${
                      isSelected
                        ? "border-accent-warm bg-accent shadow-[0_0_20px_var(--c-accent-glow-strong)]"
                        : "border-warm-deep bg-surface-deep"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--c-muted-6)]">
                        {event.era}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-fg">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-sm font-medium text-fg-warm">{event.city}</p>
                    </div>
                    <span className="rounded-full border border-[var(--c-muted-3)] px-3 py-1 text-xs text-[var(--c-muted-6)]">
                      {event.year}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--c-muted-9)]">{event.summary}</p>
                </button>
              );
              })}
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
