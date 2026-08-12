"use client";

import { STORAGE_KEYS } from "./config";
import { getOwnRatings } from "./ratings";
import type { HighlightKey, Rating } from "./types";

/**
 * Kinderprofil — vollständig freiwillig und vollständig auf dem Gerät.
 *
 * Der Entwurf sah „Vorname + Alter" vor. Ein Vorname plus Alter plus die Liste
 * besuchter Spielplätze mit Datum wäre bei einem Kind personenbezogen und in
 * einer Kleinstadt sogar identifizierend. Deshalb hier: ein frei erfundener
 * Spitzname, der das Gerät nie verlässt, und das Alter, das ohnehin schon für
 * jede Bewertung gebraucht wird.
 *
 * Ohne Profil funktioniert alles weiter — dann wird das Alter je Bewertung
 * gefragt. Mit Profil entfällt diese Frage, und der Ablauf hat die drei
 * Schritte, die der Entwurf verlangt.
 */

export type Profile = {
  /** Frei gewählt, darf leer bleiben. Niemals ein echter Name — so steht es auch im Formular. */
  spitzname: string;
  alter: number;
  /** Monat des Anlegens, für „Testet seit …". Kein genaues Datum nötig. */
  seit: string;
};

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.profile);
    if (!raw) return null;
    const p: unknown = JSON.parse(raw);
    if (!p || typeof p !== "object") return null;
    const { spitzname, alter, seit } = p as Partial<Profile>;
    if (typeof alter !== "number") return null;
    return { spitzname: typeof spitzname === "string" ? spitzname : "", alter, seit: seit ?? "" };
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  } catch {
    // Speicher gesperrt – ohne Profil bleibt die App vollständig nutzbar.
  }
}

export function clearProfile(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.profile);
  } catch {
    // ignorieren
  }
}

export function monatJetzt(): string {
  const monate = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  return monate[new Date().getMonth()];
}

/* --------------------------------------------------------------------------
   Abzeichen
   Entwurfsvorgabe: „Belohnung ohne Wettbewerb: Abzeichen für Vielfalt, nicht
   für Menge. Keine Rangliste, kein Vergleich mit anderen Kindern."
   Deshalb belohnen fünf der sechs Abzeichen Verschiedenheit, nicht Anzahl.
   -------------------------------------------------------------------------- */

export type Badge = {
  key: string;
  name: string;
  /** Bildzeichen aus components/art/Pictogram.tsx */
  art: string;
  /** Was zu tun ist — erscheint als Fortschrittstext. */
  aufgabe: (fehlt: number) => string;
  ziel: number;
  fortschritt: (ratings: Rating[]) => number;
};

const verschiedenePlaetze = (r: Rating[]) => new Set(r.map((x) => x.playgroundId)).size;

const geraeteZaehlen = (r: Rating[], keys: HighlightKey[]) =>
  r.reduce((n, x) => n + (x.highlights.some((h) => keys.includes(h)) ? 1 : 0), 0);

export const BADGES: Badge[] = [
  {
    key: "erster-test",
    name: "Erster Test",
    art: "stern",
    ziel: 1,
    aufgabe: () => "Bewerte deinen ersten Spielplatz",
    fortschritt: (r) => r.length,
  },
  {
    key: "fuenf-geraete",
    name: "Fünf Geräte",
    art: "karussell",
    ziel: 5,
    aufgabe: (fehlt) => `Noch ${fehlt} verschiedene Geräte`,
    fortschritt: (r) => new Set(r.flatMap((x) => x.highlights)).size,
  },
  {
    key: "matschfreund",
    name: "Matschfreund",
    art: "sand",
    ziel: 3,
    aufgabe: (fehlt) => `Noch ${fehlt} Mal Sand oder Wasser`,
    fortschritt: (r) => geraeteZaehlen(r, ["sand", "wasser"]),
  },
  {
    key: "kletterprofi",
    name: "Kletterprofi",
    art: "klettern",
    ziel: 3,
    aufgabe: (fehlt) => `Noch ${fehlt} Klettergerüste`,
    fortschritt: (r) => geraeteZaehlen(r, ["klettern"]),
  },
  {
    key: "weit-herum",
    name: "Weit herum",
    art: "fernglas",
    ziel: 3,
    aufgabe: (fehlt) => `Noch ${fehlt} verschiedene Spielplätze`,
    fortschritt: verschiedenePlaetze,
  },
  {
    key: "zehn-plaetze",
    name: "Zehn Plätze",
    art: "medaille",
    ziel: 10,
    aufgabe: (fehlt) => `Noch ${fehlt} Spielplätze`,
    fortschritt: verschiedenePlaetze,
  },
];

export type BadgeState = Badge & { erreicht: boolean; stand: number };

export function badgeStates(ratings: Rating[] = getOwnRatings()): BadgeState[] {
  return BADGES.map((b) => {
    const stand = Math.min(b.fortschritt(ratings), b.ziel);
    return { ...b, stand, erreicht: stand >= b.ziel };
  });
}

/** Das nächste erreichbare Abzeichen — für den Fortschrittsbalken im Profil. */
export function naechstesAbzeichen(states: BadgeState[]): BadgeState | null {
  const offen = states.filter((s) => !s.erreicht);
  if (offen.length === 0) return null;
  return offen.reduce((beste, s) =>
    s.ziel - s.stand < beste.ziel - beste.stand ? s : beste,
  );
}
