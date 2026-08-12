"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Art } from "@/components/art/Art";
import { Glyph } from "@/components/art/Glyph";
import { Mascot } from "@/components/art/Mascot";
import { RewardScreen } from "@/components/RewardScreen";
import { useCenter, usePlaygroundWorld, useQueryParam } from "@/lib/hooks";
import { loadProfile, monatJetzt, saveProfile } from "@/lib/profile";
import { HIGHLIGHTS, QUESTIONS } from "@/lib/questions";
import { hasRatedToday, saveRating } from "@/lib/ratings";
import { speak, stopSpeaking } from "@/lib/speech";
import type { AnswerValue, HighlightKey, Playground, QuestionId } from "@/lib/types";
import { findPlayground } from "@/lib/world";

const AGES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

/** Die Kernfrage. Alles Weitere ist überspringbare Zusatzrunde. */
const KERNFRAGE = QUESTIONS[0];
const ZUSATZFRAGEN = QUESTIONS.slice(1);

type Phase = "ort" | "alter" | "urteil" | "bestes" | "angebot" | "zusatz" | "fertig";

/**
 * Kinder-Modus.
 *
 * Entwurfsvorgabe: „Bewerten dauert unter 30 Sekunden, drei Schritte, kein
 * Tippen." Die drei Schritte sind: Wo hast du gespielt — Wie war es — Was war
 * am besten. Das Alter steht im Profil und wird nur gefragt, wenn keines
 * angelegt ist; danach lässt es sich auf Wunsch merken.
 *
 * Die übrigen vier Fragen laufen als ausdrücklich freiwillige Zusatzrunde.
 * Ohne sie bliebe zu wenig übrig, um ein Kommunen-Dashboard zu speisen; als
 * Pflicht würden sie den Ablauf verdoppeln. Übersprungene Fragen werden in der
 * Auswertung ausgelassen, nicht als schlechte Antwort gewertet.
 */
