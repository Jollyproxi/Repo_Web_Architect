// utils/errors.js
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

const notFound = (msg) => new AppError(msg || 'Risorsa non trovata', 404);
const badReq   = (msg) => new AppError(msg || 'Richiesta non valida', 400);

module.exports = { AppError, notFound, badReq };
