// app.js
// Configura l'istanza Express: middleware globali, router, error handler.
// Viene importato da index.js (avvio server) e dai test (senza avviare il server).

const express = require('express');
const app = express();

const routes = require('./routes/index');
const { logger } = require('./middleware/logger');

// ── Middleware globali ────────────────────────────────────────────────────────
// L'ordine è importante: ogni middleware viene eseguito nell'ordine di registrazione.

app.use(express.json());  // parsare il body JSON → popola req.body
app.use(logger);          // loggare metodo, URL, status code e tempo di risposta

// ── Montaggio dei router ──────────────────────────────────────────────────────
// Tutte le route sono prefissate con /api/v1
app.use('/api/v1', routes);

// ── Route di health check ─────────────────────────────────────────────────────
// Utile per verificare che il server sia attivo (usato da load balancer, CI/CD, ecc.)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all 404 ─────────────────────────────────────────────────────────────
// Intercetta qualsiasi URL non gestita dalle route precedenti.
// Deve stare DOPO tutti i router e PRIMA dell'error handler.
app.use((req, res) => {
  res.status(404).json({
    error: 'Risorsa non trovata',
    path: req.originalUrl,
  });
});

// ── Error handler ─────────────────────────────────────────────────────────────
// Firma speciale a 4 parametri (err, req, res, next) — Express la riconosce come error handler.
// Viene invocato quando una route chiama next(err) oppure lancia un errore.
// Deve stare SEMPRE in fondo, dopo tutte le route.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Errore interno del server',
  });
});

module.exports = app;
