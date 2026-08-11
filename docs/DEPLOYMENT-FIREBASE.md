# Spielplatz-Scouts auf Firebase Hosting veröffentlichen

Diese Anleitung führt dich Schritt für Schritt vom leeren Google-Konto bis zur öffentlich
erreichbaren App. Sie setzt keine Vorkenntnisse mit Firebase voraus.

**Zeitaufwand:** etwa 20 Minuten beim ersten Mal, danach ein einziger Befehl pro Update.
**Kosten:** 0 € im Spark-Tarif. Es wird **keine Kreditkarte** verlangt.

---

## Teil 0 — Was du bereithalten musst

Bevor du anfängst, brauchst du genau vier Dinge:

| # | Was | Woher |
|---|---|---|
| 1 | **Ein Google-Konto** | Jedes normale Google-/Gmail-Konto reicht. |
| 2 | **Node.js ab Version 20** | https://nodejs.org — nimm die LTS-Version. |
| 3 | **Diesen Code auf deinem Rechner** | `git clone` (siehe Teil 2, Schritt 2.1). |
| 4 | **Ein Terminal** | macOS: „Terminal". Windows: „PowerShell". Linux: dein übliches. |

Ein Ergebnis aus Teil 1 brauchst du später immer wieder — schreib es dir auf:

> 📋 **Meine Firebase-Projekt-ID:** `________________________`

Das ist **nicht** der Anzeigename, den du eingibst, sondern die technische ID darunter.
Sie ist dauerhaft und wird Teil deiner Adresse: `https://PROJEKT-ID.web.app`.

Prüfe zuerst deine Node-Version:

```bash
node -v
```

Erwartet: `v20.x.x` oder höher (z. B. `v22.22.2`). Kommt `v18` oder eine Fehlermeldung,
installiere zuerst Node.js LTS von nodejs.org und öffne das Terminal danach neu.

---

## Teil 1 — Das Firebase-Projekt anlegen (im Browser)

### 1.1 Firebase-Konsole öffnen

Gehe auf **https://console.firebase.google.com** und melde dich mit deinem Google-Konto an.

### 1.2 Projekt erstellen

Klicke auf **„Projekt erstellen"** (englisch: *Create a project*).

**Schritt 1 von 3 — Name.**
Gib einen Namen ein, zum Beispiel `Spielplatz-Scouts`.

⚠️ **Der wichtigste Moment der ganzen Anleitung:** Direkt unter dem Eingabefeld erscheint in
kleiner Schrift die daraus abgeleitete **Projekt-ID**, etwa `spielplatz-scouts` — oder mit
angehängten Zeichen wie `spielplatz-scouts-4f2c1`, falls der Name schon vergeben ist. Über das
Stift-Symbol daneben kannst du sie jetzt noch ändern, **später nie wieder**. Diese ID wird deine
öffentliche Adresse.

👉 Schreib sie in das Feld oben in Teil 0.

Häkchen bei den Nutzungsbedingungen setzen, **„Weiter"**.

**Schritt 2 von 3 — Google Analytics.**
Schalte **„Google Analytics für dieses Projekt aktivieren" aus.**

Begründung: Die App trackt bewusst nicht, und Kinder sind die Zielgruppe. Analytics würde
diesem Versprechen widersprechen und dir zusätzlich eine Einwilligungspflicht einhandeln. Für
Hosting wird es nicht gebraucht.

**„Projekt erstellen"** klicken und etwa 30 Sekunden warten, dann **„Weiter"**.

### 1.3 Hosting öffnen — und die richtige Variante wählen

In der linken Leiste findest du unter **„Erstellen"** (englisch *Build*) zwei ähnlich klingende
Einträge. Das ist die häufigste Verwechslung:

| Eintrag | Nehmen? | Warum |
|---|---|---|
| **Hosting** | ✅ **Diesen** | Klassisches Hosting für statische Seiten. Kostenlos im Spark-Tarif. |
| **App Hosting** | ❌ Nicht | Neueres Produkt für Server-Anwendungen. Erfordert den Blaze-Tarif mit hinterlegter Kreditkarte. |

