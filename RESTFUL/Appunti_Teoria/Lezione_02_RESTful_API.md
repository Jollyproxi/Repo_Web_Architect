# RESTful API — Lezione 02
## Metodi HTTP e semantica delle operazioni

| | |
|---|---|
| **Durata** | ~3 ore (2h teoria + 1h laboratorio) |
| **Modulo** | 02 / 13 |
| **Livello** | Intermedio |
| **Stack** | JavaScript / Node.js / Express |

---

## 1. Obiettivi della lezione

Al termine di questa lezione lo studente sarà in grado di:

- Descrivere il significato semantico di GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- Distinguere operazioni safe da operazioni idempotenti e applicare la distinzione nella progettazione delle route
- Implementare un server Express con route per tutti i metodi HTTP su una risorsa `/users`
- Testare le route con Postman verificando status code e comportamento atteso

---

## 2. Proprietà fondamentali dei metodi HTTP

Prima di esaminare i singoli metodi, è necessario definire due proprietà formali che determinano come i client, i proxy e i server possono comportarsi con una richiesta.

### 2.1 Safe (sicuro)

Un metodo è **safe** se non produce effetti collaterali osservabili sul server. Il client può eseguire una richiesta safe sapendo che non modificherà nulla.

Metodi safe: `GET`, `HEAD`, `OPTIONS`

"Non modifica nulla" non significa che il server non faccia niente — può loggare la richiesta, aggiornare contatori di analytics, ecc. Significa che quegli effetti non sono parte del contratto: il client non li ha richiesti e non può contarci.

### 2.2 Idempotente

Un metodo è **idempotente** se eseguirlo N volte produce lo stesso risultato di eseguirlo una volta sola. Lo stato finale del server è identico indipendentemente dal numero di ripetizioni.

| Metodo | Safe | Idempotente |
|---|---|---|
| `GET` | ✅ | ✅ |
| `HEAD` | ✅ | ✅ |
| `OPTIONS` | ✅ | ✅ |
| `PUT` | ❌ | ✅ |
| `DELETE` | ❌ | ✅ |
| `POST` | ❌ | ❌ |
| `PATCH` | ❌ | ❌ (di solito) |

> **Nota** — L'idempotenza non riguarda la risposta HTTP (che può cambiare), ma lo stato del server. Un secondo `DELETE /users/42` risponderà `404`, ma lo stato del server è lo stesso di dopo il primo `DELETE`: l'utente 42 non esiste.

### 2.3 Perché queste proprietà contano

- **Caching**: solo le risposte a richieste safe possono essere cacheable senza rischi
- **Retry automatico**: un proxy o un client può ritentare automaticamente solo richieste idempotenti in caso di timeout o errore di rete
- **Design delle API**: sapere quale metodo usare per un'operazione è una decisione architetturale, non stilistica

---

## 3. I metodi HTTP uno per uno

### 3.1 GET — Lettura

Recupera una rappresentazione di una risorsa. Non deve mai modificare lo stato del server.

```http
GET /users HTTP/1.1
Host: api.esempio.com
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "nome": "Mario Rossi" },
  { "id": 2, "nome": "Giulia Bianchi" }
]
```

**Regole d'uso:**

- Non mettere mai un body in una richiesta GET (tecnicamente possibile, semanticamente sbagliato e ignorato da molti server)
- I parametri vanno in query string: `GET /users?ruolo=admin&page=2`
- La risposta può (e dovrebbe) essere cacheable

---

### 3.2 POST — Creazione

Invia dati al server per creare una nuova risorsa. L'URL identifica il "contenitore" della nuova risorsa, non la risorsa stessa — che verrà creata dal server e avrà un ID assegnato da lui.

```http
POST /users HTTP/1.1
Host: api.esempio.com
Content-Type: application/json

{
  "nome": "Luca Verdi",
  "email": "luca@esempio.com"
}
```

```http
HTTP/1.1 201 Created
Location: /users/43
Content-Type: application/json

{
  "id": 43,
  "nome": "Luca Verdi",
  "email": "luca@esempio.com"
}
```

**Regole d'uso:**

- Status code corretto per la creazione: `201 Created`, non `200 OK`
- L'header `Location` nella risposta indica l'URL della risorsa appena creata
- POST non è idempotente: inviare la stessa richiesta due volte crea due risorse distinte

