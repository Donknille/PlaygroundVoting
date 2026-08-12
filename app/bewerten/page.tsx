"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Art } from "@/components/art/Art";
import { Glyph } from "@/components/art/Glyph";
import { Mascot } from "@/components/art/Mascot";
import { Pictogram } from "@/components/art/Pictogram";
import { QUESTION_TINTS } from "@/components/art/Scene";
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
          <Mascot pose="fragt" className="h-36 w-36" />
          <h1 className="font-display text-2xl font-bold">
            Diesen Spielplatz kennen wir nicht
          </h1>
          <p className="font-semibold text-ink-soft">
            Öffne ihn noch einmal aus der Liste, dann klappt das Bewerten.
          </p>
          <Link href="/" className="btn btn-ink">
            Zur Spielplatzliste
          </Link>
        </div>
      </FullScreen>
    );
  }

  if (done) {
    return (
      <FullScreen tint="var(--color-mint-soft)">
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
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-grass text-white">
            <Glyph name="haken" className="h-14 w-14" />
          </div>
          <h1 className="font-display text-2xl font-bold">Heute schon bewertet!</h1>
          <p className="font-semibold text-ink-soft">
            {playground.name} wurde von diesem Gerät heute bereits bewertet. Morgen geht es
            wieder — so bleiben die Punkte ehrlich.
          </p>
          <Link
            href={`/spielplatz/?id=${encodeURIComponent(id)}`}
            className="btn btn-ink"
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
    <FullScreen tint={QUESTION_TINTS[step % QUESTION_TINTS.length]}>
      <div className="flex items-center justify-between gap-2 pb-2">
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            if (step > 0) setStep(step - 1);
          }}
          className="btn btn-white tap aspect-square !px-0 disabled:opacity-30"
          disabled={step === 0}
          aria-label="Eine Frage zurück"
        >
          <Glyph name="zurueck" className="h-7 w-7" />
        </button>

        <KidProgressDots total={TOTAL_STEPS} current={step} />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMuted((value) => !value);
              stopSpeaking();
            }}
            className="btn btn-white tap aspect-square !px-0"
            aria-label={muted ? "Vorlesen einschalten" : "Vorlesen ausschalten"}
            aria-pressed={!muted}
          >
            <Glyph name={muted ? "stumm" : "lautsprecher"} className="h-7 w-7" />
          </button>
          <Link
            href={`/spielplatz/?id=${encodeURIComponent(id)}`}
            onClick={() => stopSpeaking()}
            className="btn btn-white tap aspect-square !px-0"
            aria-label="Bewerten abbrechen"
          >
            <Glyph name="schliessen" className="h-7 w-7" />
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
          art={currentQuestion.art}
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

/**
 * Vollbild mit Farbton je Schritt. Der Farbwechsel ist der eigentliche
 * Fortschrittsanzeiger für Kinder, die die Punktleiste oben nicht deuten.
 */
function FullScreen({
  children,
  tint,
}: {
  children: React.ReactNode;
  tint?: string;
}) {
  return (
    <div
      className="flex min-h-dvh flex-col px-3 py-3 transition-colors duration-500"
      style={{ background: tint ?? "var(--color-sand)" }}
    >
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
      <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
        <Mascot pose="winkt" className="h-28 w-28 animate-bob" />
        <h1 className="font-display text-3xl font-bold">Wie alt bist du?</h1>
        <div className="flex items-center gap-2">
          <SpeakButton text="Wie alt bist du?" muted={muted} />
          <p className="text-sm font-semibold text-ink-soft">Mehr fragen wir nicht.</p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-4 content-start gap-2">
        {AGES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onPick(value)}
            className="flex min-h-20 items-center justify-center rounded-chip bg-white font-display text-3xl font-bold shadow-[0_5px_0_rgb(42_30_70/0.14)] transition active:translate-y-[4px] active:shadow-[0_1px_0_rgb(42_30_70/0.14)]"
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
      <div className="flex flex-col items-center justify-center gap-1.5 py-3 text-center">
        <Pictogram name="stern" className="h-14 w-14 animate-wiggle" />
        <h1 className="font-display text-3xl font-bold">Was war am besten?</h1>
        <div className="flex items-center gap-2">
          <SpeakButton text="Was war am besten?" muted={muted} />
          <p className="text-sm font-semibold text-ink-soft">
            Du kannst auch nichts auswählen.
          </p>
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
              className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-chip p-2 transition active:translate-y-[3px] ${
                active
                  ? "bg-ink text-white shadow-[0_4px_0_#170f28] ring-4 ring-yolk"
                  : "bg-white shadow-[0_4px_0_rgb(42_30_70/0.14)]"
              }`}
            >
              <Art name={item.art} className="h-11 w-11" />
              <span className="text-xs leading-tight font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onDone} className="btn btn-primary mt-auto mb-2 w-full text-xl">
        Fertig!
      </button>
    </div>
  );
}
