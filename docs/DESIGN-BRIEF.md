# Design-Brief: Spielplatz-Scouts

> **Stand:** Dieser Brief beschreibt den Zustand *vor* der Umsetzung des
> Claude-Design-Entwurfs (Konzeptstand 1). Farbwelt, Typografie, Urteilsdarstellung
> und der Aufbau von Eltern-App und Kinder-Modus sind inzwischen auf den Entwurf
> umgestellt — die aktuellen Werte stehen in `app/globals.css`. Die Abschnitte zu
> den harten Anforderungen, zum Maskottchen und zum Bewertungsmaßstab gelten
> unverändert.

Dieses Dokument ist so geschrieben, dass es allein steht. Es lässt sich vollständig in ein
Design-Werkzeug einfügen, ohne dass Rückfragen zum Produkt nötig sind. Alle Texte sind die
echten Texte der App, alle Farbwerte die tatsächlich verwendeten.

Live: https://spielplatz-scouts.web.app · Code: `Donknille/PlaygroundVoting`

---

## 1. Worum es geht

Spielplatzbewertungen stammen sonst von Erwachsenen und messen Erwachsenenkriterien —
Sauberkeit, Parkplatz, Bänke. Diese App dreht das um: **Das Kind bewertet, nicht der Elternteil.**
Vollständig anonym, die einzige erfasste Angabe ist das Alter.

Daraus entsteht der eigentliche Mehrwert: **Spielplatzqualität aufgeschlüsselt nach
Altersgruppe.** Ein Platz kann für Krabbler 4,8 Punkte haben und für Zehnjährige 2,1. Genau das
kann kein Sterne-Durchschnitt.

Kein Login, kein Konto, kein Tracking, keine Werbung. Der Standort verlässt das Gerät nie.
Die Spielplätze selbst kommen aus OpenStreetMap, das Verzeichnis ist also ab Tag 1 gefüllt.

## 2. Zwei sehr verschiedene Nutzer in einer App

| | Elternbereich | Kinder-Modus (`/bewerten`) |
|---|---|---|
| **Wer** | Erwachsene, unterwegs, oft einhändig | Kinder ab 3 Jahren |
| **Aufgabe** | In 5 Sekunden entscheiden, wohin | In 30 Sekunden bewerten |
| **Lesefähigkeit** | vorhanden | **nicht vorausgesetzt** |
| **Ton** | freundlich, sachlich, dicht | groß, bunt, ein Bildschirm = eine Entscheidung |

Der Kinder-Modus ist Vollbild ohne Kopfzeile. Er ist bewusst eine andere Welt als der Rest.

## 3. Harte Anforderungen — nicht verhandelbar

Diese Punkte sind keine Stilfrage. Ein Entwurf, der sie bricht, ist unbrauchbar:

1. **Touchziele mindestens 56 × 56 px.** Kinderfinger, und Eltern mit Kind auf dem Arm.
2. **Ohne Lesen bedienbar.** Jede Frage und jede Antwort im Kinder-Modus hat ein Bild.
   Text ist immer nur Ergänzung, nie der einzige Träger. Zusätzlich gibt es einen
   Vorlese-Knopf pro Frage.
3. **Lesbar bei Sonnenlicht.** Deshalb heller, satter Grundton und keine Pastell-auf-Pastell-
   Kombinationen. Textkontrast mindestens 4,5:1, große Schrift mindestens 3:1.
4. **Kein Dark Mode.** Bewusste Entscheidung: Die App wird draußen bei Tageslicht benutzt.
5. **Punktwert nie ohne Herkunft.** Es heißt immer „4,3 · aus 12 Bewertungen von Kindern
   (4–6 Jahre)", und der Wert ist antippbar zur Erklärseite. Ein nackter Stern ist verboten.
6. **Sichtbarer Fokusring** für Tastaturbedienung, und `prefers-reduced-motion` respektieren.
7. **Werbefrei im Kinder-Modus** — dort erscheint niemals ein Partnerlogo oder Hinweis.

