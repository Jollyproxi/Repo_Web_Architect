# MAP

## Purpose

Mappa concettuale-operativa per orientarsi rapidamente tra architettura, flussi e documentazione viva del progetto.

## Navigation

- [CORE.md](CORE.md): architettura, stack e vincoli base.
- [GUIDA.md](GUIDA.md): uso pratico dell'app e workflow.
- [STATE.md](STATE.md): stato corrente, note e TODO.
- [DECISIONS.md](DECISIONS.md): motivazioni delle scelte fatte.
- [MODULES.md](MODULES.md): elenco dei moduli e responsabilità.

## Conceptual map

```text
Auth -> Sessione -> Sync stato -> Render workspace
                     |
                     v
             Contatti filtrati
          /        |         \
      ricerca   preferiti    tag
          \        |         /
               paginazione
                     |
                     v
            card -> modal -> edit/delete
```

## Operational map

1. Bootstrap in `script01.js`.
2. Dati e sessione in `data-manager.js`.
3. Validazione e CRUD in `contact-manager.js`.
4. Filtri e paginazione in `search-filter.js`.
5. Render in `ui-renderer.js`.
6. Wrapper e coordinamento in `app-logic.js`.

## Update rule

- Se cambia il flusso dell'app, aggiorna prima `STATE.md` e poi questa mappa.
