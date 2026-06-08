# RESTful API — Lezione 03
## Struttura di una REST API


## 1. Obiettivi della lezione

Al termine di questa lezione lo studente sarà in grado di:

- Applicare le convenzioni di naming delle risorse nelle URL
- Progettare una gerarchia di route con nesting corretto
- Implementare il versioning dell'API tramite prefisso nel path
- Installare e configurare Express.js da zero
- Usare i metodi, i middleware e il sistema di routing di Express
- Organizzare il codice Express in una struttura a cartelle separata (routes, controllers, middleware)

---

## 2. Naming delle risorse

### 2.1 Regole fondamentali

Il naming delle URL è l'aspetto più visibile del design di un'API. Una volta pubblicata, una URL è difficile da cambiare senza rompere i client esistenti.

**Regola 1 — Nomi al plurale per le collezioni**

```
✅  GET /users
✅  GET /orders
✅  GET /products

❌  GET /user
❌  GET /getUsers
❌  GET /listOrders
```

Il plurale è la convenzione dominante perché `/users` rappresenta la collezione e `/users/42` rappresenta un elemento di quella collezione. È coerente e prevedibile.

**Regola 2 — Lowercase e kebab-case**

```
✅  GET /blog-posts
✅  GET /user-profiles
✅  GET /shipping-addresses

❌  GET /blogPosts       (camelCase — ambiguo nelle URL)
❌  GET /BlogPosts       (PascalCase)
❌  GET /blog_posts      (snake_case — funziona, ma meno diffuso nelle API)
```

Le URL sono case-sensitive su molti server. Il kebab-case è leggibile, non ambiguo e universalmente supportato.

**Regola 3 — Nomi, non verbi**

```
✅  POST   /users              (crea un utente)
✅  DELETE /users/42           (elimina l'utente 42)
✅  PATCH  /users/42           (aggiorna l'utente 42)

❌  POST   /createUser
❌  GET    /deleteUser?id=42
❌  POST   /users/42/update
```

Il verbo è già nel metodo HTTP. Ripeterlo nell'URL è ridondante e rompe la struttura uniforme REST.

**Regola 4 — Identificatori nel path, opzioni in query string**

```
✅  GET /users/42                    (id specifico → path)
✅  GET /users?ruolo=admin           (filtro → query string)
✅  GET /users?page=2&limit=20       (paginazione → query string)

❌  GET /users/admin                 (ambiguo: è un id o un filtro?)
❌  GET /getUserById?id=42
```

### 2.2 Tabella di riferimento rapido

| Operazione | URL corretta | Metodo |
|---|---|---|
| Lista tutti gli utenti | `/users` | GET |
| Singolo utente | `/users/42` | GET |
| Crea utente | `/users` | POST |
| Sostituisci utente | `/users/42` | PUT |
| Aggiorna campo utente | `/users/42` | PATCH |
| Elimina utente | `/users/42` | DELETE |
| Utenti con ruolo admin | `/users?ruolo=admin` | GET |
| Utenti, pagina 2 | `/users?page=2&limit=10` | GET |

---

## 3. Gerarchia e nesting delle route

### 3.1 Quando annidare

Il nesting serve a esprimere una relazione di appartenenza tra risorse. Si usa quando una risorsa esiste solo nel contesto di un'altra.

```
GET  /users/42/posts          → tutti i post dell'utente 42
GET  /users/42/posts/7        → il post 7 dell'utente 42
POST /users/42/posts          → crea un post per l'utente 42
```

### 3.2 Quando NON annidare

Il nesting profondo diventa problematico rapidamente:

```
❌  GET /users/42/posts/7/comments/3/likes   (troppo profondo)
```

**Regola pratica**: non superare un livello di nesting. Se serve un terzo livello, esponi la sotto-risorsa come risorsa di primo livello con un filtro:

```
✅  GET /comments?postId=7
✅  GET /likes?commentId=3
```

>  **Best practice** — L'URL identifica **cosa** (la risorsa). Il metodo HTTP dice **come** (l'operazione). Se senti il bisogno di mettere un verbo nell'URL, stai quasi certamente usando il metodo HTTP sbagliato.

---

## 4. Versioning dell'API

### 4.1 Perché serve

Un'API pubblica è un contratto. Se modifichi il contratto (rimuovi un campo, cambi un tipo, rinomini una route), rompi tutti i client che la consumano. Il versioning permette di evolvere l'API senza rompere chi già la usa.

