import salonData from "@/data/salon.json";

export type PickLink = {
  type: string;
  label: string;
  url: string;
};

export type PickMedia = {
  type: string;
  url: string;
};

export type RouteDifficulty = "easy" | "moderate" | "hard";

export type RouteDetail = {
  distanceMi?: number;
  surface?: string;
  elevationGainFt?: number;
  difficultyTier?: RouteDifficulty;
  difficultyScore?: number;
  path?: [number, number][];
  bbox?: [[number, number], [number, number]];
};

export type Pick = {
  id: string;
  domain: string;
  title: string;
  why: string;
  tags: string[];
  endorsement: string | null;
  source: string;
  links: PickLink[];
  media: PickMedia[];
  route: RouteDetail;
};

export type CollectionArea = {
  id: string;
  label: string;
  center: [number, number];
  zoom: number;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  domains: string[];
  area: CollectionArea | null;
  picks: Pick[];
};

export type SalonData = {
  collections: Collection[];
};

const data = salonData as unknown as SalonData;

export function getCollections(): Collection[] {
  return data.collections;
}

export function getCollection(id: string): Collection | undefined {
  return data.collections.find((collection) => collection.id === id);
}

export type RoutePickGroup = {
  collectionId: string;
  title: string;
  areaLabel: string | null;
  picks: Pick[];
};

/** Running route collections and their route picks for reuse outside salon pages. */
export function getRoutePickGroups(): RoutePickGroup[] {
  return data.collections
    .filter((collection) => collection.domains.includes("route"))
    .map((collection) => ({
      collectionId: collection.id,
      title: collection.title,
      areaLabel: collection.area?.label ?? null,
      picks: collection.picks.filter((pick) => pick.domain === "route"),
    }))
    .filter((group) => group.picks.length > 0);
}

/** Group collections by their primary domain (first entry in `domains`). */
export function groupByDomain(): Record<string, Collection[]> {
  const grouped: Record<string, Collection[]> = {};
  for (const collection of data.collections) {
    const domain = collection.domains[0] ?? "other";
    (grouped[domain] ??= []).push(collection);
  }
  return grouped;
}
