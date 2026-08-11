"use client";

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
    <div
      className="flex gap-1.5"
      role="group"
      aria-label="Alter des Kindes wählen"
    >
      {AGE_GROUPS.map((group) => {
        const active = value === group.id;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onChange(group.id)}
            aria-pressed={active}
            className={`tap flex min-w-0 flex-1 shrink flex-col items-center justify-center rounded-2xl px-2 py-1.5 transition ${
              active
                ? "bg-ink text-white shadow-lg"
                : "bg-white text-ink shadow-sm ring-1 ring-black/5"
            }`}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              {group.emoji}
            </span>
            <span className="mt-1 text-sm font-bold leading-none">{group.short}</span>
            <span
              className={`mt-0.5 truncate text-[10px] leading-none ${
                active ? "text-white/70" : "text-ink-soft"
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
