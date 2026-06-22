# RESTful API — Lezione 05
## JSON: il formato dati delle API

---

## 1. Obiettivi della lezione

Al termine di questa lezione lo studente sarà in grado di:

- Descrivere la sintassi di JSON e i suoi tipi di dato
- Spiegare perché JSON si è affermato come formato dominante per le API rispetto a XML
- Usare `JSON.parse()` e `JSON.stringify()` con le loro opzioni avanzate (replacer, reviver, indentazione)
- Gestire i casi limite di serializzazione (date, `undefined`, `BigInt`, riferimenti circolari)
- Validare il JSON in ingresso con JSON Schema e la libreria `ajv`

---

## 2. Cos'è JSON

JSON (JavaScript Object Notation) è un formato testuale per lo scambio di dati. Nasce come sottoinsieme della sintassi degli oggetti letterali JavaScript, ma è oggi un formato indipendente dal linguaggio, supportato nativamente da quasi tutti i linguaggi di programmazione.

È il formato di rappresentazione (concetto visto nella Lezione 01) più usato nelle API REST: leggibile, compatto, parsabile in modo efficiente.

>  **Nota** — JSON è uno standard formale: ECMA-404 e RFC 8259. Nonostante derivi da JavaScript, "JSON" e "oggetto JavaScript" non sono la stessa cosa — un oggetto JavaScript può contenere funzioni, `undefined`, riferimenti circolari, mentre il JSON no.

---

## 3. Sintassi e tipi di dato

### 3.1 I tipi di JSON

JSON ammette esattamente sei tipi di valore:

| Tipo | Esempio | Note |
|---|---|---|
| String | `"ciao"` | Sempre con doppi apici, mai singoli |
| Number | `42`, `3.14`, `-1.5e3` | Un solo tipo numerico, nessuna distinzione int/float |
| Boolean | `true`, `false` | Minuscolo |
| Null | `null` | Assenza di valore |
| Object | `{ "chiave": "valore" }` | Coppie chiave-valore, chiavi sempre stringhe |
| Array | `[1, 2, 3]` | Lista ordinata di valori |

### 3.2 Esempio completo

```json
{
  "id": 42,
  "nome": "Mario Rossi",
  "attivo": true,
  "saldo": 1250.75,
  "ruolo": null,
  "tags": ["admin", "premium"],
  "indirizzo": {
    "via": "Via Roma 1",
    "città": "Torino",
    "cap": "10100"
  },
  "ordini": [
    { "id": 1, "totale": 99.90 },
    { "id": 2, "totale": 45.00 }
  ]
}
```

### 3.3 Regole di sintassi rigide

JSON è molto più rigido della sintassi JavaScript:

```json
// ❌ NON VALIDO in JSON:
{
  nome: "Mario",          // chiavi senza apici → ERRORE
  'cognome': 'Rossi',     // apici singoli → ERRORE
  "età": 30,              // virgola finale sotto → ERRORE
}                         // (trailing comma non ammessa)

// ✅ VALIDO:
{
  "nome": "Mario",
  "cognome": "Rossi",
  "età": 30
}
```

| Regola | JavaScript | JSON |
|---|---|---|
| Chiavi senza apici | ✅ permesso | ❌ vietato |
| Apici singoli | ✅ permesso | ❌ solo doppi apici |
| Trailing comma | ✅ permesso | ❌ vietato |
| Commenti (`//`, `/* */`) | ✅ permesso | ❌ vietato |
| `undefined` come valore | ✅ permesso | ❌ vietato |
| Funzioni come valore | ✅ permesso | ❌ vietato |

>  **Attenzione** — JSON non ammette commenti. Se hai bisogno di commenti in un file di configurazione, usa formati come JSON5 o YAML, oppure aggiungi un campo `"_commento"` come convenzione.

---

## 4. JSON vs XML

Prima di JSON, lo standard de facto per lo scambio dati era XML. Il confronto spiega perché JSON ha prevalso nelle API web.

Stesso dato nei due formati:

```json
// JSON
{
  "utente": {
    "id": 42,
    "nome": "Mario Rossi",
    "attivo": true
  }
}
```

