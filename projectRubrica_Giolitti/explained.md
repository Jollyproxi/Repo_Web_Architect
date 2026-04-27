# Explained - Rubrica Personale

Questo documento spiega nel dettaglio il funzionamento interno dell'app `projectRubrica_Giolitti`.

## 1) Obiettivo dell'app

L'applicazione e una rubrica personale lato client (front-end puro) che permette di:

- inserire contatti con nome, telefono, email, eta e avatar;
- scegliere il prefisso internazionale da una tendina con bandiere;
- evitare duplicati (email o telefono internazionale);
- visualizzare i contatti in card con paginazione;
- cercare rapidamente i contatti;
- modificare/eliminare contatti;
- salvare tutto in `localStorage`;
- usare tema chiaro/scuro ad alto contrasto.

## 2) File principali

- `index.html`: struttura UI (navbar, form, lista card, paginazione, dropdown prefissi).
- `css/style.css`: stile custom e tema scuro ad alto contrasto.
- `js/script01.js`: tutta la logica applicativa (file unico JS).
- `tests/contact-utils.test.mjs`: test della logica utility (normalizzazione e deduplica).

## 3) Architettura generale

L'app usa un approccio "single-page" senza framework:

- **HTML** fornisce i contenitori e i controlli;
- **JavaScript** gestisce stato, eventi, rendering e persistenza;
- **CSS** applica look & feel, inclusa modalita high-contrast dark.

Non c'e backend: i dati restano nel browser tramite `localStorage`.

## 4) Stato applicazione (in `script01.js`)

### 4.1 Stato contatti

```js
const state = {
  contacts: loadContacts(),
  editingContactId: null
};
```

- `contacts`: array dei contatti caricati da storage.
- `editingContactId`: id del contatto in modifica (o `null` in inserimento).

### 4.2 Stato ricerca/paginazione

```js
const searchState = {
  searchQuery: "",
  currentPage: 1,
  filteredContacts: []
};
```

- `searchQuery`: testo filtro globale.
- `currentPage`: pagina visualizzata.
- `filteredContacts`: risultato della ricerca globale.

### 4.3 Stato nazione selezionata

- `countryOptions`: dataset completo paesi/prefissi pronto per UI.
- `countryByDialCode`: mappa di fallback per prefisso.
- `selectedCountry`: paese attualmente selezionato (importante per prefissi condivisi, es. `+1`).

## 5) Modello dati contatto

Ogni contatto salva (in sintesi):

- `id`
- `fullName`
- `countryCode` (es. `+39`)
- `countryIso` (es. `it`)
- `countryName` (es. `Italy`)
- `phoneLocal`
- `phoneInternational`
- `email`
- `age`
- `avatar`
- `avatarMode` (`file | url | placeholder`)
- `placeholderInitial`

## 6) Flusso di inizializzazione

All'avvio (`script01.js`):

1. collega tutti gli event listener;
2. inizializza tema (`initTheme`);
3. popola tendina prefissi (`populateCountryCodeOptions`);
4. aggiorna testo preview avatar (`updateAvatarPreviewText`);
5. inizializza lista filtrata con tutti i contatti;
6. renderizza la prima pagina (`renderContactsPage`).

## 7) Gestione prefissi e paesi

### 7.1 Popolamento dropdown

`populateCountryCodeOptions()`:

- legge i paesi da `countries`;
- ordina alfabeticamente;
- costruisce `countryOptions` con metadati utili alla ricerca;
- popola il campo hidden `countryCode`;
- imposta default Italia (`+39`, `it`).

### 7.2 Ricerca live nella tendina

`handleCountrySearch()` filtra `countryOptions` per:

- nome paese;
- prefisso con e senza `+`.

### 7.3 Gestione prefissi condivisi (fix importante)

`setCountryDialCode(dialCode, iso2)` + `getCountryOptionBySelection(...)` risolvono i casi in cui lo stesso prefisso e condiviso da piu nazioni:

