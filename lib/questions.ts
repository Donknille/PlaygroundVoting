import type {
  AgeGroupId,
  AnswerValue,
  FeatureKey,
  HighlightKey,
  QuestionId,
} from "./types";

/**
 * Single Source of Truth für den gesamten Bewertungsmaßstab.
 *
 * Sowohl der Kinder-Modus (/bewerten) als auch die Transparenzseite
 * (/so-bewerten-wir) rendern ausschließlich aus dieser Datei. Damit können
 * gestellte Frage und erklärte Frage nicht auseinanderlaufen.
 */

export type AnswerOption = {
  emoji: string;
  /** Kurzes Wort für Eltern und Screenreader. Kinder brauchen es nicht zu lesen. */
  label: string;
};

export type Question = {
  id: QuestionId;
  /** Frage in Kindersprache – kurz, konkret, keine Verneinung. */
  prompt: string;
  emoji: string;
  /** Anteil am Spaß-Punktwert. 0 = fließt bewusst nicht ein. */
  weight: number;
  /** Erklärung für Eltern und Kommunen auf der Transparenzseite. */
  explain: string;
  /** Immer drei Optionen, immer links = wenig, rechts = viel. */
  options: [AnswerOption, AnswerOption, AnswerOption];
};

export const QUESTIONS: Question[] = [
  {
    id: "spass",
    prompt: "War es lustig?",
    emoji: "🎉",
    weight: 0.4,
    explain:
      "Die Kernfrage. Alles andere beschreibt nur, warum es lustig war. Deshalb das größte Gewicht.",
    options: [
      { emoji: "😐", label: "Ging so" },
      { emoji: "🙂", label: "Ja, lustig" },
      { emoji: "🤩", label: "Superlustig" },
    ],
  },
  {
    id: "bleiben",
    prompt: "Wolltest du noch länger bleiben?",
    emoji: "⏰",
    weight: 0.3,
    explain:
      "Der ehrlichste Gegencheck: Kinder, die nur auf das lachende Gesicht tippen, wollen trotzdem nicht bei jedem Platz bleiben. Ein starker Hinweis auf echte Qualität.",
    options: [
      { emoji: "🚶", label: "Nein, kurz reicht" },
      { emoji: "🙂", label: "Ein bisschen" },
      { emoji: "🏕️", label: "Ganz lange!" },
    ],
  },
  {
    id: "toben",
    prompt: "Konntest du gut klettern und toben?",
    emoji: "🧗",
    weight: 0.2,
    explain:
      "Bewegungsangebot. Erklärt, warum ein Platz für die eine Altersgruppe super und für die andere langweilig ist.",
    options: [
      { emoji: "🧍", label: "Nicht wirklich" },
      { emoji: "🤸", label: "Ein bisschen" },
      { emoji: "🦸", label: "Super!" },
    ],
  },
  {
    id: "kinder",
    prompt: "Waren andere Kinder zum Spielen da?",
    emoji: "👧🧒",
    weight: 0.1,
    explain:
      "Gesellschaft. Wichtig für Kinder, aber stark von Tageszeit und Wetter abhängig – deshalb nur ein kleines Gewicht.",
    options: [
      { emoji: "🙍", label: "Keine" },
      { emoji: "👫", label: "Ein paar" },
      { emoji: "👨‍👩‍👧‍👦", label: "Viele" },
    ],
  },
  {
    id: "schatten",
    prompt: "War es schön schattig?",
    emoji: "🌳",
    weight: 0,
    explain:
      "Fließt bewusst NICHT in die Spaß-Punkte ein. Schatten ist ein Elternkriterium, kein Spaßkriterium – er erscheint stattdessen als eigenes Abzeichen am Spielplatz.",
    options: [
      { emoji: "☀️", label: "Volle Sonne" },
      { emoji: "⛅", label: "Halb schattig" },
      { emoji: "🌳", label: "Schön schattig" },
    ],
  },
];

export const SCORED_QUESTIONS = QUESTIONS.filter((q) => q.weight > 0);