### 4.2 Versione nel path

```
GET /v1/users
GET /v2/users
```

È la strategia più diffusa: visibile, testabile dal browser, immediata in curl e Postman. Usala per default.

### 4.3 Cosa richiede una nuova versione

| Tipo di modifica | Breaking? | Nuova versione? |
|---|---|---|
| Aggiungere un campo opzionale in risposta | ❌ | No |
| Aggiungere una nuova route | ❌ | No |
| Rimuovere un campo dalla risposta | ✅ | Sì |
| Rinominare un campo | ✅ | Sì |
| Cambiare il tipo di un campo (`string` → `int`) | ✅ | Sì |
| Rimuovere una route | ✅ | Sì |

---

## 5. Express.js

### 5.1 Cos'è Express

Express è un framework web minimalista per Node.js. È la libreria più usata nell'ecosistema Node per costruire server HTTP, API REST e applicazioni web.

Node.js da solo include un modulo `http` nativo con cui si può costruire un server, ma è verboso e basso livello:

```javascript
// Server HTTP nativo Node.js — senza Express
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, nome: 'Mario' }]));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000);
```

Con più route e metodi, questo codice diventa illeggibile. Express risolve questo con un sistema di routing dichiarativo, middleware componibili e un'API molto più pulita.

### 5.2 Cosa fa Express (e cosa non fa)

Express è deliberatamente minimalista. Fornisce:

- **Routing** — associa coppie metodo+URL a funzioni handler
- **Middleware** — catena di funzioni che processano la richiesta prima dell'handler
- **Request/Response API** — metodi di convenienza su `req` e `res`

Non fornisce: ORM, autenticazione, validazione, database. Queste funzionalità si aggiungono tramite librerie esterne o middleware di terze parti. Questa filosofia si chiama *unopinionated*: Express non impone una struttura, tu decidi come organizzare il codice.

### 5.3 Installazione

**Prerequisiti**: Node.js installato (verifica con `node -v` e `npm -v`).

```bash
# 1. Crea una cartella per il progetto
mkdir mio-progetto-api
cd mio-progetto-api

# 2. Inizializza il progetto Node (crea package.json)
npm init -y

# 3. Installa Express come dipendenza
npm install express
```

Dopo l'installazione, la struttura del progetto è:

```
mio-progetto-api/
├── node_modules/       ← Express e le sue dipendenze (non toccare, non committare)
├── package.json        ← metadati del progetto e lista delle dipendenze
└── package-lock.json   ← versioni esatte installate (committare nel repo)
```

Il `package.json` ora contiene:

```json
{
  "name": "mio-progetto-api",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

> 📘 **Nota** — La cartella `node_modules` non va mai committata su Git. Aggiungila a `.gitignore`. Chiunque cloni il repo esegue `npm install` per ricrearla dalle informazioni in `package.json`.

### 5.4 Il server più semplice possibile

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
```

```bash
node app.js
# → Server in ascolto su http://localhost:3000
```

Quattro righe operative. Confrontalo con l'equivalente nativo Node.js della sezione 5.1.

---

## 6. Express — Concetti fondamentali

### 6.1 L'oggetto `app`

`express()` restituisce un'istanza dell'applicazione. È l'oggetto centrale: su di esso si registrano le route, si montano i middleware, si avvia il server.

```javascript
const express = require('express');
const app = express(); // istanza dell'applicazione
```

### 6.2 Routing — associare URL a funzioni

Il routing è il cuore di Express. Si definisce con i metodi HTTP come nomi di funzione sull'oggetto `app`:

```javascript
app.get('/percorso', handler);
app.post('/percorso', handler);
app.put('/percorso', handler);
app.patch('/percorso', handler);
app.delete('/percorso', handler);
app.all('/percorso', handler);   // risponde a qualsiasi metodo HTTP
```

Ogni handler è una funzione `(req, res)`:

```javascript
app.get('/users', (req, res) => {
  // req → oggetto che rappresenta la richiesta HTTP
  // res → oggetto che rappresenta la risposta HTTP
  res.status(200).json({ messaggio: 'Lista utenti' });
});
```

### 6.3 Parametri di route

I segmenti del path preceduti da `:` sono parametri dinamici, accessibili tramite `req.params`:

