import Link from "next/link";
import { Face, moodForScore } from "@/components/art/Face";
import { Pictogram } from "@/components/art/Pictogram";
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
 *
 * Das Gesicht im Wert ist dasselbe, das die Kinder im Bewerten-Ablauf angetippt
 * haben (components/art/Face.tsx). Damit ist der Punktwert nicht nur eine Zahl,
 * sondern zeigt, welche Antwort dahintersteht.
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
      <p
        className={`flex items-center gap-2 font-bold ${big ? "text-lg" : "text-sm"}`}
      >
        <Pictogram name="stern" className={big ? "h-7 w-7" : "h-5 w-5"} />
        Noch keine Bewertung —{" "}
        <span className="font-semibold text-ink-soft">sei die Erste!</span>
      </p>
    );
  }

  if (score === null) {
    return (
      <p className={big ? "text-base" : "text-sm"}>
        <span className="font-bold">
          {count} von {MIN_RATINGS_FOR_SCORE} Stimmen
        </span>{" "}
        <span className="text-ink-soft">
          — ab {MIN_RATINGS_FOR_SCORE} zeigen wir Punkte ({groupLabel})
        </span>
      </p>
    );
  }

  const filled = Math.round(score);
  const herkunft = `aus ${count} ${count === 1 ? "Bewertung" : "Bewertungen"} von Kindern (${groupLabel})`;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span
        className={`inline-flex items-center gap-2 rounded-full bg-sun-soft font-display font-bold text-ink ${
          big ? "py-1.5 pr-4 pl-1.5 text-3xl" : "py-1 pr-3 pl-1 text-xl"
        }`}
      >
        <Face mood={moodForScore(score)} className={big ? "h-10 w-10" : "h-7 w-7"} />
        {formatScore(score)}
        <span className={`font-sans font-bold text-ink-soft ${big ? "text-lg" : "text-sm"}`}>
          / 5
        </span>
      </span>

      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((step) => (
          <Face
            key={step}
            mood={2}
            className={`${big ? "h-6 w-6" : "h-4 w-4"} ${
              step <= filled ? "opacity-100" : "opacity-20 grayscale"
            }`}
          />
        ))}
      </span>

      {linkToScale ? (
        <Link
          href="/so-bewerten-wir/"
          className={`font-semibold text-ink-soft underline decoration-dotted underline-offset-4 ${
            big ? "text-base" : "text-xs"
          }`}
        >
          {herkunft}
        </Link>
      ) : (
        <span className={`font-semibold text-ink-soft ${big ? "text-base" : "text-xs"}`}>
          {herkunft}
        </span>
      )}
    </div>
  );
}
