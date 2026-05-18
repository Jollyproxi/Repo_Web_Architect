# projectRubrica_Giolitti

## Ambito
- Applicazione browser-only in ES Modules per la rubrica personale.
- Nessun backend: persistenza solo in `localStorage` e `sessionStorage`.

## Architettura da preservare
- `js/script01.js` avvia l'app e collega gli eventi.
- `js/app-logic.js` traduce gli eventi UI in azioni di dominio.
- `js/data-manager.js` gestisce persistenza, sessione e normalizzazione.
- `js/contact-utils.js` contiene helper puri; mantienili senza effetti collaterali quando possibile.
- `js/dom-refs.js` centralizza le query DOM: estendilo invece di aggiungere query sparse.

## Regole operative
- Mantieni separati mutazioni, rendering e wiring DOM.
- Preserva label italiane, id HTML e convenzioni già presenti.
- Se cambi normalizzazione, deduplicazione o logica contatti, aggiorna anche `tests/contact-utils.test.mjs`.
- Se modifichi markup o nomi dei campi, verifica anche i riferimenti nei moduli JS collegati.

## Comandi utili
```bash
npm test
```

## Verifica
- Il test coperto dal repository è `tests/contact-utils.test.mjs`.
- Apri `index.html` nel browser per verifiche manuali dell'interfaccia.
