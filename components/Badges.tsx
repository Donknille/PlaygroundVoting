import { featureMeta, highlightMeta } from "@/lib/questions";
import type { FeatureKey, HighlightKey } from "@/lib/types";

export function Pill({
  emoji,
  children,
  tone = "neutral",
}: {
  emoji: string;
  children: React.ReactNode;
  tone?: "neutral" | "gruen" | "blau" | "lila";
}) {
  const tones = {
    neutral: "bg-sand-deep text-ink",
    gruen: "bg-grass-soft text-ink",
    blau: "bg-sky-soft text-ink",
    lila: "bg-plum-soft text-ink",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${tones[tone]}`}
    >
      <span aria-hidden="true">{emoji}</span>
      {children}
    </span>
  );
}

/** Ausstattung aus OpenStreetMap. */
export function FeatureBadges({
  features,
  limit,
}: {
  features: FeatureKey[];
  limit?: number;
}) {
  const shown = limit ? features.slice(0, limit) : features;
  if (shown.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((key) => {
        const meta = featureMeta(key);
        return (
          <Pill key={key} emoji={meta.emoji} tone="blau">
            {meta.label}
          </Pill>
        );
      })}
    </div>
  );
}

/** Das, was Kinder als „am besten" ausgewählt haben. */
export function HighlightBadges({
  highlights,
  limit,
}: {
  highlights: { key: HighlightKey; count: number }[];
  limit?: number;
}) {
  const shown = limit ? highlights.slice(0, limit) : highlights;
  if (shown.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map(({ key, count }) => {
        const meta = highlightMeta(key);
        return (
          <Pill key={key} emoji={meta.emoji} tone="lila">
            {meta.label}
            <span className="text-ink-soft">×{count}</span>
          </Pill>
        );
      })}
    </div>
  );
}
