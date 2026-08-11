"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KidProgressDots, KidQuestion, SpeakButton } from "@/components/KidFlow";
import { RewardScreen } from "@/components/RewardScreen";
import { useQueryParam } from "@/lib/hooks";
import { HIGHLIGHTS, QUESTIONS } from "@/lib/questions";
import { hasRatedToday, saveRating } from "@/lib/ratings";
import { speak, stopSpeaking } from "@/lib/speech";
import type { AnswerValue, HighlightKey, Playground, QuestionId } from "@/lib/types";
import { findPlayground } from "@/lib/world";

const AGES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const TOTAL_STEPS = QUESTIONS.length + 2; // Alter + Fragen + Lieblingsgerät

export default function KidRatingPage() {
  const id = useQueryParam("id");
  const [playground, setPlayground] = useState<Playground | null>(null);
  const [resolved, setResolved] = useState(false);

  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, AnswerValue>>>({});
  const [highlights, setHighlights] = useState<HighlightKey[]>([]);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);

  useEffect(() => {
    if (id === null) return;
    setPlayground(findPlayground(id));
    setAlreadyRated(hasRatedToday(id));
    setResolved(true);
  }, [id]);

  useEffect(() => () => stopSpeaking(), []);

  const finish = useCallback(
    (chosen: HighlightKey[]) => {
      if (!id || age === null) return;
      const complete = QUESTIONS.every((q) => answers[q.id] !== undefined);
      if (!complete) return;
      saveRating({
        playgroundId: id,
        age,
        answers: answers as Record<QuestionId, AnswerValue>,
        highlights: chosen,
      });
      stopSpeaking();
      setDone(true);
    },
    [id, age, answers],
  );

  const seed = useMemo(
    () =>
      (age ?? 0) +
      Object.values(answers).reduce<number>((sum, value) => sum + (value ?? 0), 0),
    [age, answers],
  );

  if (!resolved) {
    return <FullScreen>{null}</FullScreen>;
  }

  if (!id || !playground) {
    return (
      <FullScreen>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <span className="text-6xl" aria-hidden="true">
            🤔
          </span>
          <h1 className="text-2xl font-extrabold">Diesen Spielplatz kennen wir nicht</h1>
          <p className="text-ink-soft">
            Öffne ihn noch einmal aus der Liste, dann klappt das Bewerten.
          </p>
          <Link
            href="/"
            className="tap flex items-center justify-center rounded-2xl bg-ink px-6 text-lg font-bold text-white"
          >
            Zur Spielplatzliste
          </Link>
        </div>
      </FullScreen>
    );
  }

  if (done) {
    return (
      <FullScreen>
        <RewardScreen
          playgroundId={id}
          playgroundName={playground.name}
          seed={seed}
        />
      </FullScreen>
    );
  }

  if (alreadyRated) {
    return (
      <FullScreen>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <span className="text-7xl" aria-hidden="true">
            ✅
          </span>
          <h1 className="text-2xl font-extrabold">Heute schon bewertet!</h1>
          <p className="text-ink-soft">
            {playground.name} wurde von diesem Gerät heute bereits bewertet. Morgen geht es
            wieder — so bleiben die Punkte ehrlich.
          </p>
          <Link
            href={`/spielplatz/?id=${encodeURIComponent(id)}`}
            className="tap flex items-center justify-center rounded-2xl bg-ink px-6 text-lg font-bold text-white"
          >
            Ergebnis ansehen
          </Link>
        </div>
      </FullScreen>
    );
  }

  const questionIndex = step - 1;
  const currentQuestion = QUESTIONS[questionIndex];

  return (
    <FullScreen>
      <div className="flex items-center justify-between gap-2 pb-2">
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            if (step > 0) setStep(step - 1);
          }}
          className="tap flex items-center justify-center rounded-full bg-white px-4 text-2xl shadow-sm ring-1 ring-black/5 disabled:opacity-30"
          disabled={step === 0}
          aria-label="Eine Frage zurück"
        >
          ←
        </button>

        <KidProgressDots total={TOTAL_STEPS} current={step} />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMuted((value) => !value);
              stopSpeaking();
            }}
            className="tap flex items-center justify-center rounded-full bg-white px-4 text-2xl shadow-sm ring-1 ring-black/5"
            aria-label={muted ? "Vorlesen einschalten" : "Vorlesen ausschalten"}
            aria-pressed={!muted}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <Link
            href={`/spielplatz/?id=${encodeURIComponent(id)}`}
            onClick={() => stopSpeaking()}
            className="tap flex items-center justify-center rounded-full bg-white px-4 text-2xl shadow-sm ring-1 ring-black/5"
            aria-label="Bewerten abbrechen"
          >
            ✕
          </Link>
        </div>
      </div>

      {step === 0 ? (
        <AgeStep
          muted={muted}
          onPick={(value) => {
            setAge(value);
            setStep(1);
          }}
        />
      ) : null}

      {currentQuestion ? (
        <KidQuestion
          key={currentQuestion.id}
          prompt={currentQuestion.prompt}
          emoji={currentQuestion.emoji}
          options={currentQuestion.options}
          muted={muted}
          speakOnMount={currentQuestion.prompt}
          onAnswer={(index) => {
            setAnswers((prev) => ({
              ...prev,
              [currentQuestion.id]: index as AnswerValue,
            }));
            setStep(step + 1);
          }}
        />
      ) : null}

      {step === TOTAL_STEPS - 1 ? (
        <HighlightStep
          muted={muted}
          selected={highlights}
          onToggle={(key) =>
            setHighlights((prev) =>
              prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
            )
          }
          onDone={() => finish(highlights)}
        />
      ) : null}
    </FullScreen>
  );
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-sand px-3 py-3">
      <main id="inhalt" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}

