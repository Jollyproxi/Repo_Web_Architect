# taskflow-api

## Ambito
Backend Express per l'applicazione TaskFlow. API REST completa con CRUD, validazione, paginazione, filtri, ordinamento, caching ETag e autenticazione JWT.

## Regole operative
- Il server gira su `http://localhost:3000` (configurabile via `PORT` env).
- Il "database" è in memoria (`data/tasks.js`): i dati si reset ad ogni riavvio.
- Le route di lettura (`GET`) sono pubbliche; le route di scrittura richiedono un JWT valido.
- Solo gli utenti con ruolo `admin` possono eliminare task.
- La validazione usa JSON Schema con ajv: non introdurre controlli manuali nei controller.
- I nomi dei campi sono in italiano (`titolo`, `descrizione`, `stato`, `priorita`).

## Comandi utili
```bash
npm install          # installa dipendenze
npm run dev          # avvia con nodemon (hot reload)
npm start            # avvia in produzione
```

## Verifica tipica
1. `npm run dev` → server avviato senza errori
2. `GET /health` → `200 {"status":"ok"}`
3. `GET /api/v1/tasks` → `200` con array paginato
4. `POST /auth/login` con credenziali corrette → `200` con token
5. `POST /api/v1/tasks` con token → `201`
6. `DELETE /api/v1/tasks/:id` con token admin → `204`

## Indice AGENTS.md
- `../AGENTS.md` — regole generali RESTFUL_my
