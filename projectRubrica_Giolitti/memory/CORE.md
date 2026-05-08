
# CORE

## Scope

Rubrica client-side ES modules con Bootstrap e persistenza browser-only.

## Architecture

- Bootstrap e orchestrazione in [js/script01.js](../js/script01.js).
- Logica applicativa in [js/app-logic.js](../js/app-logic.js).
- Persistenza e sessione in [js/data-manager.js](../js/data-manager.js).
- CRUD contatti in [js/contact-manager.js](../js/contact-manager.js).
- Ricerca e filtri in [js/search-filter.js](../js/search-filter.js).
- Rendering UI in [js/ui-renderer.js](../js/ui-renderer.js).

## Storage

- `rubrica-giolitti-app-data` in `localStorage` per utenti e contatti.
- `rubrica-giolitti-session` in `sessionStorage` per l'utente autenticato.
- `rubrica-theme` in `localStorage` per il tema.
- `lastDeleted` in `sessionStorage` per undo delete.

## Core rules

- Nessun backend.
- Nessuna sincronizzazione cloud.
- Admin legge e salva i contatti di tutti gli account.
- Gli utenti normali lavorano solo sui propri contatti.
- Il rendering parte dallo stato filtrato, non dal dataset grezzo.
