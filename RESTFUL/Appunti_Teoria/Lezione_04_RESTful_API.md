# RESTful API — Lezione 04
## Codici di risposta HTTP

| | |
|---|---|
| **Durata** | ~3 ore (2h teoria + 1h laboratorio) |
| **Modulo** | 04 / 13 |
| **Livello** | Intermedio |
| **Stack** | JavaScript / Node.js / Express |

---

## 1. Obiettivi della lezione

Al termine di questa lezione lo studente sarà in grado di:

- Riconoscere e usare correttamente i codici di risposta HTTP più comuni
- Distinguere le famiglie 2xx, 3xx, 4xx, 5xx e sapere quando appartiene una risposta a ciascuna
- Identificare gli errori semantici più frequenti nell'uso dei codici (es. `200` su un errore)
- Progettare un formato di risposta di errore JSON coerente e strutturato
- Implementare in Express un error handler centralizzato riutilizzabile

---

## 2. Cos'è un codice di risposta HTTP

Ogni risposta HTTP inizia con un codice a tre cifre che comunica al client l'esito della richiesta. Non è un dettaglio implementativo: è parte del contratto dell'API. Un client ben progettato prende decisioni in base al codice di risposta — decide se fare retry, se mostrare un errore all'utente, se aggiornare la cache.

La prima cifra identifica la famiglia:

| Famiglia | Significato | Azione tipica del client |
|---|---|---|
| `1xx` | Informational — richiesta ricevuta, elaborazione in corso | Raro nelle API REST moderne |
| `2xx` | Success — richiesta ricevuta, compresa, accettata | Processa i dati della risposta |
| `3xx` | Redirection — il client deve fare un'altra richiesta | Segui il redirect |
| `4xx` | Client Error — la richiesta contiene un errore | Mostra errore all'utente, non fare retry automatico |
| `5xx` | Server Error — il server non è riuscito a soddisfare la richiesta | Retry dopo un intervallo, segnala il problema |

> 📘 **Nota** — La distinzione tra 4xx e 5xx è fondamentale: `4xx` significa che il problema è nel client (richiesta sbagliata), `5xx` significa che il problema è nel server (colpa nostra). Un client non deve fare retry su un `400` — la stessa richiesta sbagliata darà sempre lo stesso errore. Può invece fare retry su un `503`.

---

## 3. Famiglia 2xx — Successo

### 3.1 200 OK

Il codice di risposta più generico per il successo. Usato quando la richiesta è stata completata e c'è un body da restituire.

**Quando usarlo:** GET riuscito, PUT riuscito, PATCH riuscito.

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "nome": "Mario Rossi",
  "email": "mario@esempio.com"
}
```

### 3.2 201 Created

La richiesta è stata completata e ha prodotto la creazione di una nuova risorsa. Deve includere l'header `Location` con l'URL della risorsa creata.

**Quando usarlo:** POST riuscito che crea una risorsa.

```http
HTTP/1.1 201 Created
Location: /api/v1/users/43
Content-Type: application/json

{
  "id": 43,
  "nome": "Luca Verdi",
  "email": "luca@esempio.com"
}
```

> ⚠️ **Errore frequente** — Rispondere `200 OK` a una POST che crea una risorsa. Il codice corretto è `201 Created`. Il client (e i tool automatici) distinguono tra i due: `201` dice esplicitamente "qualcosa è stato creato".

### 3.3 204 No Content

La richiesta è andata a buon fine ma non c'è nulla da restituire nel body. Il body deve essere vuoto.

**Quando usarlo:** DELETE riuscito, PATCH/PUT riuscito quando si sceglie di non restituire la risorsa aggiornata.

```http
HTTP/1.1 204 No Content
```

```javascript
// Express — risposta 204 corretta
res.status(204).send(); // oppure res.sendStatus(204)

// SBAGLIATO — non si mette un body su un 204
res.status(204).json({ message: 'eliminato' }); // il body viene ignorato dal client
```

### 3.4 202 Accepted

La richiesta è stata accettata per l'elaborazione, ma l'elaborazione non è ancora completata. Usato per operazioni asincrone (es. invio email, elaborazione batch).

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "jobId": "abc-123",
  "status": "pending",
  "statusUrl": "/api/v1/jobs/abc-123"
}
```

### 3.5 Riepilogo 2xx