## 4. Gestaltungsrichtung

**Verspielt und illustriert.** Kräftige Farben, große illustrierte Flächen, ein Maskottchen als
wiederkehrende Figur, spürbare Übergänge. Die App soll sich für Kinder wie ein Spiel anfühlen
und für Eltern erkennbar wie ein Kinderprodukt — aber nicht kindisch-billig, sondern sauber
gezeichnet.

Formensprache: **flache Flächen, runde Enden, keine Umrisse, keine Verläufe** (Ausnahme: der
Himmel in der großen Szene). Alles sehr rund.

## 5. Farbwerte

Jede Farbe hat drei Rollen: `-soft` als Fläche hinter dunklem Text, der reine Ton für
Illustration und Icons, `-deep` als Knopfhintergrund mit weißem Text.

| Rolle | soft | pur | deep |
|---|---|---|---|
| Text dunkel | — | `#2a1e46` (ink) | — |
| Text sekundär | — | `#6b6188` (ink-soft) | — |
| Hintergrund | `#fff4e2` (sand) | `#ffe3bb` (sand-deep) | — |
| Karten | `#ffffff` | — | — |
| **Orange (Marke)** | `#ffe8c7` | `#ff9500` | `#b35f00` |
| Gelb | `#fff3cc` | `#ffc933` | — |
| Grün | `#d4f5e3` | `#16a95e` | `#0b7a43` |
| Blau | `#d8e8ff` | `#2f86ff` | `#1a5fc4` |
| Rot | `#ffdfdc` | `#ff5245` | `#c0362b` |
| Violett | `#e8e0ff` | `#7c4dff` | `#5a2fd0` |
| Pink | `#ffdcec` | `#ff4f96` | `#c9256a` |
| Türkis | `#d1f6f0` | `#0fbfa4` | `#0a8271` |
| Holz | `#f0dfd1` | `#8b5e3c` | — |

**Orange ist die Markenfarbe** — Maskottchen, App-Symbol und Akzente teilen sie sich.

Wichtig: Weißer Text auf Orange ist zu kontrastarm. Orange trägt immer dunklen Text.

## 6. Typografie

- **Fredoka** für Überschriften, Knöpfe und Zahlen. Gewicht 600. Sehr rund, verspielt.
- **Nunito** für Fließtext. Gewicht 500 normal, 700 für Hervorhebungen.
- Beide werden selbst gehostet, nicht über eine externe Schrift-CDN geladen.

Größen im Kinder-Modus sind deutlich größer als üblich: Fragen 36 px, Antwortlabels 16 px fett.

## 7. Bausteine

**Karte** — weiß, Radius 32 px, Schatten `0 2px 0 rgba(42,30,70,.05), 0 12px 26px -16px rgba(42,30,70,.4)`

**Knopf** — Mindesthöhe 56 px, Radius 20 px, Fredoka 600, **dicke Unterkante**
`box-shadow: 0 4px 0 <dunklerer Ton>`. Beim Drücken sinkt der Knopf um 3 px ein und die Kante
schrumpft auf 1 px. Das ist die auffälligste Geste des Designs: Knöpfe fühlen sich an wie
Spielzeugtasten, nicht wie Formularfelder.

Varianten: Grün (`#0b7a43`, weißer Text) für die Hauptaktion · Orange (`#ff9500`, dunkler Text)
für Akzente · Weiß für Nebenaktionen · Dunkel (`#2a1e46`) für Bestätigungen.

**Aufkleber** — runde Fläche mit weißem Rand ringsum: `0 0 0 4px #fff, 0 8px 18px -10px rgba(42,30,70,.55)`

**Abzeichen (Pill)** — abgerundete Kapsel in einem `-soft`-Ton, links ein kleines rundes weißes
Feld mit dem Icon darin, rechts der Text.

**Bewegung** — `pop-in` (Einblenden mit Überschwingen), `wiggle` (leichtes Kippen),
`bob` (Schweben, für das Maskottchen), `tada` (Jubel), `confetti-fall`. Alle werden bei
`prefers-reduced-motion: reduce` abgeschaltet.