export function getQuestion(id: QuestionId): Question {
  const q = QUESTIONS.find((item) => item.id === id);
  if (!q) throw new Error(`Unbekannte Frage: ${id}`);
  return q;
}

/** Antwort 0/1/2 wird auf die Punkteskala 1–5 abgebildet. */
export const ANSWER_POINTS: Record<AnswerValue, number> = { 0: 1, 1: 3, 2: 5 };

export type AgeGroup = {
  id: AgeGroupId;
  label: string;
  short: string;
  emoji: string;
  min: number;
  max: number;
};

export const AGE_GROUPS: AgeGroup[] = [
  { id: "krabbler", label: "Krabbler", short: "0–3", emoji: "🍼", min: 0, max: 3 },
  { id: "kita", label: "Kita-Kind", short: "4–6", emoji: "🧸", min: 4, max: 6 },
  { id: "schule", label: "Schulkind", short: "7–9", emoji: "🎒", min: 7, max: 9 },
  { id: "grosse", label: "Große", short: "10+", emoji: "🛹", min: 10, max: 99 },
];

export function ageGroupForAge(age: number): AgeGroupId {
  const group = AGE_GROUPS.find((g) => age >= g.min && age <= g.max);
  return group ? group.id : "grosse";
}

export function getAgeGroup(id: AgeGroupId): AgeGroup {
  const group = AGE_GROUPS.find((g) => g.id === id);
  if (!group) throw new Error(`Unbekannte Altersgruppe: ${id}`);
  return group;
}

/** Auswahl im Kinder-Modus nach den Fragen: „Was war am besten?" */
export const HIGHLIGHTS: { key: HighlightKey; emoji: string; label: string }[] = [
  { key: "rutsche", emoji: "🛝", label: "Rutsche" },
  // Für Schaukel und Wippe gibt es kein eigenes Emoji – gewählt ist jeweils das
  // Bild, das der Bewegung am nächsten kommt (hängender Sitz, Balken im Gleichgewicht).
  { key: "schaukel", emoji: "🎠", label: "Schaukel" },
  { key: "klettern", emoji: "🧗", label: "Klettern" },
  { key: "sand", emoji: "🏖️", label: "Sand" },
  { key: "wasser", emoji: "💦", label: "Wasser" },
  { key: "wippe", emoji: "⚖️", label: "Wippe" },
  { key: "seilbahn", emoji: "🚡", label: "Seilbahn" },
  { key: "karussell", emoji: "🎡", label: "Karussell" },
  { key: "trampolin", emoji: "🤸", label: "Trampolin" },
];

export function highlightMeta(key: HighlightKey) {
  return HIGHLIGHTS.find((h) => h.key === key) ?? { key, emoji: "⭐", label: key };
}

/** Ausstattungsabzeichen. Quelle steht dran, damit klar ist, was woher kommt. */
export const FEATURES: {
  key: FeatureKey;
  emoji: string;
  label: string;
  source: "OpenStreetMap";
}[] = [
  { key: "zaun", emoji: "🚧", label: "Eingezäunt", source: "OpenStreetMap" },
  { key: "wasser", emoji: "💦", label: "Wasserspiel", source: "OpenStreetMap" },
  { key: "sand", emoji: "🏖️", label: "Sand", source: "OpenStreetMap" },
  { key: "toilette", emoji: "🚻", label: "WC in der Nähe", source: "OpenStreetMap" },
  { key: "barrierefrei", emoji: "♿", label: "Barrierefrei", source: "OpenStreetMap" },
  { key: "beleuchtung", emoji: "💡", label: "Beleuchtet", source: "OpenStreetMap" },
  { key: "kleinkind", emoji: "🍼", label: "Kleinkindbereich", source: "OpenStreetMap" },
];

export function featureMeta(key: FeatureKey) {
  return (
    FEATURES.find((f) => f.key === key) ?? {
      key,
      emoji: "•",
      label: key,
      source: "OpenStreetMap" as const,
    }
  );
}
