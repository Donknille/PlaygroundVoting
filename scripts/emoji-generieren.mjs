/**
 * Erzeugt components/art/emoji.generated.ts aus Fluent Emoji Flat (Microsoft, MIT).
 *
 * Warum generiert statt zur Laufzeit geladen: Die App ist ein statischer Export
 * und soll offline funktionieren. Es landen ausschließlich die Zeichen im
 * Bundle, die hier aufgeführt sind — nicht der ganze Satz mit über 3000 Bildern.
 *
 * Neu erzeugen mit:  node scripts/emoji-generieren.mjs
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const SATZ = require("@iconify-json/fluent-emoji-flat/icons.json");

/**
 * Zuordnung Bildname → Emoji. Nicht enthalten sind Schaukel, Wippe, Zaun und
 * Trampolin (dafür gibt es kein Emoji) sowie die gefüllten Uhren, die als
 * Mengenskala eigens gezeichnet sind. Die bleiben eigene Zeichnungen.
 */
const ZUORDNUNG = {
  // Spielgeräte
  rutsche: "playground-slide",
  klettern: "person-climbing",
  sand: "bucket",
  wasser: "sweat-droplets",
  seilbahn: "aerial-tramway",
  karussell: "carousel-horse",
  // Ausstattung
  toilette: "restroom",
  barrierefrei: "wheelchair-symbol",
  beleuchtung: "light-bulb",
  kleinkind: "baby-bottle",
  // Altersgruppen
  krabbler: "baby-bottle",
  kita: "teddy-bear",
  schule: "backpack",
  grosse: "skateboard",
  // Fragen- und Antwortbilder
  uhr: "alarm-clock",
  baum: "deciduous-tree",
  sonne: "sun",
  halbschatten: "sun-behind-cloud",
  party: "party-popper",
  "toben-wenig": "person-standing",
  "toben-mittel": "person-running",
  "toben-viel": "person-cartwheeling",
  // Baustein für die Kindergruppen — ein Kind, mehrfach gesetzt
  kind: "child",
  // Sonstiges
  stern: "star",
  medaille: "sports-medal",
  fernglas: "magnifying-glass-tilted-left",
  kolben: "test-tube",
  rathaus: "classical-building",
  schloss: "locked",
  lineal: "straight-ruler",
  // Gesichter — dieselbe Quelle für Antwort und Urteil
  "face-0": "neutral-face",
  "face-1": "slightly-smiling-face",
  "face-2": "star-struck",
};

const breite = SATZ.width ?? 32;
const hoehe = SATZ.height ?? 32;

const eintraege = [];
const fehlend = [];
for (const [name, emoji] of Object.entries(ZUORDNUNG)) {
  const icon = SATZ.icons[emoji];
  if (!icon) {
    fehlend.push(`${name} -> ${emoji}`);
    continue;
  }
  const vb = `0 0 ${icon.width ?? breite} ${icon.height ?? hoehe}`;
  eintraege.push(
    `  ${JSON.stringify(name)}: { viewBox: ${JSON.stringify(vb)}, body: ${JSON.stringify(icon.body)} },`,
  );
}

if (fehlend.length > 0) {
  console.error("Fehlende Zeichen:\n  " + fehlend.join("\n  "));
  process.exit(1);
}

const inhalt = `// Automatisch erzeugt von scripts/emoji-generieren.mjs — nicht von Hand ändern.
//
// Quelle: Fluent Emoji (Microsoft), MIT-Lizenz.
// https://github.com/microsoft/fluentui-emoji
//
// Enthalten sind nur die ${eintraege.length} Zeichen, die die App tatsächlich benutzt.

export type EmojiEintrag = { viewBox: string; body: string };

export const EMOJI: Record<string, EmojiEintrag> = {
${eintraege.join("\n")}
};
`;

writeFileSync(new URL("../components/art/emoji.generated.ts", import.meta.url), inhalt);
console.log(`${eintraege.length} Zeichen geschrieben (${Math.round(inhalt.length / 1024)} KB).`);
