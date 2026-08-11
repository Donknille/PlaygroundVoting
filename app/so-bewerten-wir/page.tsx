import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { MIN_RATINGS_FOR_SCORE } from "@/lib/config";
import {
  AGE_GROUPS,
  ANSWER_POINTS,
  HIGHLIGHTS,
  QUESTIONS,
  SCORED_QUESTIONS,
} from "@/lib/questions";

export const metadata: Metadata = {
  title: "So bewerten wir – Spielplatz-Scouts",
  description:
    "Alle fünf Kinderfragen, ihre Gewichtung und die Rechenregeln hinter den Spaß-Punkten – vollständig offengelegt.",
};

/**
 * Transparenzseite. Rendert ausschließlich aus lib/questions.ts – derselben Datei,
 * aus der der Kinder-Modus seine Fragen zieht. Erklärung und Praxis können damit
 * nicht auseinanderlaufen.
 */
export default function ScalePage() {
  return (
    <div className="min-h-dvh pb-16">
      <AppHeader subtitle="Bewertungsmaßstab" />

      <main id="inhalt" className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-extrabold leading-tight">So bewerten wir</h1>
          <p className="text-ink-soft">
            Jeder Punktwert in dieser App entsteht aus genau fünf Fragen, die Kinder
            beantworten. Hier steht vollständig, welche das sind, wie stark jede zählt und was
            bewusst <em>nicht</em> einfließt.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Wer bewertet</h2>
          <p className="text-ink-soft">
            Das Kind selbst — nicht die Eltern. Die einzige Angabe, die wir dazu erfassen, ist
            das Alter. Kein Name, kein Konto, kein Foto, kein Standort auf unseren Servern.
          </p>
          <Link href="/datenschutz/" className="inline-block underline underline-offset-4">
            Was gespeichert wird
          </Link>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-extrabold">Die fünf Fragen</h2>
          {QUESTIONS.map((question, index) => (
            <article key={question.id} className="card space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold leading-tight">
                  <span aria-hidden="true">{question.emoji}</span> {index + 1}.{" "}
                  {question.prompt}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    question.weight > 0 ? "bg-sun-soft" : "bg-sand-deep text-ink-soft"
                  }`}
                >
                  {question.weight > 0
                    ? `${Math.round(question.weight * 100)} %`
                    : "zählt nicht"}
                </span>
              </div>

              <ul className="grid grid-cols-3 gap-2">
                {question.options.map((option, optionIndex) => (
                  <li
                    key={option.label}
                    className="flex flex-col items-center gap-1 rounded-2xl bg-sand-deep p-2 text-center"
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span className="text-xs font-bold leading-tight">{option.label}</span>
                    <span className="text-xs text-ink-soft">
                      {ANSWER_POINTS[optionIndex as 0 | 1 | 2]}{" "}
                      {ANSWER_POINTS[optionIndex as 0 | 1 | 2] === 1 ? "Punkt" : "Punkte"}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-ink-soft">{question.explain}</p>
            </article>
          ))}
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Wie daraus Punkte werden</h2>
          <ol className="list-decimal space-y-2 pl-5 text-ink-soft">
            <li>
              Jede Antwort wird zu Punkten: links = 1, Mitte = 3, rechts = 5.
            </li>
            <li>
              Über alle Bewertungen bilden wir je Frage den <strong>Median</strong>, nicht den
              Mittelwert. Ein einzelner Ausreißer kippt damit kein Ergebnis.
            </li>
            <li>
              Die Mediane werden gewichtet zusammengezählt:{" "}
              {SCORED_QUESTIONS.map(
                (q, index) =>
                  `${Math.round(q.weight * 100)} % ${q.id}${
                    index < SCORED_QUESTIONS.length - 1 ? " + " : ""
                  }`,
              )}
              .
            </li>
            <li>
              Ergebnis sind die <strong>Spaß-Punkte von 1 bis 5</strong> — immer getrennt nach
              Altersgruppe.
            </li>
          </ol>

          <div className="rounded-2xl bg-sand-deep p-3 text-sm">
            <p className="font-bold">Beispielrechnung</p>
            <p className="mt-1 text-ink-soft">
              Superlustig (5) · nur ein bisschen bleiben (3) · super toben (5) · keine anderen
              Kinder (1)
              <br />
              0,4 × 5 + 0,3 × 3 + 0,2 × 5 + 0,1 × 1 = <strong>4,0 Punkte</strong>
            </p>
          </div>

          <p className="text-sm text-ink-soft">
            Punkte zeigen wir erst ab <strong>{MIN_RATINGS_FOR_SCORE} Bewertungen</strong> je
            Altersgruppe. Darunter steht die Zahl der Stimmen, aber kein Wert — eine einzelne
            Meinung ist kein Urteil.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Warum das Alter alles verändert</h2>
          <p className="text-ink-soft">
            Ein Kletterturm ist für Zehnjährige großartig und für Zweijährige unbrauchbar.
            Deshalb gibt es keinen einzelnen Gesamtstern, sondern einen Wert je Altersgruppe:
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {AGE_GROUPS.map((group) => (
              <li key={group.id} className="rounded-2xl bg-sand-deep p-3">
                <span className="text-2xl" aria-hidden="true">
                  {group.emoji}
                </span>
                <span className="block font-bold">{group.label}</span>
                <span className="block text-sm text-ink-soft">{group.short} Jahre</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Was bewusst nicht einfließt</h2>
          <ul className="list-disc space-y-2 pl-5 text-ink-soft">
            <li>
              <strong>Schatten.</strong> Wird gefragt, zählt aber nicht zu den Spaß-Punkten.
              Schatten ist ein Elternkriterium — er erscheint als eigenes Abzeichen.
            </li>
            <li>
              <strong>Ausstattung aus OpenStreetMap</strong> (Zaun, WC, Wasser, barrierefrei).
              Das sind Kartendaten, keine Kinderstimmen. Sie stehen als Abzeichen dabei.
            </li>
            <li>
              <strong>Sauberkeit, Parkplätze, Bänke.</strong> Klassische Erwachsenenkriterien —
              genau die Perspektive, die diese App nicht abbilden will.
            </li>
          </ul>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Regeln gegen Verzerrung</h2>
          <ul className="list-disc space-y-2 pl-5 text-ink-soft">
            <li>
              Die drei Antworten sehen <strong>immer gleich aus</strong> — gleiche Farbe,
              gleiche Größe. Kein Kind wird optisch zur „richtigen" Antwort gelenkt.
            </li>
            <li>
              Die Reihenfolge ist immer dieselbe (links wenig, rechts viel), damit Kinder sie
              wiedererkennen.
            </li>
            <li>
              Die Frage „Wolltest du noch länger bleiben?" ist der Gegencheck zur Spaßfrage.
            </li>
            <li>Ein Gerät kann denselben Spielplatz pro Tag einmal bewerten.</li>
            <li>Median statt Mittelwert, Mindestzahl an Stimmen (siehe oben).</li>
          </ul>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Was war am besten?</h2>
          <p className="text-ink-soft">
            Nach den fünf Fragen dürfen Kinder ihr Lieblingsgerät auswählen. Das zählt nicht in
            die Punkte, zeigt Eltern aber sofort, was den Platz ausmacht:
          </p>
          <ul className="flex flex-wrap gap-2">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-1.5 rounded-full bg-plum-soft px-3 py-1.5 text-sm font-medium"
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </section>

        <section id="demo" className="card space-y-3 border-2 border-dashed border-sun p-4">
          <h2 className="text-xl font-extrabold">🧪 Über den Demo-Modus</h2>
          <p className="text-ink-soft">
            Wenn keine Verbindung zu OpenStreetMap besteht oder du den Demo-Modus selbst
            startest, zeigt die App <strong>erfundene Spielplätze mit generierten
            Bewertungen</strong>. Sie sind überall als Demo gekennzeichnet.
          </p>
          <p className="text-ink-soft">
            Echte Spielplätze zeigen ausschließlich echte Stimmen. Ein Platz ohne Bewertungen
            bleibt sichtbar unbewertet — wir füllen ihn nicht künstlich auf.
          </p>
        </section>

        <Link
          href="/"
          className="tap flex w-full items-center justify-center rounded-2xl bg-ink px-4 text-lg font-bold text-white"
        >
          Spielplätze in der Nähe finden
        </Link>
      </main>
    </div>
  );
}