| Codice | Nome | Usa per |
|---|---|---|
| `200` | OK | GET, PUT, PATCH riusciti con body |
| `201` | Created | POST che crea una risorsa |
| `202` | Accepted | Operazioni asincrone avviate |
| `204` | No Content | DELETE, o PUT/PATCH senza body di risposta |

---

## 4. Famiglia 3xx — Redirect

Nelle API REST i redirect sono rari, ma esistono casi d'uso legittimi.

### 4.1 301 Moved Permanently

La risorsa è stata spostata definitivamente al nuovo URL indicato nell'header `Location`. I client (e i motori di ricerca) devono aggiornare i loro link.

```http
HTTP/1.1 301 Moved Permanently
Location: /api/v2/users/42
```

### 4.2 302 Found (Temporary Redirect)

La risorsa è temporaneamente disponibile a un URL diverso. Il client deve continuare a usare l'URL originale per le richieste future.

### 4.3 304 Not Modified

Il client ha inviato una richiesta condizionale (con `If-None-Match` o `If-Modified-Since`) e la risorsa non è cambiata. Il client può usare la copia in cache. Nessun body.

```http
HTTP/1.1 304 Not Modified
ETag: "33a64df5"
```

> 📘 **Nota** — Il `304` è il meccanismo principale del caching HTTP. Il client chiede "è cambiato dall'ultima volta che l'ho scaricato?" e il server risponde sì o no senza riscaricare i dati. Lo vedremo in dettaglio nella Lezione 06.

---

## 5. Famiglia 4xx — Errori del client

Questa è la famiglia più articolata e quella in cui si concentrano gli errori di progettazione più frequenti.

### 5.1 400 Bad Request

La richiesta è sintatticamente o semanticamente invalida. Il server non può o non vuole processarla così com'è.

**Quando usarlo:** JSON malformato nel body, parametri con tipo sbagliato, valori fuori range, campi obbligatori mancanti.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Richiesta non valida",
  "dettaglio": "Il campo 'prezzo' deve essere un numero positivo"
}
```

### 5.2 401 Unauthorized

Il client non è autenticato. La richiesta richiede credenziali valide che non sono state fornite (o sono scadute).

Il nome è fuorviante: tecnicamente dovrebbe chiamarsi "Unauthenticated". Significa "non so chi sei".

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="api"
Content-Type: application/json

{
  "error": "Autenticazione richiesta"
}
```

### 5.3 403 Forbidden

Il client è autenticato (so chi sei) ma non ha i permessi per accedere alla risorsa richiesta (non puoi farlo).

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Accesso negato",
  "dettaglio": "Solo gli amministratori possono eliminare gli utenti"
}
```

> 📘 **Nota — 401 vs 403:**
> - `401` → Non sei autenticato. Soluzione: fai login e riprova.
> - `403` → Sei autenticato, ma non hai i permessi. Soluzione: chiedi i permessi a un admin.

### 5.4 404 Not Found

La risorsa identificata dall'URL non esiste.

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Utente non trovato",
  "id": 99
}
```

> ⚠️ **Errore frequente** — Usare `404` come risposta generica per qualsiasi errore non gestito. Il `404` deve significare solo che la risorsa non esiste. Un errore di validazione è un `400`, non un `404`.

### 5.5 405 Method Not Allowed

Il metodo HTTP usato non è supportato per quell'URL. La risposta deve includere l'header `Allow` con i metodi consentiti.

```http
HTTP/1.1 405 Method Not Allowed
Allow: GET, POST
Content-Type: application/json

{
  "error": "Metodo non consentito",
  "metodi_consentiti": ["GET", "POST"]
}
```

### 5.6 409 Conflict

La richiesta non può essere completata a causa di un conflitto con lo stato attuale della risorsa. Tipicamente usato per duplicati.

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": "Conflitto",
  "dettaglio": "Email 'mario@esempio.com' già registrata"
}
```

### 5.7 422 Unprocessable Entity

La sintassi della richiesta è corretta (JSON valido, tipo giusto), ma il contenuto non supera la validazione semantica.

La distinzione tra `400` e `422` è sottile e spesso ignorata in pratica, ma la semantica formale è:
- `400` → non riesco nemmeno a leggere la richiesta (JSON malformato, tipo sbagliato)
- `422` → leggo la richiesta, ma i dati non sono validi secondo le regole di business

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": "Validazione fallita",
  "campi": {
    "email": "formato email non valido",
    "età": "deve essere compresa tra 18 e 120"
  }
}
```

