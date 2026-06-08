# RESTful API — Lezione 01
## Introduzione alle REST API


---

## 1. Obiettivi della lezione

- Descrivere il modello architetturale client-server e il ruolo di HTTP
- Spiegare cos'è REST e come si differenzia da altri stili architetturali (SOAP, RPC)
- Leggere e interpretare una URL RESTful nei suoi componenti
- Effettuare chiamate HTTP di base con Postman, curl e browser DevTools
- Riconoscere i componenti fondamentali di una HTTP request e response

---

## 2. Architettura client-server

### 2.1 Il modello a ruoli separati

Il web è costruito su un principio di separazione netta: il client richiede risorse, il server le eroga. Nessuno dei due deve sapere come l'altro è implementato internamente — conta solo il contratto tra i due: il protocollo.

| Componente | Responsabilità |
|---|---|
| **Client** | Inizia la richiesta. Può essere un browser, un'app mobile, uno script Node.js, curl. Non conosce i dettagli interni del server. |
| **Server** | Riceve la richiesta, elabora la logica di business, restituisce una risposta. Non conosce il tipo di client. |
| **Protocollo (HTTP)** | Il contratto condiviso. Definisce il formato di richieste e risposte, i metodi, i codici di stato. |

> **OSServazione** — La separazione client-server è il primo vincolo architetturale di REST. Consente di evolvere client e server in modo indipendente, a patto che il contratto HTTP non si rompa.

### 2.2 Layered system

Tra client e server possono esistere layer intermedi: proxy, load balancer, CDN, API gateway. HTTP è progettato per funzionare attraverso questi layer in modo trasparente. Il client non sa (e non deve sapere) quanti hop fa la sua richiesta prima di raggiungere il server finale.

```
Client  →  CDN  →  Load Balancer  →  API Gateway  →  Server
         (cache)                    (auth, rate limit)
```

Ogni intermediario può agire sulla richiesta (es. rispondere dalla cache, bloccare un token non valido) senza che il client ne sia consapevole.

---

## 3. Il protocollo HTTP

### 3.1 Request/response cycle

HTTP è un protocollo testuale, stateless, basato su request-response. Ogni ciclo è indipendente dal precedente.

**Struttura di una HTTP Request:**

```http
GET /users/42 HTTP/1.1
Host: api.esempio.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

(body vuoto per GET)
```

**Struttura di una HTTP Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 89

{
  "id": 42,
  "nome": "Mario Rossi",
  "email": "mario@esempio.com"
}
```

Ogni messaggio HTTP è composto da tre parti:

1. **Start line** — metodo + URL + versione (request) oppure versione + status code (response)
2. **Headers** — metadati in formato `chiave: valore`, uno per riga
3. **Body** — payload opzionale, separato dagli header da una riga vuota

### 3.2 Anatomia degli headers

Gli header HTTP trasportano metadati sulla richiesta o risposta. Non fanno parte del payload, ma sono fondamentali per il comportamento del sistema.

| Header | Significato |
|---|---|
| `Content-Type` | Formato del body (es. `application/json`, `text/html`) |
| `Accept` | Formato che il client è in grado di ricevere |
| `Authorization` | Credenziali di accesso (Bearer token, Basic, ecc.) |
| `Cache-Control` | Istruzioni per il caching della risposta |
| `X-Request-ID` | ID univoco per il tracciamento della richiesta (custom header) |

Gli header che iniziano con `X-` sono convenzionalmente custom (non standard). Sono ancora molto diffusi ma formalmente deprecati dalla RFC 6648 (2012) a favore di nomi senza prefisso.

### 3.3 Anatomia di una URL

Una URL non è solo un indirizzo: ogni componente ha un significato preciso.

```
https://api.esempio.com:443/v1/users/42?fields=nome,email&lang=it#sezione
│─────┘ │───────────────│ │──│ │───────│ │──────────────────────│ │──────│
schema   host             porta  path     query string              fragment
```

| Componente | Valore nell'esempio | Uso tipico nelle API |
|---|---|---|
| Schema | `https` | Sempre `https` in produzione |
| Host | `api.esempio.com` | Dominio del server API |
| Porta | `443` | Implicita per `https` (omessa di solito) |
| Path | `/v1/users/42` | Identifica la risorsa |
| Query string | `fields=nome,email&lang=it` | Filtri, paginazione, opzioni |
| Fragment | `#sezione` | Non arriva al server — solo client-side |

