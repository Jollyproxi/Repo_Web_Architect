# projectBeatles

## Ambito
Progetto didattico client-side per una landing page dei Beatles con pagine dedicate ai membri e alla discografia. Il layout è SCSS puro e i dati musicali arrivano da MusicBrainz quando possibile, con fallback locali.

## Regole operative
- Progetto solo statico: niente backend o database nel repository.
- SCSS puro, no Bootstrap. Il file di ingresso è `scss/main.scss`.
- La struttura SCSS è modulare: `scss/_index.scss` espone `variables` e `extendedselectors` con `@forward`, mentre i partial usano `@use 'index' as *`.
- I componenti condivisi base sono placeholder selector (`%card`, `%container`) definiti in `scss/_extendedselectors.scss` e consumati con `@extend`.
- In JavaScript gli script restano caricati come classici e si espongono su `window` (`DataManager`, `UIRenderer`, `MusicFetcher`).
- Conservare gli id e i nomi file già usati in `index.html`, `members.html`, `albums.html`, `member.html`, `album.html`.
- Le immagini previste in `img/` devono restare coerenti con i riferimenti nei template e nei renderer JS.

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
- Controllare la console del browser per eventuali problemi di fetch CORS o dati mancanti.
- Verificare che `css/main.css` venga rigenerato correttamente da `scss/main.scss`.

## Indice AGENTS.md
- `scss/AGENTS.md` — regole SCSS, `@forward`, `@use` e placeholder selector.
- `js/AGENTS.md` — logica client-side, rendering, fetch MusicBrainz e helper `MusicFetcher`.
- `css/AGENTS.md` — CSS compilati, non editare a mano.
- `img/AGENTS.md` — asset immagini e nomi attesi.