Klicke auf **Hosting**. Falls eine Seite mit **„Jetzt starten"** erscheint, klicke sie durch —
die dort gezeigten Befehle kennst du gleich ohnehin, du kannst das Fenster danach schließen.

Damit ist der Browser-Teil erledigt. Alles Weitere passiert im Terminal.

---

## Teil 2 — Werkzeuge auf deinem Rechner einrichten

### 2.1 Den Code holen

```bash
git clone https://github.com/Donknille/PlaygroundVoting.git
cd PlaygroundVoting
git checkout claude/playground-rating-app-a3q9kf
```

Hast du den Ordner schon, reicht:

```bash
cd PlaygroundVoting
git checkout claude/playground-rating-app-a3q9kf
git pull origin claude/playground-rating-app-a3q9kf
```

### 2.2 Abhängigkeiten installieren

```bash
npm install
```

Das dauert etwa 30 Sekunden und legt den Ordner `node_modules/` an.

### 2.3 Prüfen, ob der Build lokal funktioniert

**Mach diesen Schritt, bevor du irgendetwas hochlädst.** Wenn hier etwas schiefgeht, liegt es
nicht an Firebase.

```bash
npm run build
```

Erwartete Ausgabe am Ende:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /bewerten
├ ○ /datenschutz
├ ○ /karte
├ ○ /kommunen
├ ○ /so-bewerten-wir
└ ○ /spielplatz

○  (Static)  prerendered as static content
```

Es entsteht ein Ordner `out/`. Das ist genau das, was gleich hochgeladen wird — fertige
HTML-Dateien, kein Server.

### 2.4 Die Firebase-Kommandozeile installieren

```bash
npm install -g firebase-tools
```

Prüfen:

```bash
firebase --version
```

Erwartet: `15.x.x` oder höher.

**Wenn hier ein Rechte-Fehler kommt** (`EACCES`, „permission denied"):
Installiere nicht mit `sudo`, sondern überspringe die globale Installation ganz. Du kannst jeden
`firebase`-Befehl dieser Anleitung auch so ausführen:

```bash
npx firebase-tools <befehl>
```

Also zum Beispiel `npx firebase-tools login` statt `firebase login`. Das funktioniert
gleichwertig und braucht keine Administratorrechte.

---

## Teil 3 — Rechner und Firebase-Projekt verbinden

### 3.1 Anmelden

```bash
firebase login
```

Es öffnet sich ein Browserfenster. Wähle **dasselbe Google-Konto**, mit dem du in Teil 1 das
Projekt angelegt hast, und bestätige die Zugriffsanfrage. Im Terminal steht danach
`✔ Success! Logged in as deine@mailadresse.de`.

**Arbeitest du über SSH oder auf einem Rechner ohne Browser?** Dann:

```bash
firebase login --no-localhost
```

Du bekommst eine URL zum Kopieren und gibst den zurückgelieferten Code im Terminal ein.

Kontrolle, wer angemeldet ist:

```bash
firebase login:list
```

### 3.2 Deine Projekt-ID nachschlagen

Falls du sie in Teil 1 nicht notiert hast:

```bash
firebase projects:list
```

Die Spalte **„Project ID"** ist die gesuchte. Die Spalte „Project Display Name" ist es *nicht*.

### 3.3 Das Projekt fest mit diesem Ordner verknüpfen

```bash
firebase use --add
```

Du wirst zweimal gefragt:

1. **„Which project do you want to add?"** → mit den Pfeiltasten dein Projekt wählen, Enter.
2. **„What alias do you want to use for this project?"** → tippe `default`, Enter.

Dabei entsteht die Datei `.firebaserc` mit deiner Projekt-ID. Sie bleibt bewusst lokal
(steht in `.gitignore`), weil sie deine persönliche Projekt-ID enthält.

Kontrolle:

```bash
firebase use
```

Erwartet: `Active Project: default (deine-projekt-id)`

> **Alternative ohne interaktive Auswahl:** Kopiere `.firebaserc.example` nach `.firebaserc` und
> trage die Projekt-ID ein.
> macOS/Linux: `cp .firebaserc.example .firebaserc` — Windows: `copy .firebaserc.example .firebaserc`

### 3.4 Was du NICHT tun sollst

❌ **Führe `firebase init` oder `firebase init hosting` nicht aus.**

Dieser Befehl will eine neue `firebase.json` schreiben und fragt Dinge wie „Configure as a
single-page app?". Die passende Konfiguration liegt bereits fertig im Repository — mit
Weiterleitungen, Cache-Regeln und einem automatischen Build vor jedem Deploy. `firebase init`
würde sie überschreiben.

Falls du ihn versehentlich gestartet hast: Bei **„File firebase.json already exists. Overwrite?"**
unbedingt **`N`** antworten, oder `firebase.json` anschließend mit
`git checkout firebase.json` zurückholen.

---

## Teil 4 — Erst eine Vorschau, dann live

Firebase kann eine Version auf eine temporäre Adresse legen, ohne die eigentliche Seite
anzufassen. Beim ersten Mal ist das der ruhigere Weg.

```bash
firebase hosting:channel:deploy vorschau --expires 7d
```

Was passiert:

1. Der `predeploy`-Haken aus `firebase.json` startet automatisch `npm run build`.
2. Der Inhalt von `out/` wird hochgeladen.
3. Du bekommst eine Adresse der Form
   `https://deine-projekt-id--vorschau-a1b2c3d4.web.app`

