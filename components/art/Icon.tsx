import { Pictogram, type PictogramName } from "@/components/art/Pictogram";
import { EMOJI } from "@/components/art/emoji.generated";

/**
 * Bildzeichen der App.
 *
 * Die meisten kommen aus einem fertigen, professionell gezeichneten Satz
 * (Fluent Emoji, Microsoft, MIT). Eigene Zeichnungen bleiben nur dort, wo es
 * kein Emoji gibt — Schaukel, Wippe, Zaun, Trampolin — und für die gefüllten
 * Uhren, die als Mengenskala eigens entworfen sind.
 *
 * Beide Wege sehen auf jedem Gerät gleich aus: Die Emoji liegen als SVG im
 * Bundle, es wird nichts vom System übernommen und nichts nachgeladen.
 */
export function Icon({ name, className }: { name: string; className?: string }) {
  // Kindergruppen entstehen aus demselben Kind, mehrfach gesetzt. Das ergibt
  // eine saubere Mengenskala — deutlicher als drei verschiedene Bilder.
  if (name === "kind-eins") return <Kindergruppe anzahl={1} className={className} />;
  if (name === "kind-paar") return <Kindergruppe anzahl={2} className={className} />;
  if (name === "kind-viele") return <Kindergruppe anzahl={4} className={className} />;

  const emoji = EMOJI[name];
  if (emoji) {
    return (
      <svg
        viewBox={emoji.viewBox}
        className={className}
        aria-hidden="true"
        focusable="false"
        role="presentation"
        dangerouslySetInnerHTML={{ __html: emoji.body }}
      />
    );
  }

  return <Pictogram name={name as PictogramName} className={className} />;
}

function Kindergruppe({ anzahl, className }: { anzahl: number; className?: string }) {
  const kind = EMOJI.kind;
  if (!kind) return null;

  // Zwei Reihen ab drei Kindern, damit die Gruppe kompakt bleibt.
  const spalten = anzahl > 2 ? 2 : anzahl;

  return (
    <span
      className={`grid place-items-center ${className ?? ""}`}
      style={{ gridTemplateColumns: `repeat(${spalten}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: anzahl }, (_, i) => (
        <svg
          key={i}
          viewBox={kind.viewBox}
          className="h-full w-full"
          focusable="false"
          role="presentation"
          dangerouslySetInnerHTML={{ __html: kind.body }}
        />
      ))}
    </span>
  );
}
