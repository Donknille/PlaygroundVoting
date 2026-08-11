"use client";

import { useEffect, useRef } from "react";
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
                ? "w-7 bg-ink"
                : "w-3 bg-black/10"
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
      className="tap flex items-center justify-center rounded-full bg-white px-4 text-2xl shadow-sm ring-1 ring-black/5 disabled:opacity-40"
      aria-label="Frage vorlesen"
    >
      🔊
    </button>
  );
}

/**
 * Eine Frage, ein Bildschirm, drei gleich aussehende Antworten.
 *
 * Die drei Optionen sind bewusst farblich identisch: keine Antwort darf optisch
 * als die „richtige" erscheinen, sonst tippen Kinder das an, was gut aussieht.
 */
export function KidQuestion({
  prompt,
  emoji,
  options,
  onAnswer,
  muted,
  speakOnMount,
}: {
  prompt: string;
  emoji: string;
  options: { emoji: string; label: string }[];
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
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-4 text-center">
        <span className="text-6xl animate-wiggle" aria-hidden="true">
          {emoji}
        </span>
        <h1 className="text-balance px-2 text-3xl font-extrabold leading-tight">
          {prompt}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-2 pb-2">
        {options.map((option, index) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onAnswer(index)}
            className="flex min-h-[30vh] flex-col items-center justify-center gap-3 rounded-blob bg-white p-2 shadow-md ring-1 ring-black/5 transition active:scale-95"
          >
            <span className="text-6xl" aria-hidden="true">
              {option.emoji}
            </span>
            <span className="text-sm font-bold leading-tight text-ink-soft">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
