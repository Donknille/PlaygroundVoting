import { AGE_GROUPS, ageGroupForAge } from "./questions";
import type {
  AgeGroupId,
  AnswerValue,
  Coords,
  FeatureKey,
  HighlightKey,
  Playground,
  QuestionId,
  Rating,
} from "./types";

/**
 * Beispielwelt für den Demo-Modus.
 *
 * Wird gebraucht, wenn kein Netz da ist, Overpass nicht antwortet oder jemand die
 * App ohne echte Daten ausprobieren will. Alles hier Erzeugte ist deterministisch
 * (gleicher Standort → gleiche Welt) und im Produkt durchgängig als „Demo"
 * gekennzeichnet. Es sind ausdrücklich KEINE echten Kinderstimmen.
 */

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEMO_PLACES: {
  name: string;
  features: FeatureKey[];
  equipment: HighlightKey[];
  bestFor: AgeGroupId;
}[] = [
  {
    name: "Spielplatz Sonnenwiese",
    features: ["sand", "zaun", "kleinkind"],
    equipment: ["rutsche", "schaukel", "sand"],
    bestFor: "kita",
  },
  {
    name: "Abenteuerplatz Drachenhügel",
    features: ["sand"],
    equipment: ["klettern", "seilbahn", "rutsche"],
    bestFor: "schule",
  },
  {
    name: "Wasserspielplatz Blaue Welle",
    features: ["wasser", "toilette", "sand"],
    equipment: ["wasser", "sand", "schaukel"],
    bestFor: "kita",
  },
  {
    name: "Kleiner Spielplatz Amselweg",
    features: ["zaun", "kleinkind"],
    equipment: ["schaukel", "sand"],
    bestFor: "krabbler",
  },
  {
    name: "Waldspielplatz Fuchsbau",
    features: ["sand"],
    equipment: ["klettern", "wippe", "rutsche"],
    bestFor: "schule",
  },
  {
    name: "Spielplatz am Stadtpark",
    features: ["toilette", "barrierefrei", "sand", "beleuchtung"],
    equipment: ["rutsche", "karussell", "schaukel"],
    bestFor: "kita",
  },
  {
    name: "Kletterinsel Nordring",
    features: ["beleuchtung"],
    equipment: ["klettern", "trampolin"],
    bestFor: "grosse",
  },
  {
    name: "Spielplatz Kastanienhof",
    features: ["zaun", "sand", "kleinkind"],
    equipment: ["sand", "wippe", "rutsche"],
    bestFor: "krabbler",
  },
  {
    name: "Bolzplatz Grüner Anger",
    features: ["beleuchtung"],
    equipment: ["klettern"],
    bestFor: "grosse",
  },
  {
    name: "Piratenschiff am Mühlweg",
    features: ["sand", "zaun"],
    equipment: ["klettern", "rutsche", "sand"],
    bestFor: "kita",
  },
  {
    name: "Spielplatz Rosenweg",
    features: ["kleinkind", "zaun"],
    equipment: ["schaukel", "rutsche"],
    bestFor: "krabbler",
  },
  {
    name: "Trampolinwiese Südpark",
    features: ["toilette", "barrierefrei"],
    equipment: ["trampolin", "seilbahn", "karussell"],
    bestFor: "schule",
  },
  {
    name: "Spielplatz Lindenplatz",
    features: ["sand"],
    equipment: ["rutsche", "schaukel", "wippe"],
    bestFor: "kita",
  },
  {
    name: "Skate- und Spielfläche Hafenkante",
    features: ["beleuchtung", "toilette"],
    equipment: ["klettern", "trampolin"],
    bestFor: "grosse",
  },
];

const GROUP_INDEX: Record<AgeGroupId, number> = {
  krabbler: 0,
  kita: 1,
  schule: 2,
  grosse: 3,
};

/** Rundet den Mittelpunkt, damit GPS-Zittern nicht ständig eine neue Welt erzeugt. */
function stableSeed(center: Coords): number {
  return hashString(`${center.lat.toFixed(2)}:${center.lon.toFixed(2)}`);
}

