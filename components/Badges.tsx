import { Art } from "@/components/art/Art";
import { featureMeta, highlightMeta } from "@/lib/questions";
import type { FeatureKey, HighlightKey } from "@/lib/types";

export function Pill({
  art,
  children,
  tone = "neutral",
}: {
  art: string;
  children: React.ReactNode;
  tone?: "neutral" | "gruen" | "blau" | "lila" | "beere";
}) {
  const tones = {
    neutral: "bg-line",
    gruen: "bg-grass-soft",
    blau: "bg-sky-soft",
    lila: "bg-sky-soft",
    beere: "bg-coral-soft",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-1.5 text-sm font-bold text-ink ${tones[tone]}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/70">
        <Art name={art} className="h-4.5 w-4.5" />
      </span>
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
    <>
      {shown.map((key) => {
        const meta = featureMeta(key);
        return (
          <Pill key={key} art={meta.art} tone="blau">
            {meta.label}
          </Pill>
        );
      })}
    </>
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
    <>
      {shown.map(({ key, count }) => {
        const meta = highlightMeta(key);
        return (
          <Pill key={key} art={meta.art} tone="lila">
            {meta.label}
            {count > 0 ? <span className="text-ink-soft">×{count}</span> : null}
          </Pill>
        );
      })}
    </>
  );
}