---

### 3.3 PUT — Sostituzione completa

Sostituisce interamente una risorsa esistente con la rappresentazione inviata nel body. Se la risorsa non esiste, alcuni server la creano (upsert); altri rispondono `404`.

```http
PUT /users/43 HTTP/1.1
Host: api.esempio.com
Content-Type: application/json

{
  "id": 43,
  "nome": "Luca Verdi",
  "email": "luca.verdi@nuovodominio.com",
  "ruolo": "admin"
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 43,
  "nome": "Luca Verdi",
  "email": "luca.verdi@nuovodominio.com",
  "ruolo": "admin"
}
```

**Regole d'uso:**

- Il body deve contenere la rappresentazione **completa** della risorsa
- Se ometti un campo, quel campo viene cancellato (o impostato al default) — questo è il comportamento atteso di PUT
- PUT è idempotente: inviare la stessa richiesta N volte produce sempre lo stesso stato finale

> **Attenzione** — L'errore più comune con PUT è usarlo come PATCH: inviare solo i campi da aggiornare. Il risultato è una risorsa parziale sul server, con i campi omessi azzerati o nulli.

---

### 3.4 PATCH — Aggiornamento parziale

Modifica parzialmente una risorsa. Nel body si inviano solo i campi da aggiornare, non l'intera rappresentazione.

```http
PATCH /users/43 HTTP/1.1
Host: api.esempio.com
Content-Type: application/json

{
  "email": "luca.verdi@nuovodominio.com"
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 43,
  "nome": "Luca Verdi",
  "email": "luca.verdi@nuovodominio.com",
  "ruolo": "admin"
}
```

**PUT vs PATCH — quando usare quale:**

| Situazione | Metodo corretto |
|---|---|
| Aggiornare tutti i campi di un profilo utente (form completo) | `PUT` |
| Cambiare solo l'email di un utente | `PATCH` |
| Aggiornare lo stato di un ordine da `pending` a `shipped` | `PATCH` |
| Sostituire interamente un documento di configurazione | `PUT` |

> **Nota** — PATCH non è formalmente idempotente per specifica (RFC 5789), perché il risultato dipende dallo stato corrente della risorsa. In pratica, per le API JSON semplici (non JSON Patch), si comporta spesso in modo idempotente — ma non puoi contarci come garanzia di protocollo.

---

### 3.5 DELETE — Eliminazione

Elimina la risorsa identificata dall'URL.

```http
DELETE /users/43 HTTP/1.1
Host: api.esempio.com
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

```http
HTTP/1.1 204 No Content
```

**Regole d'uso:**

- Status code corretto: `204 No Content` (operazione riuscita, nessun body da restituire)
- In alternativa, `200 OK` con un body che conferma l'eliminazione (meno comune)
- DELETE è idempotente: eliminare una risorsa già eliminata restituisce `404`, ma lo stato del server è identico — la risorsa non esiste in entrambi i casi
- Non includere body nella risposta `204`

---

### 3.6 HEAD — Solo headers

Identico a GET, ma il server restituisce solo gli headers, senza body. Usato per verificare l'esistenza di una risorsa, controllare metadati (dimensione, data di modifica) o validare la cache senza trasferire dati.

```http
HEAD /files/documento.pdf HTTP/1.1
Host: api.esempio.com
```

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 204800
Last-Modified: Wed, 01 Jun 2026 10:00:00 GMT
```

**Casi d'uso tipici:**

- Verificare se una risorsa esiste prima di fare un GET costoso
- Controllare `Content-Length` per sapere quanto pesa un file prima di scaricarlo
- Validare la cache tramite `Last-Modified` o `ETag`

---

### 3.7 OPTIONS — Capacità e CORS

Restituisce i metodi HTTP supportati per una data URL. Fondamentale nel meccanismo CORS (Cross-Origin Resource Sharing) per le **preflight request**.

```http
OPTIONS /users HTTP/1.1
Host: api.esempio.com
Origin: https://frontend.esempio.com
Access-Control-Request-Method: POST
```

