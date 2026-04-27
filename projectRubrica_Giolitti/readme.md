# Rubrica personale (LocalStorage + Bootstrap)

Applicazione web per gestire contatti personali con persistenza su `localStorage`.

## Funzionalita

- Form con campi: nome/cognome, prefisso internazionale, numero locale, email
- Campo opzionale **Età** per ogni contatto
- Tendina prefisso custom Bootstrap con tutti i paesi + bandierina SVG locale (pacchetti `country-codes-flags-phone-codes` e `flag-icons`)
- Ricerca live nella tendina prefissi (filtro per nome paese e codice telefonico)
- Avatar opzionale con 3 modalita: URL immagine, upload file convertito in base64, placeholder automatico
- Toggle tra vista form (`Aggiungi Contatto`) e vista lista (`Mostra Rubrica`)
- Blocco doppioni basato su telefono internazionale normalizzato o email normalizzata
- **Vista rubrica come card** (layout grid responsive)
- **Paginazione** (6 contatti per pagina)
- **Ricerca globale** (Nome, Email, Telefono, Età)
- **Toggle Dark/Light Mode** con sprite sole (☀️) / luna (🌙) in navbar
- CRUD completo: aggiunta, modifica, eliminazione contatti
- Avvisi utente tramite alert Bootstrap
- Salvataggio e ricarica automatica contatti da `localStorage`

## Installazione

```bash
npm install
```

## Avvio locale

```bash
npm start
```

## Test rapido logica (normalizzazione e doppioni)

```bash
npm test
```
