import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { DeleteRatingsButton } from "@/components/DeleteRatingsButton";

export const metadata: Metadata = {
  title: "Datenschutz – Spielplatz-Scouts",
  description:
    "Was Spielplatz-Scouts speichert und was nicht: kein Konto, keine Namen, keine Standortübertragung.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh pb-16">
      <AppHeader subtitle="Datenschutz" />

      <main id="inhalt" className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-extrabold leading-tight">Datenschutz</h1>
          <p className="text-ink-soft">
            Hier bewerten Kinder. Deshalb ist Datensparsamkeit kein Nebenaspekt, sondern die
            Bauvorschrift für diese App.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Was gespeichert wird</h2>
          <ul className="list-disc space-y-2 pl-5 text-ink-soft">
            <li>Die ID des bewerteten Spielplatzes</li>
            <li>Das Alter des Kindes (als Zahl) und die daraus abgeleitete Altersgruppe</li>
            <li>Die fünf Antworten und die optionale Lieblingsgerät-Auswahl</li>
            <li>Das Datum — auf den Tag gerundet, ohne Uhrzeit</li>
          </ul>
          <p className="text-sm text-ink-soft">
            In dieser Version bleibt all das <strong>ausschließlich in deinem Browser</strong>{" "}
            (localStorage). Es wird an keinen Server gesendet.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Was nicht gespeichert wird</h2>
          <ul className="list-disc space-y-2 pl-5 text-ink-soft">
            <li>Kein Konto, kein Login, keine E-Mail-Adresse</li>
            <li>Kein Name des Kindes, keine Fotos, keine Freitexte</li>
            <li>Keine Uhrzeit und kein Bewegungsprofil</li>
            <li>Kein Tracking, keine Analyse-Skripte, keine Werbung</li>
          </ul>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Standort</h2>
          <p className="text-ink-soft">
            Der Standort wird nur im Gerät verwendet, um Entfernungen zu berechnen und
            Spielplätze in der Nähe abzufragen. Für die Abfrage der Spielplatzliste geht eine
            auf etwa einen Kilometer gerundete Umkreisanfrage an OpenStreetMap. Deine genaue
            Position verlässt das Gerät nicht.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold">Löschen</h2>
          <DeleteRatingsButton />
        </section>

        <section className="card space-y-2 p-4">
          <h2 className="text-xl font-extrabold">Kartendaten</h2>
          <p className="text-ink-soft">
            Spielplätze und Kartenkacheln stammen von{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap
            </a>{" "}
            (ODbL). Beim Laden der Karte erfährt deren Server die aufgerufenen Kartenausschnitte.
          </p>
        </section>

        <section className="card space-y-2 border-2 border-dashed border-sun p-4">
          <h2 className="text-xl font-extrabold">Hinweis zum Prototyp</h2>
          <p className="text-ink-soft">
            Diese Fassung speichert Bewertungen nur lokal. Sobald Bewertungen zwischen Familien
            geteilt werden, kommt ein Server hinzu — dann gehören Auftragsverarbeitung,
            Impressum und ein vollständiges Verzeichnis der Verarbeitungstätigkeiten dazu.
          </p>
        </section>

        <Link
          href="/so-bewerten-wir/"
          className="tap flex w-full items-center justify-center rounded-2xl bg-ink px-4 text-lg font-bold text-white"
        >
          So bewerten wir
        </Link>
      </main>
    </div>
  );
}