```http
HTTP/1.1 204 No Content
Allow: GET, POST, OPTIONS
Access-Control-Allow-Origin: https://frontend.esempio.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

Il browser invia automaticamente una richiesta OPTIONS **prima** di qualsiasi richiesta cross-origin con metodi non-safe o headers custom. Il server deve rispondere correttamente altrimenti il browser blocca la richiesta successiva. Lo vedremo in dettaglio nella Lezione 08.

---

## 4. Errori semantici comuni

Questi sono gli errori di progettazione più frequenti nelle API REST alle prime armi:

| Errore | Esempio sbagliato | Correzione |
|---|---|---|
| Usare GET per operazioni che modificano dati | `GET /users/42/delete` | `DELETE /users/42` |
| Usare POST per tutto | `POST /users/42/update` con body | `PUT` o `PATCH /users/42` |
| Mettere il verbo nell'URL | `POST /createUser` | `POST /users` |
| Usare `200 OK` per la creazione | POST risponde `200` | POST risponde `201 Created` |
| Usare PUT inviando solo campi parziali | PUT con `{"email": "..."}` | Usare PATCH per aggiornamenti parziali |

> **Best practice** — L'URL identifica **cosa** (la risorsa). Il metodo HTTP dice **come** (l'operazione). Se senti il bisogno di mettere un verbo nell'URL, è quasi sempre un segnale che stai usando il metodo HTTP sbagliato.

---

## 5. Implementazione con Node.js ed Express

### 5.1 Setup del progetto

```bash
mkdir api-lezione02 && cd api-lezione02
npm init -y
npm install express
```

Struttura del progetto:

```
api-lezione02/
├── index.js
└── package.json
```

### 5.2 Server completo con tutti i metodi su /users

```javascript
// index.js
const express = require('express');
const app = express();

app.use(express.json()); // middleware per parsare il body JSON

// Database in memoria (array — si resetta al riavvio del server)
let users = [
  { id: 1, nome: 'Mario Rossi',   email: 'mario@esempio.com' },
  { id: 2, nome: 'Giulia Bianchi', email: 'giulia@esempio.com' },
];
let nextId = 3;

// ── GET /users — lista tutti gli utenti ─────────────────────────────────────
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// ── GET /users/:id — singolo utente ─────────────────────────────────────────
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  res.status(200).json(user);
});

// ── POST /users — crea un nuovo utente ──────────────────────────────────────
app.post('/users', (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'nome ed email sono obbligatori' });
  }

  const newUser = { id: nextId++, nome, email };
  users.push(newUser);

  res.status(201)
     .header('Location', `/users/${newUser.id}`)
     .json(newUser);
});

// ── PUT /users/:id — sostituisce completamente un utente ────────────────────
app.put('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Utente non trovato' });

  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ error: 'PUT richiede tutti i campi: nome, email' });
  }

  // Sostituzione completa — l'id rimane invariato
  users[index] = { id: users[index].id, nome, email };
  res.status(200).json(users[index]);
});

// ── PATCH /users/:id — aggiornamento parziale ───────────────────────────────
app.patch('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });

  // Aggiorna solo i campi presenti nel body
  if (req.body.nome  !== undefined) user.nome  = req.body.nome;
  if (req.body.email !== undefined) user.email = req.body.email;

  res.status(200).json(user);
});

// ── DELETE /users/:id — elimina un utente ───────────────────────────────────
app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Utente non trovato' });

  users.splice(index, 1);
  res.status(204).send(); // No Content — nessun body
});

// ── Avvio server ─────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
```

### 5.3 Avviare il server

```bash
node index.js
# → Server in ascolto su http://localhost:3000
```

---

## 6. Laboratorio (~1 ora)

**Obiettivo**: implementare il server della sezione 5 e testare ogni route con Postman, verificando che status code, headers e body corrispondano al comportamento atteso.

---

### Esercizio 1 — Setup e primo test

1. Creare il progetto e il file `index.js` con il codice della sezione 5.2
2. Avviare il server con `node index.js`
3. In Postman, creare una Collection `Lezione 02 - Metodi HTTP`
4. Aggiungere ed eseguire: `GET http://localhost:3000/users`
5. Verificare: status `200`, body è un array JSON con 2 utenti

---

### Esercizio 2 — Testare tutti i metodi

Per ogni richiesta, annota il **status code ricevuto** e confrontalo con quello atteso.

