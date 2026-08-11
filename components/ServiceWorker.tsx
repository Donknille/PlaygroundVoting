"use client";

import { useEffect } from "react";

/**
 * Registriert den Service Worker für den Offline-Betrieb.
 * Wichtig, weil das Netz am Spielplatz oft schwach ist.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
