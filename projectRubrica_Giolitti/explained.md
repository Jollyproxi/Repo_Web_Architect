# Rubrica Personale - Quick Reference (Current State)

Riferimento rapido allineato al codice attuale.

## What this app is

Rubrica client-side (solo browser) con UI Bootstrap, moduli ES, multi-account e persistenza locale (`localStorage` + `sessionStorage`). Nessun backend.

## Main files

- [index.html](index.html): struttura UI (auth, shell app, modali, form, lista, toast undo).
- [js/script01.js](js/script01.js): orchestratore, bootstrap, binding eventi DOM.
- [js/app-logic.js](js/app-logic.js): coordinamento applicativo (render/search/save/auth wrappers/modal).
- [js/data-manager.js](js/data-manager.js): normalizzazione dati, sessione, persistenza, regole admin/non-admin.
- [js/contact-manager.js](js/contact-manager.js): validazione contatto, deduplica, CRUD state.
- [js/search-filter.js](js/search-filter.js): ricerca, filtri tag/preferiti, paginazione.
- [js/ui-renderer.js](js/ui-renderer.js): rendering card/paginazione/hint/alert/view-state.
- [js/auth-manager.js](js/auth-manager.js): login/register/logout/change password/delete account.
- [js/country-selector.js](js/country-selector.js): selezione prefisso + bandiera + type-to-select.
- [js/import-export.js](js/import-export.js): export/import JSON.
- [js/theme-manager.js](js/theme-manager.js): tema chiaro/scuro persistito.
- [js/dom-refs.js](js/dom-refs.js): riferimenti DOM centralizzati.

## Storage keys

- `rubrica-giolitti-app-data` (`localStorage`): database utenti + contatti.
- `rubrica-giolitti-session` (`sessionStorage`): sessione con `loggedInUserId` e `userId`.
- `rubrica-theme` (`localStorage`): preferenza tema.
- `lastDeleted` (`sessionStorage`): backup temporaneo per undo eliminazione contatto.

## Data shape (current)

```js
{
  users: [
    {
      id,
      username,       // normalized lowercase
      password,
      isAdmin,        // true solo per superuser
      contacts: [
        {
          id,
          fullName,
          countryCode,
          countryIso,
          countryName,
          phoneLocal,
          phoneInternational,
          email,
          age,
          avatar,
          avatarMode,          // "file" | "url" | "placeholder"
          placeholderInitial,
          createdBy,           // username owner/logged user at create time
          isFavorite,
          tags                 // normalized lowercase unique array
        }
      ]
    }
  ]
}
```

Session object:

```js
{ loggedInUserId: string, userId: string }
```

## Runtime flow (`js/script01.js` + `js/app-logic.js`)

1. Carica `appData` e seed `admin/admin` se non esistono utenti.
2. Carica `sessionState` e risolve utente attivo.
3. Se autenticato: sincronizza `contactState.contacts`, render workspace, mostra lista, applica ricerca/render.
4. Se non autenticato: mostra auth view + hint.
5. Event listeners delegano ai wrapper in `js/app-logic.js`.
6. Submit contatto: validazione + normalizzazione + deduplica (email/telefono internazionale).
7. Salvataggio via `saveContactsForCurrentUser()` con logica diversa admin/non-admin.
8. Dopo mutazioni: reset paging/search secondo caso e rerender completo.

## Admin behavior (important)

- `admin/admin` viene creato automaticamente solo a DB vuoto.
- Utente normale: vede/salva solo `activeUser.contacts`.
- Admin: vede contatti di tutti gli utenti (`flatMap`).
- Quando admin salva, i contatti vengono redistribuiti sugli account in base a `createdBy`; fallback all'admin se owner non trovato.

## Search/filter behavior

- Query globale su `fullName`, `email`, `phoneInternational`, `age`.
- Filtro preferiti (`showFavoritesOnly`).
- Filtro tag con selezione multipla OR (`some`).
- Paginazione a 6 contatti per pagina.
- Render sempre da `searchState.filteredContacts`.

## UI behavior highlights

- Click su card apre modal dettaglio (`#contactModal`).
- Pulsanti nel modal: modifica/elimina contatto corrente.
- Delete mostra toast undo (`#undoToast`) con finestra temporale (delay bootstrap 5s).
- Theme toggle persiste su `rubrica-theme`.
- Country selector custom con icone bandiere SVG e fallback emoji.
- Import JSON sostituisce i contatti correnti dell'utente attivo dopo conferma.

## Tests

- Script disponibile: `npm test`.
- File test: [tests/contact-utils.test.mjs](tests/contact-utils.test.mjs).
- Copertura attuale: utility pure (`normalize*`, `buildInternationalPhone`, `resolveAvatarSource`, `isDuplicateContact`).
- Verifica eseguita: `npm test` OK in data 2026-05-04 (`Test contatti: OK`).

## Known constraints

- Nessuna sincronizzazione cloud/backend.
- Dati legati a browser + origin.
- Password in chiaro nel browser (scelta didattica).
- Import/export agisce sui contatti dell'utente attivo.

## Quick troubleshooting

**Se la lista non si aggiorna dopo create/edit/delete:**

1. Verifica che venga chiamato `applySearchAndRender()` dopo il save/mutate in [js/app-logic.js](js/app-logic.js).
2. Verifica la coerenza tra campi form in [index.html](index.html) e lettura `FormData` in [js/contact-manager.js](js/contact-manager.js).
3. Verifica che `syncStateFromUser()` venga chiamato correttamente dopo login/bootstrap.

**Se admin vede dati incoerenti dopo salvataggio:**

1. Controlla `createdBy` su ogni contatto.
2. Controlla la redistribuzione in `saveContactsForCurrentUser()` in [js/data-manager.js](js/data-manager.js).

**Se import fallisce:**

1. Il JSON deve contenere `contacts` come array.
2. Controlla eventuali errori parse mostrati in alert.



