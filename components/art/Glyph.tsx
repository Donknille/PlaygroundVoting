/**
 * Einfarbige Bedienzeichen. Erben die Textfarbe (`currentColor`), damit sie in
 * jedem Knopf und auf jedem Untergrund automatisch passen.
 *
 * Getrennt von den bunten Bildzeichen (Pictogram), weil sie eine andere Aufgabe
 * haben: Sie zeigen keine Sache, sondern eine Handlung.
 */

export type GlyphName =
  | "standort"
  | "karte"
  | "liste"
  | "lautsprecher"
  | "stumm"
  | "haken"
  | "zurueck"
  | "weiter"
  | "route"
  | "muell"
  | "aktualisieren"
  | "info"
  | "schliessen"
  | "kind"
  | "suche";

const PATHS: Record<GlyphName, React.ReactNode> = {
  standort: (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  karte: (
    <>
      <path d="M9 4L3 6.5v13.5L9 17.5m0-13.5v13.5m0-13.5L15 6.5m0 0L21 4v13.5L15 20m0-13.5V20m0 0L9 17.5" />
    </>
  ),
  liste: <path d="M4 6h16M4 12h16M4 18h10" />,
  lautsprecher: (
    <>
      <path d="M11 5L6.5 9H3v6h3.5L11 19z" />
      <path d="M15.5 9.2a4 4 0 010 5.6M18.5 6.5a8 8 0 010 11" />
    </>
  ),
  stumm: (
    <>
      <path d="M11 5L6.5 9H3v6h3.5L11 19z" />
      <path d="M16 10l5 4M21 10l-5 4" />
    </>
  ),
  haken: <path d="M4.5 12.5l5 5 10-11" />,
  zurueck: <path d="M15 5l-7 7 7 7" />,
  weiter: <path d="M9 5l7 7-7 7" />,
  route: <path d="M3.5 11.5l17-7.5-7.5 17-2-7z" />,
  muell: (
    <>
      <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
      <path d="M10.5 11v5M13.5 11v5" />
    </>
  ),
  aktualisieren: (
    <>
      <path d="M20 12a8 8 0 11-2.6-5.9" />
      <path d="M20.5 3.5V9H15" />
    </>
  ),
  schliessen: <path d="M6 6l12 12M18 6L6 18" />,
  /* Der Knopf in den Kinder-Modus — im Elternteil der einzige gelbe Punkt. */
  kind: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8.2 14c1.7 2.3 6 2.3 7.6 0" />
      <path d="M9 9.6v.01M15 9.6v.01" strokeWidth="2.6" />
    </>
  ),
  suche: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.2 16.2L21 21" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.01" />
    </>
  ),
};

export function Glyph({
  name,
  className = "h-6 w-6",
  filled = false,
}: {
  name: GlyphName;
  className?: string;
  /** Für Zeichen, die als Fläche besser lesbar sind (Standortnadel, Routenpfeil). */
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {PATHS[name]}
    </svg>
  );
}