Diese Vorschau löscht sich nach sieben Tagen von selbst. Öffne sie **auf dem Handy** und arbeite
die Prüfliste aus Teil 6 ab.

---

## Teil 5 — Der echte Deploy

```bash
firebase deploy --only hosting
```

Erwartete Ausgabe:

```
=== Deploying to 'deine-projekt-id'...

i  deploying hosting
i  hosting[deine-projekt-id]: beginning deploy...
i  hosting[deine-projekt-id]: found 40 files in out
✔  hosting[deine-projekt-id]: file upload complete
✔  hosting[deine-projekt-id]: release complete

✔  Deploy complete!

Hosting URL: https://deine-projekt-id.web.app
```

**Die App ist jetzt öffentlich erreichbar** — unter zwei gleichwertigen Adressen:

- `https://deine-projekt-id.web.app`
- `https://deine-projekt-id.firebaseapp.com`

HTTPS ist automatisch aktiv. Das ist keine Nebensache: Ohne HTTPS würde der Browser die
Standortabfrage verweigern, und die App könnte keine Spielplätze in der Nähe finden.

---

## Teil 6 — Prüfliste nach dem Deploy

**Bitte wirklich abarbeiten, und zwar auf einem Handy mit Mobilfunk, nicht am Schreibtisch-WLAN.**

Der wichtigste Punkt ist Nummer 3: Die Verbindung zu OpenStreetMap konnte in der
Entwicklungsumgebung nicht getestet werden, weil dort der Netzzugang zu `overpass-api.de`
gesperrt war. Dieser eine Pfad ist nach dem Deploy zum ersten Mal unter echten Bedingungen zu
sehen.

| # | Prüfung | Erwartet |
|---|---|---|
| 1 | Adresse im Handy-Browser öffnen | Startseite „Für wen sucht ihr heute?" erscheint |
| 2 | Standortfreigabe erlauben | Nach 1–3 Sekunden erscheint eine Spielplatzliste |
| 3 | **Gelber Kasten „Demo-Modus" sichtbar?** | **Nein** ← der entscheidende Punkt |
| 4 | Spielplatznamen ansehen | Echte Namen aus deiner Umgebung, nicht „Spielplatz Sonnenwiese" |
| 5 | Auf „🗺️ Karte" tippen | Kartenkacheln sind sichtbar, Pins mit Punktwerten darauf |
| 6 | Einen Platz öffnen, „Kind bewerten lassen" | Fünf Bildfragen, danach Konfetti |
| 7 | Zurück zur Übersicht | Deine Bewertung ist beim Platz sichtbar |
| 8 | „Route in Google Maps" tippen | Google Maps öffnet sich mit dem Ziel |
| 9 | Im Browsermenü „Zum Startbildschirm hinzufügen" | App-Symbol (gelbe Rutsche) erscheint |

