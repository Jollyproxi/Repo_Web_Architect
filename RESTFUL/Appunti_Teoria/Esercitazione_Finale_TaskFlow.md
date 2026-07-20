# RESTful API — Esercitazione finale
## Progetto guidato: "TaskFlow" — API completa + frontend



## Introduzione

Costruirai **TaskFlow**, un gestore di attività (task) con API REST completa e un frontend che la consuma. Il progetto è organizzato in **6 fasi**, ognuna basata sulla precedente. Alla fine avrai un'applicazione che tocca ogni argomento del corso: metodi HTTP, codici di stato, struttura Express, validazione JSON, statelessness, paginazione, autenticazione JWT e consumo dell'API dal browser con fetch e Promise.

Ogni fase indica il tempo stimato, gli obiettivi, i passi e i **criteri di accettazione** (come sai di aver finito).

**Mappa delle fasi:**

| Fase | Argomento | Lezioni | Tempo |
|---|---|---|---|
| 1 | Setup e struttura del progetto | 01, 03 | ~45 min |
| 2 | CRUD completo con metodi e codici corretti | 02, 04 | ~60 min |
| 3 | Validazione con JSON Schema (ajv) | 05 | ~45 min |
| 4 | Paginazione, filtri, ordinamento, caching | 06 | ~60 min |
| 5 | Autenticazione JWT e autorizzazione | 07 | ~75 min |
| 6 | Frontend con fetch e Promise (JS/HTML/CSS) | 01, tutte | ~75 min |

---

# FASE 1 — Setup e struttura del progetto
### Lezioni 01, 03 · ~45 minuti

## Obiettivi

- Inizializzare un progetto Express con la struttura a cartelle vista nella Lezione 03
- Definire il modello dati delle task
- Avviare un server con una prima route funzionante

## Il modello dati

Una task ha questa struttura:

```json
{
  "id": 1,
  "titolo": "Studiare le REST API",
  "descrizione": "Ripassare i metodi HTTP",
  "stato": "da_fare",
  "priorita": "alta",
  "creata": "2026-06-03T10:00:00.000Z"
}
```

Vincoli:
- `stato`: uno tra `da_fare`, `in_corso`, `completata`
- `priorita`: uno tra `bassa`, `media`, `alta`

## Passi

**1.1** — Crea il progetto:

```bash
mkdir taskflow-api && cd taskflow-api
npm init -y
npm install express
npm install --save-dev nodemon
```

**1.2** — Aggiungi gli script in `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

**1.3** — Crea la struttura di cartelle:

```
taskflow-api/
├── index.js
├── app.js
├── .gitignore
├── routes/
│   └── index.js
├── controllers/
│   └── tasksController.js
├── middleware/
│   └── logger.js
└── data/
    └── tasks.js
```

**1.4** — `.gitignore`:

```
node_modules/
.env
```

**1.5** — `data/tasks.js` — il "database" in memoria con dati di partenza:

```javascript
// data/tasks.js
let tasks = [
  { id: 1, titolo: 'Studiare le REST API',   descrizione: 'Ripassare i metodi HTTP', stato: 'in_corso',   priorita: 'alta',  creata: new Date('2026-06-01T09:00:00Z').toISOString() },
  { id: 2, titolo: 'Configurare Express',     descrizione: 'Setup del server',        stato: 'completata', priorita: 'alta',  creata: new Date('2026-06-01T10:00:00Z').toISOString() },
  { id: 3, titolo: 'Scrivere la validazione', descrizione: 'Integrare ajv',           stato: 'da_fare',    priorita: 'media', creata: new Date('2026-06-02T09:00:00Z').toISOString() },
  { id: 4, titolo: 'Implementare JWT',        descrizione: 'Login e route protette',  stato: 'da_fare',    priorita: 'alta',  creata: new Date('2026-06-02T14:00:00Z').toISOString() },
  { id: 5, titolo: 'Testare con Postman',     descrizione: 'Coprire tutti i casi',    stato: 'da_fare',    priorita: 'bassa', creata: new Date('2026-06-03T08:00:00Z').toISOString() },
];
let nextId = 6;

module.exports = {
  getAll:   () => tasks,
  getNextId: () => nextId++,
  reset:    (nuove) => { tasks = nuove; },
};
```

**1.6** — `middleware/logger.js` (dalla Lezione 03):

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const durata = Date.now() - start;
    console.log(`${req.method.padEnd(6)} ${req.originalUrl.padEnd(30)} ${res.statusCode} (${durata}ms)`);
  });
  next();
};
module.exports = { logger };
```

**1.7** — `app.js`:

