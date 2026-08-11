import Link from "next/link";

/**
 * Demo-Daten müssen immer als solche erkennbar sein. Generierte Beispielstimmen
 * dürfen nie mit echten Kinderbewertungen verwechselt werden.
 */
export function DemoBanner({ reason }: { reason?: string | null }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-sun bg-sun-soft px-3 py-2 text-sm">
      <p className="font-bold">🧪 Demo-Modus — erfundene Spielplätze</p>
      <p className="text-ink-soft">
        {reason ? `${reason} ` : ""}
        Keine echten Kinderstimmen.{" "}
        <Link href="/so-bewerten-wir/#demo" className="underline underline-offset-4">
          Mehr dazu
        </Link>
      </p>
    </div>
  );
}
