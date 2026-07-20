// app.js
const express = require('express');
const cors = require('cors');
const app = express();

const routes = require('./routes/index');
const { logger } = require('./middleware/logger');

// Middleware
app.use(cors()); // per sviluppo: consente tutte le origini
app.use(express.json());
app.use(logger);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// API routes
app.use('/api/v1', routes);

// catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato', path: req.originalUrl });
});

// Error handler centralizzato
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.status || 500} — ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || 'Errore interno' });
});

module.exports = app;
