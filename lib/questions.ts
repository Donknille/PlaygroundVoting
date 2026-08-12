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
  /** Name des Bildzeichens, aufgelöst in components/art/Art.tsx. */
  art: string;
  /** Kurzes Wort für Eltern und Screenreader. Kinder brauchen es nicht zu lesen. */
  label: string;
};

export type Question = {
  id: QuestionId;
  /** Frage in Kindersprache – kurz, konkret, keine Verneinung. */
  prompt: string;
  art: string;
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
    art: "party",
    weight: 0.4,
    explain:
      "Die Kernfrage. Alles andere beschreibt nur, warum es lustig war. Deshalb das größte Gewicht.",
    options: [
      { art: "face-0", label: "Ging so" },
      { art: "face-1", label: "Ja, lustig" },
      { art: "face-2", label: "Superlustig" },
    ],
  },
  {
    id: "bleiben",
    prompt: "Wolltest du noch länger bleiben?",
    art: "uhr",
    weight: 0.3,
    explain:
      "Der ehrlichste Gegencheck: Kinder, die nur auf das lachende Gesicht tippen, wollen trotzdem nicht bei jedem Platz bleiben. Ein starker Hinweis auf echte Qualität.",
    options: [
      { art: "uhr-kurz", label: "Nein, kurz reicht" },
      { art: "uhr-mittel", label: "Ein bisschen" },
      { art: "uhr-lang", label: "Ganz lange!" },
    ],
  },
  {
    id: "toben",
    prompt: "Konntest du gut klettern und toben?",
    art: "klettern",
    weight: 0.2,
    explain:
      "Bewegungsangebot. Erklärt, warum ein Platz für die eine Altersgruppe super und für die andere langweilig ist.",
    options: [
      { art: "stehen", label: "Nicht wirklich" },
      { art: "huepfen", label: "Ein bisschen" },
      { art: "superheld", label: "Super!" },
    ],
  },
  {
    id: "kinder",
    prompt: "Waren andere Kinder zum Spielen da?",
    art: "kind-paar",
    weight: 0.1,
    explain:
      "Gesellschaft. Wichtig für Kinder, aber stark von Tageszeit und Wetter abhängig – deshalb nur ein kleines Gewicht.",
    options: [
      { art: "kind-eins", label: "Keine" },
      { art: "kind-paar", label: "Ein paar" },
      { art: "kind-viele", label: "Viele" },
    ],
  },
  {
    id: "schatten",
    prompt: "War es schön schattig?",
    art: "baum",
    weight: 0,
    explain:
      "Fließt bewusst NICHT in die Spaß-Punkte ein. Schatten ist ein Elternkriterium, kein Spaßkriterium – er erscheint stattdessen als eigenes Abzeichen am Spielplatz.",
    options: [
      { art: "sonne", label: "Volle Sonne" },
      { art: "halbschatten", label: "Halb schattig" },
      { art: "baum", label: "Schön schattig" },
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
  art: string;
  min: number;
  max: number;
};

export const AGE_GROUPS: AgeGroup[] = [
  { id: "krabbler", label: "Krabbler", short: "0–3", art: "krabbler", min: 0, max: 3 },
  { id: "kita", label: "Kita-Kind", short: "4–6", art: "kita", min: 4, max: 6 },
  { id: "schule", label: "Schulkind", short: "7–9", art: "schule", min: 7, max: 9 },
  { id: "grosse", label: "Große", short: "10+", art: "grosse", min: 10, max: 99 },
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
export const HIGHLIGHTS: { key: HighlightKey; art: string; label: string }[] = [
  { key: "rutsche", art: "rutsche", label: "Rutsche" },
  { key: "schaukel", art: "schaukel", label: "Schaukel" },
  { key: "klettern", art: "klettern", label: "Klettern" },
  { key: "sand", art: "sand", label: "Sand" },
  { key: "wasser", art: "wasser", label: "Wasser" },
  { key: "wippe", art: "wippe", label: "Wippe" },
  { key: "seilbahn", art: "seilbahn", label: "Seilbahn" },
  { key: "karussell", art: "karussell", label: "Karussell" },
  { key: "trampolin", art: "trampolin", label: "Trampolin" },
];

export function highlightMeta(key: HighlightKey) {
  return HIGHLIGHTS.find((h) => h.key === key) ?? { key, art: "stern", label: key };
}

/** Ausstattungsabzeichen. Quelle steht dran, damit klar ist, was woher kommt. */
export const FEATURES: {
  key: FeatureKey;
  art: string;
  label: string;
  source: "OpenStreetMap";
}[] = [
  { key: "zaun", art: "zaun", label: "Eingezäunt", source: "OpenStreetMap" },
  { key: "wasser", art: "wasser", label: "Wasserspiel", source: "OpenStreetMap" },
  { key: "sand", art: "sand", label: "Sand", source: "OpenStreetMap" },
  { key: "toilette", art: "toilette", label: "WC in der Nähe", source: "OpenStreetMap" },
  { key: "barrierefrei", art: "barrierefrei", label: "Barrierefrei", source: "OpenStreetMap" },
  { key: "beleuchtung", art: "beleuchtung", label: "Beleuchtet", source: "OpenStreetMap" },
  { key: "kleinkind", art: "kleinkind", label: "Kleinkindbereich", source: "OpenStreetMap" },
];

export function featureMeta(key: FeatureKey) {
  return (
    FEATURES.find((f) => f.key === key) ?? {
      key,
      art: "stern",
      label: key,
      source: "OpenStreetMap" as const,
    }
  );
}
