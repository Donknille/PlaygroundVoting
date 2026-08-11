"use client";

import Link from "next/link";
import { useMemo } from "react";

const STICKERS = ["🏅", "🌟", "🦄", "🚀", "🐝", "🌈", "🐙", "🦖"];
const CONFETTI = ["🎈", "🎉", "⭐", "🍀", "💛", "🔵"];

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
      Array.from({ length: 18 }, (_, index) => ({
        emoji: CONFETTI[index % CONFETTI.length],
        left: `${(index * 37 + 11) % 96}%`,
        delay: `${((index * 13) % 20) / 10}s`,
        duration: `${2.4 + ((index * 7) % 15) / 10}s`,
      })),
    [],
  );

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {confetti.map((item, index) => (
          <span
            key={index}
            className="absolute top-0 text-2xl"
            style={{
              left: item.left,
              animation: `confetti-fall ${item.duration} linear ${item.delay} infinite`,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="relative animate-pop-in">
        <span className="text-8xl" aria-hidden="true">
          {sticker}
        </span>
      </div>

      <div className="relative space-y-2 px-4">
        <h1 className="text-4xl font-extrabold">Danke!</h1>
        <p className="text-lg text-ink-soft">
          Deine Bewertung hilft anderen Kindern, {playgroundName} zu finden.
        </p>
      </div>

      <div className="relative w-full space-y-2 px-4">
        <Link
          href={`/spielplatz/?id=${encodeURIComponent(playgroundId)}`}
          className="tap flex w-full items-center justify-center rounded-2xl bg-ink px-4 text-lg font-bold text-white"
        >
          Ergebnis ansehen
        </Link>
        <Link
          href="/"
          className="tap flex w-full items-center justify-center rounded-2xl bg-white px-4 text-lg font-bold shadow-sm ring-1 ring-black/5"
        >
          Nächster Spielplatz
        </Link>
      </div>
    </div>
  );
}
