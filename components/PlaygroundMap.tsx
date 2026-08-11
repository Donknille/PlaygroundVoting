"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef } from "react";
import { aggregateFor, formatScore } from "@/lib/scoring";
import type { AgeGroupId, Coords, PlaygroundWithDistance } from "@/lib/types";
import { ratingsForPlayground } from "@/lib/world";

/**
 * Karte als Zweitansicht. Die Liste bleibt der schnellste Weg zum Ziel; die Karte
 * hilft beim Einordnen („welcher liegt auf dem Heimweg?").
 *
 * Marker werden als DivIcon gebaut – so braucht die Karte keine Bilddateien und
 * zeigt den Punktwert direkt im Pin.
 */
export default function PlaygroundMap({
  center,
  playgrounds,
  group,
  onSelect,
}: {
  center: Coords;
  playgrounds: PlaygroundWithDistance[];
  group: AgeGroupId | "alle";
  onSelect: (playground: PlaygroundWithDistance) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [center.lat, center.lon],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap-Mitwirkende",
      }).addTo(map);

      L.circleMarker([center.lat, center.lon], {
        radius: 8,
        color: "#2570d4",
        weight: 3,
        fillColor: "#ffffff",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip("Ihr seid hier");

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

      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];

      for (const playground of playgrounds) {
        const aggregate = aggregateFor(ratingsForPlayground(playground), group);
        const label = aggregate.score === null ? "?" : formatScore(aggregate.score);
        const tone =
          aggregate.score === null
            ? "#b9c1cf"
            : aggregate.score >= 4
              ? "#1f9d55"
              : aggregate.score >= 3
                ? "#f59f0b"
                : "#e64a35";

        const icon = L.divIcon({
          className: "",
          html: `<div style="display:flex;align-items:center;gap:4px;background:${tone};color:#fff;font-weight:800;font-size:13px;padding:5px 9px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.3);white-space:nowrap">🛝 ${label}</div>`,
          iconSize: [66, 30],
          iconAnchor: [33, 30],
        });

        const marker = L.marker([playground.lat, playground.lon], {
          icon,
          title: playground.name,
        })
          .addTo(map)
          .on("click", () => selectRef.current(playground));

        markersRef.current.push(marker);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [playgrounds, group]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
