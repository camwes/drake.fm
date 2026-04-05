"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArcLayer, ScatterplotLayer } from "@deck.gl/layers";
import { DeckGL } from "@deck.gl/react";
import { FlyToInterpolator, type PickingInfo } from "@deck.gl/core";
import Map from "react-map-gl/maplibre";
import type { LifeEvent } from "@/data/life-events";

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3.35,
  pitch: 28,
  bearing: -10,
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

type LifeAtlasProps = {
  events: LifeEvent[];
};

type LifeRoute = {
  id: string;
  source: [number, number];
  target: [number, number];
  sourceAccent: string;
  targetAccent: string;
};

type RoutePulsePoint = {
  id: string;
  coordinates: [number, number, number];
  radius: number;
  alpha: number;
};

type AtlasViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
  transitionInterpolator?: FlyToInterpolator;
};

const NAVIGATION_DURATION = 3200;
const ROUTE_HEIGHT_MULTIPLIER = 0.12;
const ROUTE_PULSE_ALTITUDE_OFFSET = 12000;

export function LifeAtlas({ events }: LifeAtlasProps) {
  const [selectedId, setSelectedId] = useState(events[events.length - 1]?.id ?? "");
  const selectedEvent =
    events.find((event) => event.id === selectedId) ?? events[events.length - 1];
  const selectedIndex = events.findIndex((event) => event.id === selectedEvent.id);
  const [viewState, setViewState] = useState<AtlasViewState>(() =>
    buildViewState(selectedEvent),
  );
  const [activeRoute, setActiveRoute] = useState<LifeRoute | null>(null);
  const [routeProgress, setRouteProgress] = useState(1);
  const animationFrameRef = useRef<number | null>(null);

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

    const route = new ArcLayer<LifeRoute>({
      id: "life-path",
      data: [activeRoute],
      getSourcePosition: (segment) => segment.source,
      getTargetPosition: (segment) => segment.target,
      getHeight: () => ROUTE_HEIGHT_MULTIPLIER,
      getSourceColor: (segment) => hexToRgb(segment.sourceAccent, 24),
      getTargetColor: (segment) => hexToRgb(segment.targetAccent, 90),
      getWidth: 3,
    });

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

    return [route, marker, points];
  }, [activeRoute, events, routeProgress, selectedEvent.id]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const stopRouteAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setActiveRoute(null);
    setRouteProgress(1);
  }, []);

  const startRouteAnimation = useCallback(
    (route: LifeRoute, onComplete: () => void) => {
    stopRouteAnimation();

    setActiveRoute(route);
    setRouteProgress(0);

    let startedAt: number | null = null;

    const step = (now: number) => {
      if (startedAt === null) {
        startedAt = now;
      }

      const progress = Math.min((now - startedAt) / NAVIGATION_DURATION, 1);
      setRouteProgress(progress);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      animationFrameRef.current = null;
      setActiveRoute(null);
      onComplete();
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
    },
    [stopRouteAnimation],
  );

  const selectEvent = useCallback(
    (event: LifeEvent) => {
      if (event.id === selectedEvent.id) {
        return;
      }

      const targetIndex = events.findIndex((item) => item.id === event.id);
      const shouldAnimateRoute = targetIndex === selectedIndex + 1;

      if (shouldAnimateRoute) {
        const route = {
          id: `${selectedEvent.id}-${event.id}`,
          source: selectedEvent.coordinates,
          target: event.coordinates,
          sourceAccent: selectedEvent.accent,
          targetAccent: event.accent,
        };

        setViewState(buildRouteViewState(route));
        startRouteAnimation(route, () => {
          setViewState(buildViewState(event));
        });
      } else {
        stopRouteAnimation();
        setViewState(buildViewState(event));
      }

      setSelectedId(event.id);
    },
    [events, selectedEvent, selectedIndex, startRouteAnimation, stopRouteAnimation],
  );

  return (
    <section className="grid h-full grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative min-h-[55vh] overflow-hidden border-b border-[#5d3827] bg-[#120c0b] shadow-[0_24px_80px_rgba(0,0,0,0.4)] lg:min-h-0 lg:border-b-0 lg:border-r">
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

        <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-2xl border border-[#7a4a2b] bg-[#2a1812]/90 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur">
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

        <div className="absolute inset-x-4 bottom-4 z-20 max-w-2xl rounded-[1.75rem] border border-white/10 bg-black/45 p-5 backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#f8d57e]">
                Current focus
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                {selectedEvent.title}
              </h2>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#f0b77f]">
                {selectedEvent.year} / {selectedEvent.city}
              </p>
            </div>
            <div
              className="mt-1 h-4 w-4 rounded-full border border-white/70 shadow-[0_0_24px_rgba(248,213,126,0.45)]"
              style={{ backgroundColor: selectedEvent.accent }}
            />
          </div>
          <p className="mt-4 select-text text-sm leading-6 text-[#f5d4b5]">
            {selectedEvent.summary}
          </p>
          <p className="mt-3 select-text text-sm leading-7 text-white/78">
            {selectedEvent.detail}
          </p>
        </div>
      </div>

      <aside className="flex min-h-0 flex-col bg-[#130d0c]">
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

function buildViewState(event: LifeEvent): AtlasViewState {
  return {
    ...INITIAL_VIEW_STATE,
    longitude: event.coordinates[0],
    latitude: event.coordinates[1],
    zoom: 8,
    pitch: 34,
    transitionDuration: 1800,
    transitionInterpolator: new FlyToInterpolator(),
  };
}

function buildRouteViewState(route: LifeRoute): AtlasViewState {
  const longitudeSpan = Math.abs(route.target[0] - route.source[0]);
  const latitudeSpan = Math.abs(route.target[1] - route.source[1]);
  const span = Math.max(longitudeSpan, latitudeSpan);

  return {
    ...INITIAL_VIEW_STATE,
    longitude: (route.source[0] + route.target[0]) / 2,
    latitude: (route.source[1] + route.target[1]) / 2,
    zoom: getRouteZoom(span),
    pitch: 42,
    bearing: clampBearing(getRouteBearing(route.source, route.target)),
    transitionDuration: 1200,
    transitionInterpolator: new FlyToInterpolator(),
  };
}

function hexToRgb(hex: string, alpha = 255): [number, number, number, number] {
  const normalized = hex.replace("#", "");
  const numeric = Number.parseInt(normalized, 16);

  return [(numeric >> 16) & 255, (numeric >> 8) & 255, numeric & 255, alpha];
}

function clampZoom(zoom: number): number {
  return Math.max(1.5, Math.min(16, zoom));
}

function interpolateCoordinates(
  source: [number, number],
  target: [number, number],
  progress: number,
): [number, number] {
  return [
    source[0] + (target[0] - source[0]) * progress,
    source[1] + (target[1] - source[1]) * progress,
  ];
}

function buildRoutePulsePoints(
  route: LifeRoute,
  progress: number,
): RoutePulsePoint[] {
  return [createPulsePoint(route, progress, "head")];
}

function createPulsePoint(
  route: LifeRoute,
  progress: number,
  idSuffix: string,
): RoutePulsePoint {
  return {
    id: `${route.id}-${idSuffix}`,
    coordinates: interpolateArcCoordinates(route.source, route.target, progress),
    radius: 6,
    alpha: 215,
  };
}

function interpolateArcCoordinates(
  source: [number, number],
  target: [number, number],
  progress: number,
): [number, number, number] {
  const [longitude, latitude] = interpolateCoordinates(source, target, progress);
  const arcHeight =
    getArcHeightMeters(source, target, progress) + ROUTE_PULSE_ALTITUDE_OFFSET;

  return [longitude, latitude, arcHeight];
}

function getArcHeightMeters(
  source: [number, number],
  target: [number, number],
  progress: number,
): number {
  const distance = haversineDistanceMeters(source, target);
  return Math.sqrt(progress * (1 - progress)) * distance * ROUTE_HEIGHT_MULTIPLIER;
}

function haversineDistanceMeters(
  source: [number, number],
  target: [number, number],
): number {
  const earthRadius = 6371000;
  const sourceLatitude = toRadians(source[1]);
  const targetLatitude = toRadians(target[1]);
  const deltaLatitude = toRadians(target[1] - source[1]);
  const deltaLongitude = toRadians(target[0] - source[0]);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(sourceLatitude) *
      Math.cos(targetLatitude) *
      Math.sin(deltaLongitude / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function getRouteZoom(span: number): number {
  if (span > 28) {
    return 3.3;
  }
  if (span > 18) {
    return 4.1;
  }
  if (span > 10) {
    return 4.8;
  }
  if (span > 5) {
    return 5.6;
  }
  return 6.6;
}

function getRouteBearing(
  source: [number, number],
  target: [number, number],
): number {
  return (Math.atan2(target[0] - source[0], target[1] - source[1]) * 180) / Math.PI;
}

function clampBearing(bearing: number): number {
  return Math.max(-35, Math.min(35, bearing));
}
