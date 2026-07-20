# RESTful API — Lezione 07
## Autenticazione e autorizzazione

| | |
|---|---|
| **Durata** | ~3 ore (2h teoria + 1h laboratorio) |
| **Modulo** | 07 / 13 |
| **Livello** | Intermedio |
| **Stack** | JavaScript / Node.js / Express |

---

## 1. Obiettivi della lezione

Al termine di questa lezione lo studente sarà in grado di:

- Distinguere autenticazione da autorizzazione e applicare la distinzione nelle API
- Descrivere i principali meccanismi di autenticazione (API Key, JWT, sessioni) e i loro trade-off
- Spiegare la struttura di un JWT e come viene firmato e verificato
- Implementare login e route protette con JWT in Express
- Riconoscere il ruolo di access token e refresh token e i flussi OAuth 2.0 di base

---

## 2. Autenticazione vs autorizzazione

La distinzione è fondamentale e spesso confusa. Sono due domande diverse.

| | Autenticazione | Autorizzazione |
|---|---|---|
| **Domanda** | Chi sei? | Cosa puoi fare? |
| **Verifica** | L'identità del client | I permessi del client |
| **Quando** | Prima | Dopo l'autenticazione |
| **Codice HTTP se fallisce** | `401 Unauthorized` | `403 Forbidden` |
| **Esempio** | Login con email e password | "Solo gli admin possono eliminare utenti" |

Collegamento con la Lezione 04: `401` significa "non so chi sei" (autenticazione mancante o fallita), `403` significa "so chi sei, ma non puoi farlo" (autorizzazione negata). L'ordine è sempre autenticazione prima, autorizzazione dopo.

> 📘 **Nota** — Il nome dell'header HTTP `Authorization` è storicamente fuorviante: trasporta le credenziali di *autenticazione*, non di autorizzazione. È un'incoerenza terminologica ereditata dalle prime specifiche HTTP.

---

## 3. Meccanismi di autenticazione

### 3.1 API Key

Una stringa segreta che identifica il client. Inviata a ogni richiesta, tipicamente in un header.

```http
GET /api/v1/dati HTTP/1.1
X-API-Key: sk_live_a1b2c3d4e5f6...
```

**Caratteristiche:**
- Semplice da implementare
- Identifica un'applicazione o un progetto, non un singolo utente
- Non contiene informazioni: è solo un identificatore da confrontare con un archivio server-side
- Adatta a comunicazione server-to-server, integrazioni, accesso a dati pubblici con rate limiting

**Limite:** se compromessa, dà accesso completo finché non viene revocata. Va trattata come una password.

### 3.2 Sessioni con cookie (stateful)

Il meccanismo tradizionale del web. Al login, il server crea una sessione, la memorizza (in memoria o database), e invia al client un cookie con l'ID di sessione.

```
1. POST /login (email, password)
   → il server crea sessione, salva { sessionId: abc, userId: 42 }
   → risponde con Set-Cookie: sessionId=abc

2. GET /profilo
   Cookie: sessionId=abc
   → il server cerca abc nel suo store, trova userId 42
```

**Il problema con REST:** questo approccio è **stateful**. Il server mantiene lo stato della sessione in memoria. Come visto nella Lezione 06, questo complica la scalabilità orizzontale — ogni server deve accedere allo stesso session store.

### 3.3 JWT (token stateless)

Il meccanismo più usato nelle API REST moderne. Al login il server genera un token firmato che contiene le informazioni sull'utente. Il client lo invia a ogni richiesta. Il server verifica la firma senza consultare alcun archivio.

```
1. POST /login (email, password)
   → il server genera un JWT firmato che contiene { userId: 42, ruolo: "admin" }
   → risponde con il token

2. GET /profilo
   Authorization: Bearer eyJhbGc...
   → il server verifica la firma del token e legge userId 42 dal token stesso
   → nessun accesso al database per l'autenticazione
```

**Il vantaggio chiave:** è **stateless**. Il server non memorizza nulla. Qualsiasi server con la chiave segreta può verificare il token. Questo è coerente con il vincolo stateless di REST.

| Meccanismo | Stato server | Uso tipico |
|---|---|---|
| API Key | Stateful (lookup) | Server-to-server, integrazioni |
| Sessione + cookie | Stateful (session store) | Web app tradizionali |
| JWT | Stateless | API REST, SPA, mobile |

---

## 4. JWT in dettaglio

