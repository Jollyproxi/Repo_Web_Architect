# RESTful API — Lezione 06
## Interazioni stateless e gestione dello stato


## 1. Obiettivi della lezione

- Spiegare cosa significa che un'API è stateless e quali vantaggi porta
- Distinguere lo stato dell'applicazione (da non mantenere) dallo stato della risorsa (da mantenere)
- Implementare la paginazione con approccio offset-based e cursor-based
- Aggiungere filtri e ordinamento tramite query string
- Applicare il caching HTTP con `Cache-Control` ed `ETag`

---

## 2. Cosa significa stateless

### 2.1 Definizione

Un'API è stateless quando ogni richiesta contiene tutte le informazioni necessarie per essere elaborata, indipendentemente dalle richieste precedenti. Il server non conserva alcun contesto tra una richiesta e la successiva.

Questo è uno dei sei vincoli di REST visti nella Lezione 01. Ogni richiesta è un'unità autosufficiente.

```
Richiesta 1 → elaborata in isolamento → risposta 1
Richiesta 2 → elaborata in isolamento → risposta 2   (non sa nulla della richiesta 1)
Richiesta 3 → elaborata in isolamento → risposta 3   (non sa nulla di 1 e 2)
```

### 2.2 Cosa NON deve mantenere il server

Il server non deve conservare "memoria" tra le richieste:

- Non deve ricordare a che pagina di risultati era arrivato il client
- Non deve mantenere una sessione con lo stato di navigazione
- Non deve conservare dati temporanei legati a una specifica sequenza di richieste

Ogni informazione necessaria deve arrivare dal client a ogni richiesta: tramite URL, query string, header (es. il token di autenticazione) o body.

### 2.3 Un esempio concreto

**Approccio stateful (SBAGLIATO in REST):**

```
Richiesta 1: POST /carrello/aggiungi  { prodotto: "A" }
   → il server crea una sessione e ricorda "questo utente ha A nel carrello"

Richiesta 2: POST /carrello/aggiungi  { prodotto: "B" }
   → il server aggiunge B alla sessione ricordata

Richiesta 3: GET /carrello
   → il server restituisce [A, B] leggendo dalla sessione in memoria
```

Il problema: il server deve mantenere in memoria lo stato del carrello per ogni utente connesso. Se ci sono due server dietro un load balancer, la richiesta 2 potrebbe finire su un server che non conosce la sessione creata dalla richiesta 1.

**Approccio stateless (CORRETTO):**

```
Richiesta 1: POST /users/42/carrello/prodotti  { prodotto: "A" }
   → il server salva A nel carrello dell'utente 42 (nel database, non in memoria di sessione)

Richiesta 2: POST /users/42/carrello/prodotti  { prodotto: "B" }
   → il server salva B nel carrello dell'utente 42

Richiesta 3: GET /users/42/carrello
   → il server legge il carrello dell'utente 42 dal database
```

La differenza chiave: lo stato del carrello è una risorsa persistente nel database, identificata da un URL, non uno stato di sessione in memoria.

---

## 3. Stato dell'applicazione vs stato della risorsa

Questa distinzione risolve la confusione più comune sul concetto di stateless.

| | Stato dell'applicazione | Stato della risorsa |
|---|---|---|
| **Cos'è** | Dove si trova il client nella sua interazione | I dati persistenti gestiti dall'API |
| **Esempi** | "sono a pagina 3", "ho selezionato questo filtro", token di login | Utenti, ordini, prodotti nel database |
| **Chi lo mantiene** | Il **client** | Il **server** (nel database) |
| **In REST** | NON sul server | Sì, è il cuore dell'API |

> **Nota** — "Stateless" non significa che il server non ha stato. Il server ha eccome uno stato: il database pieno di risorse. Significa che non mantiene lo stato *dell'applicazione del client* — cioè dove il client si trova nel suo flusso di interazione. Quello è responsabilità del client.

Esempio: la paginazione. Il client che vuole la pagina 3 non conta sul server per ricordare "eri a pagina 2, quindi ora ti do la 3". Il client chiede esplicitamente `GET /users?page=3`. Lo stato "sono a pagina 3" vive nel client.

---

## 4. Vantaggi della statelessness

### 4.1 Scalabilità orizzontale

Se il server non mantiene stato di sessione, qualsiasi server può gestire qualsiasi richiesta. Puoi aggiungere server dietro un load balancer senza preoccuparti di quale server ha la sessione di quale utente.

