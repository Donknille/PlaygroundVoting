# Geschäftsmodell — Spielplatz-Scouts

## Die Idee in einem Satz

Kinder bewerten Spielplätze in 30 Sekunden mit Bildern, und Eltern finden dadurch Plätze in ihrer
Nähe, von denen sie vorher nichts wussten — passend zum Alter ihres Kindes.

## Warum das ein eigenes Produkt ist

Bewertungen zu Spielplätzen existieren, aber sie messen das Falsche. Ein Google-Maps-Stern für
einen Spielplatz sagt etwas über Parkplätze, Sauberkeit und Bänke — also darüber, wie angenehm der
Nachmittag für die Erwachsenen war. Ob das Kind bleiben wollte, steht nirgends.

Daraus folgt der Kern des Produkts: **Das Kind ist die Bewertungsquelle, nicht der Elternteil.**
Und weil ein Kletterturm für Zehnjährige großartig und für Zweijährige unbrauchbar ist, gibt es
nie einen Gesamtstern, sondern immer einen Wert je Altersgruppe. Das ist gleichzeitig der
Datensatz, den sonst niemand hat.

---

## Wertversprechen

| Zielgruppe | Nutzen |
|---|---|
| **Eltern** | In fünf Sekunden sehen, welcher Platz in der Nähe für *dieses* Kind taugt — inklusive Plätzen, die sie nicht kannten. |
| **Kinder** | Ein Spiel mit Bildern statt eines Formulars, mit Belohnung am Ende. |
| **Kommunen** | Laufende, gesetzlich geforderte Kinderbeteiligung ohne Workshop-Aufwand — als Datengrundlage für Sanierungsbudgets. |
| **Hersteller / Planungsbüros** | Welche Gerätetypen begeistern welche Altersgruppe wirklich? |

## Erlösmodell

**1. B2G — Kommunen-Dashboard (Hauptumsatz).**
Jahreslizenz gestaffelt nach Einwohnerzahl: 490 € (bis 20.000), 1.490 € (bis 100.000),
2.900 € (darüber). Enthält Ranking aller eigenen Plätze je Altersgruppe, Schwachstellenanalyse je
Frage, Trend nach Sanierungen, Export für Gemeinderatsvorlagen, QR-Schilder für die Plätze.

Verkaufsargument: Die Beteiligung von Kindern und Jugendlichen an sie betreffenden Planungen ist
vorgeschrieben (§ 1 Abs. 3 SGB VIII, Gemeindeordnungen der Länder, § 3 BauGB). Bisher wird das mit
einmaligen Workshops erfüllt — teuer, punktuell, zwölf Kinder. Ein einzelner moderierter Workshop
kostet meist mehr als eine Jahreslizenz und liefert eine Momentaufnahme statt einer Zeitreihe.

**2. B2C — „Scouts Plus" für Eltern.**
2,99 €/Monat oder 19 €/Jahr: Offline-Karte, Filter (Schatten, Zaun, Wasser, WC, Wickeltisch,
Kinderwagen), Merklisten und Ausflugsrouten, mehrere Kinderprofile, Hinweis bei neuen Plätzen im
Umkreis. **Die Kernsuche bleibt dauerhaft gratis** — sie ist das, was die Datenbasis erzeugt.

**3. B2B — Datenlizenzen.**
Anonymisierte Aggregat-Reports für Spielgerätehersteller und Landschaftsarchitekten: welche
Gerätetypen in welchen Altersgruppen wie abschneiden.

**4. Regionen und Tourismus.**
Whitelabel-Widget „Spielplätze der Region" für Ferienregionen, Campingplätze, Freizeitparks.

**5. Partnerschaften statt Werbung.**
Krankenkassen (Bewegungsförderung), Stadtwerke, Familienkarten — sichtbar ausschließlich im
Elternbereich, **niemals im Kinder-Modus**, ohne Tracking.

### Warum keine Werbung im Kinder-Modus

Kindgerichtete Werbung ist rechtlich heikel (UWG Anhang Nr. 28) und würde genau das Vertrauen
zerstören, das gegenüber Kommunen das eigentliche Verkaufsargument ist. Werbefreiheit und
Datensparsamkeit werden deshalb aktiv als Produktmerkmal kommuniziert, nicht als Verzicht
behandelt.

## Kaltstart

Das Verzeichnis ist ab Tag 1 vollständig: alle Spielplätze kommen aus OpenStreetMap
(`leisure=playground`, ODbL, rund 100.000 Einträge allein in Deutschland). Bewertungen sind die
Anreicherung, nicht die Voraussetzung. Ein Platz ohne Stimmen zeigt „Noch keine Bewertung — sei
die Erste!" statt einer leeren Liste.

