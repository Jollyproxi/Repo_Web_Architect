// middleware/validateBody.js
// Middleware factory: restituisce un middleware configurato con i campi obbligatori.
// Uso: validateBody(['nome', 'email']) → (req, res, next) => { ... }
//
// Separare la validazione dal controller ha un vantaggio chiave:
// il controller può assumere che i campi obbligatori esistano sempre,
// senza dover ripetere la stessa logica di controllo in ogni funzione.

const validateBody = (requiredFields) => {
  return (req, res, next) => {
    // Filtra i campi che mancano nel body o il cui valore è stringa vuota
    const missing = requiredFields.filter(
      field => req.body[field] === undefined || req.body[field] === ''
    );

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Campi obbligatori mancanti',
        campi_mancanti: missing,
      });
    }

    next();
  };
};

module.exports = { validateBody };