```
                    ┌── Server A ──┐
Client → Load       ├── Server B ──┤ → Database condiviso
         Balancer   └── Server C ──┘

Ogni richiesta può andare su A, B o C indifferentemente:
nessuno di loro conserva stato, tutti leggono dal database.
```

### 4.2 Resilienza

Se un server cade, il load balancer redirige le richieste su un altro. Nessuna sessione persa, perché non c'era sessione in memoria da perdere.

### 4.3 Cacheability

Poiché ogni richiesta è autosufficiente, le risposte possono essere messe in cache in modo affidabile (lo vediamo nella sezione 8).

### 4.4 Semplicità

Non c'è da gestire scadenza delle sessioni, sincronizzazione dello stato tra server, memory leak da sessioni non chiuse.

> **Best practice** — L'autenticazione stateless si realizza con i token (es. JWT, Lezione 07): il token contiene tutte le informazioni sull'utente ed è inviato a ogni richiesta nell'header `Authorization`. Il server verifica il token senza mantenere una sessione lato server.

---

## 5. Paginazione

Quando una collezione contiene migliaia di elementi, restituirli tutti in una sola risposta è inefficiente e lento. La paginazione divide i risultati in "pagine".

### 5.1 Paginazione offset-based

L'approccio più semplice e diffuso: il client specifica quanti elementi saltare (`offset`) e quanti prenderne (`limit`). Spesso espresso come `page` e `limit`.

```
GET /users?page=1&limit=20    → elementi 1-20
GET /users?page=2&limit=20    → elementi 21-40
GET /users?page=3&limit=20    → elementi 41-60
```

La conversione da `page` a `offset`:

```javascript
const offset = (page - 1) * limit;
// page=1, limit=20 → offset=0  → elementi da 0 a 19
// page=2, limit=20 → offset=20 → elementi da 20 a 39
```

**Implementazione in Express:**

```javascript
const getAll = (req, res) => {
  // Parsare e validare i parametri, con default sensati
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const totale = users.length;
  const risultati = users.slice(offset, offset + limit);

  res.status(200).json({
    dati: risultati,
    paginazione: {
      pagina: page,
      per_pagina: limit,
      totale: totale,
      pagine_totali: Math.ceil(totale / limit),
    },
  });
};
```

Esempio di risposta:

```json
{
  "dati": [ { "id": 21, "nome": "..." }, ... ],
  "paginazione": {
    "pagina": 2,
    "per_pagina": 20,
    "totale": 137,
    "pagine_totali": 7
  }
}
```

