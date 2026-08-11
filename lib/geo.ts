import type { Coords } from "./types";

const EARTH_RADIUS_M = 6371000;

export function haversineM(a: Coords, b: Coords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistance(meters: number): string {
  if (meters < 950) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

/** Grobe Gehzeit bei 4 km/h – für Eltern greifbarer als Meter. */
export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 66));
}

/**
 * Rundet den Mittelpunkt auf ein Raster, damit benachbarte Standorte denselben
 * Cache-Eintrag treffen und Overpass nicht bei jedem Meter neu befragt wird.
 */
export function cacheKeyForCenter(center: Coords, radiusM: number): string {
  const grid = 0.01; // ≈ 1,1 km
  const lat = Math.round(center.lat / grid) * grid;
  const lon = Math.round(center.lon / grid) * grid;
  return `${lat.toFixed(2)},${lon.toFixed(2)},${radiusM}`;
}

/** Keyloser Google-Maps-Navigationslink – braucht weder API-Key noch Billing. */
export function mapsDirectionsUrl(target: Coords): string {
  const params = new URLSearchParams({
    api: "1",
    destination: `${target.lat},${target.lon}`,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
