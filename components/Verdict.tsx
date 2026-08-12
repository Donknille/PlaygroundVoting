import Link from "next/link";
import { MIN_RATINGS_FOR_SCORE } from "@/lib/config";
import { verdictFor } from "@/lib/scoring";

/**
 * Das Kinderurteil als Wort.
 *
 * Entwurfsprinzip: „Pins zeigen das Kinderurteil als Wort, nicht als Note."
 * Der Punktwert existiert weiterhin — er wird nur nicht mehr angezeigt, weil
 * eine Nachkommastelle für Eltern im Vorbeigehen nichts aussagt und für Kinder
 * ohnehin bedeutungslos ist.
 *
 * Die Herkunft steht immer daneben („32 Kinder"). Ein Urteil ohne Angabe,
 * worauf es beruht, gibt es an keiner Stelle der App.
 */

export function VerdictBadge({
  score,
  size = "sm",
}: {
  score: number | null;
  size?: "sm" | "lg";
}) {
  const big = size === "lg";

  if (score === null) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full bg-line font-bold text-ink-soft ${
          big ? "px-4 py-2 text-lg" : "px-3 py-1.5 text-sm"
        }`}
      >
        <span
          className={`rounded-full bg-ink-fainter ${big ? "h-3.5 w-3.5" : "h-2.5 w-2.5"}`}
          aria-hidden="true"
        />
        Kein Urteil
      </span>
    );
  }

  const { wort, farbe, flaeche } = verdictFor(score);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-bold text-ink ${
        big ? "px-4 py-2 text-lg" : "px-3 py-1.5 text-sm"
      }`}
      style={{ background: flaeche }}
    >
      <span
        className={`rounded-full ${big ? "h-3.5 w-3.5" : "h-2.5 w-2.5"}`}
        style={{ background: farbe }}
        aria-hidden="true"
      />
      {wort}
    </span>
  );
}

/** Wie viele Kinder hinter dem Urteil stehen — nie weglassen. */
export function VerdictSource({
  count,
  groupLabel,
  className = "",
}: {
  count: number;
  groupLabel?: string;
  className?: string;
}) {
  if (count === 0) {
    return (
      <span className={`text-ink-faint ${className}`}>Sei die Erste!</span>
    );
  }
  return (
    <span className={`text-ink-faint ${className}`}>
      {count} {count === 1 ? "Kind" : "Kinder"}
      {groupLabel ? ` · ${groupLabel}` : ""}
    </span>
  );
}

/**
 * Urteil und Herkunft zusammen. Ersetzt die frühere Punkteanzeige und ist die
 * einzige Stelle, an der beides gerendert wird — dadurch können sie nicht
 * getrennt voneinander auftauchen.
 */
export function VerdictLine({
  score,
  count,
  groupLabel,
  size = "sm",
  linkToScale = true,
}: {
  score: number | null;
  count: number;
  groupLabel: string;
  size?: "sm" | "lg";
  linkToScale?: boolean;
}) {
  const big = size === "lg";
  const zuWenig = score === null && count > 0;

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <VerdictBadge score={score} size={size} />

      {zuWenig ? (
        <span className={`font-semibold text-ink-faint ${big ? "text-base" : "text-xs"}`}>
          {count} von {MIN_RATINGS_FOR_SCORE} Stimmen — ab {MIN_RATINGS_FOR_SCORE} zeigen wir
          ein Urteil
        </span>
      ) : linkToScale ? (
        <Link
          href="/so-bewerten-wir/"
          className={`font-semibold underline decoration-dotted underline-offset-4 ${
            big ? "text-base" : "text-xs"
          }`}
        >
          <VerdictSource count={count} groupLabel={groupLabel} />
        </Link>
      ) : (
        <VerdictSource
          count={count}
          groupLabel={groupLabel}
          className={`font-semibold ${big ? "text-base" : "text-xs"}`}
        />
      )}
    </div>
  );
}