## 8. Das Maskottchen: Fips, der Fuchs-Scout

Keine Dekoration — Fips hat Aufgaben. Er führt durch den Bewerten-Ablauf, überreicht die
Belohnung und übernimmt alle Zustände, die sonst nur aus Text bestünden.

**Aussehen:** Fuchs in Markenorange `#ff9500`, cremefarbene Schnauze und Bauch (`#fff3e2`),
rosa Ohrinnenseiten (`#ffdcec`), dunkle Augen mit weißem Glanzpunkt, dunkle runde Nase,
buschiger Schwanz mit heller Spitze, dunkelbraune Pfoten. Erkennungszeichen: ein **rotes
Scout-Halstuch** (`#ff5245`) mit gelbem Knoten. Bewusst kein Hut — der würde mit den Ohren
kollidieren.

**Vier Posen:**

| Pose | Wo | Haltung |
|---|---|---|
| **winkt** | Startseite, Altersfrage | Arm oben, Winklinien, lächelt |
| **sucht** | Laden, Standortabfrage, Leerzustand | Fernglas vor den Augen, neutraler Mund |
| **fragt** | Neben jeder Frage im Kinder-Modus | Pfote am Kinn, kleiner runder Mund, violettes Fragezeichen |
| **jubelt** | Belohnungsbildschirm | Beide Arme hoch, offener Mund, gelbe Funken |

Zusätzlich gibt es **nur den Kopf** für alles unter 60 px (Kopfzeile, App-Symbol) — die ganze
Figur wäre dort nicht mehr lesbar.

## 9. Icons

Zwei getrennte Familien:

**Bunte Bildzeichen** (32 × 32, mehrfarbig, zeigen eine *Sache*):
Rutsche · Schaukel · Klettern (Kletternetz-Pyramide) · Sand (Eimer auf Sandhügel) · Wasser
(Tropfen) · Wippe · Seilbahn · Karussell (Drehscheibe mit Haltegriffen) · Trampolin · Zaun ·
WC · Barrierefrei · Beleuchtung · Kleinkindbereich · Rassel (0–3) · Teddy (4–6) · Schulranzen
(7–9) · Skateboard (10+) · Uhr · Baum · Sonne · Halbschatten · Luftballons · Stern · Medaille ·
Fernglas · Erlenmeyerkolben (Demo) · Rathaus · Schloss · Lineal · drei Toben-Figuren ·
drei Kinder-Gruppen · drei gefüllte Uhren

**Einfarbige Bedienzeichen** (24 × 24, erben die Textfarbe, zeigen eine *Handlung*):
Standort · Karte · Liste · Lautsprecher · Stumm · Haken · Zurück · Weiter · Route · Papierkorb ·
Aktualisieren · Info · Schließen

**Überholt:** Die Bildzeichen kommen inzwischen aus **Fluent Emoji** (Microsoft, MIT) und liegen
als SVG im Bundle. Der ursprüngliche Einwand gegen Emoji war die Geräteabhängigkeit — die
entfällt, weil nichts vom System übernommen wird. Eigene Zeichnungen bleiben nur für Schaukel,
Wippe, Zaun und Trampolin, für die es kein Emoji gibt, sowie für die gefüllten Uhren als
Mengenskala. Erzeugt wird der Satz von `scripts/emoji-generieren.mjs`.

**Die drei Gesichter** sind der wichtigste Baustein und kommen aus einer einzigen Quelle,
weil sie an zwei Stellen dasselbe bedeuten müssen:

| Stimmung | Gesicht | Hintergrund |
|---|---|---|
| 0 — „Ging so" | gerader Strichmund, Punktaugen | `#ffe3bb` |
| 1 — „Ja, lustig" | Lächelbogen, rosa Wangen | `#ffc933` |
| 2 — „Superlustig" | **Sternaugen**, offener Mund, Zunge, rosa Wangen | `#ff9500` |

