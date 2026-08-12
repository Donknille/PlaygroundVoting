import Link from "next/link";
import { Icon } from "@/components/art/Icon";

/**
 * Demo-Daten müssen immer als solche erkennbar sein. Generierte Beispielstimmen
 * dürfen nie mit echten Kinderbewertungen verwechselt werden.
 */
export function DemoBanner({ reason }: { reason?: string | null }) {
  return (
    <div className="flex items-start gap-2.5 rounded-chip border-[3px] border-dashed border-sun bg-sun-soft px-3 py-2.5 text-sm">
      <Icon name="kolben" className="mt-0.5 h-7 w-7 shrink-0" />
      <p>
        <span className="font-display font-bold">Demo-Modus — erfundene Spielplätze.</span>{" "}
        <span className="font-semibold text-ink-soft">
          {reason ? `${reason} ` : ""}
          Keine echten Kinderstimmen.{" "}
          <Link href="/so-bewerten-wir/#demo" className="underline underline-offset-4">
            Mehr dazu
          </Link>
        </span>
      </p>
    </div>
  );
}
