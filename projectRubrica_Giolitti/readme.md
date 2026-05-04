# Rubrica Personale

Applicazione client-side per la gestione di una rubrica personale con supporto multi-account, architettura modulare ES Modules e salvataggio dei dati esclusivamente nel browser.

## Descrizione del progetto

Questo progetto permette di creare più utenti e mantenere rubriche separate per ciascun account. Non è presente alcun backend: tutti i dati vengono salvati in `localStorage` e `sessionStorage`.

Il file principale `js/script01.js` ha il ruolo di orchestratore: inizializza l’applicazione, collega i moduli e registra gli eventi della pagina.

## Funzionalità principali

- **Autenticazione multi-account**: registrazione, login e logout.
- **Gestione account**: cambio password ed eliminazione account.
- **Account amministratore automatico**: se non esistono utenti, viene creato `admin / admin`.
  - L'amministratore ha privilegi speciali per visualizzare e gestire tutti gli account e i contatti.
- **Gestione contatti** con campi per:
  - nome e cognome
  - prefisso internazionale
  - numero di telefono
  - email
  - età opzionale
  - avatar opzionale
  - tag
  - preferiti
- **Selezione prefisso internazionale** con ricerca rapida e bandiere.
- **Avatar** tramite upload file, URL oppure placeholder con iniziale.
- **Controllo duplicati** su email normalizzata e numero internazionale.
- **Ricerca e filtri**:
  - ricerca globale
  - filtro preferiti
  - filtro per tag
  - paginazione
- **Tema chiaro/scuro** salvato nel browser.
- **Import/export JSON** dei contatti.
- **Persistenza locale** senza server esterno.
- **Dettaglio contatto**: click sulla card per visualizzare i dati completi.

## Struttura del progetto

I file JavaScript sono stati separati per responsabilità:

- `js/data-manager.js` → caricamento, salvataggio, normalizzazione e sessione
- `js/auth-manager.js` → login, logout e gestione account
- `js/contact-manager.js` → CRUD dei contatti e gestione del form
- `js/country-selector.js` → prefissi internazionali e bandiere
- `js/search-filter.js` → ricerca, tag, preferiti e paginazione
- `js/ui-renderer.js` → rendering dell’interfaccia
- `js/import-export.js` → importazione ed esportazione JSON
- `js/theme-manager.js` → gestione del tema grafico
- `js/script01.js` → bootstrap dell’applicazione e collegamento degli eventi

## Struttura dei dati

I dati principali vengono salvati con la seguente struttura:

```json
{
  "users": [
    {
      "id": "...",
      "username": "admin",
      "password": "admin",
      "isAdmin": true,
      "contacts": [
        {
          "id": "...",
          "fullName": "Mario Rossi",
          "countryCode": "+39",
          "countryIso": "it",
          "countryName": "Italy",
          "phoneLocal": "3331234567",
          "phoneInternational": "+393331234567",
          "email": "mario@example.com",
          "age": null,
          "avatar": "",
          "avatarMode": "placeholder",
          "placeholderInitial": "M",
          "tags": ["work"],
          "isFavorite": false
        }
      ]
    }
  ]
}
```


## Installazione e test

```bash
npm install
npm test
```

## Avvio dell’applicazione

Aprire direttamente `index.html` nel browser. Non è necessario avviare un server.

## Verifica funzionale

Il progetto include un test automatico essenziale in `tests/contact-utils.test.mjs`, che controlla:

- normalizzazione di email, prefisso e numero di telefono
- costruzione del numero internazionale
- iniziale per l’avatar placeholder
- rilevamento dei contatti duplicati
- risoluzione della sorgente avatar

Per eseguire il test:

```bash
npm test
```

## Note finali

L’applicazione è stata sviluppata con l’obiettivo di:

- mantenere il codice ordinato e leggibile;
- separare chiaramente logica, interfaccia e persistenza;
- rendere il progetto facilmente estendibile;
- evitare dipendenze da backend esterni.
