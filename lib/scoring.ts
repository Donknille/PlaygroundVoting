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
  perQuestion: Record<QuestionId, number>;
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
  return SCORED_QUESTIONS.reduce((sum, q) => {
    const answer = rating.answers[q.id];
    return sum + q.weight * ANSWER_POINTS[answer];
  }, 0);
}

/**
 * Aggregiert über den Median je Frage statt über den Mittelwert.
 * Ein einzelner Ausreißer (oder Spaßvogel) kippt damit kein Ergebnis.
 */
export function aggregate(ratings: Rating[]): Aggregate {
  const perQuestion = {} as Record<QuestionId, number>;
  for (const q of QUESTIONS) {
    perQuestion[q.id] = median(ratings.map((r) => r.answers[q.id] ?? 0));
  }

  const highlightCounts = new Map<HighlightKey, number>();
  for (const rating of ratings) {
    for (const key of rating.highlights) {
      highlightCounts.set(key, (highlightCounts.get(key) ?? 0) + 1);
    }
  }

  const score =
    ratings.length >= MIN_RATINGS_FOR_SCORE
      ? SCORED_QUESTIONS.reduce((sum, q) => {
          const medianAnswer = perQuestion[q.id];
          // Zwischen den Stufen linear interpolieren (Median kann x,5 sein).
          const low = ANSWER_POINTS[Math.floor(medianAnswer) as AnswerValue];
          const high = ANSWER_POINTS[Math.ceil(medianAnswer) as AnswerValue];
          const frac = medianAnswer - Math.floor(medianAnswer);
          return sum + q.weight * (low + (high - low) * frac);
        }, 0)
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
  return agg.count >= MIN_RATINGS_FOR_SCORE && agg.perQuestion.schatten >= 1.5;
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
