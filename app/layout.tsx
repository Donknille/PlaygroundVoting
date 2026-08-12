import type { Metadata, Viewport } from "next";
// Selbst gehostet statt über Google Fonts geladen: keine externe Anfrage zur
// Laufzeit, funktioniert offline und greift auch auf Android, wo die runde
// Systemschrift ui-rounded fehlt.
import "@fontsource-variable/fredoka/wght.css";
import "@fontsource-variable/figtree/wght.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "Spielplatz-Scouts – Spielplätze, von Kindern bewertet",
  description:
    "Finde Spielplätze in deiner Nähe, bewertet von den einzigen echten Experten: den Kindern. Anonym, ohne Anmeldung, ohne Werbung.",
  manifest: "/manifest.webmanifest",
  applicationName: "Spielplatz-Scouts",
  appleWebApp: { capable: true, title: "Spielplatz-Scouts", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5b700",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
        >
          Zum Inhalt springen
        </a>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
