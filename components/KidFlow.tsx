"use client";

import { useEffect, useRef } from "react";
import { Art } from "@/components/art/Art";
import { Glyph } from "@/components/art/Glyph";
import { Mascot } from "@/components/art/Mascot";
import { speak } from "@/lib/speech";

/** Fortschritt als dicke Punkte – Kinder sehen, wie viel noch kommt, ohne zu lesen. */
export function KidProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-label={`Frage ${current + 1} von ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-3 rounded-full transition-all ${
            index < current
              ? "w-3 bg-grass"
              : index === current
                ? "w-8 bg-ink"
                : "w-3 bg-ink/15"
          }`}
        />
      ))}
    </div>
  );
}

export function SpeakButton({ text, muted }: { text: string; muted: boolean }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      disabled={muted}
      className="btn btn-white tap aspect-square !rounded-full !px-0 disabled:opacity-40"
      aria-label="Frage vorlesen"
    >
      <Glyph name={muted ? "stumm" : "lautsprecher"} className="h-7 w-7" />
    </button>
  );
}

/**
 * Eine Frage, ein Bildschirm, drei gleich aussehende Antworten.
 *
 * Die drei Karten sind bewusst farblich identisch: keine Antwort darf optisch
 * als die „richtige" erscheinen, sonst tippen Kinder das an, was am schönsten
 * aussieht. Unterschiedlich ist nur das Bild darauf.
 */
export function KidQuestion({
  prompt,
  art,
  options,
  onAnswer,
  muted,
  speakOnMount,
}: {
  prompt: string;
  art: string;
  options: { art: string; label: string }[];
  onAnswer: (index: number) => void;
  muted: boolean;
  speakOnMount: string;
}) {
  const spokenFor = useRef<string | null>(null);

  useEffect(() => {
    if (muted) return;
    if (spokenFor.current === speakOnMount) return;
    spokenFor.current = speakOnMount;
    const timer = setTimeout(() => speak(speakOnMount), 250);
    return () => clearTimeout(timer);
  }, [speakOnMount, muted]);

  return (
    <div key={speakOnMount} className="flex flex-1 flex-col">
      <div className="flex shrink-0 flex-col items-center justify-center gap-2 py-3 text-center">
        <div className="flex items-end gap-1">
          <Mascot pose="fragt" className="h-32 w-32 animate-bob" />
          <span className="mb-4 rounded-blob rounded-bl-md bg-white px-3 py-2 shadow-md">
            <Art name={art} className="h-14 w-14" />
          </span>
        </div>
        <h1 className="animate-slide-up text-balance px-2 font-display text-4xl leading-tight font-bold">
          {prompt}
        </h1>
      </div>

      {/* Die Karten füllen die restliche Höhe: kein Leerraum, und die
          Tippfläche wird so groß wie der Bildschirm es hergibt. */}
      <div className="grid flex-1 grid-cols-3 gap-2 pb-2">
        {options.map((option, index) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onAnswer(index)}
            className="flex h-full min-h-[30vh] flex-col items-center justify-center gap-3 rounded-blob bg-white p-2 shadow-[0_5px_0_rgb(42_30_70/0.14)] transition active:translate-y-[4px] active:shadow-[0_1px_0_rgb(42_30_70/0.14)]"
          >
            <Art name={option.art} className="h-24 w-24" />
            <span className="text-base leading-tight font-bold text-ink-soft">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
