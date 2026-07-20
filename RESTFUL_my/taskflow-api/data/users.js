// data/users.js
const bcrypt = require('bcryptjs');

const users = [
  { id: 1, email: 'admin@taskflow.it', passwordHash: bcrypt.hashSync('admin123', 10), ruolo: 'admin' },
  { id: 2, email: 'user@taskflow.it',  passwordHash: bcrypt.hashSync('user123', 10),  ruolo: 'user'  },
];

module.exports = {
  findByEmail: (email) => users.find(u => u.email === email),
};
