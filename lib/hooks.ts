"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SEARCH_RADIUS_M, STORAGE_KEYS } from "./config";
import { demoPlaygrounds } from "./demoData";
import { haversineM } from "./geo";
import { fetchPlaygrounds } from "./overpass";
import type {
  AgeGroupId,
  Coords,
  Playground,
  PlaygroundWithDistance,
} from "./types";

/* ------------------------------------------------------------------ Altersgruppe */

export function useAgeGroup(): [AgeGroupId | null, (id: AgeGroupId) => void] {
  const [group, setGroup] = useState<AgeGroupId | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.ageGroup);
      if (stored) setGroup(stored as AgeGroupId);
    } catch {
      // ohne gespeicherte Auswahl beginnt der Nutzer einfach neu
    }
  }, []);

  const update = useCallback((id: AgeGroupId) => {
    setGroup(id);
    try {
      window.localStorage.setItem(STORAGE_KEYS.ageGroup, id);
    } catch {
      // ignorieren
    }
  }, []);

  return [group, update];
}

/* ---------------------------------------------------------------------- Standort */

export type CenterSource = "gps" | "ort" | "gespeichert";
export type CenterStatus = "start" | "suche" | "bereit" | "abgelehnt" | "fehlt";

export type CenterState = {
  center: Coords | null;
  source: CenterSource | null;
  status: CenterStatus;
  requestGps: () => void;
  setPlace: (coords: Coords) => void;
};

export function useCenter(): CenterState {
  const [center, setCenter] = useState<Coords | null>(null);
  const [source, setSource] = useState<CenterSource | null>(null);
  const [status, setStatus] = useState<CenterStatus>("start");

  const persist = useCallback((coords: Coords) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.lastCenter, JSON.stringify(coords));
    } catch {
      // ignorieren
    }
  }, []);

  const requestGps = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("fehlt");
      return;
    }
    setStatus("suche");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCenter(coords);
        setSource("gps");
        setStatus("bereit");
        persist(coords);
      },
      () => {
        // Kein Standort ist kein Fehlerzustand: es gibt die Ortsauswahl.
        setStatus((prev) => (prev === "suche" ? "abgelehnt" : prev));
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, [persist]);

  const setPlace = useCallback(
    (coords: Coords) => {
      setCenter(coords);
      setSource("ort");
      setStatus("bereit");
      persist(coords);
    },
    [persist],
  );

  // Beim Start: gespeicherten Standort sofort verwenden (schnelle erste Liste),
  // sonst direkt GPS anfragen.
  useEffect(() => {
    let stored: Coords | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.lastCenter);
      if (raw) stored = JSON.parse(raw) as Coords;
    } catch {
      stored = null;
    }
    if (stored && typeof stored.lat === "number" && typeof stored.lon === "number") {
      setCenter(stored);
      setSource("gespeichert");
      setStatus("bereit");
    } else {
      requestGps();
    }
  }, [requestGps]);

  return { center, source, status, requestGps, setPlace };
}

/* ------------------------------------------------------------------ Spielplätze */

export type WorldMode = "live" | "demo";
export type WorldStatus = "leer" | "laden" | "bereit" | "fehler";

export type World = {
  status: WorldStatus;
  mode: WorldMode;
  playgrounds: PlaygroundWithDistance[];
  /** Grund für den Demo-Modus, falls automatisch umgeschaltet wurde. */
  demoReason: string | null;
  reload: () => void;
};

function withDistance(
  playgrounds: Playground[],
  center: Coords,
): PlaygroundWithDistance[] {
  return playgrounds
    .map((playground) => ({
      ...playground,
      distanceM: haversineM(center, { lat: playground.lat, lon: playground.lon }),
    }))
    .sort((a, b) => a.distanceM - b.distanceM);
}

export function usePlaygroundWorld(center: Coords | null, forceDemo: boolean): World {
  const [status, setStatus] = useState<WorldStatus>("leer");
  const [mode, setMode] = useState<WorldMode>("live");
  const [raw, setRaw] = useState<Playground[]>([]);
  const [demoReason, setDemoReason] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!center) return;
    let cancelled = false;

    if (forceDemo) {
      setMode("demo");
      setDemoReason(null);
      setRaw(demoPlaygrounds(center));
      setStatus("bereit");
      return;
    }

    setStatus("laden");
    fetchPlaygrounds(center, SEARCH_RADIUS_M)
      .then(({ playgrounds }) => {
        if (cancelled) return;
        if (playgrounds.length === 0) {
          setMode("demo");
          setDemoReason("In diesem Umkreis kennt OpenStreetMap noch keinen Spielplatz.");
          setRaw(demoPlaygrounds(center));
        } else {
          setMode("live");
          setDemoReason(null);
          setRaw(playgrounds);
        }
        setStatus("bereit");
      })
      .catch(() => {
        if (cancelled) return;
        setMode("demo");
        setDemoReason("Die Spielplatzdaten von OpenStreetMap sind gerade nicht erreichbar.");
        setRaw(demoPlaygrounds(center));
        setStatus("bereit");
      });

    return () => {
      cancelled = true;
    };
  }, [center, forceDemo, attempt]);

  const playgrounds = useMemo(
    () => (center ? withDistance(raw, center) : []),
    [raw, center],
  );

  return { status, mode, playgrounds, demoReason, reload };
}

/** Merkt sich, ob der Client bereits gemountet ist (localStorage-Zugriffe). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Query-Parameter direkt aus der Adresszeile.
 * Bewusst nicht über useSearchParams: die App ist ein statischer Export, und so
 * bleibt jede Seite ohne Suspense-Grenze prerenderbar.
 */
export function useQueryParam(name: string): string | null {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    const read = () =>
      setValue(new URLSearchParams(window.location.search).get(name));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [name]);
  return value;
}
