import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Für Kommunen – Spielplatz-Scouts",
  description:
    "Laufende Kinderbeteiligung statt einmaliger Workshops: anonymisiertes Feedback zu jedem Spielplatz, aufgeschlüsselt nach Altersgruppe.",
};

const PACKAGES = [
  {
    name: "Gemeinde",
    size: "bis 20.000 Einwohner",
    price: "490 €",
    perks: ["Alle Spielplätze im Dashboard", "Auswertung nach Altersgruppe", "PDF-Export"],
  },
  {
    name: "Stadt",
    size: "20.000 – 100.000 Einwohner",
    price: "1.490 €",
    perks: ["Zusätzlich Trendverlauf", "Vergleich der Stadtteile", "QR-Schilder für die Plätze"],
  },
  {
    name: "Großstadt",
    size: "über 100.000 Einwohner",
    price: "2.900 €",
    perks: ["Zusätzlich Bezirksrechte", "Datenexport (CSV)", "Begleitung der Beteiligungswoche"],
  },
];

export default function MunicipalityPage() {
  return (
    <div className="min-h-dvh pb-16">
      <AppHeader subtitle="Für Kommunen" />

      <main id="inhalt" className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <section className="space-y-3">
          <h1 className="text-3xl font-extrabold leading-tight">
            Kinderbeteiligung, die nicht nach einem Nachmittag endet
          </h1>
          <p className="text-ink-soft">
            Kinder und Jugendliche sind bei Planungen zu beteiligen, die sie betreffen — §&nbsp;1
            Abs.&nbsp;3 SGB&nbsp;VIII, die Gemeindeordnungen der Länder und §&nbsp;3 BauGB sagen
            das seit Jahren. In der Praxis heißt das meist: ein Workshop, zwölf Kinder, ein
            Protokoll, fünf Jahre Ruhe.
          </p>
          <p className="text-ink-soft">
            Spielplatz-Scouts sammelt dieselbe Beteiligung dauerhaft — dort, wo Kinder ohnehin
            sind, in 30 Sekunden und ohne dass ein einziges personenbezogenes Datum entsteht.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Was Sie im Dashboard sehen</h2>
          <ul className="list-disc space-y-2 pl-5 text-ink-soft">
            <li>
              <strong>Rangliste Ihrer Spielplätze</strong> — je Altersgruppe, nicht als
              Sammelstern
            </li>
            <li>
              <strong>Wo es hakt</strong> — welche Frage einen Platz nach unten zieht
              (Bewegung? Verweildauer? Schatten?)
            </li>
            <li>
              <strong>Lieblingsgeräte</strong> — was Kinder tatsächlich zuerst nennen
            </li>
            <li>
              <strong>Trend nach einer Sanierung</strong> — messbar statt vermutet
            </li>
            <li>
              <strong>Export</strong> für Gemeinderatsvorlagen
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-extrabold">Jahreslizenz</h2>
          <div className="space-y-3">
            {PACKAGES.map((pack) => (
              <article key={pack.name} className="card space-y-2 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{pack.name}</h3>
                    <p className="text-sm text-ink-soft">{pack.size}</p>
                  </div>
                  <p className="text-xl font-extrabold">
                    {pack.price}
                    <span className="text-sm font-medium text-ink-soft"> / Jahr</span>
                  </p>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {pack.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="text-sm text-ink-soft">
            Zum Vergleich: ein einzelner moderierter Beteiligungsworkshop kostet meist mehr als
            eine Jahreslizenz — und liefert eine Momentaufnahme statt einer Zeitreihe.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Warum das datenschutzrechtlich trägt</h2>
          <p className="text-ink-soft">
            Es gibt keine Konten, keine Namen, keine Fotos und keine Freitexte. Erfasst werden
            ausschließlich Altersgruppe, fünf Antworten und der Tag. Damit entstehen keine
            personenbezogenen Daten von Kindern, die nach Art.&nbsp;8 DSGVO besonders geschützt
            sind — der übliche Stolperstein solcher Beteiligungsprojekte.
          </p>
          <Link href="/datenschutz/" className="inline-block underline underline-offset-4">
            Details zum Datenschutz
          </Link>
        </section>

        <section className="card space-y-2 border-2 border-dashed border-sun p-4">
          <h2 className="text-xl font-extrabold">Prototyp</h2>
          <p className="text-ink-soft">
            Diese Seite beschreibt das geplante Angebot. Das Kommunen-Dashboard ist noch nicht
            gebaut, und es sind noch keine Kontaktdaten hinterlegt.
          </p>
        </section>

        <Link
          href="/"
          className="tap flex w-full items-center justify-center rounded-2xl bg-ink px-4 text-lg font-bold text-white"
        >
          Zur App
        </Link>
      </main>
    </div>
  );
}
