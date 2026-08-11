"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AgeGroupPicker } from "@/components/AgeGroupPicker";
import { AppHeader } from "@/components/AppHeader";
import { DemoBanner } from "@/components/DemoBanner";
import { PlaygroundCard } from "@/components/PlaygroundCard";
import { FALLBACK_PLACES, SEARCH_RADIUS_M } from "@/lib/config";
import { useAgeGroup, useCenter, usePlaygroundWorld, useQueryParam } from "@/lib/hooks";
import { getAgeGroup } from "@/lib/questions";

export default function DiscoveryPage() {
  const [group, setGroup] = useAgeGroup();
  const { center, source, status, requestGps, setPlace } = useCenter();
  const demoParam = useQueryParam("demo");
  const [forceDemo, setForceDemo] = useState(false);

  useEffect(() => {
    if (demoParam === "1") setForceDemo(true);
  }, [demoParam]);

  const world = usePlaygroundWorld(center, forceDemo);
  const activeGroup = group ?? "alle";

  return (
    <div className="min-h-dvh pb-24">
      <AppHeader />

      <main id="inhalt" className="mx-auto max-w-2xl space-y-3 px-4 py-4">
        <section aria-labelledby="alter-titel" className="space-y-1.5">
          <h1 id="alter-titel" className="text-xl font-extrabold leading-tight">
            Für wen sucht ihr heute?
          </h1>
          <AgeGroupPicker value={group} onChange={setGroup} />
          <p className="text-xs text-ink-soft">
            {group
              ? `Punkte gelten für Kinder von ${getAgeGroup(group).short} Jahren — bewertet von Kindern.`
              : "Ohne Auswahl gilt der Wert über alle Altersgruppen."}
          </p>
        </section>

        {center ? null : (
          <LocationPrompt status={status} onRequestGps={requestGps} onPick={setPlace} />
        )}

        {world.mode === "demo" && center ? <DemoBanner reason={world.demoReason} /> : null}

        {center ? (
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                  {world.status === "laden"
                    ? "Suche läuft …"
                    : `${world.playgrounds.length} Spielplätze, nächste zuerst`}
                </h2>
                <LocationLine source={source} onRequestGps={requestGps} />
              </div>
              <Link
                href="/karte/"
                className="shrink-0 rounded-full bg-white px-3 py-2 text-sm font-bold shadow-sm ring-1 ring-black/5"
              >
                🗺️ Karte
              </Link>
            </div>

            {world.status === "laden" ? (
              <SkeletonList />
            ) : (
              <div className="space-y-3">
                {world.playgrounds.map((playground) => (
                  <PlaygroundCard
                    key={playground.id}
                    playground={playground}
                    group={activeGroup}
                  />
                ))}
              </div>
            )}

            {world.status === "bereit" && world.playgrounds.length === 0 ? (
              <p className="card p-4 text-ink-soft">
                Im Umkreis von {SEARCH_RADIUS_M / 1000} km ist kein Spielplatz eingetragen.
              </p>
            ) : null}
          </section>
        ) : null}

        <FooterLinks
          onDemo={() => setForceDemo(true)}
          demoActive={forceDemo || world.mode === "demo"}
        />
      </main>
    </div>
  );
}

function LocationLine({
  source,
  onRequestGps,
}: {
  source: string | null;
  onRequestGps: () => void;
}) {
  const label =
    source === "gps"
      ? "dein Standort"
      : source === "ort"
        ? "gewählter Ort"
        : "zuletzt genutzter Standort";
  return (
    <button
      type="button"
      onClick={onRequestGps}
      className="truncate text-xs text-ink-soft underline decoration-dotted underline-offset-4"
    >
      📍 {label} — aktualisieren
    </button>
  );
}

function LocationPrompt({
  status,
  onRequestGps,
  onPick,
}: {
  status: string;
  onRequestGps: () => void;
  onPick: (coords: { lat: number; lon: number }) => void;
}) {
  return (
    <section className="card space-y-3 p-4">
      <h2 className="text-lg font-bold">
        {status === "suche" ? "Standort wird gesucht …" : "Wo seid ihr gerade?"}
      </h2>
      <p className="text-sm text-ink-soft">
        Der Standort bleibt auf deinem Gerät. Wir senden ihn an keinen Server.
      </p>
      <button
        type="button"
        onClick={onRequestGps}
        className="tap w-full rounded-2xl bg-grass px-4 text-lg font-bold text-white"
      >
        📍 Standort verwenden
      </button>
      <div>
        <p className="mb-2 text-sm font-bold text-ink-soft">Oder Ort auswählen:</p>
        <div className="flex flex-wrap gap-2">
          {FALLBACK_PLACES.map((place) => (
            <button
              key={place.name}
              type="button"
              onClick={() => onPick({ lat: place.lat, lon: place.lon })}
              className="rounded-full bg-sand-deep px-4 py-2.5 text-sm font-bold"
            >
              {place.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="card h-28 animate-pulse bg-white/70" />
      ))}
    </div>
  );
}

function FooterLinks({
  onDemo,
  demoActive,
}: {
  onDemo: () => void;
  demoActive: boolean;
}) {
  return (
    <footer className="space-y-3 border-t border-black/5 pt-5 text-sm text-ink-soft">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/so-bewerten-wir/" className="underline underline-offset-4">
          So bewerten wir
        </Link>
        <Link href="/datenschutz/" className="underline underline-offset-4">
          Datenschutz
        </Link>
        <Link href="/kommunen/" className="underline underline-offset-4">
          Für Kommunen
        </Link>
        {!demoActive ? (
          <button type="button" onClick={onDemo} className="underline underline-offset-4">
            Demo-Modus starten
          </button>
        ) : null}
      </div>
      <p>
        Spielplatzdaten von{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>{" "}
        (ODbL). Ohne Konto, ohne Werbung, ohne Tracking.
      </p>
    </footer>
  );
}
