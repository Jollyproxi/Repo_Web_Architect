# Repo Web Architect

Questo file è l'indice di primo livello del repository. Le regole dettagliate stanno negli `AGENTS.md` locali della cartella più vicina al contenuto che stai modificando.

## Regola di precedenza
- Se esiste un `AGENTS.md` dentro la cartella che stai modificando, segui prima quello.
- Se esistono più `AGENTS.md`, valgono tutti quelli che si trovano lungo il percorso dalla root alla cartella corrente, dal più generale al più specifico.

## Mappa rapida del repo
- `projectRubrica_Giolitti/` → applicazione principale: rubrica client-side in ES Modules con Bootstrap e persistenza in `localStorage`/`sessionStorage`.
- `projectBeatles/` → progetto stedativo: landing page dei Beatles con pagine dedicate ai membri e discografia, SCSS e fetch da MusicBrainz/AudioDB.
- `REACT_my/` → progetti didattici React con Vite: `project_1` (componenti base), `project_2` (card con children), `project_3` (array + map + filtering).
- `HTML/` → lezioni e demo statiche HTML/CSS/JS;
- `JAVASCRIPT/` → esercizi e lezioni JavaScript, DOM, OOP e funzioni; sono materiali didattici statici.
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

 - Ogni sottocartella DEVE includere un file `AGENTS.md` che faccia da documentazione operativa e da indice per eventuali `AGENTS.md` più specifici al suo interno. Quando modifichi o aggiungi contenuto in una cartella:
   - crea/aggiorna `AGENTS.md` locale che elenchi i file chiave (es. `index.html`, `package.json`, `scss/`, `js/`, `tests/`) e i comandi utili locali (`npm install`, `npm run start`, `npm test` se presenti);
   - mantieni un breve riepilogo delle convenzioni locali (nomenclatura id/classi importanti, partial SCSS condivisi, entrypoint JS come `js/script01.js`);
   - fai in modo che il `AGENTS.md` locale sia sia le istruzioni operative per un agente sia un indice navigabile per i file `AGENTS.md` più profondi.

  - Struttura minima suggerita per ogni `AGENTS.md` locale (usa questi header e fornisci riferimenti concreti):
    - `# <Cartella>` (titolo)
    - `## Ambito` — cosa contiene la cartella (es. demo, progetto, dataset)
    - `## Regole operative` — regole specifiche da rispettare (es. non introdurre backend, id/html da preservare)
    - `## Comandi utili` — comandi locali di build/avvio/test con esempi (es. `npm install`, `npm run start`)
    - `## Verifica tipica` — come verificare le modifiche (file da aprire, test da eseguire)
    - `## Indice AGENTS.md` — elenco dei `AGENTS.md` più specifici contenuti nella cartella (se presenti)

  - **Regola di lettura per gli agenti (REGOLA FISSA):** prima di procedere con qualsiasi task, leggi **SEMPRE TUTTI** gli `AGENTS.md` delle cartelle coinvolte:
    - leggi prima il `AGENTS.md` di root;
    - poi leggi TUTTI gli `AGENTS.md` lungo il percorso dal root alla cartella target;
    - assicurati di avere il quadro completo delle regole operative prima di procedere.

## Dove trovare le istruzioni specifiche
- `projectRubrica_Giolitti/AGENTS.md`
- `projectBeatles/AGENTS.md`
- `REACT_my/AGENTS.md` → `project_1/AGENTS.md`, `project_2/AGENTS.md`, `project_3/AGENTS.md`
- `HTML/AGENTS.md`
- `JAVASCRIPT/AGENTS.md`
- `Statement Fondamentali/AGENTS.md`
- `RESTFUL/AGENTS.md`
- `RESTFUL_my/AGENTS.md`
- `APPUNTI/AGENTS.md`