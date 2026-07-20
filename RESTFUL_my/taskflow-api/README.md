# TaskFlow API

API REST completa per il gestore di attività "TaskFlow". Progetto didattico che copre CRUD, validazione JSON Schema, paginazione, filtri, ordinamento, caching ETag e autenticazione JWT.

## Avvio

```bash
# Installa le dipendenze
npm install

# Avvia in sviluppo (con auto-reload)
npm run dev

# Avvia in produzione
npm start
```

Il server parte su `http://localhost:3000`.

## Endpoint

| Metodo | URL | Auth | Descrizione |
|--------|-----|------|-------------|
| GET | `/health` | — | Health check |
| GET | `/api/v1/tasks` | — | Lista task (paginata, filtrabile, ordinabile) |
| GET | `/api/v1/tasks/:id` | — | Singola task (con ETag) |
| POST | `/api/v1/tasks` | JWT | Crea task |
| PUT | `/api/v1/tasks/:id` | JWT | Sostituisci task |
| PATCH | `/api/v1/tasks/:id` | JWT | Aggiorna task (parziale) |
| DELETE | `/api/v1/tasks/:id` | JWT (admin) | Elimina task |
| POST | `/api/v1/auth/login` | — | Login e generazione token |

## Query params per GET /tasks

- `page` — numero pagina (default: 1)
- `limit` — elementi per pagina (default: 10, max: 100)
- `stato` — filtro per stato (`da_fare`, `in_corso`, `completata`)
- `priorita` — filtro per priorità (`bassa`, `media`, `alta`)
- `sort` — campo ordinamento (`titolo`, `stato`, `priorita`, `creata`)
- `order` — direzione (`asc` default, `desc`)

## Credenziali demo

| Email | Password | Ruolo |
|-------|----------|-------|
| admin@taskflow.it | admin123 | admin |
| user@taskflow.it | user123 | user |

## Struttura

```
taskflow-api/
├── index.js              ← entry point
├── app.js                ← Express setup
├── routes/               ← router Express
├── controllers/          ← logica applicativa
├── middleware/            ← logger, validazione, auth
├── schemas/              ← JSON Schema (ajv)
├── utils/                ← classi di errore
└── data/                 ← "database" in memoria
```