### 5.8 429 Too Many Requests

Il client ha inviato troppe richieste in un dato intervallo di tempo (rate limiting).

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{
  "error": "Troppe richieste",
  "retry_after_secondi": 60
}
```

### 5.9 Riepilogo 4xx

| Codice | Nome | Usa per |
|---|---|---|
| `400` | Bad Request | JSON malformato, tipo sbagliato, valore non valido |
| `401` | Unauthorized | Nessuna autenticazione fornita o token scaduto |
| `403` | Forbidden | Autenticato ma senza permessi |
| `404` | Not Found | Risorsa inesistente |
| `405` | Method Not Allowed | Metodo HTTP non supportato per quell'URL |
| `409` | Conflict | Duplicato, conflitto di stato |
| `422` | Unprocessable Entity | Dati semanticamente non validi |
| `429` | Too Many Requests | Rate limit superato |

---

## 6. Famiglia 5xx — Errori del server

### 6.1 500 Internal Server Error

Errore generico del server: qualcosa è andato storto internamente e il server non è in grado di fornire una risposta più specifica.

**Regola d'oro:** non esporre mai dettagli interni (stack trace, query SQL, nomi di file) in una risposta `500` in produzione. Queste informazioni sono preziose per un attaccante.

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Errore interno del server"
}
```

```javascript
// In sviluppo, puoi includere il dettaglio per il debug:
if (process.env.NODE_ENV === 'development') {
  res.status(500).json({ error: err.message, stack: err.stack });
} else {
  res.status(500).json({ error: 'Errore interno del server' });
}
```

### 6.2 502 Bad Gateway

Il server, agendo come gateway o proxy, ha ricevuto una risposta invalida da un server upstream (es. il microservizio chiamato non ha risposto correttamente).

### 6.3 503 Service Unavailable

Il server non è al momento in grado di gestire la richiesta — sovraccarico o manutenzione programmata. Dovrebbe includere l'header `Retry-After`.

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 120
Content-Type: application/json

{
  "error": "Servizio temporaneamente non disponibile",
  "retry_after_secondi": 120
}
```

### 6.4 504 Gateway Timeout

Il server, agendo come gateway, non ha ricevuto una risposta in tempo dal server upstream.

### 6.5 Riepilogo 5xx

| Codice | Nome | Usa per |
|---|---|---|
| `500` | Internal Server Error | Errore generico non gestito |
| `502` | Bad Gateway | Risposta invalida da un upstream |
| `503` | Service Unavailable | Server sovraccarico o in manutenzione |
| `504` | Gateway Timeout | Timeout della risposta da upstream |

---

## 7. Errori semantici comuni

Questi sono i pattern sbagliati più frequenti nelle API REST:

| Pattern sbagliato | Esempio | Codice corretto | Perché |
|---|---|---|---|
| `200` su un errore | `POST /login` risponde `200` con `{"success": false}` | `401` o `400` | Il codice HTTP deve riflettere l'esito, non il body |
| `404` generico | Qualsiasi errore non gestito → `404` | Dipende dall'errore | Il `404` significa solo "risorsa non trovata" |
| `500` per errori di validazione | Input mancante → `500` | `400` o `422` | Un input mancante è colpa del client, non del server |
| `200` per la creazione | `POST` crea una risorsa → `200` | `201` | Il `201` comunica che è stata creata una risorsa nuova |
| `400` per mancanza di permessi | Utente non autorizzato → `400` | `403` | Il `400` riguarda la struttura della richiesta, non i permessi |

---

## 8. Strutturare le risposte di errore

### 8.1 Il problema delle risposte di errore inconsistenti

Un'API che restituisce errori in formati diversi è difficile da consumare:

```json
// Route A
{ "message": "not found" }

// Route B
{ "error": "User not found", "code": 404 }

// Route C
"Internal server error"

// Route D
{ "errors": [{ "field": "email", "msg": "required" }] }
```

Il client deve gestire quattro formati diversi. È un errore di design.

### 8.2 Formato di errore uniforme

Definisci un formato unico per tutti gli errori dell'API e rispettalo senza eccezioni:

```json
{
  "error": "Descrizione leggibile dell'errore",
  "codice": "CODICE_MACCHINA_OPZIONALE",
  "dettaglio": "Informazione aggiuntiva opzionale",
  "campi": {
    "nome_campo": "descrizione dell'errore su quel campo"
  }
}
```

Esempi:

```json
// 400 — campo mancante
{
  "error": "Campi obbligatori mancanti",
  "campi_mancanti": ["email", "nome"]
}