**Wenn Punkt 3 fehlschlägt** — also der Demo-Kasten erscheint —, ist die App nicht kaputt; sie
sagt dir ehrlich, dass sie keine echten Daten bekommen hat. Weiter bei Teil 9,
„Der Demo-Modus geht nicht weg".

---

## Teil 7 — Änderungen veröffentlichen

Immer derselbe Ablauf:

```bash
git pull                          # falls sich der Code geändert hat
firebase deploy --only hosting
```

Ein separates `npm run build` brauchst du nicht — es läuft durch den `predeploy`-Eintrag in
`firebase.json` automatisch mit. Genau dafür ist er da: So kann dir nicht passieren, dass du
einen alten Stand hochlädst und dich wunderst, warum die Änderung nicht ankommt.

### Eine Veröffentlichung rückgängig machen

1. Firebase-Konsole → **Hosting**
2. Abschnitt **„Release-Verlauf"**
3. Bei der gewünschten älteren Version auf ⋮ → **„Rollback"**

Das wirkt sofort und braucht kein Terminal.

---

## Teil 8 — Eigene Domain (optional)

Nur nötig, wenn dir `deine-projekt-id.web.app` nicht reicht.

1. Firebase-Konsole → **Hosting** → **„Benutzerdefinierte Domain hinzufügen"**
2. Domain eingeben, z. B. `spielplatz-scouts.de`
3. Firebase zeigt einen **TXT-Eintrag** zur Eigentumsprüfung. Diesen bei deinem Domain-Anbieter
   (IONOS, Strato, Namecheap …) in die DNS-Verwaltung eintragen.
4. Nach der Bestätigung zeigt Firebase **zwei A-Einträge** (IP-Adressen). Auch diese eintragen.
5. Warten. Die DNS-Verbreitung dauert oft 1–2 Stunden, das SSL-Zertifikat wird von Firebase
   automatisch ausgestellt und kann bis zu 24 Stunden brauchen.

Bis das Zertifikat steht, zeigt der Browser eine Sicherheitswarnung. Das ist normal und
verschwindet von selbst.

---

## Teil 9 — Fehlerbehebung

### „Error: Failed to get Firebase project … Please make sure the project exists"

Entweder falsche Projekt-ID oder falsches Google-Konto.

```bash
firebase login:list      # wer bin ich?
firebase projects:list   # welche Projekte sehe ich?
firebase use --add       # Verknüpfung neu setzen
```

### „HTTP Error: 403, The caller does not have permission"

Du bist mit einem Konto angemeldet, das keinen Zugriff auf dieses Projekt hat.

```bash
firebase logout
firebase login
```

und dabei das richtige Konto wählen.

### „Error: Specified public directory 'out' does not exist"

Der Build ist nicht gelaufen oder fehlgeschlagen.

```bash
npm run build
ls out          # Windows: dir out
```

Es müssen `index.html`, `404.html` und ein Ordner `_next` zu sehen sein.

### Startseite lädt, Unterseiten zeigen 404

Fast immer wurde `firebase.json` überschrieben (siehe Teil 3.4). Wiederherstellen:

```bash
git checkout firebase.json
firebase deploy --only hosting
```

### Der Demo-Modus geht nicht weg

Die App erreicht die Overpass-Schnittstelle nicht. So findest du heraus, warum:

1. Seite am **Desktop** öffnen (Chrome oder Firefox)
2. `F12` → Reiter **„Netzwerk"** → Seite neu laden (`Strg`/`Cmd` + `R`)
3. Ins Filterfeld `interpreter` eintippen

Was du siehst und was es bedeutet:

| Beobachtung | Bedeutung | Was tun |
|---|---|---|
| Status **200**, aber trotzdem Demo-Modus | Antwort war leer — in diesem Umkreis kennt OpenStreetMap keinen Spielplatz | Anderen Ort probieren; das ist kein Fehler |
| Status **429** | Overpass drosselt (zu viele Anfragen weltweit) | 10 Minuten warten. Die App wechselt selbst auf den Ersatzserver `overpass.kumi.systems` |
| Status **504** / Zeitüberschreitung | Overpass-Server überlastet | Später erneut |
| **Keine Zeile** taucht auf | Der Standort wurde nie freigegeben | Browsereinstellungen → Standortberechtigung für die Seite prüfen |
| **CORS**-Fehlermeldung | Sehr unwahrscheinlich, Overpass erlaubt Browserzugriffe | Melden — dann muss ein eigener Zwischenserver her |

