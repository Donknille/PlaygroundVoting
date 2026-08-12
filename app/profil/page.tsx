"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Art } from "@/components/art/Art";
import { Mascot } from "@/components/art/Mascot";
import { Pictogram } from "@/components/art/Pictogram";
import {
  badgeStates,
  clearProfile,
  loadProfile,
  monatJetzt,
  naechstesAbzeichen,
  type BadgeState,
  type Profile,
} from "@/lib/profile";
import { highlightMeta } from "@/lib/questions";
import { getOwnRatings } from "@/lib/ratings";
import { scoreOfRating, verdictFor } from "@/lib/scoring";
import type { Rating } from "@/lib/types";
import { findPlayground } from "@/lib/world";

const ALTER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

/**
 * Kinderprofil — freiwillig, ohne Konto, ohne Server.
 *
 * Der Entwurf sah „Vorname + Alter" vor. Gespeichert wird stattdessen ein frei
 * erfundener Spitzname, der das Gerät nie verlässt. Ein Vorname plus Alter plus
 * die Liste besuchter Spielplätze wäre bei einem Kind personenbezogen — in
 * einer Kleinstadt sogar identifizierend.
 *
 * Entwurfsvorgabe für die Abzeichen: „Belohnung ohne Wettbewerb — für Vielfalt,
 * nicht für Menge. Keine Rangliste, kein Vergleich mit anderen Kindern."
 */
export default function ProfilSeite() {
  const [profil, setProfil] = useState<Profile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [geladen, setGeladen] = useState(false);

  const laden = useCallback(() => {
    setProfil(loadProfile());
    setRatings(getOwnRatings());
    setGeladen(true);
  }, []);

  useEffect(laden, [laden]);

  if (!geladen) return null;

  return (
    <div className="min-h-dvh pb-10">
      <AppHeader subtitle="Kinderprofil" />
      <main id="inhalt" className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        {profil ? (
          <ProfilAnsicht
            profil={profil}
            ratings={ratings}
            onLoeschen={() => {
              clearProfile();
              laden();
            }}
          />
        ) : (
          <ProfilAnlegen onFertig={laden} />
        )}
      </main>
    </div>
  );
}

