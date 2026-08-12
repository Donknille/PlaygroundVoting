import { Icon } from "@/components/art/Icon";

/**
 * Löst einen Bildnamen aus lib/questions.ts in das passende Zeichen auf.
 *
 * Die Fragen-Datei bleibt dadurch frei von JSX: Sie beschreibt weiterhin nur,
 * *welches* Bild zu einer Antwort gehört, nicht wie es gezeichnet wird.
 */
export function Art({ name, className }: { name: string; className?: string }) {
  return <Icon name={name} className={className} />;
}
