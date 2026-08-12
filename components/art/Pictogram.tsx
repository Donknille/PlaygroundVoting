/**
 * Bunte Bildzeichen — der Ersatz für die früheren Emojis.
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
  // Spielgeräte
  | "rutsche"
  | "schaukel"
  | "klettern"
  | "sand"
  | "wasser"
  | "wippe"
  | "seilbahn"
  | "karussell"
  | "trampolin"
  // Ausstattung
  | "zaun"
  | "toilette"
  | "barrierefrei"
  | "beleuchtung"
  | "kleinkind"
  // Altersgruppen
  | "krabbler"
  | "kita"
  | "schule"
  | "grosse"
  // Fragenbilder
  | "uhr"
  | "baum"
  // Antwortbilder: Bleiben (gefüllte Uhr als Mengenskala)
  | "uhr-kurz"
  | "uhr-mittel"
  | "uhr-lang"
  // Antwortbilder: Toben — eine Steigerung, kein Rollenspiel
  | "toben-wenig"
  | "toben-mittel"
  | "toben-viel"
  // Antwortbilder: Kinder
  | "kind-eins"
  | "kind-paar"
  | "kind-viele"
  // Antwortbilder: Schatten
  | "sonne"
  | "halbschatten"
  // Fragenbild Spaß
  | "party"
  // Sonstiges
  | "stern"
  | "medaille"
  | "fernglas"
  | "kolben"
  | "rathaus"
  | "schloss"
  | "lineal";

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
  rutsche: (
    <>
      <path
        d="M7 27V11M12 27V11"
        stroke="var(--color-bark)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M7 16h5M7 21h5"
        stroke="var(--color-bark)"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <rect x="5" y="7.5" width="9.5" height="3.6" rx="1.8" fill="var(--color-coral)" />
      <path
        d="M14 11c6 0 4.5 10.5 11 13.5"
        stroke="var(--color-sun)"
        strokeWidth="4.6"
        strokeLinecap="round"
        fill="none"
      />
      {GROUND}
    </>
  ),

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

  klettern: (
    <>
      <path
        d="M16 5L4.5 26M16 5l11.5 21M16 5v21"
        stroke="var(--color-coral)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M13 11h6M10.5 17h11M8 23h16"
        stroke="var(--color-sun)"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <circle cx="16" cy="4.5" r="2.6" fill="var(--color-plum)" />
      {GROUND}
    </>
  ),

  sand: (
    <>
      <path d="M3 27c3.5-8 22.5-8 26 0z" fill="var(--color-yolk)" />
      <path d="M11.5 13.5h9.5l-1.5 9.5h-6.5z" fill="var(--color-coral)" />
      <path
        d="M12.5 13a3.8 3.8 0 017.5 0"
        stroke="var(--color-coral-deep)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),

  wasser: (
    <>
      <path
        d="M16 3.5c4.4 6.5 6.6 9.3 6.6 12.4a6.6 6.6 0 11-13.2 0C9.4 12.8 11.6 10 16 3.5z"
        fill="var(--color-sky)"
      />
      <circle cx="7" cy="23" r="2.6" fill="var(--color-mint)" />
      <circle cx="25" cy="22" r="2.1" fill="var(--color-mint)" />
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

  seilbahn: (
    <>
      <path
        d="M3.5 8L28.5 16.5"
        stroke="var(--color-ink-soft)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <rect x="12.5" y="11" width="7.5" height="4.2" rx="2.1" fill="var(--color-plum)" />
      <path
        d="M16.3 15.2v4"
        stroke="var(--color-ink-soft)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="11.5" y="19" width="9.5" height="3.4" rx="1.7" fill="var(--color-sun)" />
      {GROUND}
    </>
  ),

  karussell: (
    <>
      <ellipse cx="16" cy="22.5" rx="13" ry="6" fill="var(--color-sky-deep)" />
      <ellipse cx="16" cy="20.5" rx="13" ry="6" fill="var(--color-sky)" />
      <path
        d="M16 6.5v14"
        stroke="var(--color-ink-soft)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 9.5L5.5 17.5M16 9.5l10.5 8M16 9.5l-4 10.5M16 9.5l4 10.5"
        stroke="var(--color-sun)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="5.5" r="2.8" fill="var(--color-coral)" />
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

  toilette: (
    <>
      <rect x="6" y="3.5" width="20" height="25" rx="5" fill="var(--color-sky-soft)" />
      <circle cx="16" cy="12" r="3.2" fill="var(--color-sky-deep)" />
      <path
        d="M10.5 24.5c0-3.9 2.5-6.8 5.5-6.8s5.5 2.9 5.5 6.8z"
        fill="var(--color-sky-deep)"
      />
    </>
  ),

  barrierefrei: (
    <>
      <circle cx="16" cy="16" r="13" fill="var(--color-sky)" />
      <circle cx="18.5" cy="8.5" r="2.4" fill="#fff" />
      <path
        d="M13 13.5h5.5M18 13.5v6.5h5"
        stroke="#fff"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="15.5" cy="20.5" r="5.5" stroke="#fff" strokeWidth="2" fill="none" />
    </>
  ),

  beleuchtung: (
    <>
      <path
        d="M16 28V15"
        stroke="var(--color-ink-soft)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M9.5 15a6.5 6.5 0 0113 0z" fill="var(--color-yolk)" />
      <path
        d="M16 3.5v3.5M6.5 7l2.2 2.2M25.5 7l-2.2 2.2"
        stroke="var(--color-yolk)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </>
  ),

  kleinkind: (
    <>
      <rect x="12.5" y="3.5" width="7" height="3.6" rx="1.8" fill="var(--color-berry)" />
      <rect x="10.5" y="7" width="11" height="3.4" rx="1.7" fill="var(--color-berry-soft)" />
      <rect x="11" y="10.5" width="10" height="17.5" rx="4.5" fill="var(--color-sky-soft)" />
      <path d="M11 19h10v5a4.5 4.5 0 01-4.5 4h-1A4.5 4.5 0 0111 24z" fill="var(--color-sky)" />
    </>
  ),

  krabbler: (
    <>
      <circle cx="16" cy="12" r="9" fill="var(--color-berry)" />
      <circle cx="12.5" cy="9.5" r="1.9" fill="#fff" />
      <circle cx="18.5" cy="14" r="1.9" fill="#fff" />
      <rect x="13.4" y="20" width="5.2" height="8" rx="2.6" fill="var(--color-sun)" />
      <ellipse cx="16" cy="28.5" rx="4.2" ry="2.3" fill="var(--color-sun-deep)" />
    </>
  ),

  kita: (
    <>
      <circle cx="8.5" cy="10" r="4.2" fill="var(--color-bark)" />
      <circle cx="23.5" cy="10" r="4.2" fill="var(--color-bark)" />
      <circle cx="16" cy="17.5" r="10.2" fill="var(--color-bark)" />
      <ellipse cx="16" cy="21" rx="5.2" ry="4.2" fill="var(--color-bark-soft)" />
      <circle cx="12.3" cy="15" r="1.5" fill="var(--color-ink)" />
      <circle cx="19.7" cy="15" r="1.5" fill="var(--color-ink)" />
      <ellipse cx="16" cy="19" rx="1.9" ry="1.5" fill="var(--color-ink)" />
    </>
  ),

  schule: (
    <>
      <path
        d="M11.5 10a4.5 4.5 0 019 0"
        stroke="var(--color-coral-deep)"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="6" y="9.5" width="20" height="18.5" rx="5" fill="var(--color-coral)" />
      <rect x="6" y="15.5" width="20" height="2.6" fill="var(--color-coral-deep)" />
      <rect x="11" y="19" width="10" height="7" rx="2.6" fill="var(--color-sand)" />
    </>
  ),

  grosse: (
    <>
      <path
        d="M4.5 16h23"
        stroke="var(--color-plum)"
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <path
        d="M10 18.5v2M22 18.5v2"
        stroke="var(--color-ink-soft)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="23" r="3.2" fill="var(--color-sun)" />
      <circle cx="22" cy="23" r="3.2" fill="var(--color-sun)" />
    </>
  ),

  uhr: (
    <>
      <circle cx="16" cy="16" r="12.5" fill="var(--color-sky-soft)" />
      <path
        d="M16 8.5V16l5 3.5"
        stroke="var(--color-sky-deep)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),

  baum: (
    <>
      <path
        d="M16 28V16"
        stroke="var(--color-bark)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="10" cy="15" r="5.5" fill="var(--color-grass)" />
      <circle cx="22" cy="15" r="5.5" fill="var(--color-grass)" />
      <circle cx="16" cy="11" r="7.5" fill="var(--color-grass)" />
    </>
  ),

  /* Gefüllte Uhr als Mengenskala: wenig / halb / fast ganz.
     „Mehr Fläche = mehr" versteht auch ein Dreijähriger, ohne lesen zu können. */
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
  "toben-wenig": (
    <>
      <circle cx="16" cy="7.5" r="4.6" fill="var(--color-yolk)" />
      <rect x="11.8" y="12.2" width="8.4" height="8.6" rx="4.2" fill="var(--color-plum)" />
      <rect x="8.4" y="12.6" width="3.6" height="7.8" rx="1.8" fill="var(--color-plum)" />
      <rect x="20" y="12.6" width="3.6" height="7.8" rx="1.8" fill="var(--color-plum)" />
      <rect x="12.4" y="19.6" width="3.2" height="7.8" rx="1.6" fill="var(--color-plum-deep)" />
      <rect x="16.4" y="19.6" width="3.2" height="7.8" rx="1.6" fill="var(--color-plum-deep)" />
      {GROUND}
    </>
  ),

  "toben-mittel": (
    <>
      <circle cx="16" cy="6.4" r="4.6" fill="var(--color-yolk)" />
      <rect x="11.8" y="11.3" width="8.4" height="9.4" rx="4.2" fill="var(--color-plum)" />
      <rect
        x="6.8"
        y="8.6"
        width="3.6"
        height="8.4"
        rx="1.8"
        fill="var(--color-plum)"
        transform="rotate(-38 8.6 12.8)"
      />
      <rect
        x="21.6"
        y="8.6"
        width="3.6"
        height="8.4"
        rx="1.8"
        fill="var(--color-plum)"
        transform="rotate(38 23.4 12.8)"
      />
      <rect
        x="11.2"
        y="19.6"
        width="3.2"
        height="6"
        rx="1.6"
        fill="var(--color-plum-deep)"
        transform="rotate(-28 12.8 22.6)"
      />
      <rect
        x="17.6"
        y="19.6"
        width="3.2"
        height="6"
        rx="1.6"
        fill="var(--color-plum-deep)"
        transform="rotate(28 19.2 22.6)"
      />
      {/* Sprunglinien: die Figur ist vom Boden weg */}
      <path
        d="M8 27c1.6 1.1 3.2 1.6 4.8 1.8M24 27c-1.6 1.1-3.2 1.6-4.8 1.8"
        stroke="var(--color-ink-fainter)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  "toben-viel": (
    <>
      {/* Kletterstange */}
      <rect x="2.5" y="3.5" width="27" height="3.2" rx="1.6" fill="var(--color-bark)" />
      {/* Arme greifen nach oben */}
      <rect x="11.4" y="6" width="3.4" height="8" rx="1.7" fill="var(--color-plum)" />
      <rect x="17.2" y="6" width="3.4" height="8" rx="1.7" fill="var(--color-plum)" />
      <circle cx="16" cy="15.2" r="4.4" fill="var(--color-yolk)" />
      <rect x="11.9" y="18.6" width="8.2" height="7.6" rx="4.1" fill="var(--color-plum)" />
      {/* Beine schwingen */}
      <rect
        x="11"
        y="24.6"
        width="3.2"
        height="5.8"
        rx="1.6"
        fill="var(--color-plum-deep)"
        transform="rotate(-34 12.6 27.5)"
      />
      <rect
        x="17.8"
        y="24.6"
        width="3.2"
        height="5.8"
        rx="1.6"
        fill="var(--color-plum-deep)"
        transform="rotate(34 19.4 27.5)"
      />
      {/* Funken: hier geht am meisten */}
      <path d="M4 13.5l1 2.2 2.2 1-2.2 1L4 20l-1-2.3-2.2-1 2.2-1z" fill="var(--color-sun)" />
      <path d="M28 12l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill="var(--color-sun)" />
    </>
  ),

  "kind-eins": <Kid x={16} y={11} color="var(--color-plum)" />,

  "kind-paar": (
    <>
      <Kid x={10} y={12} color="var(--color-plum)" />
      <Kid x={22} y={12} color="var(--color-berry)" />
    </>
  ),

  "kind-viele": (
    <>
      <Kid x={7.5} y={9} color="var(--color-sky)" />
      <Kid x={18.5} y={8} color="var(--color-berry)" />
      <Kid x={13} y={18} color="var(--color-plum)" />
      <Kid x={24} y={17} color="var(--color-grass)" />
    </>
  ),

  sonne: (
    <>
      <circle cx="16" cy="16" r="7.5" fill="var(--color-yolk)" />
      <path
        d="M16 2.5v3.5M16 26v3.5M2.5 16h3.5M26 16h3.5M6.4 6.4l2.5 2.5M23.1 23.1l2.5 2.5M25.6 6.4l-2.5 2.5M8.9 23.1l-2.5 2.5"
        stroke="var(--color-sun)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </>
  ),

  halbschatten: (
    <>
      <circle cx="11.5" cy="11.5" r="6.5" fill="var(--color-yolk)" />
      <path
        d="M11.5 2.5v2.5M2.5 11.5h2.5M5.1 5.1l1.8 1.8"
        stroke="var(--color-sun)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="13" cy="20.5" r="5.5" fill="#e6edf6" />
      <circle cx="20" cy="18.5" r="6.5" fill="#e6edf6" />
      <rect x="7.5" y="20" width="19" height="6" rx="3" fill="#e6edf6" />
    </>
  ),

  party: (
    <>
      <ellipse cx="11" cy="12" rx="6.5" ry="8" fill="var(--color-coral)" />
      <path d="M11 19.8l-1.7 2.6h3.4z" fill="var(--color-coral)" />
      <ellipse cx="22" cy="15" rx="5.5" ry="6.8" fill="var(--color-sky)" />
      <path d="M22 21.6l-1.4 2.2h2.8z" fill="var(--color-sky)" />
      <path
        d="M11 22.4c1 3.5-2 4.5-1 6.6M22 24c.8 3-1.4 3.8-.6 5.4"
        stroke="var(--color-ink-soft)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="4" cy="8" r="1.9" fill="var(--color-yolk)" />
      <circle cx="28.5" cy="6" r="1.7" fill="var(--color-grass)" />
      <circle cx="27.5" cy="27" r="1.7" fill="var(--color-berry)" />
    </>
  ),

  stern: (
    <path
      d="M16 3l3.9 8.3 8.6 1.2-6.3 6.3 1.5 9-7.7-4.3-7.7 4.3 1.5-9L3.5 12.5l8.6-1.2z"
      fill="var(--color-yolk)"
    />
  ),

  medaille: (
    <>
      <path d="M10 3l4 10h-6z" fill="var(--color-sky)" />
      <path d="M22 3l-2 10h6z" fill="var(--color-coral)" />
      <circle cx="16" cy="20.5" r="9" fill="var(--color-yolk)" />
      <circle cx="16" cy="20.5" r="5.5" fill="var(--color-sun)" />
    </>
  ),

  fernglas: (
    <>
      <rect x="12.5" y="8" width="7" height="9" rx="2" fill="var(--color-bark)" />
      <rect x="4" y="5" width="7.5" height="7" rx="2" fill="var(--color-ink-soft)" />
      <rect x="20.5" y="5" width="7.5" height="7" rx="2" fill="var(--color-ink-soft)" />
      <circle cx="8.5" cy="20" r="7" fill="var(--color-plum)" />
      <circle cx="23.5" cy="20" r="7" fill="var(--color-plum)" />
      <circle cx="8.5" cy="20" r="3.4" fill="var(--color-sky-soft)" />
      <circle cx="23.5" cy="20" r="3.4" fill="var(--color-sky-soft)" />
    </>
  ),

  kolben: (
    <>
      <path
        d="M13 3.5h6v8l6.5 12a3 3 0 01-2.6 4.5H9.1a3 3 0 01-2.6-4.5L13 11.5z"
        fill="var(--color-sky-soft)"
      />
      <path
        d="M9.4 19h13.2l2.9 4.5a3 3 0 01-2.6 4.5H9.1a3 3 0 01-2.6-4.5z"
        fill="var(--color-mint)"
      />
      <rect x="11.5" y="2.5" width="9" height="3" rx="1.5" fill="var(--color-ink-soft)" />
    </>
  ),

  rathaus: (
    <>
      <path d="M16 3l13 7.5H3z" fill="var(--color-coral)" />
      <rect x="5" y="10.5" width="22" height="14" fill="var(--color-sand-deep)" />
      <rect x="8" y="14" width="3.5" height="10.5" fill="var(--color-ink-soft)" />
      <rect x="14.25" y="14" width="3.5" height="10.5" fill="var(--color-ink-soft)" />
      <rect x="20.5" y="14" width="3.5" height="10.5" fill="var(--color-ink-soft)" />
      <rect x="2.5" y="24.5" width="27" height="4" rx="2" fill="var(--color-ink)" />
    </>
  ),

  schloss: (
    <>
      <path
        d="M10 14v-3.5a6 6 0 0112 0V14"
        stroke="var(--color-ink-soft)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="5.5" y="13.5" width="21" height="15" rx="4.5" fill="var(--color-grass)" />
      <circle cx="16" cy="20" r="2.6" fill="#fff" />
      <rect x="14.8" y="20" width="2.4" height="5" rx="1.2" fill="#fff" />
    </>
  ),

  lineal: (
    <>
      <rect
        x="2.5"
        y="10"
        width="27"
        height="12"
        rx="3"
        fill="var(--color-yolk)"
        transform="rotate(-8 16 16)"
      />
      <path
        d="M7.5 10.5v4M12.5 9.8v6M17.5 9.1v4M22.5 8.4v6"
        stroke="var(--color-sun-deep)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
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