```xml
<!-- XML -->
<utente>
  <id>42</id>
  <nome>Mario Rossi</nome>
  <attivo>true</attivo>
</utente>
```

| Aspetto | JSON | XML |
|---|---|---|
| Verbosità | Compatto | Verboso (tag di apertura e chiusura) |
| Tipi di dato | Nativi (number, boolean, null) | Tutto è testo, serve interpretazione |
| Parsing in JS | Nativo (`JSON.parse`) | Richiede DOM parser o librerie |
| Leggibilità | Alta | Media |
| Attributi/namespace | Non supportati | Supportati (più potente, più complesso) |
| Validazione schema | JSON Schema | XSD (più maturo) |
| Uso tipico oggi | API REST, web, mobile | Documenti, SOAP, configurazioni legacy |

>  **Best practice** — Per le API REST moderne, JSON è la scelta predefinita. XML rimane rilevante solo per integrazione con sistemi SOAP o legacy, o dove serve la potenza espressiva di namespace e schemi XSD.

---

## 5. Serializzazione e deserializzazione in JavaScript

I due termini chiave:

- **Serializzazione** — convertire una struttura dati in memoria (oggetto JavaScript) in una stringa JSON. Si fa con `JSON.stringify()`.
- **Deserializzazione** — convertire una stringa JSON in una struttura dati in memoria. Si fa con `JSON.parse()`.

```
Oggetto JS  ──JSON.stringify()──►  Stringa JSON  ──invio via HTTP──►
Stringa JSON  ──JSON.parse()──►  Oggetto JS
```

### 5.1 JSON.stringify() — serializzare

```javascript
const utente = {
  id: 42,
  nome: 'Mario Rossi',
  attivo: true,
};

const json = JSON.stringify(utente);
// '{"id":42,"nome":"Mario Rossi","attivo":true}'

console.log(typeof json); // "string"
```

**Indentazione leggibile** — il terzo parametro controlla la formattazione:

```javascript
JSON.stringify(utente, null, 2);
// {
//   "id": 42,
//   "nome": "Mario Rossi",
//   "attivo": true
// }
```

Il secondo parametro è il **replacer**, il terzo è lo **spazio di indentazione** (numero o stringa).

### 5.2 JSON.parse() — deserializzare

```javascript
const json = '{"id":42,"nome":"Mario Rossi","attivo":true}';

const utente = JSON.parse(json);
console.log(utente.nome);    // "Mario Rossi"
console.log(typeof utente);  // "object"
console.log(utente.id + 1);  // 43 (number, non string)
```

**Gestione degli errori di parsing** — `JSON.parse()` lancia un'eccezione se la stringa non è JSON valido:

```javascript
try {
  const dati = JSON.parse('{ nome: "Mario" }'); // chiavi senza apici → errore
} catch (err) {
  console.error('JSON non valido:', err.message);
  // JSON non valido: Unexpected token n in JSON at position 2
}
```

> **Nota** — In Express, `express.json()` chiama internamente `JSON.parse()` sul body. Se il client invia JSON malformato, Express genera automaticamente un errore che finisce nell'error handler (visto nella Lezione 04). È buona pratica gestirlo restituendo un `400 Bad Request`.

---

## 6. Opzioni avanzate

### 6.1 Replacer — filtrare e trasformare in serializzazione

Il replacer di `JSON.stringify` può essere un array di chiavi da includere, oppure una funzione di trasformazione.

**Replacer come array — whitelist di campi:**

```javascript
const utente = { id: 42, nome: 'Mario', password: 'segreto123', email: 'm@e.com' };

// Includi solo id, nome, email — escludi password
JSON.stringify(utente, ['id', 'nome', 'email']);
// '{"id":42,"nome":"Mario","email":"m@e.com"}'
```

**Replacer come funzione — trasformazione per chiave:**

```javascript
const dati = { nome: 'Mario', stipendio: 50000 };

JSON.stringify(dati, (chiave, valore) => {
  if (chiave === 'stipendio') return undefined; // rimuovi il campo
  return valore;
});
// '{"nome":"Mario"}'
```

> **Best practice** — Non inviare mai campi sensibili (password, token, hash) nelle risposte API. Il replacer è un modo, ma è più robusto escludere i campi a livello di controller o usare un metodo `toJSON()` sull'oggetto.