```javascript
// app.js
const express = require('express');
const app = express();

const routes = require('./routes/index');
const { logger } = require('./middleware/logger');

app.use(express.json());
app.use(logger);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/v1', routes);

// catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato', path: req.originalUrl });
});

module.exports = app;
```

**1.8** — `index.js`:

```javascript
// index.js
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server su http://localhost:${PORT}`));
```

**1.9** — `routes/index.js` (per ora minimale, lo espandi nella Fase 2):

```javascript
// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/tasks', (req, res) => {
  const tasks = require('../data/tasks').getAll();
  res.status(200).json(tasks);
});

module.exports = router;
```

## Criteri di accettazione

- [ ] `npm run dev` avvia il server senza errori
- [ ] `GET http://localhost:3000/health` risponde `200` con `{"status":"ok"}`
- [ ] `GET http://localhost:3000/api/v1/tasks` risponde `200` con l'array di 5 task
- [ ] Il logger stampa ogni richiesta nel terminale
- [ ] `GET http://localhost:3000/inesistente` risponde `404`

---

# FASE 2 — CRUD completo
### Lezioni 02, 04 · ~60 minuti

## Obiettivi

- Implementare tutti i metodi HTTP sulla risorsa `/tasks`
- Usare il codice di stato corretto per ogni operazione
- Gestire gli errori con un error handler centralizzato

## Passi

**2.1** — Crea `utils/errors.js` (dalla Lezione 04):

```javascript
// utils/errors.js
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}
const notFound = (msg) => new AppError(msg || 'Risorsa non trovata', 404);
const badReq   = (msg) => new AppError(msg || 'Richiesta non valida', 400);

module.exports = { AppError, notFound, badReq };
```

**2.2** — Crea `controllers/tasksController.js` con tutti i metodi:

```javascript
// controllers/tasksController.js
const db = require('../data/tasks');
const { notFound, badReq } = require('../utils/errors');

const STATI = ['da_fare', 'in_corso', 'completata'];
const PRIORITA = ['bassa', 'media', 'alta'];

const findById = (id) => db.getAll().find(t => t.id === parseInt(id));

// GET /api/v1/tasks
const getAll = (req, res) => {
  res.status(200).json(db.getAll());
};

// GET /api/v1/tasks/:id
const getOne = (req, res, next) => {
  const task = findById(req.params.id);
  if (!task) return next(notFound(`Task ${req.params.id} non trovata`));
  res.status(200).json(task);
};

// POST /api/v1/tasks
const create = (req, res, next) => {
  const { titolo, descrizione = '', stato = 'da_fare', priorita = 'media' } = req.body;

  if (!titolo) return next(badReq('Il campo titolo è obbligatorio'));
  if (!STATI.includes(stato)) return next(badReq(`stato non valido. Ammessi: ${STATI.join(', ')}`));
  if (!PRIORITA.includes(priorita)) return next(badReq(`priorita non valida. Ammessi: ${PRIORITA.join(', ')}`));

  const nuova = {
    id: db.getNextId(),
    titolo, descrizione, stato, priorita,
    creata: new Date().toISOString(),
  };
  db.getAll().push(nuova);

  res.status(201).header('Location', `/api/v1/tasks/${nuova.id}`).json(nuova);
};

// PUT /api/v1/tasks/:id — sostituzione completa
const replace = (req, res, next) => {
  const task = findById(req.params.id);
  if (!task) return next(notFound(`Task ${req.params.id} non trovata`));

  const { titolo, descrizione = '', stato = 'da_fare', priorita = 'media' } = req.body;
  if (!titolo) return next(badReq('PUT richiede il campo titolo'));

  task.titolo = titolo;
  task.descrizione = descrizione;
  task.stato = stato;
  task.priorita = priorita;

  res.status(200).json(task);
};

// PATCH /api/v1/tasks/:id — aggiornamento parziale
const update = (req, res, next) => {
  const task = findById(req.params.id);
  if (!task) return next(notFound(`Task ${req.params.id} non trovata`));

  ['titolo', 'descrizione', 'stato', 'priorita'].forEach(campo => {
    if (req.body[campo] !== undefined) task[campo] = req.body[campo];
  });

  res.status(200).json(task);
};

// DELETE /api/v1/tasks/:id
const remove = (req, res, next) => {
  const tasks = db.getAll();
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return next(notFound(`Task ${req.params.id} non trovata`));

  tasks.splice(index, 1);
  res.status(204).send();
};

module.exports = { getAll, getOne, create, replace, update, remove };
```

**2.3** — Crea `routes/tasks.js`:

