# projectBeatles

Landing page e pagine dedicate alla band The Beatles, sviluppate in HTML, SCSS puro e JavaScript client-side.

## Avvio rapido

1. Installare le dipendenze.

```powershell
npm install
```

2. Compilare gli SCSS in CSS.

```powershell
npm run build:scss
```

3. In sviluppo, tenere aperto il watcher.

```powershell
npm run watch:scss
```

4. Aprire `index.html` nel browser, oppure servire la cartella con un server statico se si vuole testare fetch e asset con maggiore affidabilità.

## Cosa contiene

- `index.html` per la landing page.
- `members.html` e `albums.html` per le viste elenco.
- `member.html` e `album.html` per i dettagli.
- `scss/main.scss` come entrypoint degli stili.
- `js/` per rendering, fallback locali e collegamenti a MusicBrainz.

## Note

- Il progetto resta completamente statico: non serve alcun backend.
- Se MusicBrainz non risponde, i dati locali continuano a riempire la discografia e i contenuti base.
- La grafica è stata rifinita con una palette più calda, cards più profonde e una galleria più leggibile senza cambiare la struttura HTML.

