# AGENTS.md

## Contesto rapido
- Repository didattico Frontend, senza build system: esempi progressivi in `HTML/`, `JAVASCRIPT/`, `Statement Fondamentali/`, materiali in `APPUNTI/`.
- Struttura per lezione/progetto: cartelle `Lezione*`, `project*`, `Esercitazioni/*` con asset locali (`css/`, `js/`, `img/`).
- Ogni esercizio e' in gran parte indipendente: non esiste un'app unica o moduli condivisi.

## Architettura e flusso (big picture)
- Pattern dominante: `index.html` + file collegati via tag `<link>`/`<script>` relativi (es. `HTML/Lezione4/index.html`).
- JavaScript in stile browser globale (no import/export): funzioni, classi e variabili nel global scope (es. `JAVASCRIPT/Lezione3_OOP/js/script02.js`).
- Flusso tipico UI: query DOM -> listener eventi -> update DOM/array in memoria (es. `JAVASCRIPT/projectTodoList/js/script.js`).
- Validazione form fatta nel client con funzioni dedicate e rendering feedback su `innerHTML` (es. `JAVASCRIPT/Lezione2_Funzioni/js/script05.js`).

## Workflow sviluppo/debug
- Nessun `package.json`, test runner o CI rilevato: usa apertura diretta degli HTML in browser.
- Per sviluppo locale, preferisci Live Server (o equivalente) quando servono percorsi relativi/refresh rapido.
- Debug principale via DevTools browser: Console + Elements; molti esempi stampano con `console.log`.
- Verifica sempre i collegamenti asset relativi quando sposti file (`./css/...`, `./js/...`, `./img/...`).

## Convenzioni specifiche del repo
- Mantieni naming didattico esistente (`Lezione0_Intro`, `Lezione3_OOP`, `projectTodoList`) invece di rinominare in stile enterprise.
- Coerenza lingua: commenti e testi prevalentemente in italiano; mantienila nei nuovi esempi.
- Script inclusi in fondo al `body` per accesso DOM immediato (es. `JAVASCRIPT/Lezione0_Intro/index.html`, `HTML/Lezione4/index.html`).
- Uso frequente di `innerHTML` e template literal per output rapido in pagina (es. `script05.js`, `projectTodoList/js/script.js`).
- Alcuni file sono volutamente vuoti/incompleti come tracce esercizio (`readme.md` vuoti, `test.js` vuoto): non "normalizzare" senza richiesta.

## Integrazioni e dipendenze esterne
- Dipendenze esterne minime via CDN in singoli esempi, non centralizzate.
- Confermato: Font Awesome CDN in `HTML/Lezione4/index.html`.
- Risorse immagine anche da URL remoto (`https://picsum.photos`) in pagine demo.

## Linee guida operative per agenti AI
- Prima di modificare, identifica la lezione target: evita cambi cross-cartella non richiesti.
- Mantieni file self-contained (HTML/CSS/JS locali alla cartella della lezione).
- Se aggiungi JS, allineati allo stile esistente (DOM API vanilla, listener espliciti, niente framework).
- Quando proponi verifiche, usa passaggi browser concreti (aprire file, cliccare bottone, controllare Console/DOM).
- Cita sempre i path reali toccati nel report finale per facilitare la revisione didattica.

