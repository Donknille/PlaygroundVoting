"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Glyph } from "@/components/art/Glyph";
import { Mascot } from "@/components/art/Mascot";
import { DemoBanner } from "@/components/DemoBanner";
import { PlaygroundCard } from "@/components/PlaygroundCard";
import { FALLBACK_PLACES, SEARCH_RADIUS_M } from "@/lib/config";
import { useAgeGroup, useCenter, usePlaygroundWorld, useQueryParam } from "@/lib/hooks";
import { AGE_GROUPS, FEATURES, featureMeta } from "@/lib/questions";
import { aggregateFor, hasShadeBadge } from "@/lib/scoring";
import type { FeatureKey, PlaygroundWithDistance } from "@/lib/types";
import { ratingsForPlayground } from "@/lib/world";

const PlaygroundMap = dynamic(() => import("@/components/PlaygroundMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-map-green" />,
});

/** Filter, die sich aus echten Daten füllen lassen — keine erfundenen Kategorien. */
const FILTER_FEATURES: FeatureKey[] = ["wasser", "sand", "zaun", "toilette", "kleinkind"];

export default function ParentApp() {
  const [group, setGroup] = useAgeGroup();
  const { center, source, status, requestGps, setPlace } = useCenter();
  const demoParam = useQueryParam("demo");
  const ansichtParam = useQueryParam("ansicht");

  const [forceDemo, setForceDemo] = useState(false);
  const [ansicht, setAnsicht] = useState<"karte" | "liste">("liste");
  const [suche, setSuche] = useState("");
  const [filter, setFilter] = useState<string[]>([]);
  const [ortName, setOrtName] = useState<string | null>(null);
  const [gewaehlt, setGewaehlt] = useState<PlaygroundWithDistance | null>(null);

  useEffect(() => {
    if (demoParam === "1") setForceDemo(true);
  }, [demoParam]);
  useEffect(() => {
    if (ansichtParam === "karte") setAnsicht("karte");
  }, [ansichtParam]);

  const world = usePlaygroundWorld(center, forceDemo);
  const activeGroup = group ?? "alle";

  const gefiltert = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return world.playgrounds.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (filter.length === 0) return true;
      return filter.every((f) => {
        if (f === "schatten") return hasShadeBadge(aggregateFor(ratingsForPlayground(p), "alle"));
        return p.features.includes(f as FeatureKey);
      });
    });
  }, [world.playgrounds, suche, filter]);

  const toggleFilter = (key: string) =>
    setFilter((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));

  const liste = gefiltert.map((playground) => (
    <PlaygroundCard key={playground.id} playground={playground} group={activeGroup} />
  ));

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-sand/95 px-4 pt-3 pb-2 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="label">Spielplätze in</p>
              <h1 className="truncate font-display text-2xl leading-tight font-bold">
                {ortName ?? (center ? "deiner Nähe" : "…")}
              </h1>
            </div>
            {/* Der einzige gelbe Punkt im Elternteil — dadurch unverwechselbar. */}
            <Link href="/bewerten/" className="btn btn-sun shrink-0 !min-h-12 !px-4 text-base">
              <Glyph name="kind" className="h-6 w-6" />
              Kinder-Modus
            </Link>
          </div>

          {center ? (
            <>
              <label className="mt-3 flex items-center gap-2 rounded-chip border border-line bg-paper px-3.5 py-3">
                <Glyph name="suche" className="h-5 w-5 shrink-0 text-ink-faint" />
                <input
                  type="search"
                  value={suche}
                  onChange={(e) => setSuche(e.target.value)}
                  placeholder="Spielplatz suchen"
                  className="w-full bg-transparent text-base outline-none placeholder:text-ink-fainter"
                  aria-label="Spielplatz suchen"
                />
              </label>

              <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
                {AGE_GROUPS.map((g) => (
                  <Chip
                    key={g.id}
                    active={group === g.id}
                    onClick={() => setGroup(g.id)}
                    aria-pressed={group === g.id}
                  >
                    {g.short} Jahre
                  </Chip>
                ))}
                <Chip active={filter.includes("schatten")} onClick={() => toggleFilter("schatten")}>
                  Schatten
                </Chip>
                {FILTER_FEATURES.map((key) => (
                  <Chip
                    key={key}
                    active={filter.includes(key)}
                    onClick={() => toggleFilter(key)}
                  >
                    {featureMeta(key).label}
                  </Chip>
                ))}
              </div>

              <div className="mt-2 flex rounded-chip bg-line p-1">
                {(["karte", "liste"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAnsicht(v)}
                    aria-pressed={ansicht === v}
                    className={`flex-1 rounded-[0.7rem] py-2.5 font-display text-base font-bold capitalize transition ${
                      ansicht === v ? "bg-paper shadow-sm" : "text-ink-soft"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </header>

      <main id="inhalt" className="relative flex flex-1 flex-col">
        {!center ? (
          <OrtWaehlen
            status={status}
            onRequestGps={() => {
              setOrtName(null);
              requestGps();
            }}
            onPick={(ort) => {
              setOrtName(ort.name);
              setPlace({ lat: ort.lat, lon: ort.lon });
            }}
          />
        ) : ansicht === "karte" ? (
          <div className="relative flex-1">
            <div className="absolute inset-0">
              <PlaygroundMap
                center={center}
                playgrounds={gefiltert}
                group={activeGroup}
                selectedId={gewaehlt?.id ?? null}
                onSelect={setGewaehlt}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 max-h-[46%] overflow-y-auto rounded-t-3xl bg-sand px-3 pt-2 pb-4 shadow-[0_-8px_24px_-12px_rgb(46_42_36/0.35)]">
              <div className="mx-auto mb-2.5 h-1.5 w-10 rounded-full bg-ink/15" aria-hidden="true" />
              {world.mode === "demo" ? (
                <div className="mb-2">
                  <DemoBanner reason={world.demoReason} />
                </div>
              ) : null}
              <div className="space-y-2">{liste}</div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-2xl space-y-2 px-4 py-3">
            {world.mode === "demo" ? <DemoBanner reason={world.demoReason} /> : null}

            <div className="flex items-center justify-between gap-3 pt-1 pb-1">
              <p className="label">
                {world.status === "laden"
                  ? "Suche läuft"
                  : `${gefiltert.length} ${gefiltert.length === 1 ? "Spielplatz" : "Spielplätze"}`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrtName(null);
                  requestGps();
                }}
                className="flex items-center gap-1 text-xs font-semibold text-ink-faint underline decoration-dotted underline-offset-4"
              >
                <Glyph name="standort" filled className="h-3.5 w-3.5" />
                {source === "gps" ? "Standort aktualisieren" : "Standort verwenden"}
              </button>
            </div>

            {world.status === "laden" ? (
              <SucheLaeuft />
            ) : gefiltert.length === 0 ? (
              <LeerZustand hatFilter={filter.length > 0 || suche.trim().length > 0} />
            ) : (
              liste
            )}

            <FussLeiste
              onDemo={() => setForceDemo(true)}
              demoActive={forceDemo || world.mode === "demo"}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink-soft"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function OrtWaehlen({
  status,
  onRequestGps,
  onPick,
}: {
  status: string;
  onRequestGps: () => void;
  onPick: (ort: { name: string; lat: number; lon: number }) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6">
      <div className="card space-y-3 p-5">
        <div className="flex items-center gap-3">
          <Mascot pose="sucht" className="h-20 w-20 shrink-0" />
          <div>
            <h2 className="font-display text-xl font-bold">
              {status === "suche" ? "Standort wird gesucht …" : "Wo seid ihr gerade?"}
            </h2>
            <p className="text-sm text-ink-soft">
              Der Standort bleibt auf deinem Gerät. Wir senden ihn an keinen Server.
            </p>
          </div>
        </div>
        <button type="button" onClick={onRequestGps} className="btn btn-primary w-full">
          <Glyph name="standort" filled className="h-6 w-6" />
          Standort verwenden
        </button>
        <div>
          <p className="label mb-2">Oder Ort wählen</p>
          <div className="flex flex-wrap gap-2">
            {FALLBACK_PLACES.map((ort) => (
              <button
                key={ort.name}
                type="button"
                onClick={() => onPick(ort)}
                className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-semibold"
              >
                {ort.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SucheLaeuft() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-3 py-3">
        <Mascot pose="sucht" className="h-16 w-16 animate-bob" />
        <p className="font-display text-base font-bold text-ink-soft">Fips schaut sich um …</p>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="card h-20 animate-pulse" aria-hidden="true" />
      ))}
    </div>
  );
}

function LeerZustand({ hatFilter }: { hatFilter: boolean }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-6 text-center">
      <Mascot pose="sucht" className="h-24 w-24" />
      <p className="font-display text-lg font-bold">
        {hatFilter ? "Nichts gefunden" : "Hier ist nichts eingetragen"}
      </p>
      <p className="text-sm text-ink-soft">
        {hatFilter
          ? "Nimm einen Filter weg oder such nach einem anderen Namen."
          : `Im Umkreis von ${SEARCH_RADIUS_M / 1000} km kennt OpenStreetMap keinen Spielplatz.`}
      </p>
    </div>
  );
}

function FussLeiste({ onDemo, demoActive }: { onDemo: () => void; demoActive: boolean }) {
  return (
    <footer className="space-y-2 border-t border-line pt-4 text-sm text-ink-faint">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/so-bewerten-wir/" className="underline underline-offset-4">
          So bewerten wir
        </Link>
        <Link href="/profil/" className="underline underline-offset-4">
          Kinderprofil
        </Link>
        <Link href="/datenschutz/" className="underline underline-offset-4">
          Datenschutz
        </Link>
        <Link href="/kommunen/" className="underline underline-offset-4">
          Für Kommunen
        </Link>
        {!demoActive ? (
          <button type="button" onClick={onDemo} className="underline underline-offset-4">
            Demo-Modus
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
