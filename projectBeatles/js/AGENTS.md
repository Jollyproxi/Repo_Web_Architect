# projectBeatles/js

## Ambito
Sorgenti JavaScript del progetto: fetch verso MusicBrainz, AudioDB per i loghi, fallback locali, rendering delle pagine `members.html`, `albums.html`, `member.html` e `album.html`, più i link musicali gestiti dal helper `MusicFetcher`.

## Regole operative
- Gli script sono caricati come classici (`<script defer>`), non come ES modules.
- `data-manager.js` espone `window.DataManager` e gestisce fetch/fallback da MusicBrainz e AudioDB.
- `ui-renderer.js` espone `window.UIRenderer` e si occupa del rendering DOM, inclusi i fallback SVG per immagini.
- `app.js` è il bootstrap che legge la pagina corrente e invoca il renderer corretto.
- `MusicFetcher` costruisce i link di ascolto / ricerca per album e membri.
- Mantenere i dati fallback coerenti con le immagini e i titoli usati nei template.
- Il logo nella navbar (`<a class="logo">`) è cliccabile e rimanda a `index.html`.
- La navigazione non contiene più il pulsante "Home"; include: Members, Discografia, Brani e Singles.
- **Immagini**: La galleria carica dinamicamente immagini da Unsplash tramite `renderGallery()`. Gli errori di caricamento sono trattati con fallback SVG generati da `buildSvgDataUri()` tramite `applyFallbackImage()`.
 - `data-manager.js` espone `window.DataManager` e gestisce fetch/fallback da MusicBrainz e AudioDB. Sono state aggiunte funzioni per la gestione delle tracce:
   - `fetchRecordingsByArtistMbid(mbid, limit)` — ricerca recordings per artista.
   - `fetchRecordingsByReleaseGroup(releaseGroupId)` — ottiene le tracce di un release-group (scorrendo release/recordings).
   - `fetchReleaseGroupsByArtistMbidType(mbid, type)` — ricerca release-groups per tipo (es. `single`).
  - `ui-renderer.js` espone `window.UIRenderer` e si occupa del rendering DOM, inclusi i fallback SVG per immagini. Sono stati aggiunti renderer per le nuove pagine: `renderSongs()` e `renderSingles()`.
  - I ritratti dei membri usano `AudioDB` come fonte primaria tramite `DataManager.resolveMemberPortrait(member)`, con fallback Unsplash/SVG se l'API non restituisce il thumbnail.
 - `app.js` è il bootstrap che legge la pagina corrente e invoca il renderer corretto; è stato aggiornato per gestire `songs.html` e `singles.html`.
   - `ui-renderer.js` espone `window.UIRenderer` e si occupa del rendering DOM, inclusi i fallback SVG per immagini. `renderSongs()` ora mostra ogni brano come una card con metadata (titolo, album, anno, durata, ID) e controlli di ricerca e filtro. `renderSingles()` mostra i singoli come card.

## API esterne utilizzate
- **MusicBrainz**: `/artist`, `/release-group` per metadati su artisti e album (formato JSON).
- **AudioDB**: `/artist.php` per recuperare il logo/thumbnail dell'artista (`strArtistThumb`). 
- **CoverArtArchive**: per le copertine degli album (URL composito da `release-group-id`).
- **Unsplash**: per immagini generiche di ricerca (fallback per galleria e membri).

## Comandi utili
- Aprire `index.html`, `members.html`, `albums.html`, `member.html`, `album.html` nel browser.
- Se serve verificare fetch e CORS, eseguire la pagina da un server statico locale.

## Verifica tipica
- Controllare la console del browser per errori di rete, CORS o riferimenti mancanti alle immagini.
- Verificare che i click sulle card aprano i dettagli con query string.
- Verificare che il click sul logo nella navbar (The Beatles) rimandi a home (index.html).
- Verificare che la galleria carichi immagini da Unsplash (o SVG fallback se offline).

## Indice AGENTS.md
- `../AGENTS.md` — regole generali del progetto.