function ProfilAnsicht({
  profil,
  ratings,
  onLoeschen,
}: {
  profil: Profile;
  ratings: Rating[];
  onLoeschen: () => void;
}) {
  const abzeichen = badgeStates(ratings);
  const naechstes = naechstesAbzeichen(abzeichen);
  const plaetze = new Set(ratings.map((r) => r.playgroundId)).size;

  return (
    <>
      <section className="flex items-center gap-3">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-sun-soft">
          <Mascot pose="winkt" className="h-16 w-16" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-3xl leading-tight font-bold">
            {profil.spitzname.trim() || "Scout"}, {profil.alter}
          </h1>
          <p className="text-sm text-ink-soft">
            {profil.seit ? `Testet seit ${profil.seit} · ` : ""}
            {plaetze} {plaetze === 1 ? "Spielplatz" : "Spielplätze"}
          </p>
        </div>
      </section>

      {naechstes ? (
        <section className="rounded-blob bg-sun p-4">
          <p className="label !text-ink/60">Nächstes Abzeichen</p>
          <h2 className="font-display text-2xl font-bold">{naechstes.name}</h2>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink/15">
            <div
              className="h-full rounded-full bg-ink transition-all"
              style={{ width: `${Math.round((naechstes.stand / naechstes.ziel) * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-sm font-semibold">
            {naechstes.aufgabe(naechstes.ziel - naechstes.stand)}
          </p>
        </section>
      ) : (
        <section className="rounded-blob bg-grass-soft p-4">
          <h2 className="font-display text-xl font-bold">Alle Abzeichen gesammelt!</h2>
          <p className="text-sm text-ink-soft">Du hast wirklich alles ausprobiert.</p>
        </section>
      )}

      <section>
        <p className="label mb-2">Deine Abzeichen</p>
        <ul className="grid grid-cols-3 gap-2">
          {abzeichen.map((a) => (
            <AbzeichenKachel key={a.key} abzeichen={a} />
          ))}
        </ul>
      </section>

      <section>
        <p className="label mb-2">Zuletzt bewertet</p>
        {ratings.length === 0 ? (
          <p className="card p-4 text-sm text-ink-soft">
            Noch nichts bewertet. Such dir einen Spielplatz und leg los.
          </p>
        ) : (
          <ul className="space-y-2">
            {[...ratings]
              .reverse()
              .slice(0, 8)
              .map((r) => (
                <LetzteBewertung key={r.id} rating={r} />
              ))}
          </ul>
        )}
      </section>

      <section className="card space-y-2 p-4">
        <h2 className="font-display text-base font-bold">Dieses Profil</h2>
        <p className="text-sm text-ink-soft">
          Spitzname, Alter und Abzeichen liegen ausschließlich in diesem Browser. Sie werden an
          keinen Server gesendet und sind auf keinem anderen Gerät sichtbar. Bewerten funktioniert
          auch ganz ohne Profil.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm("Profil wirklich löschen? Die Abzeichen sind dann weg.")) onLoeschen();
          }}
          className="text-sm font-semibold text-coral-deep underline underline-offset-4"
        >
          Profil löschen
        </button>
      </section>
    </>
  );
}

function AbzeichenKachel({ abzeichen }: { abzeichen: BadgeState }) {
  return (
    <li
      className={`flex flex-col items-center gap-1.5 rounded-chip p-3 text-center ${
        abzeichen.erreicht ? "bg-paper shadow-[0_3px_0_rgb(46_42_36/0.12)]" : "bg-line"
      }`}
    >
      <Pictogram
        name={abzeichen.art as never}
        className={`h-10 w-10 ${abzeichen.erreicht ? "" : "opacity-25 grayscale"}`}
      />
      <span
        className={`text-xs leading-tight font-bold ${
          abzeichen.erreicht ? "" : "text-ink-fainter"
        }`}
      >
        {abzeichen.name}
      </span>
      {!abzeichen.erreicht ? (
        <span className="text-[10px] text-ink-fainter">
          {abzeichen.stand}/{abzeichen.ziel}
        </span>
      ) : null}
    </li>
  );
}

function LetzteBewertung({ rating }: { rating: Rating }) {
  const platz = findPlayground(rating.playgroundId);
  const urteil = verdictFor(scoreOfRating(rating));
  const geraete = rating.highlights.map((h) => highlightMeta(h).label).join(", ");

  return (
    <li>
      <Link
        href={`/spielplatz/?id=${encodeURIComponent(rating.playgroundId)}`}
        className="card flex items-center gap-3 p-3"
      >
        <span
          className="h-9 w-9 shrink-0 rounded-full"
          style={{ background: urteil.farbe }}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-base leading-tight font-bold">
            {rating.playgroundName ?? platz?.name ?? "Ein Spielplatz"}
          </span>
          <span className="block truncate text-sm text-ink-soft">
            {urteil.wort}
            {geraete ? ` · ${geraete}` : ""}
          </span>
        </span>
      </Link>
    </li>
  );
}

function ProfilAnlegen({ onFertig }: { onFertig: () => void }) {
  const [spitzname, setSpitzname] = useState("");
  const [alter, setAlter] = useState<number | null>(null);

  return (
    <>
      <section className="flex flex-col items-center gap-2 pt-2 text-center">
        <Mascot pose="winkt" className="h-32 w-32 animate-bob" />
        <h1 className="font-display text-3xl font-bold">Abzeichen sammeln?</h1>
        <p className="text-ink-soft">
          Mit einem Profil merkt sich die App dein Alter und du sammelst Abzeichen fürs
          Ausprobieren. Ohne Profil funktioniert das Bewerten genauso.
        </p>
      </section>

      <section className="card space-y-4 p-4">
        <div>
          <label htmlFor="spitzname" className="label mb-1.5 block">
            Spitzname (freiwillig)
          </label>
          <input
            id="spitzname"
            type="text"
            value={spitzname}
            maxLength={16}
            onChange={(e) => setSpitzname(e.target.value)}
            placeholder="z. B. Rutschenkönig"
            className="w-full rounded-chip border border-line bg-sand px-3.5 py-3 text-base outline-none placeholder:text-ink-fainter"
          />
          <p className="mt-1.5 text-xs text-ink-faint">
            Bitte keinen echten Namen — denk dir etwas aus. Der Spitzname bleibt auf diesem Gerät.
          </p>
        </div>

        <div>
          <span className="label mb-1.5 block">Wie alt bist du?</span>
          <div className="grid grid-cols-4 gap-2">
            {ALTER.map((wert) => (
              <button
                key={wert}
                type="button"
                onClick={() => setAlter(wert)}
                aria-pressed={alter === wert}
                className={`flex min-h-14 items-center justify-center rounded-chip font-display text-xl font-bold transition ${
                  alter === wert
                    ? "bg-ink text-paper"
                    : "bg-sand text-ink shadow-[0_3px_0_rgb(46_42_36/0.12)]"
                }`}
              >
                {wert === 13 ? "12+" : wert}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={alter === null}
          onClick={() => {
            if (alter === null) return;
            // Import bewusst hier, damit die Seite ohne Profil nichts schreibt.
            void import("@/lib/profile").then(({ saveProfile }) => {
              saveProfile({ spitzname: spitzname.trim(), alter, seit: monatJetzt() });
              onFertig();
            });
          }}
          className="btn btn-primary w-full disabled:opacity-40"
        >
          Profil anlegen
        </button>
      </section>

      <section>
        <p className="label mb-2">Diese Abzeichen gibt es</p>
        <ul className="grid grid-cols-3 gap-2">
          {badgeStates([]).map((a) => (
            <li
              key={a.key}
              className="flex flex-col items-center gap-1.5 rounded-chip bg-line p-3 text-center"
            >
              <Art name={a.art} className="h-10 w-10 opacity-40" />
              <span className="text-xs leading-tight font-bold text-ink-soft">{a.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink-faint">
          Abzeichen gibt es fürs Ausprobieren, nicht fürs Vielsein. Es gibt keine Rangliste und
          keinen Vergleich mit anderen Kindern.
        </p>
      </section>
    </>
  );
}
