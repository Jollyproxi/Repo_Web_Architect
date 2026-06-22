# api-lezione03

Esempio completo di REST API con **Node.js** ed **Express.js**, costruito seguendo i principi della Lezione 03 del corso RESTful API.

L'API gestisce due risorse — `users` e `products` — con tutte le operazioni CRUD, middleware personalizzati, validazione dei campi obbligatori e struttura a cartelle separata.

---

## Requisiti

- [Node.js](https://nodejs.org) v18 o superiore
- npm (incluso con Node.js)

Verifica l'installazione:

```bash
node -v   # es. v20.11.0
npm -v    # es. 10.2.4
```

---

## Installazione

```bash
# 1. Clona o scarica il progetto
cd api-lezione03

# 2. Installa le dipendenze
npm install
```

---

## Avvio

```bash
# Produzione (o uso normale)
npm start

# Sviluppo — si riavvia automaticamente ad ogni modifica
npm run dev
```

Il server parte su **http://localhost:3000**

Output atteso nel terminale:

```
  Server in ascolto su http://localhost:3000
   Ambiente : development
   Risorse  : /api/v1/users | /api/v1/products
```

---

## Struttura del progetto

```
api-lezione03/
├── index.js                  ← entry point: avvia il server HTTP
├── app.js                    ← configura Express, middleware, router
├── package.json
├── .gitignore
├── routes/
│   ├── index.js              ← aggrega tutti i router
│   ├── users.js              ← route per /api/v1/users
│   └── products.js           ← route per /api/v1/products
├── controllers/
│   ├── usersController.js    ← logica CRUD per users
│   └── productsController.js ← logica CRUD per products
└── middleware/
    ├── logger.js             ← logga ogni richiesta con status e durata
    └── validateBody.js       ← verifica la presenza dei campi obbligatori
```

### Responsabilità di ogni layer

| File / cartella | Cosa fa | Cosa NON fa |
|---|---|---|
| `index.js` | Avvia il server sulla porta | Qualsiasi logica applicativa |
| `app.js` | Configura middleware, monta router | Logica di business |
| `routes/` | Mappa URL+metodo → controller | Accede ai dati, valida |
| `controllers/` | Logica CRUD, legge `req`, scrive `res` | Conosce dettagli di routing |
| `middleware/` | Funzioni riutilizzabili nella catena | Logica specifica di una route |

---

## Endpoint disponibili

Base URL: `http://localhost:3000/api/v1`

### Users

| Metodo | URL | Descrizione |
|---|---|---|
| GET | `/users` | Lista tutti gli utenti |
| GET | `/users?ruolo=admin` | Filtra per ruolo (`admin` o `user`) |
| GET | `/users/:id` | Singolo utente per id |
| POST | `/users` | Crea un nuovo utente |
| PUT | `/users/:id` | Sostituisce completamente un utente |
| PATCH | `/users/:id` | Aggiorna uno o più campi |
| DELETE | `/users/:id` | Elimina un utente |

**Struttura utente:**

```json
{
  "id": 1,
  "nome": "Mario Rossi",
  "email": "mario@esempio.com",
  "ruolo": "admin"
}
```

Campi obbligatori per POST e PUT: `nome`, `email`
Campo opzionale: `ruolo` (default: `"user"`)

---

### Products

| Metodo | URL | Descrizione |
|---|---|---|
| GET | `/products` | Lista tutti i prodotti |
| GET | `/products?categoria=elettronica` | Filtra per categoria |
| GET | `/products?disponibile=true` | Filtra per disponibilità |
| GET | `/products/categoria/:categoria` | Filtra per categoria (route dedicata) |
| GET | `/products/:id` | Singolo prodotto per id |
| POST | `/products` | Crea un nuovo prodotto |
| PUT | `/products/:id` | Sostituisce completamente un prodotto |
| PATCH | `/products/:id` | Aggiorna uno o più campi |
| DELETE | `/products/:id` | Elimina un prodotto |

**Struttura prodotto:**

```json
{
  "id": 1,
  "nome": "Laptop Pro 15",
  "prezzo": 1299.99,
  "categoria": "elettronica",
  "disponibile": true
}
```

Campi obbligatori per POST e PUT: `nome`, `prezzo`
Campi opzionali: `categoria` (default: `"generico"`), `disponibile` (default: `true`)

---

### Altri endpoint

| Metodo | URL | Descrizione |
|---|---|---|
| GET | `/health` | Health check — verifica che il server sia attivo |

---

## Esempi di chiamate

### curl

```bash
# Lista tutti gli utenti
curl http://localhost:3000/api/v1/users

# Filtra utenti admin
curl "http://localhost:3000/api/v1/users?ruolo=admin"

# Singolo utente
curl http://localhost:3000/api/v1/users/1

# Crea un nuovo utente
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"nome": "Anna Neri", "email": "anna@esempio.com", "ruolo": "user"}'

# Aggiorna solo l'email (PATCH)
curl -X PATCH http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email": "mario.nuovo@esempio.com"}'

# Elimina un utente
curl -X DELETE http://localhost:3000/api/v1/users/1

# Lista prodotti per categoria
curl "http://localhost:3000/api/v1/products?categoria=elettronica"

# Lista prodotti disponibili
curl "http://localhost:3000/api/v1/products?disponibile=true"

# Crea un prodotto
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"nome": "Webcam HD", "prezzo": 79.90, "categoria": "accessori"}'

# Health check
curl http://localhost:3000/health
```

### Postman

Importa il file `api-lezione03.postman_collection.json` (se disponibile) oppure crea manualmente le richieste con gli endpoint della tabella sopra.

Ricorda di impostare:
- **Method**: il metodo HTTP corretto
- **Headers** (per POST/PUT/PATCH): `Content-Type: application/json`
- **Body** (per POST/PUT/PATCH): `raw` → `JSON`

---

## Codici di risposta

| Codice | Significato | Quando viene restituito |
|---|---|---|
| `200 OK` | Successo con body | GET, PUT, PATCH riusciti |
| `201 Created` | Risorsa creata | POST riuscito |
| `204 No Content` | Successo senza body | DELETE riuscito |
| `400 Bad Request` | Richiesta non valida | Campi obbligatori mancanti, tipo errato |
| `404 Not Found` | Risorsa non trovata | ID inesistente, URL non definita |
| `409 Conflict` | Conflitto | Email già registrata (users) |
| `500 Internal Server Error` | Errore del server | Errori non gestiti |

---

## Middleware inclusi

### `logger.js`

Logga ogni richiesta nel terminale con timestamp, metodo, URL, status code (colorato) e tempo di risposta.

```
[2026-06-03T09:15:00.000Z] GET     /api/v1/users                       200  (3ms)
[2026-06-03T09:15:05.000Z] POST    /api/v1/users                       201  (1ms)
[2026-06-03T09:15:12.000Z] GET     /api/v1/users/99                    404  (1ms)
[2026-06-03T09:15:20.000Z] DELETE  /api/v1/products/2                  204  (1ms)
```

### `validateBody.js`

Middleware factory che verifica la presenza dei campi obbligatori prima che la richiesta arrivi al controller.

```javascript
// Uso nelle route
router.post('/', validateBody(['nome', 'email']), ctrl.create);
```

Se mancano campi, risponde direttamente `400` senza invocare il controller:

```json
{
  "error": "Campi obbligatori mancanti",
  "campi_mancanti": ["email"]
}
```

---

## Note tecniche

**Dati in memoria** — Il database è un semplice array JavaScript. I dati si resettano ad ogni riavvio del server. Nelle lezioni successive verrà introdotta la persistenza su database reale.

**Nessuna autenticazione** — Le route sono pubbliche. L'autenticazione JWT verrà introdotta nella Lezione 07.

**`node_modules` escluso** — La cartella non è inclusa nel repository. Esegui `npm install` per ricrearla.

---

## Dipendenze

| Pacchetto | Versione | Uso |
|---|---|---|
| [express](https://www.npmjs.com/package/express) | ^4.18.2 | Framework web |
| [nodemon](https://www.npmjs.com/package/nodemon) | ^3.0.1 | Riavvio automatico in sviluppo (devDependency) |

---

## Prossimi passi (lezioni successive)

- **Lezione 04** — Codici di risposta HTTP: gestione errori più granulare
- **Lezione 05** — Validazione avanzata con JSON Schema (ajv)
- **Lezione 07** — Autenticazione con JWT
- **Lezione 12** — Test con Jest + Supertest