> **Attenzione** — Il fragment (`#...`) non viene mai inviato al server. È gestito interamente dal browser/client. Non usarlo nelle API per veicolare parametri.

---

## 4. REST: definizione e vincoli architetturali

### 4.1 Origine e definizione

REST (Representational State Transfer) è uno stile architetturale — non un protocollo, non uno standard formale. Viene definito da Roy Fielding nella sua dissertazione di dottorato del 2000 come un insieme di vincoli che, se rispettati, producono un sistema web scalabile, manutenibile e interoperabile.

> **Nota** — REST non è HTTP. REST è uno stile che si appoggia su HTTP. Si potrebbe tecnicamente fare REST su altri protocolli, ma nella pratica HTTP è l'unica implementazione diffusa.

### 4.2 I sei vincoli di REST

| Vincolo | Significato pratico |
|---|---|
| **Client-Server** | Separazione netta dei ruoli. Client e server evolvono indipendentemente. |
| **Stateless** | Ogni richiesta deve contenere tutte le informazioni necessarie. Il server non mantiene stato tra una richiesta e l'altra. |
| **Cacheable** | Le risposte devono indicare se sono cacheable o meno. Il caching riduce il carico del server. |
| **Uniform Interface** | Interfaccia uniforme: metodi HTTP standard, URL per le risorse, rappresentazioni (JSON/XML). |
| **Layered System** | Il client non sa se è connesso al server finale o a un intermediario (proxy, CDN, gateway). |
| **Code on Demand** *(opzionale)* | Il server può inviare codice eseguibile al client (es. JavaScript). È l'unico vincolo opzionale. |

### 4.3 REST vs SOAP vs RPC

| | REST | SOAP | RPC (es. gRPC) |
|---|---|---|---|
| **Formato** | JSON / XML | Solo XML | Binario (Protocol Buffers) |
| **Protocollo** | HTTP | HTTP, SMTP, altri | HTTP/2 |
| **Contratto** | Informale (OpenAPI) | WSDL formale | Proto file (`.proto`) |
| **Curva di apprendimento** | Bassa | Alta | Media |
| **Uso tipico** | API pubbliche, web, mobile | Enterprise legacy, sistemi bancari | Microservizi interni ad alta performance |
| **Stato** | Stateless | Stateful possibile | Stateless / Streaming |

> **Best practice** — Per la quasi totalità dei progetti web moderni, REST + JSON è lo standard de facto. SOAP è rilevante solo per integrazione con sistemi legacy. gRPC è interessante per microservizi interni, ma esula dagli obiettivi di questo corso.

---

## 5. Risorse e rappresentazioni

### 5.1 Il concetto di risorsa

In REST, tutto è una risorsa. Una risorsa è qualsiasi concetto che ha un'identità e può essere indirizzato via URL:

- Un utente: `/users/42`
- Una collezione di utenti: `/users`
- Un ordine: `/orders/1001`
- Il profilo di un utente: `/users/42/profile`

Una risorsa è un'astrazione, non un record di database. `/users/42` rappresenta il concetto "utente con id 42", non la riga della tabella `users`. Questa distinzione sarà importante quando progetteremo la struttura delle route nella Lezione 03.

### 5.2 Rappresentazione vs risorsa

La risorsa esiste sul server. La rappresentazione è ciò che il server invia al client — una snapshot della risorsa in un formato negoziato (JSON, XML, HTML, CSV...).

```http
# La stessa risorsa /users/42 può essere rappresentata in modi diversi:

# Richiesta con preferenza JSON:
GET /users/42
Accept: application/json

# Risposta:
Content-Type: application/json
{ "id": 42, "nome": "Mario Rossi" }

# Richiesta con preferenza XML (raro, ma possibile):
GET /users/42
Accept: application/xml

# Risposta:
Content-Type: application/xml
<user><id>42</id><nome>Mario Rossi</nome></user>
```

