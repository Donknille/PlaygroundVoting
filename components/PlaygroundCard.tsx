"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Art } from "@/components/art/Art";
import { VerdictBadge, VerdictSource } from "@/components/Verdict";
import { formatDistance, walkingMinutes } from "@/lib/geo";
import { featureMeta, getAgeGroup, highlightMeta } from "@/lib/questions";
import { aggregateFor, hasShadeBadge } from "@/lib/scoring";
import type { AgeGroupId, PlaygroundWithDistance } from "@/lib/types";
import { ratingsForPlayground } from "@/lib/world";

/**
 * Eine Zeile in der Spielplatzliste, nach dem Entwurf:
 * Bild links, Name, eine Zeile Fakten, rechts das Urteil als Wort und darunter,
 * auf wie vielen Kindern es beruht.
 *
 * Der Entwurf fordert „Eltern sehen fünf Fakten in zwei Sekunden": Name,
 * Entfernung, Altersspanne, ein Merkmal, Urteil.
 */
export function PlaygroundCard({
  playground,
  group,
}: {
  playground: PlaygroundWithDistance;
  group: AgeGroupId | "alle";
}) {
  const { forGroup, overall, shade } = useMemo(() => {
    const ratings = ratingsForPlayground(playground);
    return {
      forGroup: aggregateFor(ratings, group),
      overall: aggregateFor(ratings, "alle"),
      shade: hasShadeBadge(aggregateFor(ratings, "alle")),
    };
  }, [playground, group]);

  const groupLabel = group === "alle" ? undefined : `${getAgeGroup(group).short} J.`;

  // Bild links: das meistgenannte Gerät der Kinder, sonst die erste Ausstattung.
  const bild =
    forGroup.highlights[0]?.key ??
    overall.highlights[0]?.key ??
    playground.equipment[0] ??
    null;
  const bildName = bild ? highlightMeta(bild).art : "rutsche";

  // Eine Faktenzeile, höchstens drei Angaben — sonst liest sie niemand.
  const fakten = [
    `${walkingMinutes(playground.distanceM)} Min`,
    formatDistance(playground.distanceM),
    shade ? "Schatten" : playground.features[0] ? featureMeta(playground.features[0]).label : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/spielplatz/?id=${encodeURIComponent(playground.id)}`}
      className="card flex items-center gap-3 p-3 transition active:translate-y-[1px]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-line">
        <Art name={bildName} className="h-9 w-9" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block font-display text-base leading-tight font-bold">
          {playground.name}
        </span>
        <span className="mt-0.5 block truncate text-sm text-ink-soft">
          {fakten.join(" · ")}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-1">
        <VerdictBadge score={forGroup.score} />
        <VerdictSource
          count={forGroup.count}
          groupLabel={groupLabel}
          className="text-[11px] font-semibold"
        />
      </span>
    </Link>
  );
}