```javascript
app.get('/users/:id', (req, res) => {
  const id = req.params.id; // stringa — convertire a numero se necessario
  res.json({ id: parseInt(id) });
});

// GET /users/42  →  req.params.id === "42"
// GET /users/abc →  req.params.id === "abc"
```

Più parametri nello stesso path:

```javascript
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
```

### 6.4 Query string

I parametri in query string sono accessibili tramite `req.query`:

```javascript
app.get('/users', (req, res) => {
  const { ruolo, page, limit } = req.query;
  // GET /users?ruolo=admin&page=2&limit=10
  // ruolo === "admin", page === "2", limit === "10"
  res.json({ ruolo, page, limit });
});
```

> ⚠️ **Attenzione** — I valori di `req.query` sono sempre stringhe. Se serve un numero, converti esplicitamente: `parseInt(req.query.page)`.

### 6.5 Body della richiesta

Il body di POST/PUT/PATCH richiede un middleware per essere parsato. Express include `express.json()` per i body JSON:

```javascript
app.use(express.json()); // registra il middleware globalmente

app.post('/users', (req, res) => {
  const { nome, email } = req.body;
  // body JSON { "nome": "Mario", "email": "mario@esempio.com" }
  res.status(201).json({ id: 1, nome, email });
});
```

Senza `app.use(express.json())`, `req.body` è `undefined`.

### 6.6 L'oggetto `res` — inviare risposte

| Metodo | Uso | Esempio |
|---|---|---|
| `res.json(data)` | Risponde con JSON, imposta `Content-Type: application/json` | `res.json({ id: 1 })` |
| `res.status(code)` | Imposta lo status code (chainable) | `res.status(404).json(...)` |
| `res.send(data)` | Risponde con stringa, Buffer o oggetto | `res.send('ok')` |
| `res.sendStatus(code)` | Risponde solo con lo status code e il suo testo | `res.sendStatus(204)` |
| `res.header(k, v)` | Aggiunge un header alla risposta | `res.header('Location', '/users/1')` |
| `res.redirect(url)` | Risponde con redirect (302 di default) | `res.redirect('/nuova-url')` |

```javascript
// Pattern più comuni
res.status(200).json(data);
res.status(201).header('Location', '/users/42').json(newUser);
res.status(204).send();
res.status(404).json({ error: 'Non trovato' });
res.status(400).json({ error: 'Richiesta non valida' });
```

### 6.7 L'oggetto `req` — leggere la richiesta

| Proprietà | Contenuto | Esempio |
|---|---|---|
| `req.params` | Parametri di route dinamici | `req.params.id` → `"42"` |
| `req.query` | Parametri in query string | `req.query.page` → `"2"` |
| `req.body` | Body della richiesta (richiede middleware) | `req.body.nome` → `"Mario"` |
| `req.headers` | Headers della richiesta | `req.headers['authorization']` |
| `req.method` | Metodo HTTP | `"GET"`, `"POST"`, ecc. |
| `req.url` | URL della richiesta | `"/users/42?lang=it"` |
| `req.originalUrl` | URL originale (utile con router montati su prefisso) | `"/api/v1/users/42"` |
| `req.path` | Solo il path, senza query string | `"/users/42"` |

---

## 7. Middleware in Express

### 7.1 Cos'è un middleware

Un middleware è una funzione con firma `(req, res, next)` che viene eseguita durante il ciclo di vita di una richiesta. Può leggere e modificare `req` e `res`, terminare il ciclo inviando una risposta, o passare il controllo al middleware successivo chiamando `next()`.

```javascript
function mioMiddleware(req, res, next) {
  // fai qualcosa con req o res
  next(); // passa al prossimo middleware o alla route handler
}
```

**Se non chiami `next()` e non invii una risposta, la richiesta si blocca.** Il client aspetta indefinitamente.

### 7.2 Catena di esecuzione

Express esegue i middleware nell'ordine in cui vengono registrati:

```
Richiesta HTTP
      ↓
  express.json()       ← parsea il body JSON
      ↓
  logger middleware    ← logga la richiesta
      ↓
  auth middleware      ← verifica il token (lezione 7)
      ↓
  route handler        ← esegue la logica e invia la risposta
      ↓
  Risposta HTTP
```

### 7.3 Registrare i middleware