Ein Kind, das im Bewerten-Ablauf das Sterngesicht angetippt hat, erkennt es später auf der
Spielplatzkarte wieder.

## 10. Der Bewertungsmaßstab

Fünf Fragen, jede mit drei Bildantworten, davor genau eine Angabe: das Alter.
**Die drei Antwortkarten sind bewusst farblich identisch** — keine Antwort darf optisch als die
„richtige" erscheinen, sonst tippen Kinder das an, was am schönsten aussieht. Unterschiedlich
ist nur das Bild darauf. Reihenfolge immer links = wenig, rechts = viel.

| Frage | Antworten (links → rechts) | Gewicht |
|---|---|---|
| „Wie alt bist du?" | Zahlenknöpfe 2 … 12+ | Altersgruppe |
| „War es lustig?" | Ging so · Ja, lustig · Superlustig | **40 %** |
| „Wolltest du noch länger bleiben?" | Nein, kurz reicht · Ein bisschen · Ganz lange! | **30 %** |
| „Konntest du gut klettern und toben?" | Nicht wirklich · Ein bisschen · Super! | **20 %** |
| „Waren andere Kinder zum Spielen da?" | Keine · Ein paar · Viele | **10 %** |
| „War es schön schattig?" | Volle Sonne · Halb schattig · Schön schattig | zählt nicht |
| „Was war am besten?" (optional) | 9 Geräte-Icons zum Antippen | Highlights |

Schatten erscheint als eigenes **Abzeichen**, nicht im Punktwert — er ist ein Elternkriterium,
kein Spaßkriterium. So bedeutet „Spaß-Punkte" eindeutig Spaß aus Kindersicht.

**Altersgruppen:** 0–3 Krabbler · 4–6 Kita-Kind · 7–9 Schulkind · 10+ Große.
Punkte erscheinen erst ab 3 Bewertungen, davor steht „2 von 3 Stimmen".

## 11. Die acht Bildschirme

### `/` — Start (wichtigster Bildschirm)
1. Kopfzeile: Fuchskopf im orangen Kreis, „Spielplatz-Scouts / Von Kindern bewertet",
   rechts Knopf „So bewerten wir" mit Lineal-Icon
2. **Illustrierte Szene, volle Breite, ca. 150 px hoch**: Himmelverlauf, Sonne mit Strahlen,
   zwei Wolken, grüne Hügel, Bäume, eine Rutsche, eine Schaukel, gelbe Sandfläche vorn.
   Fips winkt unten links davor. Nach unten mit einer weichen Hügelkante abgeschlossen.
3. Überschrift „Für wen sucht ihr heute?" + vier Altersknöpfe nebeneinander
   (Icon, Altersspanne fett, Bezeichnung klein); aktiver Knopf dunkel
4. Ohne Standort: Karte mit Fips (suchend), „Wo seid ihr gerade?", Hinweis „Der Standort bleibt
   auf deinem Gerät. Wir senden ihn an keinen Server.", grüner Knopf „Standort verwenden",
   darunter Ortskapseln (Berlin, Hamburg, München, …)
5. Mit Standort: „14 Spielplätze, nächste zuerst", darunter Standortzeile, rechts Knopf „Karte"
6. Liste von Spielplatzkarten
7. Fußzeile mit vier Links und dem OpenStreetMap-Hinweis

### Spielplatzkarte (Listeneintrag)
Name (Fredoka, 18 px) · rechts grüne Entfernungskapsel mit Standortnadel · „ca. 3 Min. zu Fuß" ·
Punktwert: orange Kapsel mit Gesicht + Zahl + „/ 5", daneben fünf kleine Gesichter (gefüllt /
ausgegraut), dahinter die Herkunft · unten Abzeichenreihe (Schattig, Lieblingsgeräte, Ausstattung)

### `/karte` — Kartenansicht
Kopfzeile mit Zurück-Knopf und Altersfilter, darunter Vollbildkarte. Marker sind farbige Kapseln
mit weißem Mini-Gesicht und Punktzahl; die Farbe folgt dem Wert (grün gut → rot schwach), graue
Kapsel mit „?" für unbewertete Plätze.