```javascript
// routes/tasks.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tasksController');

router.get('/',    ctrl.getAll);
router.post('/',   ctrl.create);
router.get('/:id',    ctrl.getOne);
router.put('/:id',    ctrl.replace);
router.patch('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
```

**2.4** — Aggiorna `routes/index.js`:

```javascript
// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/tasks', require('./tasks'));

module.exports = router;
```

**2.5** — Aggiungi l'error handler in fondo ad `app.js`, DOPO il catch-all 404:

```javascript
// app.js — aggiungi dopo il catch-all 404
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.status || 500} — ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || 'Errore interno' });
});
```

## Criteri di accettazione

Testa in Postman e verifica ogni codice di stato:

| # | Metodo | URL | Body | Atteso |
|---|---|---|---|---|
| 1 | GET | `/api/v1/tasks/1` | — | 200 |
| 2 | GET | `/api/v1/tasks/999` | — | 404 |
| 3 | POST | `/api/v1/tasks` | `{"titolo":"Nuova task"}` | 201 + header Location |
| 4 | POST | `/api/v1/tasks` | `{}` (senza titolo) | 400 |
| 5 | POST | `/api/v1/tasks` | `{"titolo":"X","stato":"boh"}` | 400 |
| 6 | PUT | `/api/v1/tasks/1` | `{"titolo":"Modificata","stato":"completata","priorita":"bassa"}` | 200 |
| 7 | PATCH | `/api/v1/tasks/1` | `{"stato":"in_corso"}` | 200 |
| 8 | DELETE | `/api/v1/tasks/5` | — | 204 |
| 9 | DELETE | `/api/v1/tasks/5` | — | 404 |