### 4.1 Struttura

Un JWT è una stringa composta da tre parti separate da punti:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJydW9sbyI6ImFkbWluIn0.dQw4w9WgXcQ
└──────────── header ────────────┘ └──────────── payload ────────────┘ └── signature ──┘
```

Ogni parte è codificata in Base64URL (non cifrata — solo codificata).

**Header** — algoritmo di firma e tipo:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** — le informazioni (dette "claim"):

```json
{
  "userId": 42,
  "ruolo": "admin",
  "iat": 1717401600,
  "exp": 1717405200
}
```

**Signature** — firma crittografica di header e payload usando una chiave segreta.

### 4.2 Claim standard

Alcuni claim hanno significato standardizzato (RFC 7519):

| Claim | Nome | Significato |
|---|---|---|
| `iss` | Issuer | Chi ha emesso il token |
| `sub` | Subject | Il soggetto (tipicamente l'user id) |
| `exp` | Expiration | Timestamp di scadenza (Unix) |
| `iat` | Issued At | Timestamp di emissione |
| `aud` | Audience | Destinatario previsto del token |

Puoi aggiungere claim personalizzati (come `ruolo` nell'esempio), ma non mettere mai dati sensibili nel payload.

### 4.3 Il punto critico: il payload NON è cifrato

> ⚠️ **Attenzione** — Il payload di un JWT è codificato in Base64, **non cifrato**. Chiunque può decodificarlo e leggerne il contenuto. Non mettere MAI nel payload password, dati di carte di credito, o informazioni riservate. La firma garantisce che il token non sia stato *modificato*, non che sia *segreto*.

Puoi verificarlo tu stesso: prendi un JWT, incolla la parte centrale in un decoder Base64, e leggerai il payload in chiaro.

### 4.4 Come funziona la firma

Il server calcola la firma così (semplificato per HS256):

```
signature = HMAC-SHA256(
   base64url(header) + "." + base64url(payload),
   chiave_segreta
)
```

Quando il token torna, il server ricalcola la firma con la stessa chiave segreta e la confronta. Se combaciano, il token è autentico e non è stato modificato. Se qualcuno altera il payload (es. cambia `ruolo` da `user` ad `admin`), la firma non corrisponderà più, perché non conosce la chiave segreta.

Questo è ciò che rende il JWT sicuro pur essendo leggibile: **integrità garantita dalla firma, non segretezza del contenuto**.

### 4.5 Algoritmi di firma: HS256 vs RS256

| | HS256 (simmetrico) | RS256 (asimmetrico) |
|---|---|---|
| Chiavi | Una chiave segreta condivisa | Coppia chiave privata/pubblica |
| Firma | Con la chiave segreta | Con la chiave privata |
| Verifica | Con la stessa chiave segreta | Con la chiave pubblica |
| Uso | Un solo servizio firma e verifica | Un servizio firma, molti verificano |

Per un'API monolitica, HS256 è sufficiente. RS256 serve quando più servizi devono verificare token emessi da un unico authorization server (comune in architetture a microservizi).

---

## 5. Implementazione JWT in Express

[VERIFICATO] I pattern seguenti riflettono l'API stabile della libreria `jsonwebtoken`, lo standard de facto per JWT in Node.js. [INCERTO] I numeri di versione esatti possono essere cambiati dopo gennaio 2026: installa la versione corrente e verifica il changelog se noti differenze nell'API.

### 5.1 Setup

```bash
npm install jsonwebtoken bcryptjs
```

- `jsonwebtoken` — generazione e verifica dei JWT
- `bcryptjs` — hashing sicuro delle password (implementazione in JS puro, senza dipendenze native; esiste anche `bcrypt` con binding nativi, più veloce ma con compilazione)

> ⚠️ **Attenzione — la chiave segreta.** In produzione, la chiave segreta per firmare i JWT deve stare in una variabile d'ambiente (`process.env.JWT_SECRET`), MAI hardcoded nel codice o committata su Git. Negli esempi la scrivo inline solo per leggibilità didattica.

### 5.2 Hashing delle password

Non salvare MAI le password in chiaro. Si salva l'hash, calcolato con un algoritmo lento e salato come bcrypt.

```javascript
const bcrypt = require('bcryptjs');

// In fase di registrazione — hash della password
const hash = await bcrypt.hash('passwordUtente', 10); // 10 = cost factor
// hash → '$2a$10$N9qo8uLOickgx2ZMRZoMy...' — questo si salva nel database

