// middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/authController');

const autentica = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token scaduto' : 'Token non valido';
    return res.status(401).json({ error: msg });
  }
};

const autorizza = (...ruoli) => (req, res, next) => {
  if (!ruoli.includes(req.user.ruolo)) {
    return res.status(403).json({ error: 'Permessi insufficienti' });
  }
  next();
};

module.exports = { autentica, autorizza };
