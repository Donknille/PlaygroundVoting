/**
 * Fips, der Spielplatz-Scout.
 *
 * Die wiederkehrende Figur der App. Sie hat eine klare Aufgabe und ist keine
 * Dekoration: Fips führt Kinder durch den Bewerten-Ablauf, übergibt am Ende die
 * Belohnung und übernimmt die Zustände, die sonst nur aus Text bestünden
 * (Suchen, Laden, nichts gefunden). Kinder, die noch nicht lesen, erkennen an
 * seiner Haltung, was gerade passiert.
 *
 * Vier Posen, eine Formensprache. Fuchsorange ist bewusst die Markenfarbe —
 * Figur und App-Symbol sind dieselbe Farbe.
 */

export type MascotPose = "winkt" | "sucht" | "fragt" | "jubelt";

type Mouth = "laecheln" | "offen" | "klein" | "strich";

const ORANGE = "var(--color-sun)";
const CREAM = "#fff3e2";

function Arm({ d }: { d: string }) {
  return (
    <path d={d} stroke={ORANGE} strokeWidth="11" strokeLinecap="round" fill="none" />
  );
}

function Paw({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="7" fill={ORANGE} />;
}

function Head({ mouth }: { mouth: Mouth }) {
  return (
    <g>
      {/* Ohren */}
      <path d="M41 32L33 6l23 13z" fill={ORANGE} />
      <path d="M42.5 28.5L37.5 13l13 7.5z" fill="var(--color-coral-soft)" />
      <path d="M79 32L87 6 64 19z" fill={ORANGE} />
      <path d="M77.5 28.5L82.5 13l-13 7.5z" fill="var(--color-coral-soft)" />

      {/* Kopf */}
      <circle cx="60" cy="45" r="26" fill={ORANGE} />

      {/* Schnauze */}
      <ellipse cx="60" cy="54.5" rx="17.5" ry="13" fill={CREAM} />

      {/* Augen */}
      <ellipse cx="50.5" cy="41.5" rx="3.8" ry="4.4" fill="var(--color-ink)" />
      <ellipse cx="69.5" cy="41.5" rx="3.8" ry="4.4" fill="var(--color-ink)" />
      <circle cx="51.8" cy="39.8" r="1.4" fill="#fff" />
      <circle cx="70.8" cy="39.8" r="1.4" fill="#fff" />

      {/* Nase */}
      <path
        d="M60 48.5c3.4 0 5.4 1.9 5.4 3.9 0 2.1-2.5 3.6-5.4 3.6s-5.4-1.5-5.4-3.6c0-2 2-3.9 5.4-3.9z"
        fill="var(--color-ink)"
      />

      {/* Mund */}
      {mouth === "offen" ? (
        <path d="M52 58.5c2 6.5 14 6.5 16 0z" fill="var(--color-ink)" />
      ) : mouth === "klein" ? (
        <ellipse cx="60" cy="60.5" rx="2.6" ry="3" fill="var(--color-ink)" />
      ) : mouth === "strich" ? (
        <path
          d="M55 60h10"
          stroke="var(--color-ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M60 56v2.4M60 58.4c-2.2 2.8-6 2.2-7 .2M60 58.4c2.2 2.8 6 2.2 7 .2"
          stroke="var(--color-ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
}

function Body() {
  return (
    <g>
      {/* Schwanz mit heller Spitze */}
      <path
        d="M83 98c16 4 24-6 21-19-1 10-9 13-16 10z"
        fill={ORANGE}
      />
      <path d="M101 84c1.5-4.5 1.5-8 .5-11.5-3 1.5-5 5-5 9z" fill={CREAM} />

      {/* Beine */}
      <rect x="46" y="104" width="12" height="16" rx="6" fill={ORANGE} />
      <rect x="62" y="104" width="12" height="16" rx="6" fill={ORANGE} />
      <ellipse cx="52" cy="120" rx="8" ry="5" fill="var(--color-sun-deep)" />
      <ellipse cx="68" cy="120" rx="8" ry="5" fill="var(--color-sun-deep)" />

      {/* Körper */}
      <ellipse cx="60" cy="92" rx="24" ry="25" fill={ORANGE} />
      <ellipse cx="60" cy="97" rx="14.5" ry="17" fill={CREAM} />

      {/* Scout-Halstuch — das Erkennungszeichen der Figur */}
      <path d="M43 68c6 6 28 6 34 0l-5 6c-6 4-18 4-24 0z" fill="var(--color-coral)" />
      <path d="M52 73l8 16 8-16c-5 2.5-11 2.5-16 0z" fill="var(--color-coral)" />
      <circle cx="60" cy="76" r="3.4" fill="var(--color-sun)" />
    </g>
  );
}

/** Fernglas für die Suchpose — wird über die Augen gelegt. */
function Binoculars() {
  return (
    <g>
      <rect x="53" y="36" width="14" height="10" rx="3" fill="var(--color-bark)" />
      <circle cx="46" cy="41" r="10" fill="var(--color-sky)" />
      <circle cx="74" cy="41" r="10" fill="var(--color-sky)" />
      <circle cx="46" cy="41" r="5" fill="var(--color-sky-soft)" />
      <circle cx="74" cy="41" r="5" fill="var(--color-sky-soft)" />
    </g>
  );
}

/**
 * Nur der Kopf — für alles unter etwa 60 Pixeln.
 * Die ganze Figur wäre in der Kopfzeile oder im App-Symbol nicht mehr lesbar.
 */
export function MascotHead({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="28 4 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <Head mouth="laecheln" />
    </svg>
  );
}

export function Mascot({
  pose,
  className = "h-32 w-32",
}: {
  pose: MascotPose;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 128"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {pose === "winkt" ? (
        <>
          <Arm d="M44 88Q34 98 37 106" />
          <Body />
          <Head mouth="laecheln" />
          <Arm d="M78 88Q97 78 95 61" />
          <Paw x={95} y={59} />
          {/* Winklinien */}
          <path
            d="M104 52c2.5 1 4.5 3 5.5 5.5M106 44c4 1 7 3.5 8.5 7"
            stroke="var(--color-sun)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </>
      ) : pose === "sucht" ? (
        <>
          <Body />
          <Head mouth="strich" />
          <Arm d="M44 88Q36 70 47 57" />
          <Arm d="M76 88Q84 70 73 57" />
          <Binoculars />
        </>
      ) : pose === "fragt" ? (
        <>
          <Arm d="M44 88Q33 96 36 105" />
          <Body />
          <Head mouth="klein" />
          <Arm d="M78 88Q90 78 79 66" />
          <Paw x={78} y={64} />
          {/* Fragezeichen */}
          <path
            d="M93 30c0-5 4-8 8-8s8 3 8 7c0 5-6 6-7 10"
            stroke="var(--color-sky)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="101.5" cy="46" r="2.6" fill="var(--color-sky)" />
        </>
      ) : (
        <>
          <Body />
          <Head mouth="offen" />
          <Arm d="M44 86Q26 74 29 57" />
          <Paw x={29} y={55} />
          <Arm d="M76 86Q94 74 91 57" />
          <Paw x={91} y={55} />
          {/* Jubel-Funken */}
          <path
            d="M18 40l2.5 5 5 2.5-5 2.5L18 55l-2.5-5-5-2.5 5-2.5z"
            fill="var(--color-sun)"
          />
          <path
            d="M102 34l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"
            fill="var(--color-sun)"
          />
        </>
      )}
    </svg>
  );
}