// In fase di login — confronto
const corretta = await bcrypt.compare('passwordInserita', hash);
// corretta → true o false
```

> 📘 **Nota** — bcrypt è volutamente lento e integra un "salt" casuale in ogni hash. Questo rende gli attacchi a forza bruta e tramite rainbow table computazionalmente costosi. Non usare mai MD5 o SHA per le password: sono troppo veloci e quindi vulnerabili.

### 5.3 Generare un token al login

```javascript
// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In produzione: process.env.JWT_SECRET
const JWT_SECRET = 'chiave-segreta-solo-per-demo';

// Simulazione di utenti con password già hashate
let users = [
  { id: 1, email: 'admin@esempio.com', passwordHash: bcrypt.hashSync('admin123', 10), ruolo: 'admin' },
  { id: 2, email: 'user@esempio.com',  passwordHash: bcrypt.hashSync('user123', 10),  ruolo: 'user'  },
];

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email e password sono obbligatori' });
  }

  const user = users.find(u => u.email === email);

  // Nota: stesso messaggio se l'utente non esiste o se la password è errata.
  // Non rivelare quale dei due è sbagliato — è una misura di sicurezza.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  // Genera il token con i claim necessari
  const token = jwt.sign(
    { userId: user.id, ruolo: user.ruolo },  // payload
    JWT_SECRET,                               // chiave segreta
    { expiresIn: '1h' }                       // scadenza
  );

  res.status(200).json({ token, scadenza: '1h' });
};

module.exports = { login };
```

### 5.4 Middleware di verifica del token

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'chiave-segreta-solo-per-demo';

// Verifica che la richiesta abbia un JWT valido
const autentica = (req, res, next) => {
  const header = req.headers['authorization'];

  // Formato atteso: "Bearer <token>"
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante o formato non valido' });
  }

  const token = header.split(' ')[1];

  try {
    // verify lancia un'eccezione se la firma è invalida o il token è scaduto
    const payload = jwt.verify(token, JWT_SECRET);

    // Rende disponibili i dati dell'utente ai controller successivi
    req.user = payload; // { userId, ruolo, iat, exp }
    next();
  } catch (err) {
    // jwt.verify distingue tra token scaduto e firma non valida
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token scaduto' });
    }
    return res.status(401).json({ error: 'Token non valido' });
  }
};

module.exports = { autentica };
```

### 5.5 Middleware di autorizzazione per ruolo

L'autenticazione stabilisce chi sei. L'autorizzazione controlla cosa puoi fare. Questo è un secondo middleware, applicato dopo `autentica`.

```javascript
// middleware/auth.js — aggiunta

// Factory: restituisce un middleware che consente solo i ruoli indicati
const autorizza = (...ruoliAmmessi) => {
  return (req, res, next) => {
    // req.user è stato popolato da autentica() — deve girare prima
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticazione richiesta' });
    }

    if (!ruoliAmmessi.includes(req.user.ruolo)) {
      return res.status(403).json({
        error: 'Permessi insufficienti',
        ruolo_richiesto: ruoliAmmessi,
        ruolo_attuale: req.user.ruolo,
      });
    }

    next();
  };
};

module.exports = { autentica, autorizza };
```

### 5.6 Applicare i middleware alle route

```javascript
// routes/users.js
const { autentica, autorizza } = require('../middleware/auth');

// Pubblica — nessuna autenticazione
router.get('/', ctrl.getAll);

// Protetta — richiede un token valido (qualsiasi utente autenticato)
router.get('/:id', autentica, ctrl.getOne);

// Protetta + autorizzata — solo gli admin possono eliminare
router.delete('/:id', autentica, autorizza('admin'), ctrl.remove);
```

L'ordine dei middleware è significativo: `autentica` popola `req.user`, `autorizza` lo legge. Invertirli romperebbe la catena.

---

## 6. Access token e refresh token

### 6.1 Il dilemma della durata

Un JWT ha una scadenza. Quale scegliere?

- **Scadenza lunga** (es. 30 giorni): comodo, ma se il token è rubato, l'attaccante ha accesso a lungo. E un JWT stateless non si può revocare facilmente.
- **Scadenza breve** (es. 15 minuti): più sicuro, ma l'utente dovrebbe rifare login di continuo.

La soluzione standard: due token con ruoli diversi.

