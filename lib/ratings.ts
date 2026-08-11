"use client";

import { STORAGE_KEYS } from "./config";
import { ageGroupForAge } from "./questions";
import type { AnswerValue, HighlightKey, QuestionId, Rating } from "./types";

/**
 * Bewertungsspeicher im Gerät. Kein Konto, kein Server, keine Personendaten.
 * Gespeichert wird ausschließlich: Spielplatz-ID, Alter, Antworten, Tagesdatum.
 */

function readAll(): Rating[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.ratings);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Rating[]) : [];
  } catch {
    return [];
  }
}

function writeAll(ratings: Rating[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.ratings, JSON.stringify(ratings));
  } catch {
    // Speicher voll oder gesperrt – die Bewertung geht verloren, die App bleibt nutzbar.
  }
}

export function getOwnRatings(): Rating[] {
  return readAll();
}

export function getOwnRatingsFor(playgroundId: string): Rating[] {
  return readAll().filter((r) => r.playgroundId === playgroundId);
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Ein Votum pro Gerät, Spielplatz und Tag – einfachster wirksamer Spamschutz. */
export function hasRatedToday(playgroundId: string): boolean {
  const day = today();
  return readAll().some((r) => r.playgroundId === playgroundId && r.day === day);
}

export function saveRating(input: {
  playgroundId: string;
  age: number;
  answers: Record<QuestionId, AnswerValue>;
  highlights: HighlightKey[];
}): Rating {
  const rating: Rating = {
    id: `${input.playgroundId}:${today()}:${Math.random().toString(36).slice(2, 8)}`,
    playgroundId: input.playgroundId,
    age: input.age,
    ageGroup: ageGroupForAge(input.age),
    answers: input.answers,
    highlights: input.highlights,
    day: today(),
  };
  writeAll([...readAll(), rating]);
  return rating;
}

export function deleteAllRatings(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.ratings);
  } catch {
    // ignorieren
  }
}
