# projectBeatles/js

## Ambito
Sorgenti JavaScript del progetto: fetch verso MusicBrainz, fallback locali, rendering delle pagine `members.html`, `albums.html`, `member.html` e `album.html`, più i link musicali gestiti dal helper `MusicFetcher`.

## Regole operative
- Gli script sono caricati come classici (`<script defer>`), non come ES modules.
- `data-manager.js` espone `window.DataManager` e gestisce fetch/fallback.
- `ui-renderer.js` espone `window.UIRenderer` e si occupa del rendering DOM.
- `app.js` è il bootstrap che legge la pagina corrente e invoca il renderer corretto.
- `MusicFetcher` costruisce i link di ascolto / ricerca per album e membri.
- Mantenere i dati fallback coerenti con le immagini e i titoli usati nei template.

## Comandi utili
- Aprire `index.html`, `members.html`, `albums.html`, `member.html`, `album.html` nel browser.
- Se serve verificare fetch e CORS, eseguire la pagina da un server statico locale.

## Verifica tipica
- Controllare la console del browser per errori di rete, CORS o riferimenti mancanti alle immagini.
- Verificare che i click sulle card aprano i dettagli con query string.

## Indice AGENTS.md
- `../AGENTS.md` — regole generali del progetto.