function AgeStep({
  onPick,
  muted,
}: {
  onPick: (age: number) => void;
  muted: boolean;
}) {
  useEffect(() => {
    if (muted) return;
    const timer = setTimeout(() => speak("Wie alt bist du?"), 250);
    return () => clearTimeout(timer);
  }, [muted]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        <span className="text-6xl animate-wiggle" aria-hidden="true">
          🎂
        </span>
        <h1 className="text-3xl font-extrabold">Wie alt bist du?</h1>
        <div className="flex items-center gap-2">
          <SpeakButton text="Wie alt bist du?" muted={muted} />
          <p className="text-sm text-ink-soft">Mehr fragen wir nicht.</p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-4 content-start gap-2">
        {AGES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onPick(value)}
            className="flex min-h-20 items-center justify-center rounded-2xl bg-white text-3xl font-extrabold shadow-md ring-1 ring-black/5 transition active:scale-95"
          >
            {value === 13 ? "12+" : value}
          </button>
        ))}
      </div>
    </div>
  );
}

function HighlightStep({
  selected,
  onToggle,
  onDone,
  muted,
}: {
  selected: HighlightKey[];
  onToggle: (key: HighlightKey) => void;
  onDone: () => void;
  muted: boolean;
}) {
  useEffect(() => {
    if (muted) return;
    const timer = setTimeout(() => speak("Was war am besten?"), 250);
    return () => clearTimeout(timer);
  }, [muted]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
        <span className="text-5xl" aria-hidden="true">
          ⭐
        </span>
        <h1 className="text-3xl font-extrabold">Was war am besten?</h1>
        <div className="flex items-center gap-2">
          <SpeakButton text="Was war am besten?" muted={muted} />
          <p className="text-sm text-ink-soft">Du kannst auch nichts auswählen.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {HIGHLIGHTS.map((item) => {
          const active = selected.includes(item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onToggle(item.key)}
              aria-pressed={active}
              className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl p-2 shadow-md transition active:scale-95 ${
                active ? "bg-ink text-white" : "bg-white ring-1 ring-black/5"
              }`}
            >
              <span className="text-4xl" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="text-xs font-bold leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onDone}
        className="tap mt-4 flex w-full items-center justify-center rounded-2xl bg-grass px-4 text-xl font-extrabold text-white shadow-lg"
      >
        Fertig! 🎉
      </button>
    </div>
  );
}
