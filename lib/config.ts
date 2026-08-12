/** Zentrale Stellschrauben. Bewusst an einem Ort, damit nichts implizit im Code versteckt liegt. */

/** Suchradius um den Standort in Metern. */
export const SEARCH_RADIUS_M = 3000;

/** Ab so vielen Bewertungen wird ein Punktwert überhaupt angezeigt. */
export const MIN_RATINGS_FOR_SCORE = 3;

/** Wie lange Spielplatzdaten im Gerät zwischengespeichert werden (24 h). */
export const PLAYGROUND_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Overpass-Server in Reihenfolge der Verwendung. */
export const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

export const OVERPASS_TIMEOUT_MS = 15000;

/** Beispielstandorte, falls kein GPS freigegeben wird. */
export const FALLBACK_PLACES = [
  { name: "Berlin", lat: 52.52, lon: 13.405 },
  { name: "Hamburg", lat: 53.5511, lon: 9.9937 },
  { name: "München", lat: 48.1374, lon: 11.5755 },
  { name: "Köln", lat: 50.9375, lon: 6.9603 },
  { name: "Frankfurt am Main", lat: 50.1109, lon: 8.6821 },
  { name: "Leipzig", lat: 51.3397, lon: 12.3731 },
  { name: "Wien", lat: 48.2082, lon: 16.3738 },
  { name: "Zürich", lat: 47.3769, lon: 8.5417 },
] as const;

export const STORAGE_KEYS = {
  ratings: "scouts.ratings.v1",
  ageGroup: "scouts.agegroup.v1",
  playgroundCache: "scouts.playgrounds.v1",
  lastCenter: "scouts.center.v1",
  profile: "scouts.profile.v1",
} as const;