> **Attenzione** — Imponi sempre un limite massimo a `limit` (nell'esempio, 100). Senza, un client può chiedere `?limit=999999999` e mettere in ginocchio il server. Non fidarti mai dei parametri in ingresso.

### 5.2 Il problema dell'offset-based

L'approccio offset ha un difetto con dati che cambiano frequentemente:

```
Tempo 1: il client legge page=1 (elementi 1-20)
Tempo 2: qualcuno inserisce un nuovo elemento in cima alla lista
Tempo 3: il client legge page=2 (elementi 21-40)
   → l'elemento che era in posizione 20 è slittato in posizione 21
   → il client lo rivede in page=2 (duplicato), oppure ne salta un altro
```

Inoltre, su dataset molto grandi, `OFFSET 1000000` è lento nei database perché il motore deve comunque scorrere il primo milione di righe per scartarle.

### 5.3 Paginazione cursor-based

L'approccio cursor risolve entrambi i problemi. Invece di "salta N elementi", si dice "dammi gli elementi che vengono dopo questo specifico elemento".

Il cursore è un riferimento stabile a una posizione, tipicamente l'id (o timestamp) dell'ultimo elemento ricevuto.

```
GET /users?limit=20
   → risposta con 20 elementi + un cursore "next" (es. id dell'ultimo: 20)

GET /users?limit=20&cursor=20
   → i 20 elementi con id > 20

GET /users?limit=20&cursor=40
   → i 20 elementi con id > 40
```

**Implementazione semplificata:**

```javascript
const getAll = (req, res) => {
  const limit  = Math.min(100, parseInt(req.query.limit) || 20);
  const cursor = parseInt(req.query.cursor) || 0;

  // Prendi gli elementi con id maggiore del cursore
  const risultati = users
    .filter(u => u.id > cursor)
    .slice(0, limit);

  // Il cursore per la pagina successiva è l'id dell'ultimo elemento
  const nextCursor = risultati.length > 0
    ? risultati[risultati.length - 1].id
    : null;

  res.status(200).json({
    dati: risultati,
    paginazione: {
      per_pagina: limit,
      next_cursor: nextCursor,
      ha_altre: risultati.length === limit,
    },
  });
};
```

### 5.4 Offset vs cursor — quando usare quale

| | Offset-based | Cursor-based |
|---|---|---|
| Semplicità | Alta | Media |
| "Vai a pagina 5" | ✅ Facile | ❌ Non supportato |
| Dati che cambiano spesso | ❌ Duplicati/salti | ✅ Stabile |
| Performance su grandi dataset | ❌ Lenta | ✅ Veloce |
| Uso tipico | Tabelle admin, cataloghi stabili | Feed social, timeline, log |

> **Best practice** — Usa offset-based quando serve saltare a pagine arbitrarie e i dati sono relativamente stabili. Usa cursor-based per feed infiniti, timeline e dataset molto grandi o in rapida evoluzione.

---

## 6. Filtri

I filtri permettono al client di richiedere solo un sottoinsieme della collezione, tramite query string.

```
GET /products?categoria=elettronica
GET /products?categoria=elettronica&disponibile=true
GET /products?prezzo_min=50&prezzo_max=200
```

**Implementazione con più filtri combinabili:**

```javascript
const getAll = (req, res) => {
  const { categoria, disponibile, prezzo_min, prezzo_max } = req.query;

  let risultati = [...products];

  if (categoria) {
    risultati = risultati.filter(p => p.categoria === categoria);
  }

  if (disponibile !== undefined) {
    const disp = disponibile === 'true';
    risultati = risultati.filter(p => p.disponibile === disp);
  }

  if (prezzo_min) {
    risultati = risultati.filter(p => p.prezzo >= parseFloat(prezzo_min));
  }

  if (prezzo_max) {
    risultati = risultati.filter(p => p.prezzo <= parseFloat(prezzo_max));
  }

  res.status(200).json({ dati: risultati, totale: risultati.length });
};
```

> **Nota** — I filtri si applicano prima della paginazione. L'ordine logico è: filtra → ordina → pagina. Così il conteggio totale e le pagine riflettono i risultati filtrati.

---

## 7. Ordinamento

L'ordinamento si esprime tipicamente con due parametri: il campo (`sort`) e la direzione (`order`).

```
GET /products?sort=prezzo&order=asc     → dal più economico
GET /products?sort=prezzo&order=desc    → dal più caro
GET /products?sort=nome&order=asc       → alfabetico
```

**Implementazione:**

```javascript
const getAll = (req, res) => {
  const { sort, order = 'asc' } = req.query;

  let risultati = [...products];

  if (sort) {
    // Whitelist dei campi ordinabili — mai fidarsi dell'input diretto
    const campiValidi = ['nome', 'prezzo', 'categoria'];

    if (!campiValidi.includes(sort)) {
      return res.status(400).json({
        error: `Ordinamento non valido. Campi ammessi: ${campiValidi.join(', ')}`,
      });
    }

    const direzione = order === 'desc' ? -1 : 1;
    risultati.sort((a, b) => {
      if (a[sort] < b[sort]) return -1 * direzione;
      if (a[sort] > b[sort]) return  1 * direzione;
      return 0;
    });
  }

  res.status(200).json({ dati: risultati });
};
```

> ⚠️ **Attenzione** — Usa sempre una whitelist dei campi ordinabili. Permettere l'ordinamento su un campo arbitrario passato dal client può esporre problemi di performance o, con un database SQL, aprire vulnerabilità. Non passare mai `req.query.sort` direttamente a una query.

---

## 8. Caching HTTP

Il caching riduce il carico sul server e la latenza per il client, evitando di ritrasferire dati che non sono cambiati. È possibile proprio grazie alla statelessness.

### 8.1 Cache-Control

L'header `Cache-Control` istruisce client e proxy su come e per quanto tempo memorizzare una risposta.

```http
HTTP/1.1 200 OK
Cache-Control: max-age=3600
Content-Type: application/json
```

| Direttiva | Significato |
|---|---|
| `max-age=3600` | La risposta è valida per 3600 secondi (1 ora) |
| `no-cache` | Rivalida sempre col server prima di usare la cache |
| `no-store` | Non memorizzare affatto (dati sensibili) |
| `private` | Solo la cache del browser, non i proxy condivisi |
| `public` | Qualsiasi cache può memorizzare |

```javascript
// Express — impostare Cache-Control su una risorsa che cambia raramente
app.get('/api/v1/categorie', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600'); // cache 1 ora
  res.json(categorie);
});

// Dati sensibili o sempre freschi — nessuna cache
app.get('/api/v1/users/:id/saldo', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ saldo: calcolaSaldo(req.params.id) });
});
```

### 8.2 ETag e richieste condizionali

L'`ETag` è un identificatore della versione di una risorsa (tipicamente un hash del contenuto). Permette al client di chiedere "è cambiato rispetto a quello che ho già?" senza riscaricare i dati.

Il flusso:

```
1. Prima richiesta:
   GET /users/42
   → 200 OK
     ETag: "abc123"
     { dati completi }

2. Richiesta successiva — il client invia l'ETag che ha:
   GET /users/42
   If-None-Match: "abc123"

3a. Se la risorsa NON è cambiata:
    → 304 Not Modified          (nessun body — il client usa la sua copia)

3b. Se la risorsa È cambiata:
    → 200 OK
      ETag: "def456"
      { nuovi dati }
```

Il vantaggio: quando la risorsa non cambia, il server risponde `304` senza trasferire il body. Su risorse grandi, il risparmio di banda è notevole.

```javascript
const crypto = require('crypto');

app.get('/api/v1/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });

  // Calcola un ETag come hash del contenuto
  const contenuto = JSON.stringify(user);
  const etag = crypto.createHash('md5').update(contenuto).digest('hex');

  // Il client ha già questa versione?
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified, nessun body
  }

  res.set('ETag', etag);
  res.json(user);
});
```

> 📘 **Nota** — Express imposta automaticamente un ETag "debole" sulle risposte inviate con `res.json()` o `res.send()`, e gestisce automaticamente il `304` quando arriva `If-None-Match`. L'esempio sopra mostra il meccanismo esplicito per capirlo; nella pratica spesso l'ETag automatico di Express è sufficiente.

### 8.3 Solo le richieste safe sono cacheable

Collegamento con la Lezione 02: solo le risposte a metodi safe (`GET`, `HEAD`) sono cacheable. Non ha senso mettere in cache la risposta a una `POST` o `DELETE`, perché quelle modificano lo stato.

---

## 9. Implementazione completa

Uniamo paginazione, filtri e ordinamento in un unico controller riutilizzabile.

```javascript
// controllers/productsController.js — getAll completo

const getAll = (req, res) => {
  const { categoria, disponibile, sort, order = 'asc' } = req.query;

  // ── 1. Filtra ─────────────────────────────────────────────────────────────
  let risultati = [...products];

  if (categoria) {
    risultati = risultati.filter(p => p.categoria === categoria);
  }
  if (disponibile !== undefined) {
    risultati = risultati.filter(p => p.disponibile === (disponibile === 'true'));
  }

  // ── 2. Ordina ─────────────────────────────────────────────────────────────
  if (sort) {
    const campiValidi = ['nome', 'prezzo', 'categoria'];
    if (!campiValidi.includes(sort)) {
      return res.status(400).json({
        error: `Ordinamento non valido. Campi ammessi: ${campiValidi.join(', ')}`,
      });
    }
    const dir = order === 'desc' ? -1 : 1;
    risultati.sort((a, b) => (a[sort] < b[sort] ? -dir : a[sort] > b[sort] ? dir : 0));
  }

  // ── 3. Pagina ─────────────────────────────────────────────────────────────
  const page  = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const totale = risultati.length;
  const pagina = risultati.slice(offset, offset + limit);

  // ── 4. Rispondi ───────────────────────────────────────────────────────────
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

---

## 10. Laboratorio (~1 ora)

**Obiettivo**: aggiungere paginazione, filtri e ordinamento al progetto, testando con un dataset grande generato dinamicamente.

---

### Esercizio 1 — Generare dati di test

Per testare la paginazione serve un dataset ampio. Aggiungi in `controllers/productsController.js` una generazione di 150 prodotti fittizi:

```javascript
const categorie = ['elettronica', 'accessori', 'casa', 'sport'];

let products = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  nome: `Prodotto ${i + 1}`,
  prezzo: Math.round((Math.random() * 500 + 10) * 100) / 100,
  categoria: categorie[i % categorie.length],
  disponibile: Math.random() > 0.3,
}));
```

---

### Esercizio 2 — Paginazione offset-based

Implementa la paginazione nel controller `getAll` (usa il codice della sezione 5.1). Poi testa in Postman:

| Richiesta | Verifica |
|---|---|
| `GET /api/v1/products?page=1&limit=20` | Ricevi 20 elementi, `pagina: 1` |
| `GET /api/v1/products?page=2&limit=20` | Ricevi i successivi 20, id diversi |
| `GET /api/v1/products?page=8&limit=20` | Ultima pagina parziale (150 elementi / 20 = 7.5) |
| `GET /api/v1/products?limit=999` | Il limit viene ridotto a 100 (max) |
| `GET /api/v1/products` | Default: pagina 1, 20 elementi |

---

### Esercizio 3 — Filtri e ordinamento combinati

Estendi `getAll` con filtri e ordinamento (sezione 9). Testa combinazioni:

```
GET /api/v1/products?categoria=elettronica
GET /api/v1/products?categoria=elettronica&disponibile=true
GET /api/v1/products?sort=prezzo&order=asc
GET /api/v1/products?sort=prezzo&order=desc&limit=5
GET /api/v1/products?categoria=sport&sort=prezzo&order=asc&page=1&limit=10
GET /api/v1/products?sort=campo_inesistente     → deve rispondere 400
```

Verifica che l'ordine di applicazione sia corretto: il conteggio `totale` deve riflettere i risultati filtrati, non l'intero dataset.

---

### Esercizio 4 — ETag e 304

1. Aggiungi il calcolo dell'ETag alla route `GET /api/v1/products/:id` (sezione 8.2)
2. In Postman, fai una prima `GET /api/v1/products/1` e copia il valore dell'header `ETag` dalla risposta
3. Rifai la richiesta aggiungendo l'header `If-None-Match` con quel valore
4. Verifica: ricevi `304 Not Modified` con body vuoto?
5. Modifica il prodotto 1 con una `PATCH`, poi ripeti la `GET` con lo stesso `If-None-Match`: ora ricevi `200` con nuovo ETag?

---

### Domande di riflessione

- Perché la paginazione offset-based può mostrare elementi duplicati se i dati cambiano tra una richiesta e l'altra? La cursor-based ha lo stesso problema?
- Se imposti `Cache-Control: max-age=3600` su una risorsa e poi la modifichi dopo 5 minuti, cosa vede un client che l'aveva già in cache?
- Perché è importante applicare i filtri prima della paginazione e non dopo?
- Un endpoint `/users/:id/saldo` che restituisce il saldo bancario dovrebbe avere `Cache-Control: max-age=3600`? Perché?

---

## 11. Riepilogo

| Concetto | Punto chiave |
|---|---|
| **Stateless** | Ogni richiesta è autosufficiente. Il server non ricorda nulla tra le richieste |
| **Stato applicazione vs risorsa** | Il client mantiene "dove si trova"; il server mantiene i dati persistenti |
| **Vantaggi** | Scalabilità orizzontale, resilienza, cacheability, semplicità |
| **Paginazione offset** | `page` + `limit`. Semplice, ma instabile su dati che cambiano |
| **Paginazione cursor** | `cursor` + `limit`. Stabile e veloce, ma niente "salto a pagina N" |
| **Filtri** | Via query string, applicati prima della paginazione |
| **Ordinamento** | `sort` + `order`. Sempre con whitelist dei campi |
| **Cache-Control** | `max-age`, `no-store`, `no-cache`. Solo su richieste safe |
| **ETag** | Identificatore di versione. Abilita il `304 Not Modified` |

---

## 12. Domande di verifica

1. Cosa significa che un'API REST è stateless? Il server ha comunque uno stato?
2. Qual è la differenza tra stato dell'applicazione e stato della risorsa? Chi mantiene ciascuno?
3. Come si converte un numero di pagina (`page`) in un offset? Scrivi la formula.
4. Quali sono i due problemi principali della paginazione offset-based e come li risolve la cursor-based?
5. Perché è importante limitare il valore massimo di `limit` in una richiesta di paginazione?
6. Cosa fa l'header `ETag`? Come porta un client a ricevere un `304 Not Modified`?

---

## 13. Riferimenti

- RFC 9110 — *HTTP Semantics*, sezione 8.8 (Validators, ETag) e sezione 5.6.3 (statelessness in REST)
- RFC 9111 — *HTTP Caching*
- MDN Web Docs — [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- MDN Web Docs — [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
- Roy T. Fielding — dissertazione REST, capitolo 5 (Stateless constraint)

---

*Fine Lezione 06 — Prossima lezione: Autenticazione e autorizzazione*