## Go-to-Market

Stadt für Stadt, beginnend mit einem Piloten. Kita- und Grundschulkooperationen
(„Spielplatz-Detektiv-Woche") bringen die ersten hundert Bewertungen pro Stadtteil.
Eltern-Communities und Stadtteilgruppen tragen es weiter. Sobald eine Kommune zahlender Kunde ist,
kommen QR-Schilder direkt an die Plätze — sie sind gleichzeitig Wachstumsmotor und der Grund,
warum Kommunen zahlen.

## Kennzahlen

- **Abdeckungsgrad**: Anteil der Plätze einer Stadt mit ≥ 3 Bewertungen (die eigentliche
  Nordstern-Kennzahl — darunter ist das Produkt für Eltern wertlos)
- Bewertungen pro Sitzung
- Wiederkehrende Familien pro Monat
- Kommunenverträge
- Verteilung der Bewertungen über die Altersgruppen

## Risiken und Antworten

| Risiko | Antwort |
|---|---|
| DSGVO Art. 8 (Daten von Kindern) | Kein Login, kein Konto, keine Namen, keine Fotos, keine Freitexte, kein Tracking. Gespeichert werden nur Spielplatz-ID, Altersgruppe, fünf Antworten und der Tag. Der Standort verlässt das Gerät nicht. |
| Fake- und Spam-Bewertungen | Ein Votum pro Gerät, Platz und Tag; Plausibilitätsprüfung über Standortnähe; Median statt Mittelwert; Punkte erst ab drei Stimmen. |
| Overpass-Ausfall oder Rate-Limit | 24-Stunden-Cache im Gerät, auf ~1 km gerundete Abfragen, sichtbarer Demo-Fallback. |
| „Mein Kind tippt nur das lachende Gesicht" | Die Frage nach der Verweildauer als Gegencheck, Median-Auswertung, Mindestzahl an Stimmen, farblich identische Antwortoptionen. |
| Kommunen kaufen nicht | Der B2C-Teil funktioniert eigenständig; das Dashboard ist eine Auswertung ohnehin vorhandener Daten, keine getrennte Produktlinie. |

---

## Erfolgskriterien

Die drei ursprünglichen Kriterien, ergänzt um fünf, die sich aus dem Geschäftsmodell ergeben:

1. **Schnell und einfach bedienbar** — eine Bewertung dauert unter 30 Sekunden, alles liegt in
   Daumenreichweite, Touchziele ab 56 px.
2. **Bewertungsmaßstab transparent** — Fragen, Gewichtung und Altersgruppe sind von jedem
   Punktwert aus einen Tipp entfernt; jeder Wert trägt seine Herkunft im Text.
3. **Spielplätze schnell finden** — Treffer ohne Suchfeld, direkt beim Öffnen der App.
4. **Ohne Lesen bedienbar** *(neu)* — Bilder plus Vorlesefunktion; Kinder ab drei kommen ohne
   Erwachsene durch.
5. **Ab Tag 1 gefüllt** *(neu)* — kein leeres Verzeichnis, OpenStreetMap liefert die Basis.
6. **Datensparsamkeit sichtbar** *(neu)* — kein Login, keine Personendaten, und das wird im
   Produkt erklärt statt im Kleingedruckten versteckt.
7. **Auswertbar für Kommunen** *(neu)* — strukturierte Antworten mit Altersgruppe statt Freitext.
8. **Unterwegs tauglich** *(neu)* — am Spielplatz ist das Netz schwach: PWA, Cache, lokale Abgabe.

### Wie die Umsetzung darauf einzahlt

| Kriterium | Umsetzung im Code |
|---|---|
| 1 | Auto-Weiterschalten nach jedem Tipp, ein Bildschirm pro Frage, `tap`-Utility mit 56 px Mindestgröße |
| 2 | `lib/questions.ts` als einzige Quelle für Kinder-Modus **und** Transparenzseite; Herkunftstext an jedem Punktwert |
| 3 | Standortabfrage beim Start, Liste nach Entfernung, kein Suchfeld nötig |
| 4 | Emoji-Antworten, `lib/speech.ts` (Web Speech API), Vorlesen automatisch bei jeder Frage |
| 5 | `lib/overpass.ts` mit OSM-Abfrage und Gerätecache |
| 6 | `/datenschutz` mit Löschknopf, keine Analytics-Abhängigkeit im Projekt |
| 7 | Feste Antwortskala 0/1/2 plus Altersgruppe in jedem Datensatz (`lib/types.ts`) |
| 8 | `public/sw.js`, Manifest, `localStorage`-Cache mit 24-Stunden-TTL |
