"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Glyph } from "@/components/art/Glyph";
import { useEffect, useState } from "react";
import { AgeGroupPicker } from "@/components/AgeGroupPicker";
import { ScoreSmileys } from "@/components/ScoreSmileys";
import { formatDistance, walkingMinutes } from "@/lib/geo";
import { useAgeGroup, useCenter, usePlaygroundWorld, useQueryParam } from "@/lib/hooks";
import { getAgeGroup } from "@/lib/questions";
import { aggregateFor } from "@/lib/scoring";
import type { PlaygroundWithDistance } from "@/lib/types";
import { ratingsForPlayground } from "@/lib/world";

const PlaygroundMap = dynamic(() => import("@/components/PlaygroundMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-black/5 text-ink-soft">
      Karte wird geladen …
    </div>
  ),
});

export default function MapPage() {
  const [group, setGroup] = useAgeGroup();
  const { center } = useCenter();
  const demoParam = useQueryParam("demo");
  const [forceDemo, setForceDemo] = useState(false);
  const [selected, setSelected] = useState<PlaygroundWithDistance | null>(null);

  useEffect(() => {
    if (demoParam === "1") setForceDemo(true);
  }, [demoParam]);

  const world = usePlaygroundWorld(center, forceDemo);
  const activeGroup = group ?? "alle";
  const groupLabel =
    activeGroup === "alle" ? "alle Altersgruppen" : `${getAgeGroup(activeGroup).short} Jahre`;

  return (
    <div className="flex h-dvh flex-col">
      <header className="z-30 border-b border-black/5 bg-sand px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link
            href="/"
            className="tap flex items-center justify-center rounded-full bg-white px-4 text-xl shadow-sm ring-1 ring-black/5"
            aria-label="Zurück zur Liste"
          >
            <Glyph name="zurueck" className="h-6 w-6" />
          </Link>
          <p className="flex-1 font-bold">Karte</p>
          {world.mode === "demo" ? (
            <span className="rounded-full border-2 border-dashed border-sun bg-sun-soft px-3 py-1 text-xs font-bold">
              Demo
            </span>
          ) : null}
        </div>
        <div className="mx-auto mt-3 max-w-2xl">
          <AgeGroupPicker value={group} onChange={setGroup} />
        </div>
      </header>

      <main id="inhalt" className="relative flex-1">
        {center ? (
          <PlaygroundMap
            center={center}
            playgrounds={world.playgrounds}
            group={activeGroup}
            onSelect={setSelected}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-ink-soft">
            Kein Standort gewählt. Gehe zurück zur Liste und wähle einen Ort.
          </div>
        )}

        {selected ? (
          <div className="absolute inset-x-0 bottom-0 z-[1000] p-3">
            <div className="card mx-auto max-w-2xl space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold leading-tight">{selected.name}</h2>
                  <p className="text-sm text-ink-soft">
                    {formatDistance(selected.distanceM)} · ca.{" "}
                    {walkingMinutes(selected.distanceM)} Min. zu Fuß
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="tap flex items-center justify-center rounded-full bg-sand-deep px-4 text-lg"
                  aria-label="Schließen"
                >
                  <Glyph name="schliessen" className="h-5 w-5" />
                </button>
              </div>

              <SelectedScore playground={selected} group={activeGroup} label={groupLabel} />

              <Link
                href={`/spielplatz/?id=${encodeURIComponent(selected.id)}`}
                className="tap flex w-full items-center justify-center rounded-2xl bg-ink px-4 text-lg font-bold text-white"
              >
                Details ansehen
              </Link>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function SelectedScore({
  playground,
  group,
  label,
}: {
  playground: PlaygroundWithDistance;
  group: ReturnType<typeof useAgeGroup>[0] | "alle";
  label: string;
}) {
  const aggregate = aggregateFor(
    ratingsForPlayground(playground),
    group ?? "alle",
  );
  return (
    <ScoreSmileys
      score={aggregate.score}
      count={aggregate.count}
      groupLabel={label}
      linkToScale={false}
    />
  );
}
