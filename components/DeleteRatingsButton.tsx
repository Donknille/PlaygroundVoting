"use client";

import { useState } from "react";
import { deleteAllRatings, getOwnRatings } from "@/lib/ratings";
import { useMounted } from "@/lib/hooks";

export function DeleteRatingsButton() {
  const mounted = useMounted();
  const [deleted, setDeleted] = useState(false);
  const count = mounted && !deleted ? getOwnRatings().length : 0;

  if (!mounted) return null;

  if (deleted) {
    return (
      <p className="rounded-2xl bg-grass-soft p-3 text-sm font-bold">
        ✅ Alle Bewertungen wurden von diesem Gerät gelöscht.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-ink-soft">
        Auf diesem Gerät {count === 1 ? "ist" : "sind"} aktuell{" "}
        <strong>
          {count} {count === 1 ? "Bewertung" : "Bewertungen"}
        </strong>{" "}
        gespeichert.
      </p>
      <button
        type="button"
        disabled={count === 0}
        onClick={() => {
          deleteAllRatings();
          setDeleted(true);
        }}
        className="tap w-full rounded-2xl bg-coral-soft px-4 font-bold text-ink disabled:opacity-50"
      >
        Alle meine Bewertungen löschen
      </button>
    </div>
  );
}