- [ ] La POST restituisce `201` con l'header `Location`
- [ ] La DELETE restituisce `204` senza body
- [ ] Ripetere la DELETE sullo stesso id dà `404` (dimostra l'idempotenza a livello di stato)

---

# FASE 3 — Validazione con JSON Schema
### Lezione 05 · ~45 minuti

## Obiettivi

- Sostituire la validazione manuale della Fase 2 con JSON Schema e ajv
- Centralizzare la validazione in un middleware riutilizzabile

## Passi

**3.1** — Installa ajv:

```bash
npm install ajv ajv-formats
```

**3.2** — Crea `middleware/validate.js`:

```javascript
// middleware/validate.js
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = (schema) => {
  const check = ajv.compile(schema);
  return (req, res, next) => {
    if (check(req.body)) return next();

    const campi = {};
    check.errors.forEach(err => {
      const campo = err.instancePath.replace('/', '') || err.params.missingProperty || 'body';
      campi[campo] = err.message;
    });
    res.status(400).json({ error: 'Validazione fallita', campi });
  };
};

module.exports = { validate };
```

**3.3** — Crea `schemas/taskSchema.js`:

```javascript
// schemas/taskSchema.js

// Schema per la creazione (POST) — titolo obbligatorio
const creaTask = {
  type: 'object',
  properties: {
    titolo:      { type: 'string', minLength: 3, maxLength: 100 },
    descrizione: { type: 'string', maxLength: 500 },
    stato:       { type: 'string', enum: ['da_fare', 'in_corso', 'completata'] },
    priorita:    { type: 'string', enum: ['bassa', 'media', 'alta'] },
  },
  required: ['titolo'],
  additionalProperties: false,
};

// Schema per l'aggiornamento parziale (PATCH) — nessun campo obbligatorio
const aggiornaTask = {
  type: 'object',
  properties: {
    titolo:      { type: 'string', minLength: 3, maxLength: 100 },
    descrizione: { type: 'string', maxLength: 500 },
    stato:       { type: 'string', enum: ['da_fare', 'in_corso', 'completata'] },
    priorita:    { type: 'string', enum: ['bassa', 'media', 'alta'] },
  },
  additionalProperties: false,
  minProperties: 1, // almeno un campo da aggiornare
};

module.exports = { creaTask, aggiornaTask };
```

**3.4** — Applica gli schemi nelle route e **rimuovi** i controlli manuali dal controller:

```javascript
// routes/tasks.js — aggiornato
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tasksController');
const { validate } = require('../middleware/validate');
const { creaTask, aggiornaTask } = require('../schemas/taskSchema');

router.get('/',    ctrl.getAll);
router.post('/',   validate(creaTask), ctrl.create);
router.get('/:id',    ctrl.getOne);
router.put('/:id',    validate(creaTask), ctrl.replace);
router.patch('/:id',  validate(aggiornaTask), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
```

Ora nel controller puoi semplificare `create` e `replace`: la validazione è già garantita dal middleware, quindi rimuovi i controlli `if (!titolo)`, `if (!STATI.includes...)`, ecc.

## Criteri di accettazione

| Body inviato a POST /tasks | Atteso |
|---|---|
| `{"titolo":"Task valida"}` | 201 |
| `{"titolo":"ab"}` (troppo corto) | 400 |
| `{"titolo":"OK","stato":"invalido"}` | 400 |
| `{"titolo":"OK","extra":"campo"}` | 400 (additionalProperties) |
| `{}` a PATCH (nessun campo) | 400 (minProperties) |

- [ ] Gli errori di validazione elencano i campi problematici
- [ ] Il controller non contiene più validazione manuale

---

# FASE 4 — Paginazione, filtri, ordinamento, caching
### Lezione 06 · ~60 minuti

## Obiettivi

- Aggiungere paginazione offset-based alla lista task
- Supportare filtri per stato e priorità
- Supportare ordinamento
- Aggiungere caching con ETag

## Passi

**4.1** — Genera più dati per testare la paginazione. In `data/tasks.js`, dopo l'array iniziale, aggiungi:

```javascript
// data/tasks.js — aggiungi in coda, prima di module.exports
const stati = ['da_fare', 'in_corso', 'completata'];
const priorita = ['bassa', 'media', 'alta'];
for (let i = 6; i <= 50; i++) {
  tasks.push({
    id: i,
    titolo: `Task generata ${i}`,
    descrizione: `Descrizione ${i}`,
    stato: stati[i % 3],
    priorita: priorita[i % 3],
    creata: new Date(Date.now() - i * 3600000).toISOString(),
  });
}
let nextIdGen = 51; // aggiorna nextId
```

Adatta `getNextId` per partire da 51.

**4.2** — Riscrivi `getAll` nel controller con filtra → ordina → pagina:

```javascript
// controllers/tasksController.js — getAll aggiornato
const getAll = (req, res, next) => {
  const { stato, priorita, sort, order = 'asc' } = req.query;

  let risultati = [...db.getAll()];

  // 1. FILTRI
  if (stato) risultati = risultati.filter(t => t.stato === stato);
  if (priorita) risultati = risultati.filter(t => t.priorita === priorita);

  // 2. ORDINAMENTO (con whitelist)
  if (sort) {
    const campiValidi = ['titolo', 'stato', 'priorita', 'creata'];
    if (!campiValidi.includes(sort)) {
      return next(badReq(`sort non valido. Ammessi: ${campiValidi.join(', ')}`));
    }
    const dir = order === 'desc' ? -1 : 1;
    risultati.sort((a, b) => a[sort] < b[sort] ? -dir : a[sort] > b[sort] ? dir : 0);
  }

  // 3. PAGINAZIONE
  const page  = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const totale = risultati.length;
  const pagina = risultati.slice(offset, offset + limit);

  res.status(200).json({
    dati: pagina,
    paginazione: {
      pagina: page,
      per_pagina: limit,
      totale,
      pagine_totali: Math.ceil(totale / limit),
    },
  });
};
```

Ricorda di importare `badReq` in cima al controller se non c'è già.

**4.3** — Aggiungi ETag alla route del singolo task. In `getOne`:

```javascript
// controllers/tasksController.js — getOne con ETag
const crypto = require('crypto');

const getOne = (req, res, next) => {
  const task = findById(req.params.id);
  if (!task) return next(notFound(`Task ${req.params.id} non trovata`));

  const etag = crypto.createHash('md5').update(JSON.stringify(task)).digest('hex');

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.set('ETag', etag);
  res.status(200).json(task);
};
```

## Criteri di accettazione

| Richiesta | Verifica |
|---|---|
| `GET /api/v1/tasks?page=1&limit=10` | 10 task, `pagina: 1` |
| `GET /api/v1/tasks?page=3&limit=10` | Task successivi, `pagina: 3` |
| `GET /api/v1/tasks?stato=da_fare` | Solo task con stato da_fare |
| `GET /api/v1/tasks?priorita=alta&sort=titolo&order=asc` | Filtrate e ordinate |
| `GET /api/v1/tasks?sort=inesistente` | 400 |
| `GET /api/v1/tasks?limit=9999` | limit ridotto a 100 |

- [ ] La risposta include l'oggetto `paginazione` con `totale` e `pagine_totali`
- [ ] Il `totale` riflette i risultati **filtrati**, non tutti i task
- [ ] `GET /tasks/1` restituisce un header `ETag`; rifacendo la richiesta con `If-None-Match` uguale si ottiene `304`

---

# FASE 5 — Autenticazione JWT
### Lezione 07 · ~75 minuti

## Obiettivi

- Aggiungere login con generazione di JWT
- Proteggere le route di scrittura con un middleware di autenticazione
- Aggiungere autorizzazione: solo gli admin possono eliminare task

## Passi

**5.1** — Installa le dipendenze:

```bash
npm install jsonwebtoken bcryptjs
```

**5.2** — Crea `data/users.js`:

```javascript
// data/users.js
const bcrypt = require('bcryptjs');

const users = [
  { id: 1, email: 'admin@taskflow.it', passwordHash: bcrypt.hashSync('admin123', 10), ruolo: 'admin' },
  { id: 2, email: 'user@taskflow.it',  passwordHash: bcrypt.hashSync('user123', 10),  ruolo: 'user'  },
];

module.exports = {
  findByEmail: (email) => users.find(u => u.email === email),
};
```

**5.3** — Crea `controllers/authController.js`:

```javascript
// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../data/users');

// In produzione: process.env.JWT_SECRET
const JWT_SECRET = 'chiave-demo-non-per-produzione';

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email e password obbligatori' });
  }

  const user = db.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const token = jwt.sign(
    { userId: user.id, ruolo: user.ruolo },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, ruolo: user.ruolo });
};

module.exports = { login, JWT_SECRET };
```

**5.4** — Crea `middleware/auth.js`:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/authController');

const autentica = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token scaduto' : 'Token non valido';
    return res.status(401).json({ error: msg });
  }
};

