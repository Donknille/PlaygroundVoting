# Geschäftsmodell Spielplatz-Scouts — durchgerechnet

Anlass: die Frage, ob sich das Produkt über Werbung finanzieren lässt.
Ergebnis vorweg: **rechnerisch nicht** — und der Versuch würde den ertragreichsten Pfad zerstören.
Die Begründung steht in Abschnitt 4.

---

## 0. Wie dieses Dokument zu lesen ist

Zwei Sorten Zahlen, sauber getrennt:

- **Rechnung** — folgt zwingend aus den Annahmen. Nachvollziehbar, nicht strittig.
- **Annahme (A1, A2, …)** — geschätzt. Jede ist einzeln benannt, damit sie ersetzt werden kann.

⚠️ Ich hatte beim Erstellen **keinen Zugriff auf Marktdatenbanken**. Die Strukturzahlen
(Gemeinden, Familien, Werbepreise) stammen aus allgemeinem Wissen und sind Größenordnungen.
Vor einer Finanzierungsrunde oder einem Kredit gehören sie geprüft. Die *Struktur* des Modells
und die Verhältnisse zwischen den Pfaden ändern sich dadurch aber kaum — dafür sind die
Abstände zu groß.

---

## 1. Der Markt in Zahlen

### Kommunen (B2G)

| | Zahl | Herkunft |
|---|---|---|
| Gemeinden in Deutschland | ~10.750 | Strukturzahl |
| davon ab 10.000 Einwohnern | ~2.100 | **A1** |
| davon realistisch ansprechbar — eigenes Grünflächenamt, Beteiligungs- oder Digitalisierungsbudget, spürbarer Sanierungsstau | **600–900** | **A2** |

Das ist der eigentliche Zielmarkt: **rund 750 Kommunen**, nicht 10.750.

Preisstaffel nach Einwohnerzahl:

| Größe | Jahreslizenz |
|---|---|
| unter 20.000 | 490 € |
| 20.000–100.000 | 1.490 € |
| über 100.000 | 2.900 € |

Mischpreis über eine realistische Kundenverteilung: **~900 €/Jahr** (**A3**).

### Eltern (B2C)

| | Zahl |
|---|---|
| Haushalte mit Kindern unter 10 Jahren | ~5 Mio (**A4**) |
| davon über drei Jahre erreichbar (Nischen-App, ohne Werbebudget) | 0,2 %–1 % → **10.000–50.000 aktive Familien** (**A5**) |

„Aktiv" heißt: öffnet die App mindestens einmal im Quartal.

---

## 2. Die fünf Erlöspfade

### Pfad 1 — Kommunen-Lizenzen

`Anzahl Kommunen × 900 €`

Der Grund, warum es funktioniert: Kinderbeteiligung ist keine freiwillige Leistung.
§ 47f GemO BW, § 1 Abs. 3 SGB VIII und § 3 BauGB verpflichten dazu. Ein einmaliger
Beteiligungsworkshop kostet eine Kommune schnell 5.000–15.000 € und liefert eine Momentaufnahme.
Die Lizenz liefert laufende Daten für einen Bruchteil davon.

**Wichtig:** Dieser Pfad ist erst lieferbar, wenn Bewertungen zentral gespeichert werden.
Siehe Abschnitt 7.

### Pfad 2 — Eltern-Abo „Scouts Plus"

`aktive Familien × Umwandlungsquote × 19 €/Jahr`

Umwandlungsquote bei Freemium-Apps ohne aggressive Bezahlschranke: **1–3 %** (**A6**).
Die Kernsuche bleibt dauerhaft gratis — das ist Bedingung, nicht Großzügigkeit: Ohne freie
Nutzung entstehen keine Bewertungen, ohne Bewertungen gibt es kein Kommunenprodukt.

### Pfad 3 — Benannte Sponsoren

Ein festes Logo im Elternbereich, kein Werbenetzwerk, kein Tracking, kein Einwilligungsbanner.
Kandidaten: Stadtwerke, Krankenkassen, regionale Familienkarten, Sparkassen-Stiftungen.

Regional realistisch: **3.000–5.000 €/Jahr je Partner** (**A7**), 1–6 Partner.

### Pfad 4 — Datenlizenzen an Hersteller

Spielgerätehersteller und Landschaftsarchitekten im deutschsprachigen Raum: ~25 relevante Firmen.
Verkauft wird ein Benchmark: Welcher Gerätetyp begeistert welche Altersgruppe wirklich?
Diese Auswertung existiert sonst nirgends.

**6.000–8.000 €/Jahr je Lizenz** (**A8**) — aber frühestens ab etwa 5.000 Bewertungen,
sonst ist die Aussage statistisch wertlos.

### Pfad 5 — Präventionsförderung (Anschub, nicht wiederkehrend)

Krankenkassen **müssen** nach § 20 SGB V jährlich einen festen Betrag je Versichertem für
Prävention und Gesundheitsförderung ausgeben. Bewegungsförderung bei Kindern im Setting-Ansatz
fällt genau darunter. Das ist ein Fördertopf, kein Werbebudget.