export default function KidMode() {
  const idParam = useQueryParam("id");
  const { center } = useCenter();
  const world = usePlaygroundWorld(center, false);

  const [bereit, setBereit] = useState(false);
  const [ort, setOrt] = useState<Playground | null>(null);
  const [alter, setAlter] = useState<number | null>(null);
  const [hatProfil, setHatProfil] = useState(false);
  const [phase, setPhase] = useState<Phase>("ort");
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, AnswerValue>>>({});
  const [highlights, setHighlights] = useState<HighlightKey[]>([]);
  const [zusatzNr, setZusatzNr] = useState(0);
  const [muted, setMuted] = useState(false);
  const [schonBewertet, setSchonBewertet] = useState(false);
  const [alterMerken, setAlterMerken] = useState(true);

  useEffect(() => {
    const profil = loadProfile();
    if (profil) {
      setAlter(profil.alter);
      setHatProfil(true);
    }
    const vorgabe = idParam ? findPlayground(idParam) : null;
    if (vorgabe) {
      setOrt(vorgabe);
      setSchonBewertet(hasRatedToday(vorgabe.id));
      setPhase(profil ? "urteil" : "alter");
    }
    setBereit(true);
  }, [idParam]);

  useEffect(() => () => stopSpeaking(), []);

  const ansage = useCallback(
    (text: string) => {
      if (!muted) speak(text);
    },
    [muted],
  );

  const abschliessen = useCallback(
    (gewaehlt: HighlightKey[], alleAntworten: Partial<Record<QuestionId, AnswerValue>>) => {
      if (!ort || alter === null) return;
      saveRating({
        playgroundId: ort.id,
        playgroundName: ort.name,
        age: alter,
        answers: alleAntworten,
        highlights: gewaehlt,
      });
      if (alterMerken && !hatProfil) {
        saveProfile({ spitzname: "", alter, seit: monatJetzt() });
      }
      stopSpeaking();
      setPhase("fertig");
    },
    [ort, alter, alterMerken, hatProfil],
  );

  const seed = useMemo(
    () => (alter ?? 0) + Object.values(answers).reduce<number>((s, v) => s + (v ?? 0), 0),
    [alter, answers],
  );

  if (!bereit) return <KidScreen>{null}</KidScreen>;

  if (schonBewertet && ort) {
    return (
      <KidScreen>
        <Mitte>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-paper">
            <Glyph name="haken" className="h-14 w-14 text-grass" />
          </div>
          <h1 className="font-display text-3xl font-bold text-paper">Heute schon bewertet!</h1>
          <p className="text-lg text-paper/80">
            {ort.name} hast du heute schon getestet. Morgen geht es wieder — so bleiben die
            Urteile ehrlich.
          </p>
          <Link href={`/spielplatz/?id=${encodeURIComponent(ort.id)}`} className="btn btn-paper">
            Ergebnis ansehen
          </Link>
        </Mitte>
      </KidScreen>
    );
  }

  if (phase === "fertig" && ort) {
    return (
      <KidScreen>
        <RewardScreen playgroundId={ort.id} playgroundName={ort.name} seed={seed} />
      </KidScreen>
    );
  }

  /* --- Schritt 1: Wo hast du gespielt? --- */
  if (phase === "ort") {
    const vorschlaege = world.playgrounds.slice(0, 6);
    return (
      <KidScreen kopf={<KidKopf schritt={1} muted={muted} onMute={() => setMuted((m) => !m)} />}>
        <h1 className="px-1 pt-1 pb-4 font-display text-4xl leading-tight font-bold text-paper">
          Wo hast du gespielt?
        </h1>
        <div className="flex-1 space-y-3">
          {vorschlaege.length === 0 ? (
            <p className="text-lg text-paper/80">
              Wir wissen gerade nicht, wo ihr seid. Geh zurück und wähle einen Spielplatz aus der
              Liste.
            </p>
          ) : (
            vorschlaege.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setOrt(p);
                  setSchonBewertet(hasRatedToday(p.id));
                  setPhase(hatProfil ? "urteil" : "alter");
                }}
                className="flex w-full items-center gap-3 rounded-blob bg-paper p-4 text-left shadow-[0_5px_0_var(--color-kid-dark)] transition active:translate-y-[4px] active:shadow-[0_1px_0_var(--color-kid-dark)]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-line">
                  <Art name={p.equipment[0] ?? "rutsche"} className="h-9 w-9" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xl leading-tight font-bold">
                    {p.name}
                  </span>
                  <span className="block text-base text-ink-soft">
                    {i === 0 ? "gleich um die Ecke" : `${Math.round(p.distanceM)} m entfernt`}
                  </span>
                </span>
              </button>
            ))
          )}
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-blob border-2 border-dashed border-paper/50 p-5 text-lg font-bold text-paper/80"
          >
            Woanders gespielt
          </Link>
        </div>
      </KidScreen>
    );
  }

  /* --- Alter, nur wenn kein Profil besteht --- */
  if (phase === "alter") {
    return (
      <KidScreen kopf={<KidKopf schritt={1} muted={muted} onMute={() => setMuted((m) => !m)} />}>
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <Mascot pose="winkt" className="h-24 w-24 animate-bob" />
          <h1 className="font-display text-4xl font-bold text-paper">Wie alt bist du?</h1>
          <p className="text-base text-paper/75">Mehr fragen wir nicht.</p>
        </div>
        <div className="grid flex-1 grid-cols-4 content-start gap-2">
          {AGES.map((wert) => (
            <button
              key={wert}
              type="button"
              onClick={() => {
                setAlter(wert);
                setPhase("urteil");
                ansage(KERNFRAGE.prompt);
              }}
              className="flex min-h-20 items-center justify-center rounded-chip bg-paper font-display text-3xl font-bold shadow-[0_5px_0_var(--color-kid-dark)] transition active:translate-y-[4px] active:shadow-[0_1px_0_var(--color-kid-dark)]"
            >
              {wert === 13 ? "12+" : wert}
            </button>
          ))}
        </div>
        <label className="mt-3 flex items-center gap-3 rounded-chip bg-kid-dark p-3 text-paper">
          <input
            type="checkbox"
            checked={alterMerken}
            onChange={(e) => setAlterMerken(e.target.checked)}
            className="h-6 w-6 shrink-0 accent-sun"
          />
          <span className="text-sm">
            Alter auf diesem Gerät merken — dann geht es beim nächsten Mal schneller.
          </span>
        </label>
      </KidScreen>
    );
  }

  /* --- Schritt 2: Wie war es? --- */
  if (phase === "urteil") {
    return (
      <KidScreen
        kopf={<KidKopf schritt={2} muted={muted} onMute={() => setMuted((m) => !m)} />}
        onSprechen={() => ansage(KERNFRAGE.prompt)}
      >
        <Frage text={KERNFRAGE.prompt} art={KERNFRAGE.art} />
        <Antworten
          optionen={KERNFRAGE.options}
          onWahl={(i) => {
            setAnswers((p) => ({ ...p, [KERNFRAGE.id]: i as AnswerValue }));
            setPhase("bestes");
            ansage("Was war am besten?");
          }}
        />
      </KidScreen>
    );
  }

  /* --- Schritt 3: Was war am besten? --- */
  if (phase === "bestes") {
    return (
      <KidScreen
        kopf={<KidKopf schritt={3} muted={muted} onMute={() => setMuted((m) => !m)} />}
        onSprechen={() => ansage("Was war am besten?")}
      >
        <Frage text="Was war am besten?" klein="Du kannst auch nichts auswählen." art="stern" />
        <div className="grid flex-1 grid-cols-3 content-start gap-2">
          {HIGHLIGHTS.map((item) => {
            const aktiv = highlights.includes(item.key);
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={aktiv}
                onClick={() =>
                  setHighlights((p) =>
                    p.includes(item.key) ? p.filter((k) => k !== item.key) : [...p, item.key],
                  )
                }
                className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-chip p-2 transition active:translate-y-[3px] ${
                  aktiv
                    ? "bg-sun shadow-[0_4px_0_var(--color-sun-deep)]"
                    : "bg-paper shadow-[0_4px_0_var(--color-kid-dark)]"
                }`}
              >
                <Art name={item.art} className="h-11 w-11" />
                <span className="text-xs leading-tight font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setPhase("angebot")}
          className="btn btn-sun mt-3 w-full text-xl"
        >
          Fertig!
        </button>
      </KidScreen>
    );
  }

  /* --- Zusatzrunde anbieten, ausdrücklich freiwillig --- */
  if (phase === "angebot") {
    return (
      <KidScreen>
        <Mitte>
          <Mascot pose="fragt" className="h-32 w-32 animate-bob" />
          <h1 className="font-display text-3xl font-bold text-paper">
            Magst du noch vier Fragen?
          </h1>
          <p className="text-lg text-paper/80">
            Dauert nochmal zehn Sekunden. Muss aber nicht sein.
          </p>
          <div className="w-full space-y-2">
            <button
              type="button"
              onClick={() => {
                setPhase("zusatz");
                ansage(ZUSATZFRAGEN[0].prompt);
              }}
              className="btn btn-sun w-full text-xl"
            >
              Ja, gerne
            </button>
            <button
              type="button"
              onClick={() => abschliessen(highlights, answers)}
              className="btn btn-paper w-full"
            >
              Nein, fertig
            </button>
          </div>
        </Mitte>
      </KidScreen>
    );
  }

  /* --- Zusatzrunde --- */
  const frage = ZUSATZFRAGEN[zusatzNr];
  return (
    <KidScreen
      kopf={
        <KidKopf
          schritt={3}
          zusatz={`${zusatzNr + 1}/${ZUSATZFRAGEN.length}`}
          muted={muted}
          onMute={() => setMuted((m) => !m)}
        />
      }
      onSprechen={() => ansage(frage.prompt)}
    >
      <Frage text={frage.prompt} art={frage.art} />
      <Antworten
        optionen={frage.options}
        onWahl={(i) => {
          const neu = { ...answers, [frage.id]: i as AnswerValue };
          setAnswers(neu);
          if (zusatzNr + 1 < ZUSATZFRAGEN.length) {
            setZusatzNr(zusatzNr + 1);
            ansage(ZUSATZFRAGEN[zusatzNr + 1].prompt);
          } else {
            abschliessen(highlights, neu);
          }
        }}
      />
    </KidScreen>
  );
}

/* -------------------------------------------------------------------------- */

/** Eigener Look: dunkles Blau über den ganzen Bildschirm, alles doppelt so groß. */
function KidScreen({
  children,
  kopf,
  onSprechen,
}: {
  children: React.ReactNode;
  kopf?: React.ReactNode;
  onSprechen?: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-kid px-4 py-3">
      {kopf}
      <main id="inhalt" className="flex flex-1 flex-col">
        {children}
      </main>
      {onSprechen ? (
        <button
          type="button"
          onClick={onSprechen}
          className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-kid-dark text-paper"
          aria-label="Frage vorlesen"
        >
          <Glyph name="lautsprecher" className="h-7 w-7" />
        </button>
      ) : null}
    </div>
  );
}

function KidKopf({
  schritt,
  zusatz,
  muted,
  onMute,
}: {
  schritt: 1 | 2 | 3;
  zusatz?: string;
  muted: boolean;
  onMute: () => void;
}) {
  return (
    <div className="flex items-center gap-3 pb-3">
      <Link
        href="/"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kid-dark text-paper"
        aria-label="Kinder-Modus verlassen"
      >
        <Glyph name="zurueck" className="h-6 w-6" />
      </Link>
      <div
        className="flex flex-1 gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={schritt}
        aria-label={`Schritt ${schritt} von 3`}
      >
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={`h-2 flex-1 rounded-full ${s <= schritt ? "bg-paper" : "bg-paper/30"}`}
          />
        ))}
      </div>
      {zusatz ? <span className="text-sm font-bold text-paper/70">{zusatz}</span> : null}
      <button
        type="button"
        onClick={onMute}
        aria-pressed={!muted}
        aria-label={muted ? "Vorlesen einschalten" : "Vorlesen ausschalten"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kid-dark text-paper"
      >
        <Glyph name={muted ? "stumm" : "lautsprecher"} className="h-6 w-6" />
      </button>
    </div>
  );
}

function Frage({ text, klein, art }: { text: string; klein?: string; art?: string }) {
  return (
    <div className="flex items-start gap-3 px-1 pt-1 pb-3">
      {art ? (
        <span className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-blob rounded-bl-md bg-paper">
          <Art name={art} className="h-10 w-10" />
        </span>
      ) : null}
      <div className="min-w-0">
        <h1 className="animate-slide-up font-display text-4xl leading-tight font-bold text-balance text-paper">
          {text}
        </h1>
        {klein ? <p className="mt-1.5 text-base text-paper/75">{klein}</p> : null}
      </div>
    </div>
  );
}

function Antworten({
  optionen,
  onWahl,
}: {
  optionen: readonly { art: string; label: string }[];
  onWahl: (index: number) => void;
}) {
  return (
    <div className="flex flex-1 items-start pb-1">
      <div className="grid w-full grid-cols-3 gap-2">
        {optionen.map((option, index) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onWahl(index)}
            className="flex min-h-[38vh] flex-col items-center justify-center gap-3 rounded-blob bg-paper p-2 shadow-[0_5px_0_var(--color-kid-dark)] transition active:translate-y-[4px] active:shadow-[0_1px_0_var(--color-kid-dark)]"
          >
            <Art name={option.art} className="h-24 w-24" />
            <span className="text-center text-sm leading-tight font-bold text-ink-soft">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Mitte({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2 text-center">
      {children}
    </div>
  );
}
