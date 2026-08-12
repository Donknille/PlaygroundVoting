import { MIN_RATINGS_FOR_SCORE } from "./config";
import {
  ANSWER_POINTS,
  AGE_GROUPS,
  QUESTIONS,
  SCORED_QUESTIONS,
} from "./questions";
import type {
  AgeGroupId,
  AnswerValue,
  HighlightKey,
  QuestionId,
  Rating,
} from "./types";

export type Aggregate = {
  count: number;
  /** Spaß-Punkte 1–5. null, solange zu wenige Bewertungen vorliegen. */
  score: number | null;
  /** Median je Frage auf der Rohskala 0–2. */
  perQuestion: Record<QuestionId, number | null>;
  highlights: { key: HighlightKey; count: number }[];
};

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Punktwert einer einzelnen Bewertung – nur gewichtete Fragen zählen. */
export function scoreOfRating(rating: Rating): number {
  let summe = 0;
  let gewicht = 0;
  for (const q of SCORED_QUESTIONS) {
    const answer = rating.answers[q.id];
    if (answer === undefined) continue;
    summe += q.weight * ANSWER_POINTS[answer];
    gewicht += q.weight;
  }
  // Auf die tatsächlich beantworteten Fragen normieren, damit eine
  // übersprungene Zusatzfrage den Wert nicht nach unten zieht.
  return gewicht === 0 ? 0 : summe / gewicht;
}

/**
 * Aggregiert über den Median je Frage statt über den Mittelwert.
 * Ein einzelner Ausreißer (oder Spaßvogel) kippt damit kein Ergebnis.
 */
export function aggregate(ratings: Rating[]): Aggregate {
  const perQuestion = {} as Record<QuestionId, number | null>;
  for (const q of QUESTIONS) {
    const werte = ratings
      .map((r) => r.answers[q.id])
      .filter((v): v is AnswerValue => v !== undefined);
    perQuestion[q.id] = werte.length > 0 ? median(werte) : null;
  }

  const highlightCounts = new Map<HighlightKey, number>();
  for (const rating of ratings) {
    for (const key of rating.highlights) {
      highlightCounts.set(key, (highlightCounts.get(key) ?? 0) + 1);
    }
  }

  const score =
    ratings.length >= MIN_RATINGS_FOR_SCORE
      ? (() => {
          let summe = 0;
          let gewicht = 0;
          for (const q of SCORED_QUESTIONS) {
            const medianAnswer = perQuestion[q.id];
            if (medianAnswer === null) continue;
            // Zwischen den Stufen linear interpolieren (Median kann x,5 sein).
            const low = ANSWER_POINTS[Math.floor(medianAnswer) as AnswerValue];
            const high = ANSWER_POINTS[Math.ceil(medianAnswer) as AnswerValue];
            const frac = medianAnswer - Math.floor(medianAnswer);
            summe += q.weight * (low + (high - low) * frac);
            gewicht += q.weight;
          }
          return gewicht === 0 ? null : summe / gewicht;
        })()
      : null;

  return {
    count: ratings.length,
    score: score === null ? null : Math.round(score * 10) / 10,
    perQuestion,
    highlights: [...highlightCounts.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count),
  };
}

export function ratingsForGroup(ratings: Rating[], group: AgeGroupId | "alle"): Rating[] {
  return group === "alle" ? ratings : ratings.filter((r) => r.ageGroup === group);
}

export function aggregateFor(
  ratings: Rating[],
  group: AgeGroupId | "alle",
): Aggregate {
  return aggregate(ratingsForGroup(ratings, group));
}

export function aggregatesByAgeGroup(
  ratings: Rating[],
): { group: AgeGroupId; aggregate: Aggregate }[] {
  return AGE_GROUPS.map((g) => ({
    group: g.id,
    aggregate: aggregateFor(ratings, g.id),
  }));
}

/** Median der Schattenfrage ≥ 1,5 → der Platz bekommt das Schatten-Abzeichen. */
export function hasShadeBadge(agg: Aggregate): boolean {
  const schatten = agg.perQuestion.schatten;
  return agg.count >= MIN_RATINGS_FOR_SCORE && schatten !== null && schatten >= 1.5;
}

export function formatScore(score: number): string {
  return score.toFixed(1).replace(".", ",");
}

/** Kurze, ehrliche Herkunftsangabe – steht überall direkt am Punktwert. */
export function scoreProvenance(count: number, groupLabel: string): string {
  if (count === 0) return "Noch keine Bewertung";
  const plural = count === 1 ? "Bewertung" : "Bewertungen";
  return `aus ${count} ${plural} von Kindern (${groupLabel})`;
}

/**
 * Das Urteil als Wort statt als Note.
 *
 * Entwurfsprinzip: „Pins zeigen das Kinderurteil als Wort, nicht als Note."
 * Kinder denken nicht in 3,7 von 5 — und Eltern wollen im Vorbeigehen eine
 * Antwort, keine Nachkommastelle. Gerechnet wird intern weiter auf der
 * 1–5-Skala, damit das Kommunen-Dashboard und die Datenlizenzen die
 * Abstufung behalten; nach außen zeigen wir drei Wörter.
 */
export type Verdict = {
  wort: "Super" | "Okay" | "Geht so";
  /** CSS-Variable für den Punkt vor dem Wort. */
  farbe: string;
  /** Flächenfarbe, wenn das Urteil als Abzeichen erscheint. */
  flaeche: string;
};

export const VERDICT_UNBEWERTET: Verdict = {
  wort: "Geht so",
  farbe: "var(--color-ink-fainter)",
  flaeche: "var(--color-line)",
};

export function verdictFor(score: number): Verdict {
  if (score >= 4)
    return { wort: "Super", farbe: "var(--color-grass)", flaeche: "var(--color-grass-soft)" };
  if (score >= 2.75)
    return { wort: "Okay", farbe: "var(--color-sun)", flaeche: "var(--color-sun-soft)" };
  return { wort: "Geht so", farbe: "var(--color-coral)", flaeche: "var(--color-coral-soft)" };
}
