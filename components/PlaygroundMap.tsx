"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef } from "react";
import { aggregateFor, verdictFor } from "@/lib/scoring";
import type { AgeGroupId, Coords, PlaygroundWithDistance } from "@/lib/types";
import { ratingsForPlayground } from "@/lib/world";

/**
 * Karte als eine von zwei Ansichten der Eltern-App.
 *
 * Entwurfsprinzip: „Pins zeigen das Kinderurteil als Wort, nicht als Note."
 * Die Pins sind deshalb Papierkapseln mit farbigem Punkt und einem Wort —
 * keine Zahlen, keine Bilddateien, keine externe Marker-Grafik.
 *
 * Die Kachelquelle ist über Umgebungsvariablen austauschbar. Ein späterer
 * Wechsel auf einen gestaltbaren Anbieter ist damit eine Zeile Konfiguration
 * und kein Umbau.
 */
const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILES ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? "© OpenStreetMap-Mitwirkende";

export default function PlaygroundMap({
  center,
  playgrounds,
  group,
  selectedId,
  onSelect,
}: {
  center: Coords;
  playgrounds: PlaygroundWithDistance[];
  group: AgeGroupId | "alle";
  selectedId?: string | null;
  onSelect: (playground: PlaygroundWithDistance | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<{ id: string; marker: Marker }[]>([]);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [center.lat, center.lon],
        zoom: 15,
        // Eigene Bedienelemente im App-Stil statt der eckigen Vorgabe.
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(TILE_URL, { maxZoom: 19 }).addTo(map);

      L.marker([center.lat, center.lon], {
        icon: L.divIcon({ className: "", html: `<div class="here"></div>`, iconSize: [20, 20] }),
        interactive: false,
      })
        .addTo(map)
        .bindTooltip("Ihr seid hier");

      // Tippen auf die Fläche hebt die Auswahl auf.
      map.on("click", () => selectRef.current(null));

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
    };
  }, [center.lat, center.lon]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      const map = mapRef.current;
      if (cancelled || !map) return;

      for (const { marker } of markersRef.current) marker.remove();
      markersRef.current = [];

      for (const playground of playgrounds) {
        const aggregate = aggregateFor(ratingsForPlayground(playground), group);
        const urteil =
          aggregate.score === null
            ? { wort: "?", farbe: "var(--color-ink-fainter)" }
            : verdictFor(aggregate.score);

        const icon = L.divIcon({
          className: "",
          html: `<div class="pin" style="--pin-dot:${urteil.farbe}">${urteil.wort}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([playground.lat, playground.lon], {
          icon,
          title: playground.name,
        })
          .addTo(map)
          .on("click", (event) => {
            // Sonst räumt der Klick auf die Karte die Auswahl sofort wieder ab.
            L.DomEvent.stopPropagation(event);
            selectRef.current(playground);
          });

        markersRef.current.push({ id: playground.id, marker });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [playgrounds, group]);

  // Auswahl nur hervorheben, statt alle Marker neu zu bauen — sonst flackert es.
  useEffect(() => {
    for (const { id, marker } of markersRef.current) {
      const el = marker.getElement()?.querySelector(".pin");
      el?.classList.toggle("pin-selected", id === selectedId);
    }
    if (!selectedId) return;
    const treffer = playgrounds.find((p) => p.id === selectedId);
    if (treffer) mapRef.current?.panTo([treffer.lat, treffer.lon]);
  }, [selectedId, playgrounds]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const zoom = (delta: number) => {
    const map = mapRef.current;
    if (map) map.setZoom(map.getZoom() + delta);
  };

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      <div className="absolute top-3 right-3 z-[500] flex flex-col gap-1.5">
        <MapKnopf label="Hineinzoomen" onClick={() => zoom(1)}>
          +
        </MapKnopf>
        <MapKnopf label="Herauszoomen" onClick={() => zoom(-1)}>
          −
        </MapKnopf>
        <MapKnopf
          label="Auf euren Standort zentrieren"
          onClick={() => mapRef.current?.setView([center.lat, center.lon], 15)}
        >
          <span className="block h-3.5 w-3.5 rounded-full border-[3px] border-ink" />
        </MapKnopf>
      </div>

      <p className="pointer-events-none absolute bottom-1 left-2 z-[500] rounded bg-paper/80 px-1.5 py-0.5 text-[10px] text-ink-faint">
        {TILE_ATTRIBUTION}
      </p>
    </div>
  );
}

function MapKnopf({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-paper font-display text-2xl leading-none font-bold shadow-[0_2px_0_rgb(46_42_36/0.18)] transition active:translate-y-[2px] active:shadow-none"
    >
      {children}
    </button>
  );
}