- la selezione usa **prefisso + ISO**;
- vengono salvati anche `countryIso` e `countryName`;
- in edit/reload viene ripristinata la nazione corretta.

## 8) Inserimento e modifica contatto

`handleSubmit(event)`:

1. legge i campi form;
2. valida obbligatori (`fullName`, `countryCode`, `phoneLocal`, `email`);
3. normalizza dati (`normalizeCountryCode`, `normalizeLocalPhone`, `normalizeEmail`);
4. blocca duplicati (`isDuplicateContact`);
5. risolve avatar (`resolveAvatarSource`);
6. costruisce `contactPayload`;
7. crea o aggiorna contatto in `state.contacts`;
8. salva in `localStorage`;
9. resetta form e aggiorna lista.

### 8.1 Deduplica

`isDuplicateContact(...)` considera duplicato se coincide:

- email normalizzata, oppure
- telefono internazionale normalizzato.

In modifica usa `ignoreId` per non auto-bloccarsi.

## 9) Avatar: priorita sorgente

`resolveAvatarSource(...)` usa questa priorita:

1. file upload (base64);
2. URL valida `http/https`;
3. placeholder con iniziale.

`updateAvatarPreviewText(...)` informa sempre l'utente su quale sorgente e attiva.

## 10) Ricerca globale e paginazione

### 10.1 Ricerca globale

`applySearch()` filtra i contatti su:

- nome
- email
- telefono internazionale
- eta

### 10.2 Paginazione

- costante `CONTACTS_PER_PAGE = 6`;
- `renderContactsPage()` renderizza solo la pagina corrente;
- `renderPagination(totalPages, currentPage)` crea i controlli prev/next + numeri pagina.

## 11) Rendering lista come card

`renderContactsPage()` crea card Bootstrap dinamiche con:

- avatar (immagine o placeholder);
- nome;
- email/telefono/eta;
- pulsanti azione `Modifica` / `Elimina`.

Gli eventi dei pulsanti sono gestiti con delegation in `handleListActions(event)`.

## 12) Tema chiaro/scuro

- `initTheme()` legge da `localStorage` (`THEME_KEY`);
- `applyTheme(theme)` applica classi/attributi e icona toggle;
- `toggleTheme()` alterna `light <-> dark`.

Il CSS in `style.css` definisce una variante dark high-contrast ispirata a VS Code (topbar/searchbar/input/toggle).

## 13) Persistenza dati

- Chiave contatti: `rubrica-giolitti-contacts`
- Chiave tema: `rubrica-theme`

`loadContacts()` gestisce anche dati legacy (campi vecchi/non presenti) con fallback robusti.

## 14) Eventi principali mappati

- Form submit: `handleSubmit`
- Toggle viste: `showFormView`, `showListView`
- Azioni card: `handleListActions`
- Ricerca globale: `handleGlobalSearch`
- Tema: `toggleTheme`
- Dropdown prefissi: `handleCountrySelection`, `handleCountrySearch`

## 15) Styling custom (estratto)

`style.css` include:

- topbar/searchbar custom;
- tema dark high-contrast;
- hover card;
- avatar/placeholder;
- dropdown prefissi con header sticky e bandierine.

## 16) Test

Test disponibili:

- `tests/contact-utils.test.mjs`

Coprono in particolare:

- normalizzazione email/telefono/prefisso;
- gestione avatar mode;
- deduplica contatti (incluso caso edit con `ignoreId`).

Esecuzione:

```bash
npm test
```

## 17) Limiti noti / possibili miglioramenti

- i dati restano locali al browser/dispositivo;
- nessuna autenticazione o sync cloud;
- nessuna validazione server-side;
- migliorabile il supporto tastiera nella tendina paesi (eventuale step successivo).

## 18) Conclusione

L'app e progettata per essere didattica ma completa: file JS unico, stato chiaro, rendering dinamico, persistenza locale, UX moderna (ricerca + paginazione + tema), e logica robusta su normalizzazione/deduplica/gestione prefissi condivisi.

