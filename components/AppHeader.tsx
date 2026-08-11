import Link from "next/link";

export function AppHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="text-2xl leading-none" aria-hidden="true">
            🛝
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-extrabold leading-tight">
              Spielplatz-Scouts
            </span>
            <span className="block truncate text-[11px] leading-tight text-ink-soft">
              {subtitle ?? "Von Kindern bewertet"}
            </span>
          </span>
        </Link>
        <Link
          href="/so-bewerten-wir/"
          className="tap flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 text-[11px] font-bold whitespace-nowrap shadow-sm ring-1 ring-black/5"
        >
          <span aria-hidden="true">📏</span>
          So bewerten wir
        </Link>
      </div>
    </header>
  );
}
