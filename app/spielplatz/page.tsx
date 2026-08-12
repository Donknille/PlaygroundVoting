"use client";

import Link from "next/link";
import { Art } from "@/components/art/Art";
import { Glyph } from "@/components/art/Glyph";
import { Mascot } from "@/components/art/Mascot";
import { Pictogram } from "@/components/art/Pictogram";
import { useEffect, useMemo, useState } from "react";
import { FeatureBadges, HighlightBadges, Pill } from "@/components/Badges";
import { VerdictLine } from "@/components/Verdict";
import {
  formatDistance,
  haversineM,
  mapsDirectionsUrl,
  walkingMinutes,
} from "@/lib/geo";
import { useAgeGroup, useQueryParam } from "@/lib/hooks";
import { QUESTIONS, getAgeGroup } from "@/lib/questions";
import {
  aggregateFor,
  aggregatesByAgeGroup,
  formatScore,
  hasShadeBadge,
} from "@/lib/scoring";
import type { AgeGroupId, Coords, Playground, Rating } from "@/lib/types";
import { findPlayground, lastCenter, ratingsForPlayground } from "@/lib/world";

export default function PlaygroundDetailPage() {
  const id = useQueryParam("id");
  const [group, setGroup] = useAgeGroup();
  const [playground, setPlayground] = useState<Playground | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [center, setCenter] = useState<Coords | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (id === null) return;
    const found = findPlayground(id);
    setPlayground(found);
    setRatings(found ? ratingsForPlayground(found) : []);
    setCenter(lastCenter());
    setResolved(true);
  }, [id]);

  const activeGroup: AgeGroupId | "alle" = group ?? "alle";
  const forGroup = useMemo(() => aggregateFor(ratings, activeGroup), [ratings, activeGroup]);
  const overall = useMemo(() => aggregateFor(ratings, "alle"), [ratings]);
  const byGroup = useMemo(() => aggregatesByAgeGroup(ratings), [ratings]);

  if (!resolved) return <div className="min-h-dvh" />;

  if (!id || !playground) {
    return (
      <main id="inhalt" className="mx-auto max-w-2xl space-y-4 px-4 py-10 text-center">
        <Mascot pose="fragt" className="mx-auto h-32 w-32" />
        <h1 className="text-2xl font-bold">Spielplatz nicht gefunden</h1>
        <p className="text-ink-soft">
          Der Link zeigt auf einen Platz, der nicht im Gerät gespeichert ist. Öffne ihn über
          die Liste.
        </p>
        <Link
          href="/"
          className="tap inline-flex items-center justify-center rounded-2xl bg-ink px-6 text-lg font-bold text-white"
        >
          Zur Spielplatzliste
        </Link>
      </main>
    );
  }

  const groupLabel =
    activeGroup === "alle" ? "alle Altersgruppen" : `${getAgeGroup(activeGroup).short} Jahre`;
  const distance = center
    ? haversineM(center, { lat: playground.lat, lon: playground.lon })
    : null;
  const shade = hasShadeBadge(overall);

  return (
    <div className="min-h-dvh pb-28">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-sand/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link
            href="/"
            className="tap flex items-center justify-center rounded-full bg-paper px-4 text-xl shadow-sm ring-1 ring-black/5"
            aria-label="Zurück zur Liste"
          >
            <Glyph name="zurueck" className="h-6 w-6" />
          </Link>
          <p className="truncate font-bold">{playground.name}</p>
        </div>
      </header>

      <main id="inhalt" className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="card space-y-3 p-4">
          <div>
            <h1 className="text-2xl font-bold leading-tight">{playground.name}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {distance !== null
                ? `${formatDistance(distance)} · ca. ${walkingMinutes(distance)} Min. zu Fuß`
                : "Entfernung unbekannt"}
              {playground.source === "demo" ? " · Demo-Platz" : ""}
            </p>
          </div>

          <VerdictLine
            score={forGroup.score}
            count={forGroup.count}
            groupLabel={groupLabel}
            size="lg"
          />

          <div className="flex flex-wrap gap-1.5">
            {shade ? (
              <Pill art="baum" tone="gruen">
                Schattig (laut Kindern)
              </Pill>
            ) : null}
            <FeatureBadges features={playground.features} />
          </div>

          <a
            href={mapsDirectionsUrl({ lat: playground.lat, lon: playground.lon })}
            target="_blank"
            rel="noreferrer"
            className="btn w-full bg-sky-soft [--btn-edge:var(--color-sky-deep)]"
          >
            <Glyph name="route" filled className="h-6 w-6" />
            Route in Google Maps
          </a>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-lg font-bold">Für welches Alter ist der Platz gut?</h2>
          <p className="text-sm text-ink-soft">
            Tippe auf eine Altersgruppe, um die Punkte oben umzustellen.
          </p>
          <ul className="space-y-2">
            {byGroup.map(({ group: groupId, aggregate }) => {
              const meta = getAgeGroup(groupId);
              const active = activeGroup === groupId;
              return (
                <li key={groupId}>
                  <button
                    type="button"
                    onClick={() => setGroup(groupId)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      active ? "bg-ink text-white" : "bg-line"
                    }`}
                  >
                    <Art name={meta.art} className="h-8 w-8 shrink-0" />
                    <span className="flex-1">
                      <span className="block font-bold leading-tight">
                        {meta.label} ({meta.short})
                      </span>
                      <span
                        className={`block text-xs ${active ? "text-white/70" : "text-ink-soft"}`}
                      >
                        {aggregate.count === 0
                          ? "noch keine Bewertung"
                          : `${aggregate.count} ${aggregate.count === 1 ? "Bewertung" : "Bewertungen"}`}
                      </span>
                    </span>
                    <span className="text-xl font-bold tabular-nums">
                      {aggregate.score === null ? "–" : formatScore(aggregate.score)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {overall.count > 0 ? (
          <section className="card space-y-4 p-4">
            <div>
              <h2 className="text-lg font-bold">Was die Kinder gesagt haben</h2>
              <p className="text-sm text-ink-soft">
                Häufigste Antwort (Median) aus {overall.count}{" "}
                {overall.count === 1 ? "Bewertung" : "Bewertungen"}, alle Altersgruppen.
              </p>
            </div>
            <ul className="space-y-3">
              {QUESTIONS.map((question) => {
                const medianValue = overall.perQuestion[question.id];
                if (medianValue === null) return null;
                const rounded = Math.round(medianValue);
                const option = question.options[rounded] ?? question.options[0];
                return (
                  <li key={question.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-sm font-bold">
                        <Art name={question.art} className="h-6 w-6 shrink-0" />
                        {question.prompt}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink-soft">
                        <Art name={option.art} className="h-6 w-6" />
                        {option.label}
                      </span>
                    </div>
                    <div className="flex gap-1" aria-hidden="true">
                      {[0, 1, 2].map((slot) => (
                        <span
                          key={slot}
                          className={`h-2.5 flex-1 rounded-full ${
                            slot <= rounded ? "bg-sun" : "bg-black/10"
                          }`}
                        />
                      ))}
                    </div>
                    {question.weight === 0 ? (
                      <p className="text-xs text-ink-soft">
                        Zählt bewusst nicht zu den Spaß-Punkten.
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {overall.highlights.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                  Lieblingsgeräte der Kinder
                </h3>
                <HighlightBadges highlights={overall.highlights} limit={5} />
              </div>
            ) : null}

            <Link
              href="/so-bewerten-wir/"
              className="inline-block text-sm underline underline-offset-4"
            >
              Wie entstehen diese Punkte?
            </Link>
          </section>
        ) : (
          <section className="card space-y-2 p-4">
            <h2 className="text-lg font-bold">Noch keine Bewertung</h2>
            <p className="text-sm text-ink-soft">
              Diesen Platz hat noch kein Kind bewertet. Ihr könnt die Ersten sein — es dauert
              keine halbe Minute.
            </p>
          </section>
        )}

        {playground.equipment.length > 0 ? (
          <section className="card space-y-2 p-4">
            <h2 className="text-lg font-bold">Geräte laut OpenStreetMap</h2>
            <HighlightBadges
              highlights={playground.equipment.map((key) => ({ key, count: 0 }))}
            />
            <p className="text-xs text-ink-soft">
              Diese Angaben kommen aus der Karte, nicht von Kindern.
            </p>
          </section>
        ) : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-sand/95 p-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/bewerten/?id=${encodeURIComponent(id)}`}
            className="btn btn-primary w-full text-xl"
          >
            <Pictogram name="rutsche" className="h-7 w-7" />
            Kind bewerten lassen
          </Link>
          <p className="mt-1.5 text-center text-xs text-ink-soft">
            5 Bildfragen · unter 30 Sekunden · ohne Namen
          </p>
        </div>
      </div>
    </div>
  );
}