### 6.2 Reviver — trasformare in deserializzazione

Il secondo parametro di `JSON.parse` è il reviver: una funzione applicata a ogni coppia chiave-valore durante il parsing.

```javascript
const json = '{"nome":"Mario","creato":"2026-06-03T10:00:00.000Z"}';

const dati = JSON.parse(json, (chiave, valore) => {
  // Converti le stringhe ISO date in oggetti Date
  if (chiave === 'creato') return new Date(valore);
  return valore;
});

console.log(dati.creato instanceof Date); // true
```

### 6.3 toJSON() — personalizzare la serializzazione di un oggetto

Se un oggetto ha un metodo `toJSON()`, `JSON.stringify` lo usa al posto dell'oggetto stesso:

```javascript
class Utente {
  constructor(id, nome, password) {
    this.id = id;
    this.nome = nome;
    this.password = password;
  }

  // Controlla cosa viene serializzato — esclude la password
  toJSON() {
    return { id: this.id, nome: this.nome };
  }
}

const u = new Utente(42, 'Mario', 'segreto');
JSON.stringify(u);
// '{"id":42,"nome":"Mario"}' — password esclusa automaticamente
```

---

## 7. Casi limite della serializzazione

JSON non copre tutti i tipi di JavaScript. Questi casi vanno conosciuti perché generano bug silenziosi.

### 7.1 Date

Le date non sono un tipo JSON. `JSON.stringify` le converte automaticamente in stringa ISO 8601:

```javascript
JSON.stringify({ creato: new Date('2026-06-03T10:00:00Z') });
// '{"creato":"2026-06-03T10:00:00.000Z"}'
```

Ma al parsing, la stringa rimane stringa — non torna automaticamente un `Date`:

```javascript
const dati = JSON.parse('{"creato":"2026-06-03T10:00:00.000Z"}');
console.log(typeof dati.creato); // "string", NON Date
```

Per riconvertire, usa un reviver (sezione 6.2). Lo standard de facto per le date nelle API è **ISO 8601** (`2026-06-03T10:00:00Z`).

### 7.2 undefined e funzioni

Vengono semplicemente omessi (negli oggetti) o convertiti in `null` (negli array):

```javascript
JSON.stringify({ a: 1, b: undefined, c: function(){} });
// '{"a":1}' — b e c omessi

JSON.stringify([1, undefined, function(){}, 4]);
// '[1,null,null,4]' — undefined e funzioni diventano null
```

### 7.3 BigInt

`JSON.stringify` lancia un errore sui `BigInt`:

```javascript
JSON.stringify({ valore: 9007199254740993n });
// TypeError: Do not know how to serialize a BigInt
```

Soluzione: convertire esplicitamente in stringa prima di serializzare.

```javascript
JSON.stringify({ valore: 9007199254740993n.toString() });
// '{"valore":"9007199254740993"}'
```

### 7.4 NaN e Infinity

Diventano `null`:

```javascript
JSON.stringify({ a: NaN, b: Infinity, c: -Infinity });
// '{"a":null,"b":null,"c":null}'
```

### 7.5 Riferimenti circolari

`JSON.stringify` lancia un errore se l'oggetto contiene un riferimento a sé stesso:

```javascript
const obj = { nome: 'test' };
obj.self = obj; // riferimento circolare

JSON.stringify(obj);
// TypeError: Converting circular structure to JSON
```

### 7.6 Tabella riassuntiva dei casi limite

| Valore JavaScript | Risultato di JSON.stringify |
|---|---|
| `Date` | Stringa ISO 8601 |
| `undefined` (in oggetto) | Campo omesso |
| `undefined` (in array) | `null` |
| Funzione | Omessa (oggetto) / `null` (array) |
| `BigInt` | ❌ TypeError |
| `NaN`, `Infinity` | `null` |
| Riferimento circolare | ❌ TypeError |
| `Symbol` | Omesso |

---

## 8. Content-Type e negoziazione

Quando un server invia JSON, deve dichiararlo nell'header `Content-Type`:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

In Express, `res.json()` imposta automaticamente questo header:

