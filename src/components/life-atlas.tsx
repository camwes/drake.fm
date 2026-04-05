"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { DeckGL } from "@deck.gl/react";
import { FlyToInterpolator, type PickingInfo } from "@deck.gl/core";
import Map from "react-map-gl/maplibre";
import { FocusCard } from "@/components/focus-card";
import type { LifeEvent } from "@/data/life-events";
import {
  SHORT_ROUTE_DISTANCE_METERS,
  SHORT_ROUTE_DURATION,
  SHORT_ROUTE_LEAD_IN_DURATION,
  MAP_STYLE,
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

type LifeAtlasProps = {
  events: LifeEvent[];
};

export function LifeAtlas({ events }: Readonly<LifeAtlasProps>) {
  const fallbackEvent = events[events.length - 1] ?? events[0] ?? EMPTY_EVENT;
  const [selectedId, setSelectedId] = useState(fallbackEvent?.id ?? "");
  const selectedEvent =
    events.find((event) => event.id === selectedId) ?? fallbackEvent;
  const selectedIndex = events.findIndex((event) => event.id === selectedEvent.id);
  const [viewState, setViewState] = useState<AtlasViewState>(() =>
    buildViewState(selectedEvent),
  );
  const [activeRoute, setActiveRoute] = useState<LifeRoute | null>(null);
  const [routeProgress, setRouteProgress] = useState(1);
  const animationFrameRef = useRef<number | null>(null);
  const routeLeadInTimeoutRef = useRef<number | null>(null);

  const adjustZoom = (delta: number) => {
    setViewState((current) => ({
      ...current,
      zoom: clampZoom(current.zoom + delta),
      transitionDuration: 250,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  };

  const layers = useMemo(() => {
    const points = new ScatterplotLayer<LifeEvent>({
      id: "life-events",
      data: events,
      pickable: true,
      radiusUnits: "pixels",
      getPosition: (event) => event.coordinates,
      getRadius: (event) => (event.id === selectedEvent.id ? 16 : 11),
      getFillColor: (event) =>
        hexToRgb(event.id === selectedEvent.id ? "#f8d57e" : event.accent),
      getLineColor: () => [255, 248, 230, 220],
      lineWidthUnits: "pixels",
      getLineWidth: (event) => (event.id === selectedEvent.id ? 3 : 2),
      updateTriggers: {
        getRadius: [selectedEvent.id],
        getFillColor: [selectedEvent.id],
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
      return [points];
    }

    const pulsePoints = buildRoutePulsePoints(activeRoute, routeProgress);
    const marker = new ScatterplotLayer<RoutePulsePoint>({
      id: "life-path-marker",
      data: pulsePoints,
      pickable: false,
      radiusUnits: "pixels",
      getPosition: (point) => point.coordinates,
      getRadius: (point) => point.radius,
      getFillColor: (point) => [248, 213, 126, point.alpha],
      getLineColor: () => [255, 244, 223, 180],
      lineWidthUnits: "pixels",
      getLineWidth: 1,
      updateTriggers: {
        getPosition: [routeProgress],
        getRadius: [routeProgress],
        getFillColor: [routeProgress],
      },
    });

    return [marker, points];
  }, [activeRoute, events, routeProgress, selectedEvent.id]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        globalThis.cancelAnimationFrame(animationFrameRef.current);
      }
      if (routeLeadInTimeoutRef.current !== null) {
        globalThis.clearTimeout(routeLeadInTimeoutRef.current);
      }
    };
  }, []);

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

        startRouteAnimation(route, () => {
          setViewState(buildViewState(event));
        });
      } else {
        stopRouteAnimation();
        setViewState(buildDirectViewState(selectedEvent, event));
      }

      setSelectedId(event.id);
    },
    [events, selectedEvent, selectedIndex, startRouteAnimation, stopRouteAnimation],
  );

  return (
    <section className="grid min-h-screen grid-cols-1 gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative flex flex-col border-b border-[#5d3827] bg-[#120c0b] shadow-[0_24px_80px_rgba(0,0,0,0.4)] lg:min-h-0 lg:border-b-0 lg:border-r">
        <div className="relative min-h-[52vh] overflow-hidden sm:min-h-[60vh] lg:min-h-0 lg:flex-1">
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
            <Map mapStyle={MAP_STYLE} />
          </DeckGL>

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

          <FocusCard
            event={selectedEvent}
            className="absolute inset-x-4 bottom-4 z-20 hidden max-w-2xl rounded-[1.75rem] border border-white/10 bg-black/45 p-5 backdrop-blur md:inset-x-6 md:bottom-6 md:p-6 lg:block"
          />
        </div>

        <div className="border-t border-white/10 bg-[#130d0c] px-4 py-5 lg:hidden">
          <FocusCard
            event={selectedEvent}
            className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5"
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
                  ? "border-[#f6cb79] bg-[#f8d57e] shadow-[0_0_20px_rgba(248,213,126,0.55)]"
                  : "border-[#7a4a2b] bg-[#1a100d]/90 hover:border-[#f0b77f] hover:bg-[#2a1812]"
              }`}
              aria-label={`Select ${event.title}`}
            />
          );
        })}
      </div>

      <aside className="hidden min-h-0 flex-col bg-[#130d0c] lg:flex lg:max-h-screen">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f8d57e]">
            Timeline
          </p>
          <p className="mt-2 text-sm text-white/60">
            Select a chapter to move the map to that place.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="relative pl-8">
            <div className="absolute bottom-0 left-[0.6875rem] top-0 w-px bg-gradient-to-b from-[#f8d57e]/70 via-[#7a4a2b] to-transparent" />
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
                      ? "border-[#f8d57e] bg-[#2a1812] shadow-[0_0_0_1px_rgba(248,213,126,0.35)]"
                      : "border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <span
                    className={`absolute left-[-2rem] top-6 h-5 w-5 rounded-full border-4 ${
                      isSelected
                        ? "border-[#f6cb79] bg-[#f8d57e] shadow-[0_0_20px_rgba(248,213,126,0.55)]"
                        : "border-[#3b241c] bg-[#1a100d]"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                        {event.era}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-sm font-medium text-[#f5d4b5]">{event.city}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      {event.year}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">{event.summary}</p>
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