| # | Metodo | URL | Body | Status atteso |
|---|---|---|---|---|
| 1 | GET | `/users` | — | 200 |
| 2 | GET | `/users/1` | — | 200 |
| 3 | GET | `/users/99` | — | 404 |
| 4 | POST | `/users` | `{"nome":"Anna", "email":"anna@esempio.com"}` | 201 |
| 5 | POST | `/users` | `{"nome":"Anna"}` (email mancante) | 400 |
| 6 | PUT | `/users/1` | `{"nome":"Mario Rossi Aggiornato","email":"mario2@esempio.com"}` | 200 |
| 7 | PUT | `/users/1` | `{"nome":"Solo nome"}` (email mancante) | 400 |
| 8 | PATCH | `/users/2` | `{"email":"giulia.nuova@esempio.com"}` | 200 |
| 9 | DELETE | `/users/2` | — | 204 |
| 10 | DELETE | `/users/2` | — (stesso id, già eliminato) | 404 |

**Osservazione chiave per il punto 9 e 10**: il secondo DELETE restituisce `404`, ma lo stato del server è identico — l'utente 2 non esiste in entrambi i casi. Questo dimostra l'idempotenza di DELETE a livello di stato, anche se il codice di risposta cambia.

---

### Esercizio 3 — Verificare l'header Location dopo POST

1. Eseguire `POST /users` con un body valido
2. In Postman, aprire il tab **Headers** della risposta
3. Verificare la presenza dell'header `Location: /users/<id>`
4. Usare quel valore per eseguire un `GET /users/<id>` e recuperare la risorsa appena creata

---

### Esercizio 4 — Differenza PUT vs PATCH (esperimento)

1. Eseguire `GET /users/1` e annotare tutti i campi
2. Eseguire `PATCH /users/1` con body `{"email": "mario.patch@esempio.com"}`
3. Eseguire `GET /users/1` — il campo `nome` è rimasto invariato? ✅
4. Eseguire `PUT /users/1` con body `{"nome": "Solo Nome"}` (senza `email`)
5. Cosa risponde il server? Perché? (Hint: guarda la validazione nel codice)
6. Eseguire `PUT /users/1` con body completo — cosa cambia rispetto al PATCH?

---

### Domande di riflessione

- Perché `DELETE /users/99` risponde `404` mentre `DELETE /users/2` eseguito due volte risponde prima `204` poi `404`? Sono entrambi idempotenti?
- Cosa succede se esegui `POST /users` due volte con lo stesso body? Quanti utenti vengono creati?
- Il tuo server attuale gestisce `HEAD /users`? Prova a fare la richiesta — Express risponde automaticamente alle richieste HEAD per le route GET definite?

---

## 7. Riepilogo

| Metodo | Operazione | Safe | Idempotente | Status tipico |
|---|---|---|---|---|
| `GET` | Lettura | ✅ | ✅ | 200 |
| `POST` | Creazione | ❌ | ❌ | 201 |
| `PUT` | Sostituzione completa | ❌ | ✅ | 200 |
| `PATCH` | Aggiornamento parziale | ❌ | ❌ (di norma) | 200 |
| `DELETE` | Eliminazione | ❌ | ✅ | 204 |
| `HEAD` | Solo headers | ✅ | ✅ | 200 |
| `OPTIONS` | Capacità / CORS preflight | ✅ | ✅ | 204 |

---

## 8. Domande di verifica

1. Qual è la differenza tra un metodo safe e un metodo idempotente? Possono coesistere?
2. Perché POST non è idempotente? Fai un esempio concreto del problema che questo causa.
3. Hai un campo `ultimo_accesso` su un record utente. Vuoi aggiornarlo senza toccare gli altri campi. Quale metodo usi? Perché?
4. Un client fa `DELETE /orders/500` e riceve `404`. Può ritentare automaticamente la richiesta? Perché?
5. Qual è la differenza semantica tra rispondere `200 OK` e `201 Created` a una POST?
6. Quando il browser invia automaticamente una richiesta OPTIONS? Cosa si aspetta come risposta?

---

## 9. Riferimenti

- RFC 9110 — *HTTP Semantics*, sezioni 9.1–9.9 — definizione formale di tutti i metodi
- RFC 5789 — *PATCH Method for HTTP* (2010)
- MDN Web Docs — [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- Express.js docs — [Routing](https://expressjs.com/en/guide/routing.html)

---

*Fine Lezione 02 — Prossima lezione: Struttura di una REST API*