```javascript
// Middleware globale — si applica a tutte le route
app.use(express.json());
app.use(mioMiddleware);

// Middleware per route specifica
app.get('/users', authMiddleware, (req, res) => { ... });

// Middleware per router
router.use(authMiddleware);

// Error handler — firma speciale a 4 parametri, sempre in fondo
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Errore interno del server' });
});
```

### 7.4 Middleware integrati in Express

| Middleware | Funzione |
|---|---|
| `express.json()` | Parsea body JSON → popola `req.body` |
| `express.urlencoded({ extended: true })` | Parsea body da form HTML → popola `req.body` |
| `express.static('public')` | Serve file statici dalla cartella `public` |

### 7.5 Middleware di terze parti comuni

```bash
npm install morgan              # logging HTTP professionale
npm install cors                # gestione CORS (lezione 8)
npm install helmet              # header di sicurezza (lezione 9)
npm install express-rate-limit  # rate limiting (lezione 8)
```

```javascript
const morgan = require('morgan');
app.use(morgan('dev')); // log: GET /users 200 3ms
```

---

## 8. Express Router — routing modulare

### 8.1 Perché usare il Router

Quando l'applicazione cresce, definire tutte le route su `app` diventa insostenibile. `express.Router()` crea mini-applicazioni Express indipendenti che si montano su un prefisso.

```javascript
// Senza Router — tutto su app (non scala)
app.get('/users', ...);
app.post('/users', ...);
app.get('/products', ...);
// → centinaia di righe in un file

// Con Router — ogni risorsa ha il suo modulo
const usersRouter = require('./routes/users');
app.use('/api/v1/users', usersRouter);
// → app.js resta pulito
```

### 8.2 Creare e usare un Router

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// Le route sono relative al prefisso su cui è montato il router.
// Se montato su '/api/v1/users':
router.get('/', handler);        // → GET /api/v1/users
router.get('/:id', handler);     // → GET /api/v1/users/:id
router.post('/', handler);       // → POST /api/v1/users

module.exports = router;
```

```javascript
// app.js
const usersRouter = require('./routes/users');
app.use('/api/v1/users', usersRouter);
```

---

## 9. Struttura a cartelle raccomandata

### 9.1 Il problema del file unico

Il server monolitico della Lezione 02 funziona per demo, ma non scala: con 10 risorse e 5 route ciascuna si arriva facilmente a 500+ righe in un unico file.

### 9.2 Struttura raccomandata

```
api-lezione03/
├── index.js                  ← entry point: avvia il server HTTP
├── app.js                    ← configura Express, middleware globali, router
├── package.json
├── .gitignore
├── routes/
│   ├── index.js              ← aggrega tutti i router
│   └── users.js              ← router per /users
├── controllers/
│   └── usersController.js    ← logica delle route /users
└── middleware/
    └── logger.js             ← middleware personalizzati
```

### 9.3 Separazione delle responsabilità

| File / cartella | Responsabilità | Cosa NON deve fare |
|---|---|---|
| `index.js` | Avvia il server HTTP sulla porta | Qualsiasi logica applicativa |
| `app.js` | Configura Express: middleware, router, error handler | Logica di business |
| `routes/` | Mappa URL+metodo → funzione controller | Accedere ai dati, validare |
| `controllers/` | Logica di business: legge `req`, chiama servizi, scrive `res` | Conoscere i dettagli HTTP |
| `middleware/` | Funzioni riutilizzabili nella catena | Logica specifica di una route |

---

## 10. Implementazione completa

### 10.1 `.gitignore`

```
node_modules/
.env
```

### 10.2 `index.js` — Entry point

```javascript
// index.js
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
```

`index.js` non configura nulla — si limita ad avviare il server sulla porta. Questo permette di importare `app.js` nei test senza avviare il server (lo vedremo nella Lezione 12).

### 10.3 `app.js` — Configurazione Express

```javascript
// app.js
const express = require('express');
const app = express();

const routes = require('./routes/index');
const { logger } = require('./middleware/logger');

// ── Middleware globali (ordine importante) ────────────────────────────────────
app.use(express.json());   // parsare il body JSON di ogni richiesta
app.use(logger);           // loggare ogni richiesta

// ── Montaggio dei router ──────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── Error handler — sempre in fondo, dopo tutte le route ─────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Errore interno del server' });
});

module.exports = app;
```

### 10.4 `routes/index.js` — Aggregatore

```javascript
// routes/index.js
const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
router.use('/users', usersRouter);

// Aggiungere qui le route delle prossime lezioni:
// router.use('/products', require('./products'));

