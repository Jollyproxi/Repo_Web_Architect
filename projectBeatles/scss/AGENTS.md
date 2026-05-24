# projectBeatles/scss

## Ambito
aSorgenti SCSS del progetto `projectBeatles`. Il file di ingresso è `main.scss` e la base condivisa è definita in `_index.scss`, `_colors.scss`, `_variables.scss` e `_extendedselectors.scss`.

## Regole operative
- Modificare sempre gli SCSS e rigenerare i CSS con lo script `npm run build:scss`.
- Non modificare direttamente i file in `css/`, perché sono output compilati.
- **TUTTI i colori sono centralizzati in `_colors.scss`**: modificare lì per cambiare colori in tutto il progetto senza cercare hardcoded values sparsi.
- `card` e `container` sono placeholder selector (`%card`, `%container`) definiti in `_extendedselectors.scss` e da estendere con `@extend`.
- I partial (`_header.scss`, `_members.scss`, `_albums.scss`, `_gallery.scss`, `_songs.scss`, `_footer.scss`) importano l'indice con `@use 'index' as *`.
- Mantieni il responsive e la logica di layout dentro i partial di competenza.
- Le ottimizzazioni mobile vanno concentrate su `main.scss`, `_header.scss`, `_members.scss`, `_albums.scss` e `_songs.scss`, con attenzione a hero, nav wrapping, griglie e controlli filtraggio.
- In `main.scss` esistono anche le classi condivise `.state-message*` per loading/error UI: usale al posto di stili inline nei renderer JS.
- `css/main.css*` e `scss/main.css*` sono output generati: non editarli a mano e non versionarli; lavora sempre sui sorgenti SCSS.
 - Il logo della navbar è ora alto 64px. Aggiorna `_header.scss` se modifichi la dimensione o il file immagine (`img/The_Beatles_logo.svg`).
 - Aggiungi regole per le nuove pagine `songs.html` e `singles.html` nei partial pertinenti o in `main.scss` (es. `.song-controls`, `.tracks`, `.albums-grid`).

## Struttura file SCSS
- `_colors.scss` — **Centralizzazione di TUTTI i colori**: palette primaria, accenti, neutri, sfondo, overlay, ombre. Unico punto di modifica per tutti i colori del progetto.
- `_variables.scss` — Variabili di layout e spacing (breakpoint, container-max, ecc.).
- `_index.scss` — Esporta colori e variabili con `@forward`.
- `main.scss` — Entrypoint e stili base (body, button, card, hero, overview).
- `_header.scss` — Navbar e logo.
- `_members.scss` — Card e griglia membri.
- `_albums.scss` — Card e griglia album.
- `_gallery.scss` — Galleria con figure e caption.
- `_songs.scss` — Card canzoni, grid, filtri e search.
- `_footer.scss` — Footer scuro e link sociali.

## Comandi utili
- Compilare: `npm run build:scss`
- Watch: `npm run watch:scss`

## Verifica tipica
- Aprire `index.html`, `members.html` e `albums.html` dopo la compilazione e verificare layout, responsive e card condivise.

## Indice AGENTS.md
- `../AGENTS.md` — documentazione operativa del progetto.
