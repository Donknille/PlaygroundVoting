"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Karte und Liste sind seit dem Entwurf zwei Ansichten *einer* Seite und keine
 * zwei Seiten mehr. Diese Adresse bleibt bestehen, damit gespeicherte Links und
 * ein bereits abgelegter Startbildschirm-Eintrag nicht ins Leere laufen.
 */
export default function KartenWeiterleitung() {
  useEffect(() => {
    window.location.replace("/?ansicht=karte");
  }, []);

  return (
    <main id="inhalt" className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
      <h1 className="font-display text-xl font-bold">Die Karte ist umgezogen</h1>
      <p className="text-ink-soft">
        Karte und Liste liegen jetzt zusammen auf der Startseite.
      </p>
      <Link href="/?ansicht=karte" className="btn btn-ink">
        Weiter zur Karte
      </Link>
    </main>
  );
}
