/**
 * Eigene Zeichnungen für die Lücken im Standardsatz.
 *
 * Warum eigene SVGs: Ein Emoji sieht auf iOS, Android und Windows
 * unterschiedlich aus. Die Marke hätte damit kein festes Gesicht, und
 * ausgerechnet die Antwortbilder im Kinder-Modus wären auf jedem Gerät andere
 * Bilder. Diese Zeichen sehen überall gleich aus, skalieren scharf und nutzen
 * dieselbe Palette wie die restliche App (via CSS-Variablen aus globals.css).
 *
 * Raster: 32×32. Formensprache: flache Flächen, runde Enden, keine Umrisse.
 */

export type PictogramName =
  | "schaukel"
  | "wippe"
  | "trampolin"
  | "zaun"
  | "uhr-kurz"
  | "uhr-mittel"
  | "uhr-lang";

/** Kopf und Schultern — Grundfigur für die Kinder-Antwortbilder. */
function Kid({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill={color}>
      <circle cx={x} cy={y} r="3.4" />
      <path d={`M${x - 5.8} ${y + 11}c0-3.8 2.6-6.4 5.8-6.4s5.8 2.6 5.8 6.4z`} />
    </g>
  );
}

/** Zaunlatte mit Spitze. */
function Picket({ x }: { x: number }) {
  return <path d={`M${x} 27V13l2.6-3.2L${x + 5.2} 13v14z`} fill="var(--color-bark)" />;
}

const GROUND = (
  <path
    d="M4 28h24"
    stroke="var(--color-grass)"
    strokeWidth="2.6"
    strokeLinecap="round"
  />
);

const ART: Record<PictogramName, React.ReactNode> = {
  schaukel: (
    <>
      <path
        d="M7 27L11.5 7M25 27L20.5 7"
        stroke="var(--color-bark)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M9.5 7.5h13"
        stroke="var(--color-bark)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M13 8.5v11M19 8.5v11"
        stroke="var(--color-ink-soft)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="10.5" y="19" width="11" height="3.4" rx="1.7" fill="var(--color-sky)" />
      {GROUND}
    </>
  ),
  wippe: (
    <>
      <path
        d="M6 21.5L26 12.5"
        stroke="var(--color-coral)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M16 16.5l-4.5 10.5h9z" fill="var(--color-bark)" />
      <circle cx="6.5" cy="19.5" r="2.2" fill="var(--color-sun)" />
      <circle cx="25.5" cy="10.5" r="2.2" fill="var(--color-sun)" />
      {GROUND}
    </>
  ),
  trampolin: (
    <>
      <path
        d="M16 3.5v7M11.5 7L16 2.5 20.5 7"
        stroke="var(--color-sun)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <ellipse cx="16" cy="18.5" rx="12" ry="5" fill="var(--color-plum-deep)" />
      <ellipse cx="16" cy="17" rx="12" ry="5" fill="var(--color-plum)" />
      <path
        d="M6 20l-1.5 7M26 20l1.5 7"
        stroke="var(--color-ink-soft)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </>
  ),
  zaun: (
    <>
      <Picket x={5} />
      <Picket x={13.4} />
      <Picket x={21.8} />
      <rect x="3" y="15" width="26" height="2.8" rx="1.4" fill="var(--color-bark)" />
      <rect x="3" y="21" width="26" height="2.8" rx="1.4" fill="var(--color-bark)" />
    </>
  ),
  "uhr-kurz": (
    <>
      <circle cx="16" cy="16" r="12.5" fill="var(--color-sky-soft)" />
      <path d="M16 16V3.5A12.5 12.5 0 0124.84 7.16Z" fill="var(--color-sky)" />
      <circle cx="16" cy="16" r="2.2" fill="var(--color-ink)" />
    </>
  ),
  "uhr-mittel": (
    <>
      <circle cx="16" cy="16" r="12.5" fill="var(--color-sky-soft)" />
      <path d="M16 16V3.5A12.5 12.5 0 0116 28.5Z" fill="var(--color-sky)" />
      <circle cx="16" cy="16" r="2.2" fill="var(--color-ink)" />
    </>
  ),
  "uhr-lang": (
    <>
      <circle cx="16" cy="16" r="12.5" fill="var(--color-sky-soft)" />
      <path d="M16 16V3.5A12.5 12.5 0 117.16 7.16Z" fill="var(--color-sky)" />
      <circle cx="16" cy="16" r="2.2" fill="var(--color-ink)" />
    </>
  ),

  /* Dieselbe Figur in drei Stufen: stehen, hüpfen, an der Stange hängen.
     Vorher waren es Strichmännchen — sie brachen mit der flachen Formensprache
     der übrigen Zeichen, und die Umhang-Figur war nicht als solche erkennbar. */
};

export function Pictogram({
  name,
  className = "h-8 w-8",
}: {
  name: PictogramName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {ART[name]}
    </svg>
  );
}