Projektförderungen dieser Art liegen typisch bei **20.000–80.000 €** über ein bis drei Jahre
(**A9**). Einmalig, aber als Anschubfinanzierung genau in der Phase, in der sonst nichts
hereinkommt.

---

## 3. Kostenstruktur

### Betrieb

| Posten | Heute | Mit Server, kleine Last | Mittlere Last |
|---|---|---|---|
| Hosting | 0 € | 0 € | 0–20 €/Mon. |
| Datenbank | — | 0–25 €/Mon. | 25–100 €/Mon. |
| Overpass-Zwischenspeicher (eigene kleine Maschine) | — | 20–40 €/Mon. | 40 €/Mon. |
| Domain | 15 €/Jahr | 15 €/Jahr | 15 €/Jahr |
| **Summe** | **~0 €** | **~300–800 €/Jahr** | **~800–1.900 €/Jahr** |

Der Betrieb ist vernachlässigbar. Das ist die gute Nachricht.

### Arbeit — der eigentliche Kostenblock

| Modell | Jahreskosten |
|---|---|
| Nebenprojekt, unbezahlt | 0 € |
| Eine Vollzeitstelle (Vollkosten inkl. Abgaben) | ~75.000 € (**A10**) |
| Zwei Stellen (Entwicklung + Vertrieb) | ~150.000 € |

**Kommunenvertrieb ist der Aufwandstreiber.** Ein Abschluss braucht realistisch 3–8 Kontakte
über 6–18 Monate, weil Haushaltsjahre und Gremienbeschlüsse den Takt vorgeben (**A11**).

---

## 4. Werbung gegengerechnet

Die Ausgangsfrage. Annahmen: 20 Einblendungen je aktiver Familie und Monat (**A12**),
TKP für **nicht-personalisierte** Anzeigen im deutschsprachigen Raum 0,50–1,50 € (**A13**).

Nicht-personalisiert ist keine Wahl, sondern Pflicht: DSA Art. 28 Abs. 2 verbietet
profilbasierte Werbung an Minderjährige, und im Kinder-Modus ist Werbung nach UWG Anhang Nr. 28
ohnehin ausgeschlossen.

| Aktive Familien | Einblendungen/Jahr | Werbeerlös/Jahr |
|---|---|---|
| 8.000 | 1,9 Mio | **960–2.880 €** |
| 20.000 | 4,8 Mio | **2.400–7.200 €** |
| 50.000 | 12,0 Mio | **6.000–18.000 €** |

Dagegengehalten: **35 Kommunen bringen 31.500 €/Jahr.**

Selbst im günstigsten Werbeszenario — 50.000 aktive Familien, oberer TKP — liegt der Werbeerlös
bei 18.000 €. Das entspricht 20 Kommunen. 50.000 Familien zu gewinnen ist ungleich schwerer als
20 Kommunen zu überzeugen.

**Und die Kosten der Werbung sind nicht die Einblendungen, sondern:**

1. Ein Einwilligungsbanner als erster Klick — direkt gegen „in fünf Sekunden zum Ziel".
2. Das Verkaufsargument gegenüber Kommunen entfällt. Eine Kommune, die Kinderbeteiligung
   ausschreibt, nimmt keine App, die Kinderdaten an ein Werbenetzwerk weitergibt.
3. Krankenkassen und Stiftungen fördern keine werbefinanzierten Kinderangebote.

**Werbung tauscht 2.000–18.000 € gegen die Pfade 1, 3 und 5.** Das ist der Kern der Antwort.

---

## 5. Drei Szenarien, Stand Jahr 3

### Vorsichtig

| Pfad | Rechnung | Betrag |
|---|---|---|
| Kommunen | 12 × 900 € | 10.800 € |
| Plus-Abo | 8.000 × 1 % × 19 € | 1.520 € |
| Sponsoring | 1 Partner | 3.000 € |
| **Summe** | | **15.320 €/Jahr** |

### Realistisch

| Pfad | Rechnung | Betrag |
|---|---|---|
| Kommunen | 35 × 950 € | 33.250 € |
| Plus-Abo | 20.000 × 2 % × 19 € | 7.600 € |
| Sponsoring | 3 Partner | 12.000 € |
| Datenlizenz | 1 | 6.000 € |
| **Summe** | | **58.850 €/Jahr** |

### Gut

| Pfad | Rechnung | Betrag |
|---|---|---|
| Kommunen | 90 × 1.100 € | 99.000 € |
| Plus-Abo | 50.000 × 3 % × 19 € | 28.500 € |
| Sponsoring | 6 Partner | 30.000 € |
| Datenlizenzen | 3 | 24.000 € |
| **Summe** | | **181.500 €/Jahr** |

Selbst das gute Szenario bleibt bei 90 von ~750 erreichbaren Kommunen — also 12 % Marktanteil.
Das ist ehrgeizig, aber nicht absurd.

