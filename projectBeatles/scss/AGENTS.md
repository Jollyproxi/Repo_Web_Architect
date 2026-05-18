# projectBeatles/scss

## Ambito
Sorgenti SCSS del progetto `projectBeatles`. Il file di ingresso è `main.scss` e la base condivisa è definita in `_index.scss`, `_variables.scss` e `_extendedselectors.scss`.

## Regole operative
- Modificare sempre gli SCSS e rigenerare i CSS con lo script `npm run build:scss`.
- Non modificare direttamente i file in `css/`, perché sono output compilati.
- `card` e `container` sono placeholder selector (`%card`, `%container`) definiti in `_extendedselectors.scss` e da estendere con `@extend`.
- I partial (`_header.scss`, `_members.scss`, `_albums.scss`, `_gallery.scss`, `_footer.scss`) importano l’indice con `@use 'index' as *`.
- Mantieni il responsive e la logica di layout dentro i partial di competenza.

## Comandi utili
- Compilare: `npm run build:scss`
- Watch: `npm run watch:scss`

## Verifica tipica
- Aprire `index.html`, `members.html` e `albums.html` dopo la compilazione e verificare layout, responsive e card condivise.

## Indice AGENTS.md
- `../AGENTS.md` — documentazione operativa del progetto.