// 401 — token mancante
{
  "error": "Autenticazione richiesta"
}

// 403 — permessi insufficienti
{
  "error": "Accesso negato",
  "dettaglio": "Ruolo 'user' non autorizzato per questa operazione"
}

// 404 — risorsa non trovata
{
  "error": "Utente non trovato",
  "id": 99
}

// 409 — conflitto
{
  "error": "Email già registrata",
  "campo": "email",
  "valore": "mario@esempio.com"
}

// 500 — errore interno (produzione)
{
  "error": "Errore interno del server"
}
```

> ✅ **Best practice** — Il campo `error` deve essere sempre una stringa leggibile da un essere umano. Non usare codici numerici come valore di `error` — per quelli c'è già il codice HTTP.

---

## 9. Error handler centralizzato in Express

### 9.1 Il problema della gestione errori distribuita

Senza un error handler centralizzato, la gestione degli errori è sparsa in ogni controller:

```javascript
// Senza centralizzazione — pattern ripetuto in ogni route
app.get('/users/:id', (req, res) => {
  try {
    const user = getUser(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno' }); // ripetuto ovunque
  }
});
```

### 9.2 Creare un errore con status personalizzato

Il pattern standard è creare oggetti Error con una proprietà `status` aggiuntiva:

```javascript
// utils/errors.js
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

const notFound = (msg)  => new AppError(msg || 'Risorsa non trovata', 404);
const badRequest = (msg) => new AppError(msg || 'Richiesta non valida', 400);
const conflict = (msg)   => new AppError(msg || 'Conflitto', 409);
const forbidden = (msg)  => new AppError(msg || 'Accesso negato', 403);

module.exports = { AppError, notFound, badRequest, conflict, forbidden };
```

### 9.3 Usare next(err) nei controller

Invece di gestire l'errore direttamente, il controller passa l'errore a Express tramite `next(err)`:

```javascript
// controllers/usersController.js
const { notFound, conflict } = require('../utils/errors');

const getOne = (req, res, next) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return next(notFound(`Utente con id ${req.params.id} non trovato`));
  res.status(200).json(user);
};

const create = (req, res, next) => {
  const { nome, email } = req.body;
  const esiste = users.find(u => u.email === email);
  if (esiste) return next(conflict(`Email '${email}' già registrata`));

  const newUser = { id: nextId++, nome, email };
  users.push(newUser);
  res.status(201).header('Location', `/api/v1/users/${newUser.id}`).json(newUser);
};
```

### 9.4 L'error handler in app.js

Express riconosce l'error handler dalla firma a quattro parametri `(err, req, res, next)`. Deve essere registrato dopo tutte le route.

```javascript
// app.js — error handler centralizzato

// ── Catch-all 404 (route non trovata) ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint non trovato',
    path: req.originalUrl,
  });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Logga sempre l'errore internamente
  console.error(`[${new Date().toISOString()}] ${err.status || 500} — ${err.message}`);
  if (!err.status || err.status === 500) {
    console.error(err.stack); // stack trace solo per errori 500
  }

  // In sviluppo: includi dettagli per il debug
  // In produzione: risposta minima, mai stack trace
  const isDev = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: err.message || 'Errore interno del server',
    ...(isDev && err.status === 500 && { stack: err.stack }),
  });
});
```

### 9.5 Gestione degli errori asincroni

In Express 4, gli errori nelle funzioni asincrone (`async/await`) devono essere catturati esplicitamente e passati a `next`:

```javascript
// Senza wrapper — l'errore non arriva all'error handler
app.get('/users', async (req, res) => {
  const users = await db.getAll(); // se lancia, Express non lo cattura
  res.json(users);
});

// Con try/catch — corretto per Express 4
app.get('/users', async (req, res, next) => {
  try {
    const users = await db.getAll();
    res.json(users);
  } catch (err) {
    next(err); // passa l'errore all'error handler
  }
});
```

> 📘 **Nota** — Express 5 (attualmente in release candidate) cattura automaticamente gli errori dalle funzioni async. In Express 4, il try/catch è obbligatorio oppure si usa una libreria come `express-async-errors`.

---

## 10. Implementazione aggiornata

Aggiorniamo il progetto della Lezione 03 con la gestione errori centralizzata.

### 10.1 Aggiungere `utils/errors.js`

```javascript
// utils/errors.js

