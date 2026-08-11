export type QuestionId = "spass" | "bleiben" | "toben" | "kinder" | "schatten";

/** 0 = wenig, 1 = mittel, 2 = viel. Reihenfolge ist immer gleich (links → rechts). */
export type AnswerValue = 0 | 1 | 2;

export type AgeGroupId = "krabbler" | "kita" | "schule" | "grosse";

export type HighlightKey =
  | "rutsche"
  | "schaukel"
  | "sand"
  | "wasser"
  | "klettern"
  | "wippe"
  | "seilbahn"
  | "karussell"
  | "trampolin";

/** Ausstattung, die aus OpenStreetMap-Tags kommt – nicht aus Kinderbewertungen. */
export type FeatureKey =
  | "zaun"
  | "wasser"
  | "sand"
  | "toilette"
  | "barrierefrei"
  | "beleuchtung"
  | "kleinkind";

export type PlaygroundSource = "osm" | "demo";

export type Playground = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  source: PlaygroundSource;
  features: FeatureKey[];
  /** Geräte laut OSM-Tags (playground:*), rein informativ. */
  equipment: HighlightKey[];
};

export type Rating = {
  id: string;
  playgroundId: string;
  age: number;
  ageGroup: AgeGroupId;
  answers: Record<QuestionId, AnswerValue>;
  highlights: HighlightKey[];
  /** Auf den Tag gerundet – bewusst keine Uhrzeit, um Rückschlüsse zu vermeiden. */
  day: string;
  /** true = generierte Beispielbewertung, niemals eine echte Kinderstimme. */
  demo?: boolean;
};

export type Coords = { lat: number; lon: number };

export type PlaygroundWithDistance = Playground & { distanceM: number };
