import Link from "next/link";
import { MascotHead } from "@/components/art/Mascot";
import { Icon } from "@/components/art/Icon";

export function AppHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-2">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun-soft">
            <MascotHead className="h-9 w-9" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight font-bold">
              Spielplatz-Scouts
            </span>
            <span className="block truncate text-[11px] leading-tight font-semibold text-ink-soft">
              {subtitle ?? "Von Kindern bewertet"}
            </span>
          </span>
        </Link>
        <Link
          href="/so-bewerten-wir/"
          className="tap flex shrink-0 items-center gap-1.5 rounded-full bg-paper px-3 py-2 text-[11px] font-bold whitespace-nowrap shadow-[0_3px_0_rgb(42_30_70/0.12)]"
        >
          <Icon name="lineal" className="h-5 w-5" />
          So bewerten wir
        </Link>
      </div>
    </header>
  );
}