### 6.2 Il pattern a due token

| | Access token | Refresh token |
|---|---|---|
| Durata | Breve (5-15 min) | Lunga (giorni/settimane) |
| Uso | Inviato a ogni richiesta API | Usato solo per ottenere un nuovo access token |
| Se rubato | Danno limitato nel tempo | Più pericoloso → va protetto meglio |
| Dove si conserva | Memoria del client | Cookie httpOnly o storage sicuro |

Il flusso:

```
1. Login → il server restituisce access token (15 min) + refresh token (7 giorni)

2. Il client usa l'access token per le richieste API

3. Dopo 15 min l'access token scade → richiesta risponde 401

4. Il client invia il refresh token a POST /auth/refresh
   → il server verifica il refresh token e restituisce un nuovo access token

5. Il client riprende con il nuovo access token — senza rifare login
```

> 📘 **Nota** — A differenza dell'access token, il refresh token spesso viene tenuto in un archivio server-side proprio per poterlo revocare (logout, furto sospetto). Questo reintroduce un po' di stato, ma solo sul refresh, non su ogni richiesta API. È un compromesso deliberato tra la purezza stateless e la sicurezza.

---

## 7. OAuth 2.0 — panoramica

OAuth 2.0 è il framework standard per l'autorizzazione delegata: permettere a un'applicazione di accedere a risorse per conto di un utente, senza che l'utente condivida la propria password con quell'applicazione. È ciò che c'è dietro "Accedi con Google/GitHub".

### 7.1 I ruoli

| Ruolo | Chi è | Esempio |
|---|---|---|
| Resource Owner | L'utente proprietario dei dati | Tu |
| Client | L'app che vuole accedere ai dati | Un sito che usa "login con Google" |
| Authorization Server | Chi autentica e rilascia i token | Google |
| Resource Server | Chi ospita i dati protetti | L'API di Google |

### 7.2 Authorization Code Flow (semplificato)

Il flusso più comune per le applicazioni web:

```
1. L'utente clicca "Accedi con Google" sul sito (Client)

2. Il Client redirige l'utente a Google (Authorization Server)

3. L'utente si autentica su Google e autorizza il Client
   (l'utente inserisce la password SU Google, mai sul Client)

4. Google redirige l'utente al Client con un "authorization code"

5. Il Client scambia il code con Google per un access token
   (questo scambio avviene server-to-server, non nel browser)

6. Il Client usa l'access token per accedere ai dati dell'utente
```

Il punto chiave di sicurezza: l'utente inserisce la password solo sull'Authorization Server (Google), mai sul Client. Il Client non vede mai le credenziali dell'utente. Riceve solo un token con permessi limitati.

L'implementazione pratica di OAuth (con provider reali, gestione dei redirect, sicurezza del flusso) è oggetto della Lezione 08.

---

## 8. Laboratorio (~1 ora)

**Obiettivo**: aggiungere autenticazione JWT completa al progetto — login, route protette, autorizzazione per ruolo.

---

### Esercizio 1 — Setup e login

1. Installa le dipendenze: `npm install jsonwebtoken bcryptjs`
2. Crea `controllers/authController.js` con il codice della sezione 5.3
3. Crea `routes/auth.js` con la route `POST /login`
4. Registra il router in `routes/index.js` sotto `/auth`
5. Testa in Postman:

| Richiesta | Body | Esito atteso |
|---|---|---|
| `POST /api/v1/auth/login` | `{"email":"admin@esempio.com","password":"admin123"}` | 200 + token |
| `POST /api/v1/auth/login` | `{"email":"admin@esempio.com","password":"sbagliata"}` | 401 |
| `POST /api/v1/auth/login` | `{"email":"inesistente@x.com","password":"x"}` | 401 |

Copia il token ricevuto: serve per gli esercizi successivi.

---

### Esercizio 2 — Ispezionare il token

1. Copia il token JWT ricevuto dal login
2. Vai su un decoder JWT (o decodifica la parte centrale in Base64)
3. Osserva il payload: cosa contiene? Trovi `userId`, `ruolo`, `iat`, `exp`?
4. Domanda: il payload è leggibile senza conoscere la chiave segreta. Perché allora il token è considerato sicuro?

---

### Esercizio 3 — Proteggere le route

1. Crea `middleware/auth.js` con `autentica` (sezione 5.4)
2. Applica `autentica` alla route `GET /api/v1/users/:id`
3. Testa:

