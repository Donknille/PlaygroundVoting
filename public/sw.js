/**
 * Service Worker für den Offline-Betrieb.
 * Am Spielplatz ist das Netz oft schwach – die App muss trotzdem starten und
 * eine Bewertung entgegennehmen können (die liegt ohnehin nur im Gerät).
 */

const CACHE = "scouts-v2";

const APP_SHELL = [
  "/",
  "/karte/",
  "/spielplatz/",
  "/bewerten/",
  "/so-bewerten-wir/",
  "/datenschutz/",
  "/kommunen/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.all(
          APP_SHELL.map((url) => cache.add(url).catch(() => undefined)),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Fremde Hosts (Kartenkacheln, Overpass) bewusst nicht anfassen.
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit ?? caches.match("/"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