const autorizza = (...ruoli) => (req, res, next) => {
  if (!ruoli.includes(req.user.ruolo)) {
    return res.status(403).json({ error: 'Permessi insufficienti' });
  }
  next();
};

module.exports = { autentica, autorizza };
```

**5.5** — Crea `routes/auth.js` e registralo:

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;
```

```javascript
// routes/index.js — aggiungi
router.use('/auth', require('./auth'));
```

**5.6** — Proteggi le route di scrittura. In `routes/tasks.js`:

```javascript
// routes/tasks.js — aggiornato con autenticazione
const { autentica, autorizza } = require('../middleware/auth');

// Lettura: pubblica
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Scrittura: richiede autenticazione
router.post('/',     autentica, validate(creaTask), ctrl.create);
router.put('/:id',   autentica, validate(creaTask), ctrl.replace);
router.patch('/:id', autentica, validate(aggiornaTask), ctrl.update);

// Eliminazione: solo admin
router.delete('/:id', autentica, autorizza('admin'), ctrl.remove);
```

## Criteri di accettazione

| Scenario | Atteso |
|---|---|
| `POST /auth/login` con credenziali corrette | 200 + token |
| `POST /auth/login` con password sbagliata | 401 |
| `GET /tasks` senza token | 200 (lettura pubblica) |
| `POST /tasks` senza token | 401 |
| `POST /tasks` con token valido | 201 |
| `DELETE /tasks/1` con token `user` | 403 |
| `DELETE /tasks/1` con token `admin` | 204 |

- [ ] Il login restituisce un JWT
- [ ] Le route di lettura restano pubbliche
- [ ] Le route di scrittura richiedono il token
- [ ] La DELETE distingue `401` (no token) da `403` (token user)

---

# FASE 6 — Frontend con fetch e Promise
### Consumo dell'API dal browser · ~75 minuti

## Obiettivi

- Costruire un frontend HTML/CSS/JS che consuma l'API TaskFlow
- Usare `fetch` e le **Promise** per ogni interazione con il backend
- Gestire login, visualizzazione, creazione ed eliminazione delle task

> Questa è la fase in cui si concentra il codice frontend. `fetch` restituisce sempre una **Promise**: capire come gestirla è il cuore del consumo di un'API dal browser.

## 6.1 — Concetto: fetch restituisce una Promise

Una Promise rappresenta un valore che sarà disponibile in futuro — il risultato di un'operazione asincrona, come una richiesta HTTP. `fetch` non restituisce i dati: restituisce una Promise che *si risolverà* con la risposta.

Due modi di gestirla:

**Con `.then()` (concatenazione):**

```javascript
fetch('http://localhost:3000/api/v1/tasks')
  .then(risposta => risposta.json())   // la prima Promise si risolve con la Response
  .then(dati => console.log(dati))     // la seconda con il JSON parsato
  .catch(errore => console.error(errore)); // gestione errori
```

**Con `async/await` (sintassi più leggibile):**

```javascript
async function caricaTask() {
  try {
    const risposta = await fetch('http://localhost:3000/api/v1/tasks');
    const dati = await risposta.json();
    console.log(dati);
  } catch (errore) {
    console.error(errore);
  }
}
```

`await` "aspetta" che la Promise si risolva, ma solo dentro una funzione `async`. Le due forme sono equivalenti — `async/await` è zucchero sintattico sopra le Promise.

