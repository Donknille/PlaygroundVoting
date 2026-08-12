"use client";

import { Art } from "@/components/art/Art";
import { AGE_GROUPS } from "@/lib/questions";
import type { AgeGroupId } from "@/lib/types";

/**
 * Die wichtigste Einstellung der App: Für welches Kind wird gesucht?
 * Ein Platz kann für Krabbler top und für Große langweilig sein – ohne diese
 * Auswahl ist jeder Punktwert irreführend.
 */
export function AgeGroupPicker({
  value,
  onChange,
}: {
  value: AgeGroupId | null;
  onChange: (id: AgeGroupId) => void;
}) {
  return (
    <div className="flex gap-2" role="group" aria-label="Alter des Kindes wählen">
      {AGE_GROUPS.map((group) => {
        const active = value === group.id;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onChange(group.id)}
            aria-pressed={active}
            className={`tap flex min-w-0 flex-1 shrink flex-col items-center justify-center gap-0.5 rounded-chip px-1 py-2 transition ${
              active
                ? "bg-ink text-white shadow-[0_4px_0_#170f28]"
                : "bg-white shadow-[0_4px_0_rgb(42_30_70/0.14)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(42_30_70/0.14)]"
            }`}
          >
            <Art name={group.art} className="h-7 w-7" />
            <span className="font-display text-sm leading-none font-bold">
              {group.short}
            </span>
            <span
              className={`truncate text-[10px] leading-none font-semibold ${
                active ? "text-white/75" : "text-ink-soft"
              }`}
            >
              {group.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