module.exports = router;
```

### 10.5 `routes/users.js` — Router utenti

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usersController');

// Collezione
router.get('/',   ctrl.getAll);
router.post('/',  ctrl.create);

// Singola risorsa
router.get('/:id',    ctrl.getOne);
router.put('/:id',    ctrl.replace);
router.patch('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
```

Il router non contiene logica: solo il mapping URL → funzione controller.

### 10.6 `controllers/usersController.js`

```javascript
// controllers/usersController.js

let users = [
  { id: 1, nome: 'Mario Rossi',    email: 'mario@esempio.com' },
  { id: 2, nome: 'Giulia Bianchi', email: 'giulia@esempio.com' },
];
let nextId = 3;

const getAll = (req, res) => {
  res.status(200).json(users);
};

const getOne = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  res.status(200).json(user);
};

const create = (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ error: 'nome ed email sono obbligatori' });
  }
  const newUser = { id: nextId++, nome, email };
  users.push(newUser);
  res.status(201).header('Location', `/api/v1/users/${newUser.id}`).json(newUser);
};

const replace = (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Utente non trovato' });
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ error: 'PUT richiede tutti i campi: nome, email' });
  }
  users[index] = { id: users[index].id, nome, email };
  res.status(200).json(users[index]);
};

const update = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  if (req.body.nome  !== undefined) user.nome  = req.body.nome;
  if (req.body.email !== undefined) user.email = req.body.email;
  res.status(200).json(user);
};

const remove = (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Utente non trovato' });
  users.splice(index, 1);
  res.status(204).send();
};

module.exports = { getAll, getOne, create, replace, update, remove };
```

### 10.7 `middleware/logger.js`

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });

  next(); // senza questo, la richiesta si blocca qui
};

module.exports = { logger };
```

Output nel terminale:

```
[2026-06-03T09:15:00.000Z] GET /api/v1/users → 200 (3ms)
[2026-06-03T09:15:05.000Z] POST /api/v1/users → 201 (1ms)
[2026-06-03T09:15:12.000Z] GET /api/v1/users/99 → 404 (1ms)
```

### 10.8 Avviare il server

```bash
node index.js
# → Server in ascolto su http://localhost:3000
```

Per riavviare automaticamente ad ogni modifica (utile in sviluppo):

```bash
npm install --save-dev nodemon
npx nodemon index.js
```

Oppure aggiungi uno script nel `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev":   "nodemon index.js"
}
```

```bash
npm run dev
```

---

## 11. Riepilogo dei comandi Express

```javascript
// ── Setup ─────────────────────────────────────────────────────────────────────
const express = require('express');
const app = express();

// ── Middleware globali ────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(mioMiddleware);

// ── Route ─────────────────────────────────────────────────────────────────────
app.get('/path', handler);
app.post('/path', handler);
app.put('/path/:id', handler);
app.patch('/path/:id', handler);
app.delete('/path/:id', handler);
app.all('/path', handler);

// ── Router ────────────────────────────────────────────────────────────────────
const router = express.Router();
router.get('/', handler);
router.use('/sotto-path', altroRouter);
app.use('/prefisso', router);

// ── Request ───────────────────────────────────────────────────────────────────
req.params.id               // parametro di route  → sempre stringa
req.query.page              // query string         → sempre stringa
req.body.nome               // body JSON            → richiede express.json()
req.headers['authorization']
req.method                  // "GET", "POST", ...
req.originalUrl             // URL completa con prefisso

// ── Response ──────────────────────────────────────────────────────────────────
res.status(200).json(data);
res.status(201).header('Location', url).json(data);
res.status(204).send();
res.status(404).json({ error: 'msg' });
res.redirect('/nuova-url');