> ⚠️ **Attenzione — un trabocchetto di fetch.** `fetch` considera un errore SOLO i problemi di rete. Una risposta `404` o `500` NON fa fallire la Promise: `fetch` la considera "completata con successo" perché la richiesta HTTP è avvenuta. Devi controllare `risposta.ok` manualmente.

```javascript
const risposta = await fetch(url);
if (!risposta.ok) {
  // qui gestisci 4xx e 5xx — fetch da solo NON lancia
  throw new Error(`Errore HTTP: ${risposta.status}`);
}
```

## 6.2 — Struttura del frontend

Crea una cartella `taskflow-frontend/` separata:

```
taskflow-frontend/
├── index.html
├── style.css
└── app.js
```

## 6.3 — `index.html`

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskFlow</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>TaskFlow</h1>
      <div id="stato-login" class="stato-login">Non autenticato</div>
    </header>

    <!-- Sezione login -->
    <section id="sezione-login" class="card">
      <h2>Login</h2>
      <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" value="admin@taskflow.it">
      </div>
      <div class="campo">
        <label for="password">Password</label>
        <input type="password" id="password" value="admin123">
      </div>
      <button id="btn-login">Accedi</button>
      <p id="errore-login" class="errore"></p>
    </section>

    <!-- Sezione creazione task (visibile solo se autenticato) -->
    <section id="sezione-crea" class="card nascosto">
      <h2>Nuova task</h2>
      <div class="campo">
        <label for="titolo">Titolo</label>
        <input type="text" id="titolo" placeholder="Cosa c'è da fare?">
      </div>
      <div class="campo-riga">
        <div class="campo">
          <label for="priorita">Priorità</label>
          <select id="priorita">
            <option value="bassa">Bassa</option>
            <option value="media" selected>Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div class="campo">
          <label for="stato">Stato</label>
          <select id="stato">
            <option value="da_fare" selected>Da fare</option>
            <option value="in_corso">In corso</option>
            <option value="completata">Completata</option>
          </select>
        </div>
      </div>
      <button id="btn-crea">Crea task</button>
      <p id="errore-crea" class="errore"></p>
    </section>

    <!-- Filtri -->
    <section class="filtri">
      <label for="filtro-stato">Filtra per stato:</label>
      <select id="filtro-stato">
        <option value="">Tutti</option>
        <option value="da_fare">Da fare</option>
        <option value="in_corso">In corso</option>
        <option value="completata">Completata</option>
      </select>
    </section>

    <!-- Lista task -->
    <section id="lista-task" class="lista">
      <p class="caricamento">Caricamento…</p>
    </section>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

## 6.4 — `style.css`

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f4f4f2;
  color: #2c2c2a;
  line-height: 1.5;
  padding: 2rem 1rem;
}

.container { max-width: 640px; margin: 0 auto; }

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
header h1 { font-size: 1.6rem; }

