# Esercizio — Lezione 01
## Chiamare l'API di Open-Meteo

| | |
|---|---|
| **Lezione di riferimento** | 01 — Introduzione alle REST API |
| **Difficoltà** | ⭐ Semplice |
| **Strumenti** | curl, Postman, browser |
| **Autenticazione** | Nessuna — l'API è pubblica e gratuita |

---

## Obiettivo

Effettuare chiamate reali a un'API REST pubblica, leggere la risposta JSON, identificare i parametri nella query string e osservare il comportamento dell'API al variare dei parametri.

---

## Contesto: cos'è Open-Meteo

Open-Meteo è un'API meteo gratuita, open source, senza registrazione. Risponde a chiamate `GET` con dati JSON. È un caso d'uso reale e semplice: pochi parametri obbligatori, risposta JSON ben strutturata, nessun token da gestire.

URL base dell'API di previsione:

```
https://api.open-meteo.com/v1/forecast
```

Parametri obbligatori:

| Parametro | Tipo | Descrizione |
|---|---|---|
| `latitude` | float | Latitudine della posizione |
| `longitude` | float | Longitudine della posizione |

Almeno uno tra `current`, `hourly` o `daily` deve essere specificato, altrimenti l'API risponde `400`.

---

## Parte 1 — Prima chiamata con curl

### Richiesta: meteo attuale per Torino

Torino: latitudine `45.07`, longitudine `7.69`

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=45.07&longitude=7.69&current=temperature_2m,wind_speed_10m,relative_humidity_2m"
```

### Risposta attesa (struttura):

```json
{
  "latitude": 45.0625,
  "longitude": 6.875,
  "generationtime_ms": 0.052,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 281.0,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "wind_speed_10m": "km/h",
    "relative_humidity_2m": "%"
  },
  "current": {
    "time": "2026-06-03T09:00",
    "interval": 900,
    "temperature_2m": 18.4,
    "wind_speed_10m": 7.2,
    "relative_humidity_2m": 62
  }
}
```

### Domande da rispondere:

1. Qual è il codice di stato HTTP della risposta?
2. Qual è il `Content-Type` dell'header di risposta?
3. La latitudine restituita (`45.0625`) è diversa da quella richiesta (`45.07`). Perché secondo te?
4. Cosa contiene il campo `current_units`? A cosa serve averlo nella risposta?

---

## Parte 2 — Esplorare i parametri

### Aggiungere la temperatura percepita e le precipitazioni

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=45.07&longitude=7.69&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m"
```

Il parametro `current` accetta più variabili separate da virgola. Ogni variabile aggiunta è un campo in più nella risposta.

---

### Cambiare unità di misura

Di default la temperatura è in °C e la velocità del vento in km/h. Puoi cambiarle:

```bash
# Temperatura in Fahrenheit, vento in nodi
curl "https://api.open-meteo.com/v1/forecast?latitude=45.07&longitude=7.69&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=kn"
```

Confronta la risposta con quella della Parte 1 — i valori numerici cambiano, la struttura JSON no.

---

### Cosa succede con parametri errati?

```bash
# Variabile inesistente
curl "https://api.open-meteo.com/v1/forecast?latitude=45.07&longitude=7.69&current=temperatura_sbagliata"
```

```bash
# Latitudine mancante
curl "https://api.open-meteo.com/v1/forecast?longitude=7.69&current=temperature_2m"
```

**Domande:**
- Qual è il codice di stato HTTP in entrambi i casi?
- Cosa contiene il campo `reason` nella risposta di errore?
- Questo comportamento è coerente con quanto visto in lezione sui codici `4xx`?

---

## Parte 3 — Stessa chiamata in Postman

1. Aprire Postman → nuova richiesta `GET`
2. Incollare nell'URL:
   ```
   https://api.open-meteo.com/v1/forecast
   ```
3. Andare nel tab **Params** e aggiungere i parametri come coppie chiave-valore:

   | KEY | VALUE |
   |---|---|
   | `latitude` | `45.07` |
   | `longitude` | `7.69` |
   | `current` | `temperature_2m,wind_speed_10m,relative_humidity_2m` |

4. Cliccare **Send**

Postman costruisce automaticamente la query string — osserva come appare la URL finale nella barra degli indirizzi.

**Confronto curl vs Postman:**
- Il risultato è identico?
- Quali header aggiunge automaticamente Postman che curl non aggiunge?
- Nel tab **Headers** della risposta, trova `Content-Encoding`. A cosa serve?

---

## Parte 4 — Previsione per 3 città

Effettua la chiamata per ognuna delle tre città e annota i risultati nella tabella:

| Città | Latitudine | Longitudine |
|---|---|---|
| Milano | 45.46 | 9.19 |
| Roma | 41.89 | 12.48 |
| Palermo | 38.11 | 13.36 |

```bash
# Esempio per Milano
curl "https://api.open-meteo.com/v1/forecast?latitude=45.46&longitude=9.19&current=temperature_2m,apparent_temperature,precipitation"
```

Tabella da compilare con i valori ottenuti:

| Città | Temperatura (°C) | Temperatura percepita (°C) | Precipitazioni (mm) |
|---|---|---|---|
| Milano | | | |
| Roma | | | |
| Palermo | | | |

**Domanda finale**: hai fatto 3 richieste separate. Esiste un modo per chiedere i dati di più città in una sola chiamata? (Hint: cerca nella documentazione il supporto a liste di coordinate separate da virgola nel parametro `latitude`.)

---

## Riepilogo dei concetti applicati

| Concetto (Lezione 01) | Come si manifesta in questo esercizio |
|---|---|
| Protocollo HTTP | Chiamata `GET` con query string |
| Metodo safe | `GET` non modifica nulla sul server meteo |
| Query string | `?latitude=...&longitude=...&current=...` |
| Status code | `200` per chiamate corrette, `400` per parametri errati |
| JSON come rappresentazione | La risposta è `application/json` |
| Content negotiation | L'API risponde sempre JSON — nessuna negoziazione necessaria |
| Stateless | Ogni chiamata è indipendente, non serve sessione |
