# SCSS — Guida Completa
 
> Preprocessore CSS: scrivi SCSS, il compilatore produce CSS standard. Il browser non legge mai SCSS direttamente.
 
---
 
## 1. Cos'è SCSS e la differenza con Sass
 
**Sass** è il preprocessore (il sistema). Ha due sintassi diverse:
 
| | SCSS | Sass (indented) |
|---|---|---|
| Estensione | `.scss` | `.sass` |
| Sintassi | Come CSS, con `{}` e `;` | Indentazione, senza `{}` né `;` |
| Compatibile con CSS puro | Sì |  No |
| Diffusione attuale | Dominante | Quasi in disuso |
 
### Confronto diretto
 
```scss
// SCSS (.scss)
.card {
  color: $primary;
  &:hover {
    opacity: 0.8;
  }
}
```
 
```sass
// Sass indentato (.sass)
.card
  color: $primary
  &:hover
    opacity: 0.8
```
 
Stessa potenza, sintassi diversa. Il compilatore `sass` gestisce entrambe.
 
> **Regola pratica**: quando senti "uso Sass" nel 2020+, il 95% delle volte si intende SCSS.
 
---
 
## 2. Setup e installazione
 
```bash
npm install -g sass
sass --version  # verifica installazione
```
 
---
 
## 3. Il compilatore in azione
 
### Modalità di compilazione
 
```bash
# File singolo
sass input.scss output.css
 
# Watch mode (ricompila ad ogni salvataggio)
sass --watch input.scss:output.css
 
# Cartella intera
sass --watch src/scss:dist/css
 
# Output leggibile (default)
sass input.scss output.css --style=expanded
 
# Output minificato (per produzione)
sass input.scss output.css --style=compressed
```
 
### Expanded vs Compressed
 
**Input `input.scss`:**
```scss
$primary: #2563eb;
 
.btn {
  background: $primary;
  padding: 10px 20px;
  &:hover {
    background: darken($primary, 10%);
  }
}
```
 
**Output `--style=expanded`:**
```css
.btn {
  background: #2563eb;
  padding: 10px 20px;
}
.btn:hover {
  background: #1a4fc4;
}
```
 
**Output `--style=compressed`:**
```css
.btn{background:#2563eb;padding:10px 20px}.btn:hover{background:#1a4fc4}
```
 
### Source Maps
 
```bash
sass --watch input.scss:output.css --source-map
```
 
Genera `output.css.map` — mappa ogni riga del CSS prodotto alla riga SCSS originale.  
Serve al browser DevTools per mostrarti il file SCSS durante il debug, non il CSS compilato.
 
```bash
# Disabilitare in produzione
sass input.scss output.css --no-source-map
```
 
### Partials: cosa compila e cosa no
 
```
scss/
├── _variables.scss   ← partial (underscore) — NON compilato
├── _buttons.scss     ← partial — NON compilato
└── main.scss         ← entry point — compilato → main.css
```
 
Il compilatore **ignora i file con prefisso `_`**. Se rimuovi l'underscore, li tratta come entry point e produce CSS separati — quasi sempre non quello che vuoi.
 
### Errori di compilazione
 
```scss
// Typo: variabile non definita
.btn {
  background: $primaary;
}
```
 
Output nel terminale:
```
Error: Undefined variable.
   ╷
 4 │   background: $primaary;
   │               ^^^^^^^^^^
   ╵
  input.scss 4:15  root stylesheet
```
 
Il compilatore si ferma, indica riga e colonna esatta. In watch mode rimane in ascolto e ricompila appena salvi la correzione.
 
---
 
## 4. Variabili
 
Un valore definito una volta, riutilizzato ovunque. Le variabili SCSS sono risolte a compile-time 

```scss
$color-primary: #2563eb;
$color-text:    #1f2937;
$font-stack:    'Inter', sans-serif;
$spacing-base:  8px;
 
body {
  font-family: $font-stack;
  color: $color-text;
}
 
.btn-primary {
  background-color: $color-primary;
  padding: $spacing-base * 2;
```
 
**CSS prodotto:**
```css
body {
  font-family: "Mono", sans-serif;
  color: #1f2937;
}
.btn-primary {
  background-color: #2563eb;
  padding: 16px;
}
```
 
---