```javascript
res.json({ id: 42 });
// Imposta Content-Type: application/json; charset=utf-8
// e serializza l'oggetto con JSON.stringify internamente
```

Sul lato richiesta, il client dichiara cosa accetta con `Accept` e cosa invia con `Content-Type`:

```http
POST /api/v1/users HTTP/1.1
Content-Type: application/json    ← il body che invio è JSON
Accept: application/json          ← voglio una risposta JSON
```

> **Attenzione** — Se un client invia un body JSON ma dimentica l'header `Content-Type: application/json`, il middleware `express.json()` non parsa il body e `req.body` resta vuoto. È una causa frequente di bug "il body arriva vuoto".

---

## 9. Validazione con JSON Schema

### 9.1 Perché validare

Non puoi fidarti dei dati in ingresso. Un client può inviare campi mancanti, tipi sbagliati, valori fuori range. La validazione manuale campo per campo (come fatto finora con `validateBody`) funziona per casi semplici, ma diventa ingestibile con strutture complesse.

JSON Schema è uno standard per descrivere la struttura attesa di un documento JSON, e validarlo automaticamente.

### 9.2 Anatomia di uno schema

```javascript
const schemaUtente = {
  type: 'object',
  properties: {
    nome:  { type: 'string', minLength: 2, maxLength: 50 },
    email: { type: 'string', format: 'email' },
    età:   { type: 'integer', minimum: 18, maximum: 120 },
    ruolo: { type: 'string', enum: ['admin', 'user'] },
  },
  required: ['nome', 'email'],
  additionalProperties: false, // rifiuta campi non dichiarati
};
```

| Keyword | Significato |
|---|---|
| `type` | Tipo atteso (`string`, `integer`, `number`, `boolean`, `object`, `array`) |
| `properties` | Definizione dei campi dell'oggetto |
| `required` | Array dei campi obbligatori |
| `minLength` / `maxLength` | Lunghezza delle stringhe |
| `minimum` / `maximum` | Range dei numeri |
| `enum` | Lista di valori ammessi |
| `format` | Formato semantico (`email`, `date-time`, `uri`) |
| `additionalProperties` | Se `false`, rifiuta campi non dichiarati |

### 9.3 Validare con ajv

`ajv` (Another JSON Validator) è la libreria di validazione JSON Schema più usata in Node.js.

```bash
npm install ajv ajv-formats
```

```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true }); // raccoglie tutti gli errori, non solo il primo
addFormats(ajv); // abilita format come 'email', 'date-time'

const schemaUtente = {
  type: 'object',
  properties: {
    nome:  { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    età:   { type: 'integer', minimum: 18 },
  },
  required: ['nome', 'email'],
  additionalProperties: false,
};

const validate = ajv.compile(schemaUtente);

const dati = { nome: 'M', email: 'non-una-email', età: 15 };

if (!validate(dati)) {
  console.log(validate.errors);
  // [
  //   { instancePath: '/nome', message: 'must NOT have fewer than 2 characters' },
  //   { instancePath: '/email', message: 'must match format "email"' },
  //   { instancePath: '/età', message: 'must be >= 18' }
  // ]
}
```

### 9.4 Middleware di validazione con ajv

Integriamo `ajv` come middleware Express riutilizzabile:

```javascript
// middleware/validateSchema.js
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Factory: riceve uno schema, restituisce un middleware
const validateSchema = (schema) => {
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    if (validate(req.body)) return next();

    // Trasforma gli errori di ajv in un formato leggibile
    const campi = {};
    validate.errors.forEach(err => {
      const campo = err.instancePath.replace('/', '') || err.params.missingProperty || 'body';
      campi[campo] = err.message;
    });

    res.status(400).json({
      error: 'Validazione fallita',
      campi,
    });
  };
};

module.exports = { validateSchema };
```

Uso nelle route:

```javascript
// routes/users.js
const { validateSchema } = require('../middleware/validateSchema');

const schemaCreaUtente = {
  type: 'object',
  properties: {
    nome:  { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    ruolo: { type: 'string', enum: ['admin', 'user'] },
  },
  required: ['nome', 'email'],
  additionalProperties: false,
};

router.post('/', validateSchema(schemaCreaUtente), ctrl.create);
```


---