// middleware/logger.js
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const durata = Date.now() - start;
    console.log(`${req.method.padEnd(6)} ${req.originalUrl.padEnd(30)} ${res.statusCode} (${durata}ms)`);
  });
  next();
};

module.exports = { logger };