---

## 6. Ab wann trägt es sich

| Aufstellung | Bedarf/Jahr | Erreicht bei | Frühestens |
|---|---|---|---|
| Nebenprojekt, unbezahlt | ~800 € | 1 Kommune | **Jahr 1** |
| Eine Vollzeitstelle | ~76.000 € | ~55 Kommunen + übrige Pfade | **Jahr 3–4** |
| Zwei Stellen | ~152.000 € | nur im guten Szenario | Jahr 4–5 |

**Die entscheidende Erkenntnis:** Als Nebenprojekt trägt es sich fast sofort. Als Vollzeitgeschäft
braucht es drei bis vier Jahre. Dazwischen liegt eine Finanzierungslücke, die genau Pfad 5
(Präventionsförderung) schließen kann — deshalb steht er im Plan.

---

## 7. Der kritische Pfad

Die Reihenfolge ist nicht beliebig:

1. **Server für geteilte Bewertungen.** ⚠️ Heute liegen alle Bewertungen im localStorage des
   jeweiligen Geräts. Sie sind für niemanden sonst sichtbar. **Ohne zentrale Speicherung gibt es
   kein Kommunenprodukt, keine Datenlizenz und keinen Grund für ein Eltern-Abo.**
   Das ist die größte Lücke zwischen dem heutigen Produkt und diesem Geschäftsmodell.
2. **Datendichte in einer Pilotstadt.** Zielmarke: mindestens 3 Bewertungen auf 30 % der Plätze.
   Vorher ist das Dashboard leer und unverkäuflich.
3. **Kommunen-Dashboard.** Ranking, Altersverteilung, Trend, Export für Gemeinderatsvorlagen.
4. **Erste Referenzkommune** — idealerweise vergünstigt, dafür mit Nennungsrecht.
5. **Skalierung über die Referenz.** Kommunen kaufen, was die Nachbarkommune schon nutzt.

Schritt 1 und 2 kosten Arbeit, aber kaum Geld. Sie sind die Voraussetzung für alles Weitere.

---

## 8. Wo der Hebel liegt

Sensitivität, ausgehend vom realistischen Szenario:

| Änderung | Wirkung auf den Jahresumsatz |
|---|---|
| **+10 Kommunen** | **+9.500 €** |
| +10.000 aktive Familien | +3.800 € |
| +1 Sponsor | +4.000 € |
| Preis je Lizenz +10 % | +3.325 € |
| Umwandlungsquote 2 % → 3 % | +3.800 € |

Um den Effekt von zehn zusätzlichen Kommunen über Abos zu erreichen, bräuchte es
**25.000 zusätzliche aktive Familien**.

Daraus folgt die ganze Prioritätensetzung: **Der Vertrieb an Kommunen ist die Arbeit, die zählt.**
Nutzerwachstum ist wichtig — aber als *Voraussetzung* für den Kommunenverkauf, nicht als
eigener Erlöspfad.

---

## 9. Was das Modell kippen würde

| Risiko | Wirkung | Gegenmaßnahme |
|---|---|---|
| **Kaltstart je Stadt** | Ohne Bewertungen kein Verkaufsargument | Kita- und Grundschulkooperationen, „Spielplatz-Detektiv-Woche" |
| **Lange Beschaffungszyklen** | 6–18 Monate bis zum ersten Euro | Pfad 5 als Überbrückung, Pilot vergünstigt abgeben |
| **Klumpenrisiko B2G** | 56 % des Umsatzes aus einem Pfad | Sponsoring und Datenlizenzen früh aufbauen |
| **Wettbewerber mit Kapital** | Kopiert das Konzept, kauft Reichweite | Vorsprung liegt im Datenbestand, nicht im Code — Datendichte ist der Burggraben |
| **Personenabhängigkeit** | Ein Ausfall stoppt alles | Ab Jahr 2 einplanen |
| **OSM-Datenqualität** | Regional sehr unterschiedlich | Nacherfassung durch Nutzer ermöglichen |

---

## 10. Empfehlung

1. **Kostenlos für alle Nutzer bleiben** — richtig, und Voraussetzung für alles andere.
2. **Werbefreiheit als ausdrückliches Produktversprechen führen**, nicht als Verzicht.
   Sie ist das Verkaufsargument im ertragreichsten Pfad.
3. **Keine Werbeplätze bauen.** Rechnerisch bringen sie im realistischen Szenario etwa 4.000 €
   und kosten mindestens 45.000 €.
4. **Zuerst den Server für geteilte Bewertungen bauen.** Ohne ihn ist das Geschäftsmodell
   nicht lieferbar — egal welcher Pfad.
5. **Dann eine Pilotstadt mit Datendichte, dann das Kommunen-Dashboard, dann Vertrieb.**
6. **Präventionsförderung parallel beantragen**, um die Lücke bis zu den ersten
   Lizenzeinnahmen zu schließen.
