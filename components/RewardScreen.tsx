"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Mascot } from "@/components/art/Mascot";
import { Pictogram, type PictogramName } from "@/components/art/Pictogram";

/** Sammelbare Belohnungen — bewusst Spielgeräte, nicht abstrakte Sterne. */
const STICKERS: PictogramName[] = [
  "medaille",
  "stern",
  "rutsche",
  "trampolin",
  "karussell",
  "seilbahn",
  "wasser",
  "klettern",
];

const CONFETTI_COLORS = [
  "var(--color-sun)",
  "var(--color-coral)",
  "var(--color-sky)",
  "var(--color-grass)",
  "var(--color-sun)",
  "var(--color-sky)",
];

/** Belohnung am Ende – der Grund, warum Kinder ein zweites Mal mitmachen. */
export function RewardScreen({
  playgroundId,
  playgroundName,
  seed,
}: {
  playgroundId: string;
  playgroundName: string;
  seed: number;
}) {
  const sticker = STICKERS[seed % STICKERS.length];

  const confetti = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => ({
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        left: `${(index * 37 + 11) % 96}%`,
        delay: `${((index * 13) % 20) / 10}s`,
        duration: `${2.4 + ((index * 7) % 15) / 10}s`,
        round: index % 3 === 0,
      })),
    [],
  );

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {confetti.map((item, index) => (
          <span
            key={index}
            className={`absolute top-0 block h-3 w-2.5 ${item.round ? "rounded-full" : "rounded-[2px]"}`}
            style={{
              left: item.left,
              background: item.color,
              animation: `confetti-fall ${item.duration} linear ${item.delay} infinite`,
            }}
          />
        ))}
      </div>

      <Mascot pose="jubelt" className="relative h-40 w-40 animate-tada" />

      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-paper sticker animate-pop-in">
        <Pictogram name={sticker} className="h-20 w-20" />
      </div>

      <div className="relative space-y-1.5 px-4">
        <h1 className="font-display text-4xl font-bold">Danke!</h1>
        <p className="text-lg font-semibold text-ink-soft">
          Deine Bewertung hilft anderen Kindern, {playgroundName} zu finden.
        </p>
      </div>

      <div className="relative w-full space-y-2 px-4">
        <Link
          href={`/spielplatz/?id=${encodeURIComponent(playgroundId)}`}
          className="btn btn-primary w-full"
        >
          Ergebnis ansehen
        </Link>
        <Link href="/" className="btn btn-paper w-full">
          Nächster Spielplatz
        </Link>
      </div>
    </div>
  );
}
