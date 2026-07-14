import { type AtlasViewState } from "@/lib/life-atlas-utils";
import { type CollectionArea, type Collection, type RouteDifficulty } from "@/lib/salon";

export type Bounds = [[number, number], [number, number]];

type Rgb = readonly [number, number, number];

/** Full difficulty spectrum: green (easy) → amber (moderate) → orange (hard). */
const SPECTRUM_STOPS: ReadonlyArray<{ pos: number; rgb: Rgb }> = [
  { pos: 0, rgb: [24, 165, 88] },
  { pos: 0.5, rgb: [228, 180, 0] },
  { pos: 1, rgb: [252, 76, 2] },
];

export const DIFFICULTY_LABELS: Record<RouteDifficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

export const DIFFICULTY_ORDER: RouteDifficulty[] = ["easy", "moderate", "hard"];

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function rgbToHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Interpolate RGB along the green → amber → orange spectrum. */
export function colorFromDifficultyScore(score: number): string {
  const t = clamp01(score);
  for (let i = 0; i < SPECTRUM_STOPS.length - 1; i += 1) {
    const left = SPECTRUM_STOPS[i];
    const right = SPECTRUM_STOPS[i + 1];
    if (t <= right.pos) {
      const span = right.pos - left.pos || 1;
      const local = (t - left.pos) / span;
      const rgb: Rgb = [
        lerp(left.rgb[0], right.rgb[0], local),
        lerp(left.rgb[1], right.rgb[1], local),
        lerp(left.rgb[2], right.rgb[2], local),
      ];
      return rgbToHex(rgb);
    }
  }
  return rgbToHex(SPECTRUM_STOPS[SPECTRUM_STOPS.length - 1].rgb);
}

/** CSS linear-gradient for the map legend bar. */
export function difficultySpectrumGradient(): string {
  const stops = SPECTRUM_STOPS.map(({ pos, rgb }) => `${rgbToHex(rgb)} ${pos * 100}%`).join(", ");
  return `linear-gradient(to right, ${stops})`;
}

/** Frame a static map on a collection's coarse area center. */
export function collectionView(area: CollectionArea): AtlasViewState {
  return {
    longitude: area.center[0],
    latitude: area.center[1],
    zoom: area.zoom,
    pitch: 0,
    bearing: 0,
  };
}

/** Combined bounding box over every pick's drawn route path, or null if none. */
export function collectionBounds(collection: Collection): Bounds | null {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let any = false;

  for (const pick of collection.picks) {
    for (const [lng, lat] of pick.route.path ?? []) {
      any = true;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }
  }

  return any ? [[minLng, minLat], [maxLng, maxLat]] : null;
}
