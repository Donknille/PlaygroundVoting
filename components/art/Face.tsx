/**
 * Die Gesichter — das wichtigste Bild der ganzen App.
 *
 * Sie erscheinen an zwei Stellen und müssen dort dasselbe bedeuten:
 *   1. als Antwort auf „War es lustig?" im Kinder-Modus
 *   2. als Punktwert an jedem Spielplatz
 * Deshalb kommen beide aus dieser einen Komponente. Ein Kind, das im
 * Bewerten-Ablauf das Sterngesicht angetippt hat, erkennt es später auf der
 * Spielplatzkarte wieder.
 */

export type Mood = 0 | 1 | 2;

const BG: Record<Mood, string> = {
  0: "var(--color-sand-deep)",
  1: "var(--color-yolk)",
  2: "var(--color-sun)",
};

export function Face({
  mood,
  className = "h-8 w-8",
}: {
  mood: Mood;
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
      <circle cx="16" cy="16" r="14" fill={BG[mood]} />

      {mood === 2 ? (
        <>
          {/* Sternaugen — das „superlustig"-Gesicht */}
          <path
            d="M11 8.5l1.5 3.2 3.3.45-2.4 2.4.57 3.45L11 16.35 8.03 18l.57-3.45L6.2 12.15l3.3-.45z"
            fill="var(--color-ink)"
          />
          <path
            d="M21 8.5l1.5 3.2 3.3.45-2.4 2.4.57 3.45L21 16.35 18.03 18l.57-3.45-2.4-2.4 3.3-.45z"
            fill="var(--color-ink)"
          />
          <path d="M8.5 20.5c1.5 5 13.5 5 15 0z" fill="var(--color-ink)" />
          <path d="M11 24.2c3 1.6 7 1.6 10 0z" fill="var(--color-coral)" />
        </>
      ) : (
        <>
          <circle cx="11" cy="13.5" r="2.2" fill="var(--color-ink)" />
          <circle cx="21" cy="13.5" r="2.2" fill="var(--color-ink)" />
          {mood === 1 ? (
            <path
              d="M10.5 20c1.8 3.6 9.2 3.6 11 0"
              stroke="var(--color-ink)"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M11 21h10"
              stroke="var(--color-ink)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          )}
        </>
      )}

      {mood > 0 ? (
        <>
          <circle cx="5.8" cy="19" r="2.2" fill="var(--color-berry)" opacity="0.45" />
          <circle cx="26.2" cy="19" r="2.2" fill="var(--color-berry)" opacity="0.45" />
        </>
      ) : null}
    </svg>
  );
}

/** Punktwert 1–5 auf eines der drei Gesichter abbilden. */
export function moodForScore(score: number): Mood {
  if (score >= 4) return 2;
  if (score >= 2.75) return 1;
  return 0;
}
