"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Glyph } from "@/components/art/Glyph";
import { FeatureBadges, HighlightBadges, Pill } from "@/components/Badges";
import { ScoreSmileys } from "@/components/ScoreSmileys";
import { formatDistance, walkingMinutes } from "@/lib/geo";
import { getAgeGroup } from "@/lib/questions";
import { aggregateFor, hasShadeBadge } from "@/lib/scoring";
import type { AgeGroupId, PlaygroundWithDistance } from "@/lib/types";
import { ratingsForPlayground } from "@/lib/world";

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

  const groupLabel =
    group === "alle" ? "alle Altersgruppen" : `${getAgeGroup(group).short} Jahre`;

  return (
    <Link
      href={`/spielplatz/?id=${encodeURIComponent(playground.id)}`}
      className="card block p-4 transition active:translate-y-[2px] active:shadow-[0_2px_12px_-8px_rgb(42_30_70/0.4)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg leading-tight font-bold">{playground.name}</h3>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-grass-soft px-2.5 py-1 text-sm font-bold text-grass-deep">
          <Glyph name="standort" filled className="h-4 w-4" />
          {formatDistance(playground.distanceM)}
        </span>
      </div>

      <p className="mt-0.5 text-sm font-semibold text-ink-soft">
        ca. {walkingMinutes(playground.distanceM)} Min. zu Fuß
        {playground.source === "demo" ? " · Demo-Platz" : ""}
      </p>

      <div className="mt-3">
        <ScoreSmileys
          score={forGroup.score}
          count={forGroup.count}
          groupLabel={groupLabel}
          linkToScale={false}
        />
        {forGroup.count === 0 && overall.score !== null ? (
          <p className="mt-1 text-xs font-semibold text-ink-soft">
            Für andere Altersgruppen liegen {overall.count} Bewertungen vor.
          </p>
        ) : null}
      </div>

      {(shade || playground.features.length > 0 || forGroup.highlights.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {shade ? (
            <Pill art="baum" tone="gruen">
              Schattig
            </Pill>
          ) : null}
          <HighlightBadges highlights={forGroup.highlights} limit={2} />
          <FeatureBadges features={playground.features} limit={2} />
        </div>
      )}
    </Link>
  );
}