class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

const notFound  = (msg) => new AppError(msg || 'Risorsa non trovata', 404);
const badReq    = (msg) => new AppError(msg || 'Richiesta non valida', 400);
const conflict  = (msg) => new AppError(msg || 'Conflitto', 409);
const forbidden = (msg) => new AppError(msg || 'Accesso negato', 403);
const unauth    = (msg) => new AppError(msg || 'Autenticazione richiesta', 401);

module.exports = { AppError, notFound, badReq, conflict, forbidden, unauth };
```

### 10.2 Controller aggiornato con next(err)

```javascript
// controllers/usersController.js — versione aggiornata
const { notFound, conflict } = require('../utils/errors');

let users = [
  { id: 1, nome: 'Mario Rossi',    email: 'mario@esempio.com',  ruolo: 'admin' },
  { id: 2, nome: 'Giulia Bianchi', email: 'giulia@esempio.com', ruolo: 'user'  },
];
let nextId = 3;

const getAll = (req, res) => {
  const { ruolo } = req.query;
  const result = ruolo ? users.filter(u => u.ruolo === ruolo) : users;
  res.status(200).json(result);
};

const getOne = (req, res, next) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return next(notFound(`Utente con id ${req.params.id} non trovato`));
  res.status(200).json(user);
};

const create = (req, res, next) => {
  const { nome, email, ruolo = 'user' } = req.body;
  if (users.find(u => u.email === email)) {
    return next(conflict(`Email '${email}' già registrata`));
  }
  const newUser = { id: nextId++, nome, email, ruolo };
  users.push(newUser);
  res.status(201).header('Location', `/api/v1/users/${newUser.id}`).json(newUser);
};

const replace = (req, res, next) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return next(notFound(`Utente con id ${req.params.id} non trovato`));
  const { nome, email, ruolo = 'user' } = req.body;
  const dup = users.find(u => u.email === email && u.id !== users[index].id);
  if (dup) return next(conflict(`Email '${email}' già usata da un altro utente`));
  users[index] = { id: users[index].id, nome, email, ruolo };
  res.status(200).json(users[index]);
};

const update = (req, res, next) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return next(notFound(`Utente con id ${req.params.id} non trovato`));
  ['nome', 'email', 'ruolo'].forEach(c => {
    if (req.body[c] !== undefined) user[c] = req.body[c];
  });
  res.status(200).json(user);
};

const remove = (req, res, next) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return next(notFound(`Utente con id ${req.params.id} non trovato`));
  users.splice(index, 1);
  res.status(204).send();
};

module.exports = { getAll, getOne, create, replace, update, remove };
```

### 10.3 app.js aggiornato

```javascript
// app.js
const express = require('express');
const app = express();

const routes = require('./routes/index');
const { logger } = require('./middleware/logger');

app.use(express.json());
app.use(logger);
app.use('/api/v1', routes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// ── Catch-all 404 ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato', path: req.originalUrl });
});

// ── Error handler centralizzato ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.status || 500} — ${err.message}`);
  if (!err.status || err.status === 500) console.error(err.stack);

  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    error: err.message || 'Errore interno del server',
    ...(isDev && !err.status && { stack: err.stack }),
  });
});