| Richiesta | Header Authorization | Esito atteso |
|---|---|---|
| `GET /api/v1/users/1` | (nessuno) | 401 |
| `GET /api/v1/users/1` | `Bearer <token valido>` | 200 |
| `GET /api/v1/users/1` | `Bearer token-inventato` | 401 |
| `GET /api/v1/users/1` | `<token senza "Bearer ">` | 401 |

---

### Esercizio 4 — Autorizzazione per ruolo

1. Aggiungi `autorizza` a `middleware/auth.js` (sezione 5.5)
2. Proteggi `DELETE /api/v1/users/:id` con `autentica` + `autorizza('admin')`
3. Testa con due token diversi:

| Token (login come) | Richiesta | Esito atteso |
|---|---|---|
| `admin@esempio.com` | `DELETE /api/v1/users/2` | 204 |
| `user@esempio.com` | `DELETE /api/v1/users/2` | 403 |
| (nessun token) | `DELETE /api/v1/users/2` | 401 |

Verifica la distinzione: senza token → `401` (non autenticato), con token `user` → `403` (autenticato ma non autorizzato).

---

### Esercizio 5 — Scadenza del token

1. Nel login, cambia temporaneamente `expiresIn` da `'1h'` a `'10s'`
2. Fai login, copia il token
3. Usa subito il token su una route protetta → funziona
4. Aspetta 10 secondi, riusa lo stesso token → cosa risponde?
5. Verifica che il messaggio di errore sia "Token scaduto" e non "Token non valido"

---

### Domande di riflessione

- Perché al login si restituisce lo stesso messaggio di errore (`401 Credenziali non valide`) sia se l'email non esiste sia se la password è sbagliata?
- Cosa succederebbe se un attaccante modificasse il campo `ruolo` nel payload di un JWT da `user` ad `admin`? Il server se ne accorgerebbe? Come?
- Perché bcrypt è preferibile a SHA-256 per l'hashing delle password, anche se SHA-256 è crittograficamente robusto?
- Un JWT stateless non è facilmente revocabile. Se un utente fa logout, il suo token è ancora tecnicamente valido fino alla scadenza. Come mitiga questo problema il pattern access/refresh token?

---

## 9. Riepilogo

| Concetto | Punto chiave |
|---|---|
| **Autenticazione** | Chi sei. Fallisce → `401` |
| **Autorizzazione** | Cosa puoi fare. Fallisce → `403` |
| **API Key** | Identificatore semplice, server-to-server |
| **Sessione+cookie** | Stateful, web tradizionale |
| **JWT** | Stateless, standard per API REST |
| **Struttura JWT** | header.payload.signature, Base64URL |
| **Payload** | Codificato NON cifrato — mai dati sensibili |
| **Firma** | Garantisce integrità, non segretezza |
| **bcrypt** | Hashing lento e salato per le password |
| **Access/refresh token** | Access breve per le richieste, refresh lungo per rinnovare |
| **OAuth 2.0** | Autorizzazione delegata — "login con Google" |

---

## 10. Domande di verifica

1. Qual è la differenza tra autenticazione e autorizzazione? A quali codici HTTP corrispondono i rispettivi fallimenti?
2. Descrivi le tre parti di un JWT. Quale garantisce che il token non sia stato modificato?
3. Il payload di un JWT è cifrato? Cosa implica questo per i dati che ci puoi mettere?
4. Perché il JWT è considerato "stateless" e perché questo è coerente con i principi REST?
5. A cosa serve il pattern access token + refresh token? Quale problema risolve?
6. Nel flusso OAuth 2.0 Authorization Code, l'utente inserisce la propria password sul Client? Dove la inserisce e perché è importante?

---

## 11. Riferimenti

- RFC 7519 — *JSON Web Token (JWT)*
- RFC 6749 — *The OAuth 2.0 Authorization Framework*
- RFC 6750 — *OAuth 2.0 Bearer Token Usage*
- jsonwebtoken — pacchetto npm (verificare la versione corrente e la documentazione)
- bcrypt / bcryptjs — pacchetti npm per l'hashing delle password
- OWASP — *Authentication Cheat Sheet* e *JWT Cheat Sheet*
- jwt.io — decoder interattivo e documentazione sui JWT

---

*Fine Lezione 07 — Prossima lezione: Integrazione con provider di autenticazione e sicurezza*
