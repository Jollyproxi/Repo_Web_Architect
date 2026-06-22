// controllers/usersController.js
// Contiene la logica di business per la risorsa /users.
// Legge req, opera sui dati, scrive res.
// Non conosce i dettagli del routing (URL, metodo HTTP).

// ── Database in memoria ───────────────────────────────────────────────────────
// In un progetto reale questo layer sarebbe sostituito da chiamate a un ORM/database.
let users = [
  { id: 1, nome: 'Mario Rossi',    email: 'mario@esempio.com',  ruolo: 'admin' },
  { id: 2, nome: 'Giulia Bianchi', email: 'giulia@esempio.com', ruolo: 'user'  },
  { id: 3, nome: 'Luca Verdi',     email: 'luca@esempio.com',   ruolo: 'user'  },
];
let nextId = 4;

// ── Helper ────────────────────────────────────────────────────────────────────
const findById = (id) => users.find(u => u.id === parseInt(id));
const findIndexById = (id) => users.findIndex(u => u.id === parseInt(id));

// ── GET /api/v1/users ─────────────────────────────────────────────────────────
// Supporta filtro opzionale via query string: ?ruolo=admin
const getAll = (req, res) => {
  const { ruolo } = req.query;

  let result = users;
  if (ruolo) {
    result = users.filter(u => u.ruolo === ruolo);
  }

  res.status(200).json(result);
};

// ── GET /api/v1/users/:id ─────────────────────────────────────────────────────
const getOne = (req, res) => {
  const user = findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  res.status(200).json(user);
};

// ── POST /api/v1/users ────────────────────────────────────────────────────────
// La validazione dei campi obbligatori è delegata al middleware validateBody.
const create = (req, res) => {
  const { nome, email, ruolo = 'user' } = req.body;

  // Controllo duplicati email
  const esiste = users.find(u => u.email === email);
  if (esiste) {
    return res.status(409).json({ error: `Email '${email}' già registrata` });
  }

  const newUser = { id: nextId++, nome, email, ruolo };
  users.push(newUser);

  res
    .status(201)
    .header('Location', `/api/v1/users/${newUser.id}`)
    .json(newUser);
};

// ── PUT /api/v1/users/:id ─────────────────────────────────────────────────────
// Sostituzione completa. La validazione dei campi obbligatori è nel middleware.
const replace = (req, res) => {
  const index = findIndexById(req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Utente non trovato' });

  const { nome, email, ruolo = 'user' } = req.body;

  // Controlla duplicati email escludendo l'utente stesso
  const duplicato = users.find(u => u.email === email && u.id !== users[index].id);
  if (duplicato) {
    return res.status(409).json({ error: `Email '${email}' già usata da un altro utente` });
  }

  users[index] = { id: users[index].id, nome, email, ruolo };
  res.status(200).json(users[index]);
};

// ── PATCH /api/v1/users/:id ───────────────────────────────────────────────────
// Aggiornamento parziale: aggiorna solo i campi presenti nel body.
const update = (req, res) => {
  const user = findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });

  const campiAggiornabili = ['nome', 'email', 'ruolo'];
  campiAggiornabili.forEach(campo => {
    if (req.body[campo] !== undefined) {
      user[campo] = req.body[campo];
    }
  });

  res.status(200).json(user);
};

// ── DELETE /api/v1/users/:id ──────────────────────────────────────────────────
const remove = (req, res) => {
  const index = findIndexById(req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Utente non trovato' });

  users.splice(index, 1);
  res.status(204).send();
};

module.exports = { getAll, getOne, create, replace, update, remove };
