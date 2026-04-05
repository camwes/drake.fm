import { FlyToInterpolator } from "@deck.gl/core";
import type { LifeEvent } from "@/data/life-events";

export type LifeRoute = {
  id: string;
  source: [number, number];
  target: [number, number];
  sourceAccent: string;
  targetAccent: string;
  distanceMeters: number;
  path?: [number, number][];
};

export type RoutePulsePoint = {
  id: string;
  coordinates: [number, number, number];
  radius: number;
  alpha: number;
};

export type AtlasViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
  transitionInterpolator?: FlyToInterpolator;
};

export const INITIAL_VIEW_STATE: AtlasViewState = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3.35,
  pitch: 28,
  bearing: -10,
};

export const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const HIGHWAY_101_PATH: [number, number][] = [
  [-122.1699, 37.4305],
  [-122.1835, 37.4428],
  [-122.1986, 37.4564],
  [-122.2147, 37.4702],
  [-122.2364, 37.4852],
  [-122.2572, 37.5036],
  [-122.2785, 37.5228],
  [-122.3014, 37.5438],
  [-122.3255, 37.5630],
  [-122.3378, 37.5704],
  [-122.3514, 37.5776],
  [-122.3656, 37.5841],
  [-122.3796, 37.5978],
  [-122.3938, 37.6135],
  [-122.4111, 37.6305],
  [-122.4082, 37.6463],
  [-122.4041, 37.6620],
  [-122.4000, 37.6756],
  [-122.3959, 37.6879],
  [-122.4009, 37.7076],
  [-122.4065, 37.7261],
  [-122.4113, 37.7428],
  [-122.4156, 37.7589],
  [-122.4194, 37.7749],
];

export const SHORT_ROUTE_DURATION = 3200;
export const SHORT_ROUTE_DISTANCE_METERS = 90000;
export const SHORT_ROUTE_LEAD_IN_DURATION = 450;
const DIRECT_TRANSITION_MIN_DURATION = 2200;
const DIRECT_TRANSITION_MAX_DURATION = 5200;

export const EMPTY_EVENT: LifeEvent = {
  id: "empty",
  year: "",
  title: "",
  city: "",
  coordinates: [0, 0],
  era: "",
  summary: "",
  detail: "",
  accent: "#f8d57e",
};

export function buildViewState(event: LifeEvent): AtlasViewState {
  return {
    ...INITIAL_VIEW_STATE,
    longitude: event.coordinates[0],
    latitude: event.coordinates[1],
    zoom: event.zoom ?? 12,
    pitch: 30,
    bearing: 0,
    transitionDuration: 1800,
    transitionInterpolator: new FlyToInterpolator(),
  };
}

export function buildDirectViewState(
  sourceEvent: LifeEvent,
  targetEvent: LifeEvent,
): AtlasViewState {
  const distanceMeters = haversineDistanceMeters(
    sourceEvent.coordinates,
    targetEvent.coordinates,
  );

  return {
    ...buildViewState(targetEvent),
    transitionDuration: getDirectTransitionDuration(distanceMeters),
  };
}

export function buildShortRouteFollowViewState(
  route: LifeRoute,
  progress: number,
): AtlasViewState {
  const path = route.path ?? [route.source, route.target];
  const [longitude, latitude] = interpolatePathCoordinates(path, progress);
  const span = Math.max(
    Math.abs(route.target[0] - route.source[0]),
    Math.abs(route.target[1] - route.source[1]),
  );

  return {
    ...INITIAL_VIEW_STATE,
    longitude,
    latitude,
    zoom: getShortRouteZoom(span),
    pitch: 12,
    bearing: clampBearing(getRouteBearing(route.source, route.target)),
  };
}

export function buildShortRouteIntroViewState(route: LifeRoute): AtlasViewState {
  const path = route.path ?? [route.source, route.target];
  const startPoint = path[0] ?? route.source;
  const span = Math.max(
    Math.abs(route.target[0] - route.source[0]),
    Math.abs(route.target[1] - route.source[1]),
  );

  return {
    ...INITIAL_VIEW_STATE,
    longitude: startPoint[0],
    latitude: startPoint[1],
    zoom: getShortRouteZoom(span),
    pitch: 12,
    bearing: clampBearing(getRouteBearing(route.source, route.target)),
    transitionDuration: SHORT_ROUTE_LEAD_IN_DURATION,
    transitionInterpolator: new FlyToInterpolator(),
  };
}

export function hexToRgb(
  hex: string,
  alpha = 255,
): [number, number, number, number] {
  const normalized = hex.replace("#", "");
  const numeric = Number.parseInt(normalized, 16);

  return [(numeric >> 16) & 255, (numeric >> 8) & 255, numeric & 255, alpha];
}

export function clampZoom(zoom: number): number {
  return Math.max(1.5, Math.min(16, zoom));
}

export function interpolateCoordinates(
  source: [number, number],
  target: [number, number],
  progress: number,
): [number, number] {
  return [
    source[0] + (target[0] - source[0]) * progress,
    source[1] + (target[1] - source[1]) * progress,
  ];
}

export function buildRoutePulsePoints(
  route: LifeRoute,
  progress: number,
): RoutePulsePoint[] {
  return [
    {
      id: `${route.id}-head`,
      coordinates: interpolatePathCoordinates(
        route.path ?? [route.source, route.target],
        progress,
      ),
      radius: 6,
      alpha: 215,
    },
  ];
}

export function interpolatePathCoordinates(
  path: [number, number][],
  progress: number,
): [number, number, number] {
  if (path.length === 0) {
    return [0, 0, 0];
  }

  if (path.length === 1) {
    return [path[0][0], path[0][1], 0];
  }

  const segmentLengths = path.slice(1).map((point, index) =>
    haversineDistanceMeters(path[index], point),
  );
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);

  if (totalLength === 0) {
    return [path[0][0], path[0][1], 0];
  }

  let remainingDistance = totalLength * progress;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const segmentLength = segmentLengths[index];

    if (remainingDistance <= segmentLength) {
      const segmentProgress = segmentLength === 0 ? 0 : remainingDistance / segmentLength;
      const [longitude, latitude] = interpolateCoordinates(
        path[index],
        path[index + 1],
        segmentProgress,
      );
      return [longitude, latitude, 0];
    }

    remainingDistance -= segmentLength;
  }

  const lastPoint = path[path.length - 1];
  return [lastPoint[0], lastPoint[1], 0];
}

export function haversineDistanceMeters(
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

export function buildDrivePath(
  sourceId: string,
  targetId: string,
): [number, number][] | undefined {
  if (sourceId === "school" && targetId === "coast") {
    return HIGHWAY_101_PATH;
  }

  return undefined;
}

export function getRouteBearing(
  source: [number, number],
  target: [number, number],
): number {
  return (Math.atan2(target[0] - source[0], target[1] - source[1]) * 180) / Math.PI;
}

export function clampBearing(bearing: number): number {
  return Math.max(-35, Math.min(35, bearing));
}

function getDirectTransitionDuration(distanceMeters: number): number {
  const normalized = Math.min(distanceMeters / 2500000, 1);
  return Math.round(
    DIRECT_TRANSITION_MIN_DURATION +
      (DIRECT_TRANSITION_MAX_DURATION - DIRECT_TRANSITION_MIN_DURATION) *
        Math.sqrt(normalized),
  );
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function getShortRouteZoom(span: number): number {
  if (span > 1.5) {
    return 9.2;
  }
  if (span > 0.8) {
    return 10.1;
  }
  return 11;
}
