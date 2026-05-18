# projectBeatles/css

## Ambito
CSS compilati a partire dagli SCSS del progetto. Il file principale è `main.css`.

## Regole operative
- Non modificare a mano i file CSS generati: editare gli SCSS e ricompilare.
- `main.css` deve essere il riflesso fedele di `scss/main.scss`.
- Se serve debug, usare il sorgente SCSS, non l’output compilato.

## Comandi utili
- `npm run build:scss` per compilare SCSS → CSS

## Verifica tipica
- Aprire `index.html` e verificare che `css/main.css` venga caricato senza errori.
- Controllare che i selettori generati includano i placeholder estesi (`.member-card`, `.album-card`, `main .container`).

