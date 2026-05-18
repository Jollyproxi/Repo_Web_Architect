# esempio3_davide

## Ambito
- Variante personale dell'esempio 3: contiene `scss/`, `css/`, e `index.html`.
- Esempio didattico che mostra l'uso di partials (`_variables.scss`, `_mixins.scss`, `_card.scss`, `_buttons.scss`).

## Regole operative
- Non introdurre backend o build system obbligatorio: mantieni la possibilità di aprire `index.html` direttamente.
- Documenta ogni partial SCSS condiviso nel `AGENTS.md` locale (es. `_buttons.scss` contiene il placeholder `%btn-base`).
- Se modifichi i nomi dei partial o la struttura `scss/`, aggiorna anche questo `AGENTS.md`.

## Comandi utili (opzionali)
- Compilazione rapida con Dart Sass (se installato):

```bash
sass scss/main.scss css/main.css
```

## Verifica tipica
- Apri `index.html` nel browser e verifica:
  - presenza di `css/main.css` aggiornato;
  - funzionamento dei componenti `.card` e dei bottoni `.btn-primary` / `.btn-danger`.

## Indice AGENTS.md
- (nessuno)

## File chiave in questa cartella
- `index.html`
- `scss/main.scss` (entrypoint)
- `scss/_variables.scss`, `scss/_mixins.scss`, `scss/_card.scss`, `scss/_buttons.scss` (partial condivisi)
- `css/main.css` (output compilato)

