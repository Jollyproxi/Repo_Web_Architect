// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../data/users');

// In produzione: process.env.JWT_SECRET
const JWT_SECRET = 'chiave-demo-non-per-produzione';

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email e password obbligatori' });
  }

  const user = db.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const token = jwt.sign(
    { userId: user.id, ruolo: user.ruolo },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, ruolo: user.ruolo });
};

module.exports = { login, JWT_SECRET };
