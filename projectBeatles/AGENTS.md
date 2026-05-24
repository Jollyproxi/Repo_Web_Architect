# projectBeatles

**⚠️ REGOLA FISSA:** Prima di procedere, leggi **SEMPRE** il `../AGENTS.md` di root e tutti gli AGENTS.md lungo il percorso fino a questa cartella.

## Ambito
Progetto didattico client-side per una landing page dei Beatles con pagine dedicate ai membri e alla discografia. Il layout è SCSS puro, i dati musicali arrivano da MusicBrainz e AudioDB quando possibile, con fallback locali.

## Regole operative
- Progetto solo statico: niente backend o database nel repository.
- SCSS puro, no Bootstrap. Il file di ingresso è `scss/main.scss`.
- La struttura SCSS è modulare: `scss/_index.scss` espone `variables` e `extendedselectors` con `@forward`, mentre i partial usano `@use 'index' as *`.
- I componenti condivisi base sono placeholder selector (`%card`, `%container`) definiti in `scss/_extendedselectors.scss` e consumati con `@extend`.
- In JavaScript gli script restano caricati come classici e si espongono su `window` (`DataManager`, `UIRenderer`, `MusicFetcher`).
- Conservare gli id e i nomi file già usati in `index.html`, `members.html`, `albums.html`, `member.html`, `album.html`.
 - Le immagini previste in `img/` devono restare coerenti con i riferimenti nei template e nei renderer JS (`The_Beatles_logo.svg` è il logo nella navbar, ridimensionato a 64px di altezza).
 - **UI**: Il logo nella navbar è un'immagine SVG (`<img src="img/The_Beatles_logo.svg">`) cliccabile che rimanda a `index.html`. La navigazione non contiene il pulsante "Home".
 - **Hero image**: L'immagine hero (nella sezione `.hero`) è resa tramite `background-image` (Unsplash) con un overlay di gradiente; il renderer JS mantiene i fallback SVG per le gallerie.
 - **Color palette**: tutte le variabili di colore sono centralizzate in `scss/_colors.scss`. Modifica lì se necessario per tweaking globale della tavolozza (nessun hardcoded color sparso nei file).
	 - **Navbar**: la navbar è bianca e la navigazione è centrata. I link evidenziano lo stato al passaggio (hover) usando il colore primario. Il logo rimane cliccabile verso `index.html`.
	 - **Songs**: la pagina `songs.html` mostra ora i brani come card con metadata leggibili (titolo, album, anno, durata, id) e filtri di ricerca/album.
	 - **Loading states**: tutte le pagine async mostrano spinner elegante con icona ⏳ mentre caricano da API. Error handling user-friendly con messaggi e fallback ai dati locali.
	 - **Accessibility**: tutte le pagine hanno meta descriptions, ARIA labels su nav, `aria-current="page"` su link attivo, semantic HTML5, alt text descrittivi.
		 - **Generated CSS**: `css/main.css*` e `scss/main.css*` sono output compilati, ignorati da Git e da non modificare a mano.

## Nuove pagine e comportamenti
- `songs.html` — pagina che mostra l'elenco completo di brani recuperati da MusicBrainz; include barra di ricerca e filtri client-side.
- `singles.html` — pagina che mostra release-groups di tipo `single` (singoli) recuperati da MusicBrainz.
- `album.html` — ora mostra anche la lista delle tracce (recordings) per l'`album` (release-group) usando l'endpoint `/release` per ottenere i recordings.
- **About section** — Sezione storia banda aggiunta a `index.html` con 4 periodi storici (Origini, Beatlemania, Era Psichedelica, Scioglimento).
- **Card espandibili** — Pagine membri, album, brani, singoli hanno card con hover overlay e descrizioni complete.
- **Mobile optimization** — Hero a singola colonna, header con nav wrapping, griglie e controlli filtraggio più compatti sui breakpoint stretti.
	 - **State messages** — I blocchi loading/error usano classi SCSS condivise (`.state-message*`) invece di stili inline.

## Note tecniche aggiuntive
- `data-manager.js` espone ora funzioni aggiuntive: `fetchRecordingsByArtistMbid`, `fetchRecordingsByReleaseGroup`, `fetchReleaseGroupsByArtistMbidType`.
- Le nuove chiamate possono restituire risultati parziali a causa di limiti CORS o limiti dell'API MusicBrainz; i renderer devono prevedere fallback locali.
- **Galleria**: La galleria (`#galleryGrid`) è inizialmente vuota e viene popolata dinamicamente dal JS tramite `renderGallery()`, che usa immagini da Unsplash (tramite `buildUnsplashUrl`) con fallback SVG generati dinamicamente.
- **Ritratti membri**: `AudioDB` è la sorgente primaria per i ritratti dei membri tramite `fetchArtistLogoByName()` / `resolveMemberPortrait()`. Unsplash e SVG rimangono fallback locali.

## API esterne utilizzate
- **MusicBrainz** (`https://musicbrainz.org/ws/2`): metadati su artisti e album.
- **AudioDB** (`https://www.theaudiodb.com/api/v1/json/2`): logo/thumbnail degli artisti via `strArtistThumb`.
- **CoverArtArchive** (`https://coverartarchive.org`): copertine degli album.
- **Unsplash** (`https://source.unsplash.com`): immagini di ricerca fallback.

## Comandi utili
Compilare SCSS:

```powershell
cd "C:\Users\davide.GiOLIttI\OneDrive - ITS ICT Piemonte\Desktop\FrontEnd\repos\Repo_Web_Architect\projectBeatles"
npm install
npm run build:scss
npm run watch:scss
```

Avviare un server statico locale per testare fetch e routing:

```powershell
python -m http.server 8000
```

## Verifica tipica
- Aprire `index.html`, `members.html`, `albums.html`, `member.html`, `album.html`.
- Verificare che il click sul logo ("The Beatles") rimandi a home.
- Verificare che l'immagine hero (SVG) sia visibile con il testo "The Beatles" e gradiente verde.
- Controllare la console del browser per eventuali problemi di fetch CORS o dati mancanti.
- Verificare che la galleria carica le immagini da Unsplash (o SVG fallback se offline).
- Verificare che `css/main.css` venga rigenerato correttamente da `scss/main.scss`.

## Indice AGENTS.md
- `scss/AGENTS.md` — regole SCSS, `@forward`, `@use` e placeholder selector.
- `js/AGENTS.md` — logica client-side, rendering, fetch MusicBrainz/AudioDB e helper `MusicFetcher`.
- `css/AGENTS.md` — CSS compilati, non editare a mano.
- `img/AGENTS.md` — asset immagini e nomi attesi.

