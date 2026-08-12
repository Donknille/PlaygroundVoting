/**
 * Große illustrierte Flächen.
 *
 * Sie tragen das Versprechen der App, bevor ein einziges Wort gelesen wurde:
 * Hier geht es um draußen, um Spielgeräte, um gutes Wetter. Auf der Startseite
 * ersetzt die Szene den sonst üblichen leeren Kopfbereich, im Kinder-Modus
 * färbt sie den ganzen Bildschirm je Frage anders ein — so merkt ein Kind ohne
 * Fortschrittsbalken, dass es weitergegangen ist.
 */

/** Weiche Wolke aus drei Kreisen und einem Sockel. */
function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" opacity="0.9">
      <circle cx="0" cy="0" r="11" />
      <circle cx="14" cy="-4" r="14" />
      <circle cx="30" cy="1" r="10" />
      <rect x="-2" y="0" width="34" height="11" rx="5.5" />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3.5" y="-14" width="7" height="20" rx="3" fill="var(--color-bark)" />
      <circle cx="-9" cy="-20" r="12" fill="var(--color-grass-deep)" />
      <circle cx="9" cy="-20" r="12" fill="var(--color-grass-deep)" />
      <circle cx="0" cy="-30" r="15" fill="var(--color-grass)" />
    </g>
  );
}

/**
 * Kopfband der Startseite: Himmel, Sonne, Hügel und zwei Spielgeräte.
 * `slice` sorgt dafür, dass die Szene auf jeder Breite gefüllt bleibt und
 * lieber seitlich beschnitten wird, als Ränder zu zeigen.
 */
export function PlaygroundScene({ className = "h-40 w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 150"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <defs>
        <linearGradient id="scene-himmel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bcdcff" />
          <stop offset="100%" stopColor="#e6f2ff" />
        </linearGradient>
      </defs>

      <rect width="400" height="150" fill="url(#scene-himmel)" />

      {/* Sonne */}
      <circle cx="342" cy="34" r="21" fill="var(--color-sun)" />
      <g
        stroke="var(--color-sun)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.75"
      >
        <path d="M342 3v7M342 58v7M311 34h7M366 34h7M320 12l5 5M359 51l5 5M364 12l-5 5M325 51l-5 5" />
      </g>

      <Cloud x={40} y={30} s={1.1} />
      <Cloud x={210} y={20} s={0.8} />

      {/* Hügel hinten */}
      <path d="M0 112c60-26 120-26 200 0s140 18 200-6v44H0z" fill="var(--color-grass)" />

      <Tree x={38} y={112} s={0.85} />
      <Tree x={370} y={116} s={0.7} />

      {/* Rutsche */}
      <g>
        <path
          d="M118 116V78M132 116V78"
          stroke="var(--color-bark)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M118 88h14M118 100h14"
          stroke="var(--color-bark)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <rect x="112" y="70" width="26" height="8" rx="4" fill="var(--color-coral)" />
        <path
          d="M138 76c14 0 10 26 26 34"
          stroke="var(--color-sun)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Schaukel */}
      <g>
        <path
          d="M232 116L246 66M276 116L262 66"
          stroke="var(--color-bark)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M240 68h30"
          stroke="var(--color-bark)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M249 70v26M263 70v26"
          stroke="var(--color-ink-soft)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="245" y="96" width="22" height="7" rx="3.5" fill="var(--color-sky)" />
      </g>

      {/* Sandfläche vorn */}
      <path d="M0 132c70-12 150-12 220 0s110 8 180 2v16H0z" fill="var(--color-sun)" />
      <rect y="146" width="400" height="4" fill="var(--color-sun)" opacity="0.35" />
    </svg>
  );
}

/**
 * Farbiger Vollflächen-Hintergrund für den Kinder-Modus.
 * Jede Frage bekommt einen eigenen Farbton, damit der Fortschritt auch ohne
 * Lesen und ohne Blick auf die Punktleiste sichtbar ist.
 */
export const QUESTION_TINTS = [
  "var(--color-sky-soft)",
  "var(--color-grass-soft)",
  "var(--color-sky-soft)",
  "var(--color-coral-soft)",
  "var(--color-sun-soft)",
  "var(--color-grass-soft)",
  "var(--color-sun-soft)",
] as const;

/** Weicher Hügelabschluss, der Illustration und Inhalt verbindet. */
export function HillDivider({ className = "h-6 w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <path d="M0 24c60-18 120-18 200-6s140 10 200-4v34H0z" fill="var(--color-sand)" />
    </svg>
  );
}