>  **Nota** — Il server risponde con il formato che il client dichiara di accettare nell'header `Accept`. Se non supporta il formato richiesto, risponde `406 Not Acceptable`. Questo meccanismo si chiama **content negotiation**.

---

## 6. Strumenti del mestiere

### 6.1 Postman

Postman è lo strumento grafico più diffuso per testare e documentare API. Permette di:

- Costruire richieste HTTP con metodo, URL, headers e body
- Organizzare le richieste in Collection
- Scrivere test automatici in JavaScript
- Generare documentazione dalla Collection
- Condividere Collection con il team

> **Best practice** — Abituati a salvare ogni richiesta in una Collection, non ad eseguirle e buttarle. Le Collection diventano la documentazione pratica di un'API.

### 6.2 curl

curl è lo strumento da riga di comando per effettuare richieste HTTP. Disponibile su tutti i sistemi operativi. Utile in script, automazioni e ambienti server.

```bash
# GET semplice
curl https://jsonplaceholder.typicode.com/users/1

# GET con header personalizzato e output formattato
curl -H "Accept: application/json" https://api.github.com/users/octocat | json_pp

# POST con body JSON
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "test", "body": "contenuto", "userId": 1}'

# Mostrare headers della risposta (solo headers, no body)
curl -I https://jsonplaceholder.typicode.com/users/1

# Verbose: mostra request headers, response headers e body
curl -v https://jsonplaceholder.typicode.com/users/1
```

Flag curl più usati:

| Flag | Significato |
|---|---|
| `-X METHOD` | Specifica il metodo HTTP (GET è il default) |
| `-H "key: value"` | Aggiunge un header alla richiesta |
| `-d "body"` | Aggiunge un body alla richiesta |
| `-I` | Mostra solo gli headers della risposta (HEAD request) |
| `-v` | Verbose: mostra tutto il ciclo request/response |
| `-o file.json` | Salva la risposta su file invece che su stdout |

### 6.3 Browser DevTools

Il tab Network delle DevTools (F12) permette di ispezionare in tempo reale tutte le richieste HTTP effettuate da una pagina web.

| Tab DevTools | Utilità per le API |
|---|---|
| Network → All | Lista completa di tutte le richieste HTTP effettuate |
| Headers | Request headers, response headers, status code, URL completa |
| Payload | Body della richiesta (per POST/PUT) |
| Response | Body della risposta (JSON come testo grezzo) |
| Preview | Risposta JSON formattata e navigabile ad albero |
| Timing | Tempo di risposta, DNS lookup, TCP connect, TTFB |

### 6.4 API pubbliche per fare pratica

| API | URL base | Note |
|---|---|---|
| JSONPlaceholder | `jsonplaceholder.typicode.com` | API fake per test: users, posts, comments, todos. Nessuna auth. |
| GitHub API | `api.github.com` | Utenti, repository, commit. Rate limit 60 req/h senza token. |
| Open-Meteo | `api.open-meteo.com` | Dati meteo. Nessuna autenticazione richiesta. |

---

## 7. Laboratorio (~1 ora)

**Obiettivo**: esplorare API pubbliche reali con Postman e curl, analizzare request e response headers nelle DevTools, familiarizzare con la struttura delle risposte JSON.

---

### Esercizio 1 — Postman: esplorare JSONPlaceholder

1. Aprire Postman e creare una nuova Collection chiamata `Lezione 01 - Esplorazione`
2. Aggiungere una richiesta GET: `https://jsonplaceholder.typicode.com/users`
3. Eseguire e analizzare: status code, `Content-Type` header, struttura JSON della risposta
4. Aggiungere una seconda richiesta GET: `https://jsonplaceholder.typicode.com/users/1`
5. Confrontare la risposta: lista vs singolo oggetto — quali campi cambiano?
6. Aggiungere header `Accept: application/xml` — cosa risponde il server? Perché?

