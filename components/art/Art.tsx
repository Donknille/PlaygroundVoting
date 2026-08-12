import { Face, type Mood } from "@/components/art/Face";
import { Pictogram, type PictogramName } from "@/components/art/Pictogram";

/**
 * Löst einen Bildnamen aus lib/questions.ts in das passende Zeichen auf.
 *
 * Die Fragen-Datei bleibt dadurch frei von JSX: Sie beschreibt weiterhin nur,
 * *welches* Bild zu einer Antwort gehört, nicht wie es gezeichnet wird. Der
 * Bewertungsmaßstab und seine Darstellung bleiben getrennt — genau wie vorher
 * bei den Emojis, nur jetzt mit eigenen Zeichnungen.
 */
export function Art({ name, className }: { name: string; className?: string }) {
  if (name.startsWith("face-")) {
    return <Face mood={Number(name.slice(5)) as Mood} className={className} />;
  }
  return <Pictogram name={name as PictogramName} className={className} />;
}