export function demoPlaygrounds(center: Coords): Playground[] {
  const rnd = mulberry32(stableSeed(center));
  return DEMO_PLACES.map((place, index) => {
    const angle = rnd() * Math.PI * 2;
    const distance = 180 + rnd() * 2500;
    const dLat = (distance * Math.cos(angle)) / 111320;
    const dLon =
      (distance * Math.sin(angle)) /
      (111320 * Math.max(0.2, Math.cos((center.lat * Math.PI) / 180)));
    return {
      id: `demo-${index}`,
      name: place.name,
      lat: center.lat + dLat,
      lon: center.lon + dLon,
      source: "demo" as const,
      features: place.features,
      equipment: place.equipment,
    };
  });
}

function answerFrom(rnd: () => number, strength: number): AnswerValue {
  const value = strength * 0.8 + rnd() * 0.36;
  if (value < 0.44) return 0;
  if (value < 0.74) return 1;
  return 2;
}

function ageForGroup(rnd: () => number, groupId: AgeGroupId): number {
  const group = AGE_GROUPS[GROUP_INDEX[groupId]];
  const max = Math.min(group.max, 12);
  return group.min + Math.floor(rnd() * (max - group.min + 1));
}

export function demoRatings(playgroundId: string): Rating[] {
  const index = Number(playgroundId.replace("demo-", ""));
  const place = DEMO_PLACES[index];
  if (!place) return [];

  const rnd = mulberry32(hashString(`ratings:${playgroundId}`));
  const quality = 0.28 + rnd() * 0.66;
  const shade = rnd();
  const crowd = rnd();
  // Rund jeder siebte Platz bleibt bewusst unter der Anzeigeschwelle: der Zustand
  // „noch zu wenig Stimmen" muss im Produkt sichtbar sein, nicht wegdesignt werden.
  const roll = rnd();
  const count = roll < 0.15 ? Math.floor(roll * 14) : 4 + Math.floor(roll * 24);

  const ratings: Rating[] = [];
  for (let i = 0; i < count; i += 1) {
    // Die passende Altersgruppe ist überrepräsentiert – so wie im echten Leben.
    const groupRoll = rnd();
    const bestIndex = GROUP_INDEX[place.bestFor];
    const drift = groupRoll < 0.55 ? 0 : groupRoll < 0.85 ? 1 : 2;
    const direction = rnd() < 0.5 ? -1 : 1;
    const groupIndex = Math.min(3, Math.max(0, bestIndex + drift * direction));
    const groupId = AGE_GROUPS[groupIndex].id;
    const age = ageForGroup(rnd, groupId);

    const fit = Math.max(0.12, 1 - Math.abs(groupIndex - bestIndex) * 0.34);
    const answers: Record<QuestionId, AnswerValue> = {
      spass: answerFrom(rnd, quality * fit),
      bleiben: answerFrom(rnd, quality * fit * 0.94),
      toben: answerFrom(rnd, quality * (0.45 + 0.55 * fit)),
      kinder: answerFrom(rnd, crowd),
      schatten: answerFrom(rnd, shade),
    };

    const highlights: HighlightKey[] = [];
    if (answers.spass > 0 && place.equipment.length > 0) {
      highlights.push(place.equipment[Math.floor(rnd() * place.equipment.length)]);
      if (rnd() < 0.3) {
        const second = place.equipment[Math.floor(rnd() * place.equipment.length)];
        if (!highlights.includes(second)) highlights.push(second);
      }
    }

    const daysAgo = Math.floor(rnd() * 120);
    const date = new Date(Date.now() - daysAgo * 86400000);

    ratings.push({
      id: `${playgroundId}:demo:${i}`,
      playgroundId,
      age,
      ageGroup: ageGroupForAge(age),
      answers,
      highlights,
      day: date.toISOString().slice(0, 10),
      demo: true,
    });
  }
  return ratings;
}