Suchradius und Server stehen in `lib/config.ts` (`SEARCH_RADIUS_M`, `OVERPASS_ENDPOINTS`).

### Änderungen erscheinen nicht, obwohl der Deploy erfolgreich war

Der Service Worker liefert die zwischengespeicherte Fassung aus.

- Am Handy: Browser-Tab schließen und neu öffnen, oder Seite zweimal neu laden.
- Am Desktop: `Strg`/`Cmd` + `Shift` + `R`.
- Ganz sicher: `F12` → **„Anwendung"** → **„Speicher"** → **„Websitedaten löschen"**.

Die Datei `sw.js` selbst wird per Cache-Regel nie zwischengespeichert, ein Update greift also
spätestens beim übernächsten Aufruf.

### Standortabfrage erscheint gar nicht

Passiert nur bei `http://`. Über die Firebase-Adresse ist immer HTTPS aktiv — prüfe, ob du
wirklich `https://` in der Adresszeile stehen hast.

---

## Teil 10 — Kosten

Firebase Hosting im **Spark-Tarif** (Standard, ohne Kreditkarte) umfasst laut aktueller
Firebase-Preisliste:

- 10 GB Speicher
- 360 MB übertragene Daten pro Tag
- SSL-Zertifikat und eigene Domain inklusive

Ein Seitenaufruf dieser App überträgt beim ersten Mal deutlich weniger als 1 MB und danach fast
nichts mehr, weil der Service Worker zwischenspeichert. Das Tageskontingent reicht damit für
mehrere tausend Aufrufe.

Wird es überschritten, ist die Seite bis Mitternacht (Pazifische Zeit) nicht erreichbar — es
entstehen **keine automatischen Kosten**. Erst wenn du selbst auf den **Blaze**-Tarif wechselst,
kann abgerechnet werden. Prüfe die Konditionen vor einem echten Start noch einmal unter
https://firebase.google.com/pricing, Preismodelle ändern sich.

Nicht in diesen Kosten enthalten und ebenfalls kostenlos, aber mit Fairness-Regeln:
OpenStreetMap und Overpass. Beide werden von Spenden getragen. Bei nennenswerten Nutzerzahlen
gehört ein eigener Overpass-Server oder ein zwischenspeichernder Server dazu — siehe die
Roadmap in der README.

---

## Teil 11 — Automatisch veröffentlichen bei jedem Push (optional)

Erst sinnvoll, wenn der manuelle Weg zuverlässig läuft.

**Der einfache Weg:**

```bash
firebase init hosting:github
```

Der Befehl legt ein Dienstkonto an, hinterlegt es als GitHub-Secret und schreibt einen Workflow.

⚠️ Er fragt zwischendurch, ob er bestehende Dateien überschreiben darf. Bei
**„File firebase.json already exists. Overwrite?"** unbedingt **`N`** antworten. Prüfe danach mit
`git diff firebase.json`, dass die Datei unverändert ist.

**Der kontrollierte Weg** — Workflow selbst anlegen als
`.github/workflows/deploy.yml`, nachdem `firebase init hosting:github` das Secret erzeugt hat:

```yaml
name: Deploy zu Firebase Hosting

on:
  push:
    branches: [claude/playground-rating-app-a3q9kf]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: DEINE-PROJEKT-ID
```

Damit das läuft, muss `.firebaserc` nicht im Repository liegen — die Projekt-ID steht direkt im
Workflow.

---

## Spickzettel

```bash
# einmalig
npm install -g firebase-tools
firebase login
firebase use --add

# Vorschau (7 Tage, ändert die Live-Seite nicht)
firebase hosting:channel:deploy vorschau --expires 7d

# live
firebase deploy --only hosting

# nachsehen
firebase use              # welches Projekt ist verknüpft?
firebase projects:list    # welche Projekte gibt es?
firebase hosting:channel:list
```
