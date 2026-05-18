# Repo Web Architect

Questo file è l'indice di primo livello del repository. Le regole dettagliate stanno negli `AGENTS.md` locali della cartella più vicina al contenuto che stai modificando.

## Regola di precedenza
- Se esiste un `AGENTS.md` dentro la cartella che stai modificando, segui prima quello.
- Se esistono più `AGENTS.md`, valgono tutti quelli che si trovano lungo il percorso dalla root alla cartella corrente, dal più generale al più specifico.

## Mappa rapida del repo
- `projectRubrica_Giolitti/` → applicazione: rubrica browser-only in ES Modules con Bootstrap, autenticazione multi-account, 
   import/export JSON e persistenza in `localStorage`/`sessionStorage`; per verificare la logica usa `npm test` in `tests/contact-utils.test.mjs`, 
   per la UI apri `index.html` nel browser.
- `projectRubrica/` → esercizio legacy di rubrica personale browser-only con `localStorage`/`sessionStorage` e Bootstrap.
- `HTML/` → lezioni e demo statiche HTML/CSS/JS; include anche `HTML/Lezione7/`, che usa Bootstrap/Leaflet da npm e si avvia localmente con `npm install` + `npm run start`.
- `JAVASCRIPT/` → esercizi e lezioni JavaScript, DOM, OOP e funzioni; sono materiali didattici statici, incluse le varianti `JAVASCRIPT/projectRubrica/` e `JAVASCRIPT/projectTodoList/`.
- `Statement Fondamentali/` → esempi base e pagine introduttive, sempre statiche.
- `RESTFUL/` e `RESTFUL_my/` → materiali di supporto ed esempi dati/JSON per esercizi RESTful, senza backend nel repo.
- `APPUNTI/` → note e documentazione di studio.

## Regole comuni
- Non inventare backend, API o database quando lavori nel repository: il progetto è pensato per browser e file statici.
- Mantieni separazione tra logica, rendering e wiring DOM quando modifichi app strutturate.
- Preserva, quando possibile, label italiane, id DOM e nomenclatura già usata nei progetti didattici.
- Preferisci modifiche piccole e locali alla cartella del progetto interessato, evitando refactor trasversali.
- Ogni volta che cambi file, struttura o comportamento in una cartella, verifica se serve aggiornare anche l'`AGENTS.md` locale più vicino e 
  allineare le regole con la nuova situazione e a cascata i file che ne dipendono o da cui dipendono dove necessario. 
- Dopo modifiche rilevanti, rilegge le istruzioni della cartella interessata per mantenere coerenti le regole operative.

## Dove trovare le istruzioni specifiche
- `projectRubrica_Giolitti/AGENTS.md`
- `HTML/AGENTS.md`
- `HTML/Lezione7/AGENTS.md`
- `JAVASCRIPT/AGENTS.md`
- `Statement Fondamentali/AGENTS.md`
- `RESTFUL/AGENTS.md`
- `RESTFUL_my/AGENTS.md`
- `APPUNTI/AGENTS.md`