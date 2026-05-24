# Centralizzazione dei colori in projectBeatles

## Stato
✅ **Completato** - Tutti i colori sono stati estratti in un unico file `_colors.scss` per facilità di tweaking.

## File modificati

### Nuovo file
- `scss/_colors.scss` — **File principale di centralizzazione colori** con tutte le variabili di colore della palette (primary, accent, neutral, overlay, shadow, ecc.)

### File aggiornati per usare le nuove variabili di colore

1. **scss/_index.scss**
   - Aggiunto `@forward 'colors'` prima di `_variables.scss`

2. **scss/_variables.scss**
   - Ripulito: rimosse tutte le variabili di colore (trasferite a `_colors.scss`)
   - Mantiene solo variabili di layout: `$container-max`, `$break-sm`, `$break-md`

3. **scss/_extendedselectors.scss**
   - Aggiunto `@use 'colors' as colors`
   - Aggiornato %card per usare variabili di colore da `colors`

4. **scss/main.scss**
   - Aggiornati tutti i colori hardcoded a variabili di colore
   - Backgroundi gradient usano `$accent-light`, `$primary-light`
   - Buttons usano `$primary`, `$primary-hover`, `$primary-overlay-*`
   - Ombre usano `$brown-shadow`, `$brown-dark-*`

5. **scss/_header.scss**
   - Header usa `$white` al posto di `#fff`
   - Border usa `$header-border`
   - Ombre usano `$brown-header`, `$primary-overlay-sm`

6. **scss/_members.scss**
   - Border usa `$header-border`
   - Ombre usano `$brown-dark-1`
   - Overlay gradient usa `$dark-overlay-xl`, `$dark-overlay-darker`
   - Placeholder text usa `$gray-placeholder`

7. **scss/_albums.scss**
   - Ombre usano `$brown-dark-1`

8. **scss/_gallery.scss**
   - Aggiunto `@use 'index' as *` (era mancante)
   - Border usa `$white-overlay-md`
   - Ombre usano `$brown-dark-1`, `$brown-dark-2`
   - Background gallery-item usa `$black-dark-dark`
   - Figcaption usa `$dark-overlay-md`, `$dark-overlay-dark`

9. **scss/_footer.scss**
   - Background usa `$footer-dark-1`, `$footer-dark-2`
   - Testo usa `$white`, `$white-text-muted`
   - Border usa `$white-overlay-sm`
   - Social links background usa `$white-overlay-subtle`

10. **scss/_songs.scss**
   - Badge background usa `$dark-overlay-sm`
   - Input/select background usa `$white`
   - Testo usa `$ink`

## Variabili di colore disponibili in `_colors.scss`

### Colori primari di brand
- `$primary` — Burgundy caldo (#8f3b2f)
- `$primary-hover` — Burgundy scuro (#6f2d25)
- `$primary-light`, `$primary-overlay-sm/md/lg` — Variazioni di opacità

### Accenti
- `$accent` — Gold caldo (#d4a64a)
- `$accent-light` — Gold con 22% opacità

### Neutri
- `$muted` — Testo attenuato (#6b665f)
- `$ink` — Testo scuro (#14120f)
- `$gray-placeholder` — Gray (#999)

### Sfondo
- `$bg` — Light warm (#fbf7f0)
- `$card-bg` — Card background (light off-white, 95% opacità)
- `$surface` — Surface color (#fffaf2)

### Bianco e trasparenza
- `$white` — Puro bianco (#fff)
- `$white-overlay-*` — Variazioni di opacità (5%, 8%, 45%, 55%)
- `$white-text-muted` — Testo bianco attenuato (#ddd)

### Nero e overlay scuri
- `$black` — Nero puro (#000)
- `$black-dark-dark` — Molto scuro (#111)
- `$footer-dark-1/2` — Colori footer specifici
- `$dark-overlay-*` — Variazioni di opacità (2%, 4%, 8%, 35%, 74%)

### Tonalità marrone (per ombre e profondità)
- `$brown-dark-1/2/3` — Ombre graduate (16%, 22%, 20% opacità)
- `$brown-shadow` — Ombra card (15% opacità)
- `$brown-header` — Ombra header (6% opacità)

### Linee e bordi
- `$line` — Divider sottile
- `$header-border` — Border header standard

## Come usare

Per tweaking globale della palette:
1. Apri `scss/_colors.scss`
2. Modifica le variabili di colore desiderate
3. Esegui `npm run build:scss` o `npm run watch:scss`
4. Il CSS verrà rigenerato con i nuovi colori in tutto il progetto

**Non cercare colori hardcoded negli altri file**: sono tutti gestiti tramite variabili!

## Vantaggi

✅ Unico punto di modifica per tutti i colori
✅ Nessun hardcoded color sparso nei file SCSS
✅ Facile creare temi o variazioni di colore
✅ Migliore mantenibilità e scalabilità
✅ Nomi descrittivi per ogni variabile