---

### Esercizio 2 — curl: chiamate da terminale

Esegui i seguenti comandi e osserva le risposte:

```bash
# 1. GET profilo utente GitHub
curl https://api.github.com/users/octocat

# 2. Mostrare solo gli headers della risposta — nota X-RateLimit-Remaining
curl -I https://api.github.com/users/octocat

# 3. GET meteo corrente per Roma (lat 41.9, lon 12.5)
curl "https://api.open-meteo.com/v1/forecast?latitude=41.9&longitude=12.5&current_weather=true"

# 4. POST su JSONPlaceholder (non persiste realmente, ma risponde correttamente)
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "La mia prima POST", "body": "Contenuto di test", "userId": 1}'
```

**Domande da rispondere dopo l'esercizio:**

- Qual è il codice di stato della POST? Perché è diverso dal GET?
- Cosa contiene l'header `X-RateLimit-Remaining` nella risposta di GitHub?
- Nella risposta del meteo, qual è il `Content-Type`?

---

### Esercizio 3 — DevTools: osservare il traffico HTTP

1. Aprire Chrome o Firefox, aprire DevTools (F12), andare sul tab Network
2. Navigare su `https://jsonplaceholder.typicode.com` — ci sono richieste XHR/Fetch automatiche?
3. Aprire una nuova scheda con `https://api.github.com/users/octocat`
4. In Network, cliccare sulla singola richiesta e analizzare:
   - `Request Headers` — cosa invia il browser automaticamente?
   - `Response Headers` — qual è il `Content-Type`? Quanto vale `Cache-Control`?
   - `Response Body` — come appare nel tab Preview vs Response?
5. Trovare e annotare: status code, tempo di risposta (Timing → TTFB)

> **Nota** — Nel tab Timing trovi il TTFB (Time To First Byte): il tempo che passa tra l'invio della richiesta e la ricezione del primo byte della risposta. È la metrica più significativa per la latenza di un'API.

---

## 8. Riepilogo

| Concetto | Da ricordare |
|---|---|
| **Client-Server** | Separazione di ruoli. Client richiede, server risponde. Nessuno dei due conosce i dettagli interni dell'altro. |
| **HTTP** | Protocollo stateless, testuale. Ogni ciclo request-response è indipendente. |
| **URL** | Identifica una risorsa. Schema + host + path + query string. Il fragment non arriva al server. |
| **REST** | Stile architetturale (non protocollo) basato su 6 vincoli. Usa HTTP come trasporto. |
| **Risorsa** | Astrazione indirizzabile via URL. Non è il record del database — è il concetto. |
| **Rappresentazione** | Il formato con cui la risorsa viene trasmessa (JSON, XML...). Negoziato via `Accept` header. |
| **Stateless** | Il server non ricorda nulla tra una richiesta e la successiva. Ogni richiesta deve essere autosufficiente. |

---

## 9. Domande di verifica

1. Qual è la differenza tra un'architettura client-server e un'architettura peer-to-peer?
2. Cosa significa che HTTP è "stateless"? Fai un esempio di problema che questo crea e come viene risolto.
3. Descrivi i componenti di questa URL: `https://api.negozio.it/v2/prodotti/123?colore=rosso`
4. REST è un protocollo? Elenca almeno 3 dei suoi vincoli architetturali.
5. Qual è la differenza tra una risorsa e la sua rappresentazione?
6. Quando useresti `curl` invece di Postman? Quando preferiresti Postman?

---

## 10. Riferimenti

- Roy T. Fielding — *Architectural Styles and the Design of Network-based Software Architectures* (2000) — la dissertazione originale che definisce REST
- RFC 9110 — *HTTP Semantics* (2022) — la specifica ufficiale e aggiornata di HTTP
- MDN Web Docs — [HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- JSONPlaceholder — [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)
- Postman Learning Center — [learning.postman.com](https://learning.postman.com)

---

*Fine Lezione 01 — Prossima lezione: Metodi HTTP e semantica delle operazioni*