### `/spielplatz` — Detail
Name, Entfernung, Punktwert groß, Abzeichen, Knopf „Route in Google Maps" ·
Abschnitt „Für welches Alter ist der Platz gut?" mit allen vier Gruppen und ihren Werten ·
Abschnitt „Was die Kinder gesagt haben" mit je Frage einem dreistufigen Balken und der häufigsten
Antwort · Lieblingsgeräte · unten fest verankert der grüne Knopf **„Kind bewerten lassen"** mit
Rutschen-Icon und darunter „5 Bildfragen · unter 30 Sekunden · ohne Namen"

### `/bewerten` — Kinder-Modus (Vollbild)
- **Jeder Schritt hat einen eigenen Vollflächen-Farbton** (blau → grün → violett → pink → gelb →
  türkis). Das ist der Fortschrittsanzeiger für Kinder, die die Punktleiste nicht deuten.
- Oben: runder Zurück-Knopf · Fortschrittspunkte (erledigt = grün, aktuell = langer dunkler
  Balken, offen = blass) · Lautsprecher · Schließen
- Mitte: Fips (fragend) mit einer Sprechblase, die das Fragebild zeigt, darunter die Frage groß
- Unten: **drei gleich aussehende weiße Karten, die die gesamte Resthöhe füllen**, je mit großem
  Bild und Label. Chunky-Schatten, sinken beim Drücken ein.
- Altersschritt: Fips winkt, „Wie alt bist du?", Vorlese-Knopf, „Mehr fragen wir nicht.",
  darunter ein 4-spaltiges Raster mit Zahlen
- Highlight-Schritt: Stern, „Was war am besten?", 3×3 Geräte-Raster (ausgewählt = dunkel mit
  gelbem Ring), unten grüner Knopf „Fertig!"

### Belohnung
Konfettiregen aus bunten Rechtecken und Kreisen · Fips jubelt (mit Tada-Animation) · darunter ein
Aufkleber im weiß umrandeten Kreis mit einem zufälligen Geräte- oder Medaillen-Icon · „Danke!" ·
„Deine Bewertung hilft anderen Kindern, {Name} zu finden." · zwei Knöpfe: „Ergebnis ansehen",
„Nächster Spielplatz"

### `/so-bewerten-wir` — Transparenzseite
Erklärt Fragen, Gewichte, Rechenweg, Altersgruppen und was **nicht** einfließt. Wird vollständig
aus derselben Datei erzeugt wie der Kinder-Modus, damit gestellte und erklärte Frage nicht
auseinanderlaufen können.

### `/datenschutz` und `/kommunen`
Datenschutz: was gespeichert wird (wenig), mit Löschknopf.
Kommunen: Verkaufsseite für das B2G-Angebot, sachlicher als der Rest, Rathaus-Icon.

## 12. Was noch offen ist

- Die **Kartenansicht** ist der schwächste Bildschirm — die Marker funktionieren, aber die Seite
  hat noch keine eigene gestalterische Idee.
- Der **Kommunen-Bereich** ist bewusst nüchtern, könnte aber eine eigene, erwachsenere
  Gestaltungslinie vertragen, ohne die Kinderwelt zu verlieren.
- Es gibt **keine Illustration für den Fehlerfall** „Keine Verbindung".
- Auf breiten Bildschirmen wird die Startseite nur zentriert, nicht neu angeordnet — ein
  zweispaltiges Layout mit Karte rechts wäre denkbar.

## 13. Wenn du das Design ersetzt

Der gesamte Farb- und Formenvorrat liegt in **einer** Datei (`app/globals.css`) als
CSS-Variablen. Farben, Radien und Schriften ändern sich dort einmal und schlagen überall durch —
auch in den SVG-Zeichnungen, die dieselben Variablen benutzen. Bildsprache und Layout stecken in
den einzelnen Komponenten unter `components/`.
