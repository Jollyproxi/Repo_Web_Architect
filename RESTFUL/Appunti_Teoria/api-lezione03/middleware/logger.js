// middleware/logger.js
// Middleware personalizzato di logging.
// Logga metodo, URL, status code e tempo di risposta per ogni richiesta.

const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // res.on('finish') viene emesso DOPO che la risposta è stata inviata al client.
  // A quel punto res.statusCode è definitivo e possiamo calcolare la durata.
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    console.log(
      `[${timestamp}] ${req.method.padEnd(7)} ${req.originalUrl.padEnd(35)} ${statusColor}${res.statusCode}\x1b[0m  (${duration}ms)`
    );
  });

  next(); // FONDAMENTALE: senza next() la richiesta si blocca qui
};

// Colori ANSI per il terminale: verde 2xx, giallo 3xx, rosso 4xx/5xx
const getStatusColor = (code) => {
  if (code >= 500) return '\x1b[31m'; // rosso
  if (code >= 400) return '\x1b[33m'; // giallo
  if (code >= 300) return '\x1b[36m'; // cyan
  return '\x1b[32m';                  // verde
};

module.exports = { logger };
