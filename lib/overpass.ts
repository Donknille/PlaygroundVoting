import {
  OVERPASS_ENDPOINTS,
  OVERPASS_TIMEOUT_MS,
  PLAYGROUND_CACHE_TTL_MS,
  STORAGE_KEYS,
} from "./config";
import { cacheKeyForCenter } from "./geo";
import type { Coords, FeatureKey, HighlightKey, Playground } from "./types";

/**
 * Spielplätze kommen aus OpenStreetMap (leisure=playground, ODbL).
 * Dadurch ist das Verzeichnis ab Tag 1 gefüllt – Bewertungen sind die
 * Anreicherung, nicht die Voraussetzung.
 */

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const EQUIPMENT_TAGS: Record<string, HighlightKey> = {
  slide: "rutsche",
  swing: "schaukel",
  sandpit: "sand",
  water: "wasser",
  climbingframe: "klettern",
  climbing: "klettern",
  seesaw: "wippe",
  zipwire: "seilbahn",
  cablecar: "seilbahn",
  roundabout: "karussell",
  trampoline: "trampolin",
};

function buildQuery(center: Coords, radiusM: number): string {
  const around = `around:${radiusM},${center.lat.toFixed(5)},${center.lon.toFixed(5)}`;
  return `[out:json][timeout:25];
(
  node["leisure"="playground"](${around});
  way["leisure"="playground"](${around});
  relation["leisure"="playground"](${around});
);
out center 250;`;
}

function featuresFromTags(tags: Record<string, string>): FeatureKey[] {
  const features: FeatureKey[] = [];
  const surface = tags.surface ?? "";

  if (tags.barrier || tags.fenced === "yes") features.push("zaun");
  if (
    tags["playground:water"] === "yes" ||
    tags["playground:watertable"] === "yes" ||
    tags.water === "yes"
  ) {
    features.push("wasser");
  }
  if (surface.includes("sand") || tags["playground:sandpit"] === "yes") {
    features.push("sand");
  }
  if (tags.toilets === "yes") features.push("toilette");
  if (tags.wheelchair === "yes" || tags.wheelchair === "designated") {
    features.push("barrierefrei");
  }
  if (tags.lit === "yes") features.push("beleuchtung");
  if (
    tags["playground:toddler"] === "yes" ||
    (tags.min_age !== undefined && Number(tags.min_age) <= 2) ||
    (tags.max_age !== undefined && Number(tags.max_age) <= 6)
  ) {
    features.push("kleinkind");
  }
  return features;
}

function equipmentFromTags(tags: Record<string, string>): HighlightKey[] {
  const found = new Set<HighlightKey>();
  for (const [key, value] of Object.entries(tags)) {
    if (!key.startsWith("playground:") || value === "no") continue;
    const mapped = EQUIPMENT_TAGS[key.slice("playground:".length)];
    if (mapped) found.add(mapped);
  }
  return [...found];
}

function nameFor(tags: Record<string, string>): string {
  const explicit = tags.name ?? tags["name:de"];
  if (explicit) return explicit;
  if (tags["addr:street"]) return `Spielplatz ${tags["addr:street"]}`;
  return "Spielplatz ohne Namen";
}

function toPlayground(element: OverpassElement): Playground | null {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat === undefined || lon === undefined) return null;
  const tags = element.tags ?? {};
  return {
    id: `${element.type}/${element.id}`,
    name: nameFor(tags),
    lat,
    lon,
    source: "osm",
    features: featuresFromTags(tags),
    equipment: equipmentFromTags(tags),
  };
}

type CacheEntry = { at: number; playgrounds: Playground[] };

function readCache(key: string): Playground[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.playgroundCache);
    if (!raw) return null;
    const store = JSON.parse(raw) as Record<string, CacheEntry>;
    const entry = store[key];
    if (!entry) return null;
    if (Date.now() - entry.at > PLAYGROUND_CACHE_TTL_MS) return null;
    return entry.playgrounds;
  } catch {
    return null;
  }
}

function writeCache(key: string, playgrounds: Playground[]): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.playgroundCache);
    const store = (raw ? JSON.parse(raw) : {}) as Record<string, CacheEntry>;
    store[key] = { at: Date.now(), playgrounds };
    // Nur die jüngsten Umgebungen behalten – der Speicher soll nicht volllaufen.
    const entries = Object.entries(store)
      .sort((a, b) => b[1].at - a[1].at)
      .slice(0, 8);
    window.localStorage.setItem(
      STORAGE_KEYS.playgroundCache,
      JSON.stringify(Object.fromEntries(entries)),
    );
  } catch {
    // Cache ist optional – ohne ihn funktioniert alles weiter, nur langsamer.
  }
}

async function requestOverpass(endpoint: string, query: string): Promise<Playground[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Overpass antwortete mit ${response.status}`);
    const json = (await response.json()) as { elements?: OverpassElement[] };
    return (json.elements ?? [])
      .map(toPlayground)
      .filter((item): item is Playground => item !== null);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Holt Spielplätze im Umkreis. Nutzt zuerst den Gerätecache (24 h),
 * dann die Overpass-Server der Reihe nach. Wirft, wenn keiner erreichbar ist –
 * die Oberfläche schaltet dann sichtbar in den Demo-Modus.
 */
export async function fetchPlaygrounds(
  center: Coords,
  radiusM: number,
): Promise<{ playgrounds: Playground[]; fromCache: boolean }> {
  const key = cacheKeyForCenter(center, radiusM);
  const cached = readCache(key);
  if (cached) return { playgrounds: cached, fromCache: true };

  const query = buildQuery(center, radiusM);
  let lastError: unknown = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const playgrounds = await requestOverpass(endpoint, query);
      writeCache(key, playgrounds);
      return { playgrounds, fromCache: false };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Keine Verbindung zu OpenStreetMap");
}