// ── Avvio ─────────────────────────────────────────────────────────────────────
app.listen(3000, () => console.log('Server avviato'));
```

---

## 12. Laboratorio (~1 ora)

**Obiettivo**: costruire da zero il progetto con la struttura a cartelle della sezione 9, partendo dall'installazione di Express.

### Esercizio 1 — Setup da zero

```bash
mkdir api-lezione03 && cd api-lezione03
npm init -y
npm install express
npm install --save-dev nodemon
```

Aggiungere in `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev":   "nodemon index.js"
}
```

Creare la struttura di cartelle e i file come da sezione 10. Avviare con `npm run dev`.

### Esercizio 2 — Testare tutte le route

Con il server attivo, testare in Postman:

| # | Metodo | URL | Body |
|---|---|---|---|
| 1 | GET | `http://localhost:3000/api/v1/users` | — |
| 2 | GET | `http://localhost:3000/api/v1/users/1` | — |
| 3 | GET | `http://localhost:3000/api/v1/users/99` | — |
| 4 | POST | `http://localhost:3000/api/v1/users` | `{"nome":"Anna","email":"anna@esempio.com"}` |
| 5 | PATCH | `http://localhost:3000/api/v1/users/1` | `{"email":"mario.nuovo@esempio.com"}` |
| 6 | DELETE | `http://localhost:3000/api/v1/users/2` | — |

Verificare che il logger stampi ogni richiesta nel terminale con status code e tempo.

### Esercizio 3 — Aggiungere la risorsa `/products`

1. Creare `routes/products.js` con le stesse route di `users.js`
2. Creare `controllers/productsController.js` con questi dati mock:

```javascript
let products = [
  { id: 1, nome: 'Laptop Pro',    prezzo: 1299.99, categoria: 'elettronica' },
  { id: 2, nome: 'Zaino Tecnico', prezzo: 89.90,   categoria: 'accessori' },
  { id: 3, nome: 'Monitor 4K',    prezzo: 449.00,  categoria: 'elettronica' },
];
```

3. Registrare il router in `routes/index.js`
4. Testare `GET http://localhost:3000/api/v1/products`

### Esercizio 4 — Middleware di validazione riutilizzabile

Creare `middleware/validateBody.js`:

```javascript
// middleware/validateBody.js
const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Campi obbligatori mancanti: ${missing.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { validateBody };
```

Usarlo nella route POST di users:

```javascript
// routes/users.js
const { validateBody } = require('../middleware/validateBody');

router.post('/', validateBody(['nome', 'email']), ctrl.create);
```

Testare: cosa risponde il server se il body è `{"nome": "Anna"}` senza email?

---

## 13. Riepilogo

| Concetto | Punto chiave |
|---|---|
| **Naming** | Plurale, lowercase, kebab-case, nomi non verbi |
| **Nesting** | Max un livello. Oltre, usa risorsa di primo livello con filtro |
| **Versioning** | Prefisso `/v1/` nel path. Solo breaking change richiedono nuova versione |
| **Express** | Framework minimalista per Node.js. Routing + middleware, nient'altro |
| **`app.use()`** | Registra middleware globali o monta router su un prefisso |
| **`app.get/post/...`** | Definisce una route per uno specifico metodo HTTP |
| **`req`** | Oggetto che rappresenta la richiesta: `.params`, `.query`, `.body`, `.headers` |
| **`res`** | Oggetto che rappresenta la risposta: `.status()`, `.json()`, `.send()` |
| **Middleware** | Funzione `(req, res, next)`. Ordine di registrazione = ordine di esecuzione |
| **Router** | Mini-applicazione Express montabile su un prefisso. Tiene le route separate per risorsa |
| **Struttura** | `routes` → `controllers`. Ogni layer ha una sola responsabilità |

---

## 14. Domande di verifica

1. Perché si usano nomi al plurale nelle URL REST? Fai un esempio di URL corretta e una scorretta per la stessa risorsa.
2. Cos'è Express e cosa aggiunge rispetto al modulo `http` nativo di Node.js?
3. Qual è la differenza tra `app.use()` e `app.get()`?
4. Cosa succede se un middleware non chiama `next()` e non invia una risposta?
5. Qual è la differenza tra `req.params`, `req.query` e `req.body`? Quando è popolato ciascuno?
6. Cos'è un breaking change in un'API? Fai un esempio che lo è e uno che non lo è.

---

## 15. Riferimenti

- Express.js — [Sito ufficiale](https://expressjs.com)
- Express.js docs — [Getting started](https://expressjs.com/en/starter/installing.html)
- Express.js docs — [Routing](https://expressjs.com/en/guide/routing.html)
- Express.js docs — [Writing middleware](https://expressjs.com/en/guide/writing-middleware.html)
- npm — [Pagina del pacchetto Express](https://www.npmjs.com/package/express)
- Stripe API — esempio reale di versioning nel path: `api.stripe.com/v1/`

---

*Fine Lezione 03 — Prossima lezione: Codici di risposta HTTP*
