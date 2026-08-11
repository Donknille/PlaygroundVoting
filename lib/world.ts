"use client";

import { STORAGE_KEYS } from "./config";
import { demoPlaygrounds, demoRatings } from "./demoData";
import { getOwnRatingsFor } from "./ratings";
import type { Coords, Playground, Rating } from "./types";

/**
 * Bewertungen eines Spielplatzes.
 *
 * Echte OSM-Plätze zeigen ausschließlich echte, im Gerät gespeicherte Stimmen –
 * ein unbewerteter Platz bleibt sichtbar unbewertet. Nur Demo-Plätze bekommen
 * zusätzlich generierte Beispielstimmen, damit die Oberfläche vorführbar ist.
 */
export function ratingsForPlayground(playground: Playground): Rating[] {
  const own = getOwnRatingsFor(playground.id);
  if (playground.source === "demo") return [...demoRatings(playground.id), ...own];
  return own;
}

export function lastCenter(): Coords | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.lastCenter);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Coords;
    return typeof parsed?.lat === "number" && typeof parsed?.lon === "number"
      ? parsed
      : null;
  } catch {
    return null;
  }
}

/**
 * Findet einen Spielplatz allein anhand seiner ID – ohne die Liste erneut zu laden.
 * Detail- und Bewertungsseite sind dadurch direkt per Link erreichbar (QR-Code am Platz).
 */
export function findPlayground(id: string): Playground | null {
  const center = lastCenter();

  if (id.startsWith("demo-")) {
    if (!center) return null;
    return demoPlaygrounds(center).find((item) => item.id === id) ?? null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.playgroundCache);
    if (!raw) return null;
    const store = JSON.parse(raw) as Record<string, { playgrounds: Playground[] }>;
    for (const entry of Object.values(store)) {
      const hit = entry.playgrounds?.find((item) => item.id === id);
      if (hit) return hit;
    }
  } catch {
    return null;
  }
  return null;
}