module.exports = app;
```

---

## 11. Laboratorio (~1 ora)

**Obiettivo**: aggiornare il progetto della Lezione 03 con la gestione errori centralizzata e verificare che ogni scenario restituisca il codice HTTP corretto.

---

### Esercizio 1 — Aggiungere utils/errors.js

1. Creare la cartella `utils/` nella root del progetto
2. Creare `utils/errors.js` con il codice della sezione 10.1
3. Aggiornare `controllers/usersController.js` e `controllers/productsController.js` per usare `next(err)` invece di `res.status(...).json(...)` per gli errori

---

### Esercizio 2 — Aggiornare app.js

Sostituire l'error handler esistente con quello della sezione 10.3. Aggiungere anche il catch-all 404 se non già presente.

---

### Esercizio 3 — Verifica dei codici di risposta

Testare in Postman i seguenti scenari e verificare che il codice HTTP ricevuto corrisponda a quello atteso:

| # | Richiesta | Codice atteso | Motivo |
|---|---|---|---|
| 1 | `GET /api/v1/users` | 200 | Lista restituita correttamente |
| 2 | `GET /api/v1/users/1` | 200 | Utente trovato |
| 3 | `GET /api/v1/users/999` | 404 | Utente inesistente |
| 4 | `POST /api/v1/users` body completo | 201 | Utente creato |
| 5 | `POST /api/v1/users` senza email | 400 | Campo obbligatorio mancante |
| 6 | `POST /api/v1/users` email duplicata | 409 | Conflitto email |
| 7 | `DELETE /api/v1/users/1` | 204 | Eliminato, nessun body |
| 8 | `DELETE /api/v1/users/1` (già eliminato) | 404 | Non trovato |
| 9 | `GET /api/v1/nonesiste` | 404 | Endpoint non definito |
| 10 | `GET /health` | 200 | Health check |

---

### Esercizio 4 — Simulare un errore 500

Aggiungi temporaneamente questa route in `app.js` per testare l'error handler con un errore inaspettato:

```javascript
app.get('/api/v1/crash', (req, res, next) => {
  // Simula un errore imprevisto (es. bug nel codice, database giù)
  next(new Error('Questo è un errore simulato del server'));
});
```

1. Avvia il server con `NODE_ENV=development node index.js`
2. Chiama `GET /api/v1/crash` — vedi lo stack trace nella risposta?
3. Avvia con `NODE_ENV=production node index.js`
4. Chiama di nuovo — lo stack trace è nascosto?

---

### Esercizio 5 — Formattare gli errori di validazione

Aggiornare il middleware `validateBody.js` per restituire un formato di errore più dettagliato:

```javascript
// Attuale
{ "error": "Campi obbligatori mancanti", "campi_mancanti": ["email"] }

// Obiettivo
{
  "error": "Validazione fallita",
  "campi": {
    "email": "campo obbligatorio mancante"
  }
}
```

Come modificheresti `validateBody.js` per produrre questo output?

---

## 12. Riepilogo

| Codice | Nome | Usa per |
|---|---|---|
| `200` | OK | Successo con body (GET, PUT, PATCH) |
| `201` | Created | Risorsa creata (POST) |
| `204` | No Content | Successo senza body (DELETE) |
| `400` | Bad Request | Input non valido, tipo sbagliato |
| `401` | Unauthorized | Non autenticato |
| `403` | Forbidden | Autenticato ma senza permessi |
| `404` | Not Found | Risorsa o endpoint inesistente |
| `409` | Conflict | Duplicato, conflitto di stato |
| `422` | Unprocessable Entity | Dati semanticamente invalidi |
| `429` | Too Many Requests | Rate limit superato |
| `500` | Internal Server Error | Errore generico del server |
| `503` | Service Unavailable | Server non disponibile |

**Principi da ricordare:**
- Il codice HTTP deve riflettere l'esito reale — mai `200` con un payload di errore
- `4xx` = colpa del client, `5xx` = colpa del server
- Mai esporre stack trace o dettagli interni in produzione
- Definisci un formato di errore JSON uniforme e rispettalo su tutte le route
- Centralizza la gestione degli errori in un unico error handler in fondo ad `app.js`

---

## 13. Domande di verifica

1. Qual è la differenza semantica tra `401` e `403`? Fai un esempio concreto per ciascuno.
2. Perché non si deve rispondere `200 OK` a una POST che crea una risorsa?
3. Un client riceve `503`. Può fare retry automatico della richiesta? E se riceve `400`?
4. Cos'è un error handler in Express? Come lo distingue dagli altri middleware?
5. Perché non si devono mai esporre stack trace nelle risposte `500` in produzione?
6. Qual è la differenza tra `400` e `422`? In quali casi useresti l'uno o l'altro?

---

## 14. Riferimenti

- RFC 9110 — *HTTP Semantics*, sezione 15 — Status Codes (definizione ufficiale di tutti i codici)
- MDN Web Docs — [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- Express.js docs — [Error handling](https://expressjs.com/en/guide/error-handling.html)
- httpstatuses.com — riferimento rapido con descrizioni e casi d'uso

---

*Fine Lezione 04 — Prossima lezione: JSON — il formato dati delle API*
