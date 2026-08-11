import Link from "next/link";
import { MIN_RATINGS_FOR_SCORE } from "@/lib/config";
import { formatScore } from "@/lib/scoring";

type Props = {
  score: number | null;
  count: number;
  groupLabel: string;
  size?: "sm" | "lg";
  /** Blendet den Erklärlink aus, wenn er auf der Seite ohnehin schon steht. */
  linkToScale?: boolean;
};

/**
 * Punktwert plus Herkunft – die beiden gehören zusammen und werden nie getrennt
 * dargestellt. Wer den Wert sieht, sieht auch, worauf er beruht.
 */
export function ScoreSmileys({
  score,
  count,
  groupLabel,
  size = "sm",
  linkToScale = true,
}: Props) {
  const big = size === "lg";

  if (count === 0) {
    return (
      <p className={big ? "text-lg font-semibold" : "text-sm font-semibold"}>
        <span className="text-sun">★</span> Noch keine Bewertung —{" "}
        <span className="text-ink-soft font-medium">sei die Erste!</span>
      </p>
    );
  }

  if (score === null) {
    return (
      <p className={big ? "text-base" : "text-sm"}>
        <span className="font-semibold">{count} von {MIN_RATINGS_FOR_SCORE} Stimmen</span>{" "}
        <span className="text-ink-soft">
          — ab {MIN_RATINGS_FOR_SCORE} zeigen wir Punkte ({groupLabel})
        </span>
      </p>
    );
  }

  const filled = Math.round(score);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span
        className={`inline-flex items-center gap-2 rounded-full bg-sun-soft px-3 font-bold text-ink ${
          big ? "py-2 text-2xl" : "py-1 text-lg"
        }`}
      >
        <span aria-hidden="true">{filled >= 4 ? "🤩" : filled >= 3 ? "🙂" : "😐"}</span>
        {formatScore(score)}
        <span className={`font-medium text-ink-soft ${big ? "text-lg" : "text-sm"}`}>
          / 5
        </span>
      </span>

      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={`${big ? "text-lg" : "text-sm"} ${
              step <= filled ? "opacity-100" : "opacity-20 grayscale"
            }`}
          >
            😄
          </span>
        ))}
      </span>

      {linkToScale ? (
        <Link
          href="/so-bewerten-wir"
          className={`text-ink-soft underline decoration-dotted underline-offset-4 ${
            big ? "text-base" : "text-xs"
          }`}
        >
          {`aus ${count} ${count === 1 ? "Bewertung" : "Bewertungen"} von Kindern (${groupLabel})`}
        </Link>
      ) : (
        <span className={`text-ink-soft ${big ? "text-base" : "text-xs"}`}>
          {`aus ${count} ${count === 1 ? "Bewertung" : "Bewertungen"} von Kindern (${groupLabel})`}
        </span>
      )}
    </div>
  );
}