.stato-login {
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: #e8e6e0;
  color: #6b6a64;
}
.stato-login.attivo { background: #d5f5e3; color: #1e8449; }

.card {
  background: #fff;
  border: 1px solid #e0ded8;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.card h2 { font-size: 1.1rem; margin-bottom: 1rem; }

.campo { margin-bottom: 1rem; }
.campo-riga { display: flex; gap: 1rem; }
.campo-riga .campo { flex: 1; }

label { display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.3rem; }

input, select {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid #d3d1c7;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
}
input:focus, select:focus { outline: none; border-color: #378add; }

button {
  padding: 0.6rem 1.2rem;
  background: #2c2c2a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}
button:hover { background: #444441; }

.errore { color: #a32d2d; font-size: 0.85rem; margin-top: 0.5rem; min-height: 1rem; }

.nascosto { display: none; }

.filtri {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
}
.filtri select { width: auto; }

.lista { display: flex; flex-direction: column; gap: 0.7rem; }
.caricamento { text-align: center; color: #6b6a64; padding: 2rem; }

.task {
  background: #fff;
  border: 1px solid #e0ded8;
  border-left-width: 4px;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.task.priorita-alta   { border-left-color: #e24b4a; }
.task.priorita-media  { border-left-color: #e2a44b; }
.task.priorita-bassa  { border-left-color: #4ba3e2; }

.task-info h3 { font-size: 1rem; margin-bottom: 0.2rem; }
.task-info p { font-size: 0.85rem; color: #6b6a64; }

.task-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  background: #eeece6;
  color: #6b6a64;
}
.badge.stato-completata { background: #d5f5e3; color: #1e8449; }
.badge.stato-in_corso   { background: #fde3c8; color: #b9770e; }

.btn-elimina {
  background: none;
  color: #a32d2d;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
}
.btn-elimina:hover { background: #fcebeb; }
```

## 6.5 — `app.js`

Qui sta il cuore dell'esercizio: ogni interazione con l'API passa da `fetch` e dalle Promise.

```javascript
// app.js
const API = 'http://localhost:3000/api/v1';

// Lo stato dell'applicazione vive nel CLIENT (Lezione 06: stateless)
let token = null;
let ruolo = null;

// ── Riferimenti agli elementi ──────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

// ═══════════════════════════════════════════════════════════════════════════
// FUNZIONI DI COMUNICAZIONE CON L'API (tutte basate su fetch → Promise)
// ═══════════════════════════════════════════════════════════════════════════

// Helper generico: incapsula fetch, gestione errori e header di autenticazione.
// Restituisce una Promise che si risolve con i dati JSON, o si rifiuta con un errore.
async function chiamaAPI(percorso, opzioni = {}) {
  const headers = { 'Content-Type': 'application/json', ...opzioni.headers };

  // Se abbiamo un token, lo aggiungiamo all'header Authorization
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const risposta = await fetch(`${API}${percorso}`, { ...opzioni, headers });

  // IMPORTANTE: fetch NON lancia su 4xx/5xx. Controlliamo noi risposta.ok
  if (!risposta.ok) {
    const errore = await risposta.json().catch(() => ({ error: 'Errore sconosciuto' }));
    throw new Error(errore.error || `Errore HTTP ${risposta.status}`);
  }

  // 204 No Content non ha body da parsare
  if (risposta.status === 204) return null;

  return risposta.json();
}

// ── LOGIN — POST /auth/login ────────────────────────────────────────────────
function login(email, password) {
  // Ritorna la Promise di chiamaAPI, così chi chiama può usare .then/.catch
  return chiamaAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ── CARICA TASK — GET /tasks (con filtro opzionale) ─────────────────────────
function caricaTask(filtroStato = '') {
  const query = filtroStato ? `?stato=${filtroStato}&limit=50` : '?limit=50';
  return chiamaAPI(`/tasks${query}`);
}

// ── CREA TASK — POST /tasks ─────────────────────────────────────────────────
function creaTask(dati) {
  return chiamaAPI('/tasks', {
    method: 'POST',
    body: JSON.stringify(dati),
  });
}

// ── ELIMINA TASK — DELETE /tasks/:id ────────────────────────────────────────
function eliminaTask(id) {
  return chiamaAPI(`/tasks/${id}`, { method: 'DELETE' });
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════════════

function renderTask(risposta) {
  const lista = $('lista-task');
  const tasks = risposta.dati; // la risposta ha { dati, paginazione }

  if (tasks.length === 0) {
    lista.innerHTML = '<p class="caricamento">Nessuna task.</p>';
    return;
  }

  lista.innerHTML = tasks.map(t => `
    <div class="task priorita-${t.priorita}">
      <div class="task-info">
        <h3>${escapeHtml(t.titolo)}</h3>
        <p>${escapeHtml(t.descrizione || '')}</p>
        <div class="task-meta">
          <span class="badge stato-${t.stato}">${t.stato.replace('_', ' ')}</span>
          <span class="badge">priorità: ${t.priorita}</span>
        </div>
      </div>
      ${ruolo === 'admin' ? `<button class="btn-elimina" data-id="${t.id}">Elimina</button>` : ''}
    </div>
  `).join('');

  // Collega i bottoni elimina (solo se admin li ha renderizzati)
  document.querySelectorAll('.btn-elimina').forEach(btn => {
    btn.addEventListener('click', () => gestisciElimina(btn.dataset.id));
  });
}

// Previene l'iniezione di HTML dai dati (sicurezza di base lato client)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════════════
// GESTORI DEGLI EVENTI
// ═══════════════════════════════════════════════════════════════════════════

// LOGIN
$('btn-login').addEventListener('click', () => {
  const email = $('email').value;
  const password = $('password').value;
  $('errore-login').textContent = '';

  // Uso della Promise con .then/.catch
  login(email, password)
    .then(dati => {
      token = dati.token;   // salva il token (stato nel client)
      ruolo = dati.ruolo;

      // Aggiorna la UI
      $('stato-login').textContent = `Autenticato (${ruolo})`;
      $('stato-login').classList.add('attivo');
      $('sezione-login').classList.add('nascosto');
      $('sezione-crea').classList.remove('nascosto');

      aggiornaLista(); // ricarica con i permessi corretti
    })
    .catch(errore => {
      $('errore-login').textContent = errore.message;
    });
});

// CREA TASK
$('btn-crea').addEventListener('click', () => {
  const dati = {
    titolo: $('titolo').value,
    stato: $('stato').value,
    priorita: $('priorita').value,
  };
  $('errore-crea').textContent = '';

  // Qui uso async/await tramite una IIFE per mostrare l'alternativa a .then
  (async () => {
    try {
      await creaTask(dati);
      $('titolo').value = ''; // pulisci il form
      aggiornaLista();        // ricarica la lista
    } catch (errore) {
      $('errore-crea').textContent = errore.message;
    }
  })();
});

// ELIMINA TASK
function gestisciElimina(id) {
  eliminaTask(id)
    .then(() => aggiornaLista())
    .catch(errore => alert('Errore: ' + errore.message));
}

// FILTRO
$('filtro-stato').addEventListener('change', () => aggiornaLista());

// ═══════════════════════════════════════════════════════════════════════════
// FUNZIONE CENTRALE: ricarica la lista applicando il filtro corrente
// ═══════════════════════════════════════════════════════════════════════════
function aggiornaLista() {
  const filtro = $('filtro-stato').value;
  $('lista-task').innerHTML = '<p class="caricamento">Caricamento…</p>';

  caricaTask(filtro)
    .then(renderTask)
    .catch(errore => {
      $('lista-task').innerHTML = `<p class="caricamento">Errore: ${errore.message}</p>`;
    });
}

// ── Avvio: carica le task all'apertura della pagina ─────────────────────────
aggiornaLista();
```

## 6.6 — Avviare il tutto

**Attenzione al CORS.** Il frontend gira su un origin diverso dal backend. Il browser bloccherà le richieste per la policy CORS. Per farlo funzionare, aggiungi il middleware CORS al backend (lo approfondirai nella Lezione 08):

```bash
# nel progetto backend
npm install cors
```

```javascript
// app.js del backend — aggiungi in cima ai middleware
const cors = require('cors');
app.use(cors()); // per sviluppo: consente tutte le origini
```

Poi:

```bash
# Terminale 1 — backend
cd taskflow-api && npm run dev

# Terminale 2 — frontend (un semplice server statico)
cd taskflow-frontend && npx serve
# oppure apri index.html con l'estensione Live Server di VS Code
```

## Criteri di accettazione

- [ ] All'apertura, la pagina mostra la lista delle task (chiamata `GET /tasks` via fetch)
- [ ] Il login con `admin@taskflow.it` / `admin123` funziona e mostra "Autenticato (admin)"
- [ ] Dopo il login compare il form di creazione
- [ ] Creare una task la aggiunge alla lista senza ricaricare la pagina
- [ ] Il filtro per stato aggiorna la lista (nuova chiamata `GET /tasks?stato=…`)
- [ ] Solo da admin compaiono i bottoni "Elimina"
- [ ] Eliminare una task la rimuove dalla lista
- [ ] Nella console del browser (DevTools → Network) vedi le richieste fetch con i loro status code

---

# Consegna finale

## Cosa consegnare

1. **Backend** `taskflow-api/` (senza `node_modules`)
2. **Frontend** `taskflow-frontend/`
3. Un breve `README.md` che spieghi come avviare entrambi

## Griglia di autovalutazione

| Area | Cosa verificare | Lezione |
|---|---|---|
| Struttura | routes / controllers / middleware separati | 03 |
| Metodi HTTP | GET/POST/PUT/PATCH/DELETE usati correttamente | 02 |
| Codici di stato | 200/201/204/400/401/403/404 appropriati | 04 |
| Validazione | ajv con schema, additionalProperties: false | 05 |
| Statelessness | nessuna sessione server; token nel client | 06, 07 |
| Paginazione/filtri | funzionanti, con whitelist sull'ordinamento | 06 |
| Autenticazione | login JWT, route protette | 07 |
| Autorizzazione | 401 vs 403 distinti correttamente | 07 |
| Frontend | fetch + Promise, gestione di risposta.ok | 01, tutte |

## Estensioni facoltative (per chi finisce in anticipo)

- Aggiungi la **paginazione nel frontend**: bottoni "precedente/successivo" che usano l'oggetto `paginazione` della risposta
- Aggiungi un endpoint `GET /tasks/stats` che restituisce il conteggio delle task per stato
- Implementa il **refresh token** (Lezione 07, sezione 6)
- Aggiungi l'aggiornamento dello **stato di una task** dal frontend con una `PATCH` (es. un select su ogni task che chiama l'API)
- Sostituisci `alert()` con notifiche più eleganti nel frontend

---

*Fine esercitazione — Buon lavoro.*
