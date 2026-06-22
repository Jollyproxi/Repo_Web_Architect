// controllers/productsController.js
// Contiene la logica di business per la risorsa /products.

// ── Database in memoria ───────────────────────────────────────────────────────
let products = [
  { id: 1, nome: 'Laptop Pro 15',  prezzo: 1299.99, categoria: 'elettronica',  disponibile: true  },
  { id: 2, nome: 'Zaino Tecnico',  prezzo: 89.90,   categoria: 'accessori',    disponibile: true  },
  { id: 3, nome: 'Monitor 4K 27"', prezzo: 449.00,  categoria: 'elettronica',  disponibile: true  },
  { id: 4, nome: 'Mouse Wireless', prezzo: 39.90,   categoria: 'accessori',    disponibile: false },
  { id: 5, nome: 'Tastiera Mech',  prezzo: 129.00,  categoria: 'accessori',    disponibile: true  },
];
let nextId = 6;

// ── Helper ────────────────────────────────────────────────────────────────────
const findById = (id) => products.find(p => p.id === parseInt(id));
const findIndexById = (id) => products.findIndex(p => p.id === parseInt(id));

// ── GET /api/v1/products ──────────────────────────────────────────────────────
// Supporta filtri via query string: ?categoria=elettronica&disponibile=true
const getAll = (req, res) => {
  const { categoria, disponibile } = req.query;

  let result = products;

  if (categoria) {
    result = result.filter(p => p.categoria === categoria);
  }

  // req.query restituisce stringhe, quindi confrontiamo con la stringa "true"
  if (disponibile !== undefined) {
    const disp = disponibile === 'true';
    result = result.filter(p => p.disponibile === disp);
  }

  res.status(200).json(result);
};

// ── GET /api/v1/products/categoria/:categoria ─────────────────────────────────
// Esempio di rotta annidata (un livello): filtra per categoria via path.
// Equivalente a GET /products?categoria=elettronica, ma come route dedicata.
const getByCategoria = (req, res) => {
  const { categoria } = req.params;
  const result = products.filter(p => p.categoria === categoria);

  if (result.length === 0) {
    return res.status(404).json({ error: `Nessun prodotto trovato per la categoria '${categoria}'` });
  }

  res.status(200).json(result);
};

// ── GET /api/v1/products/:id ──────────────────────────────────────────────────
const getOne = (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Prodotto non trovato' });
  res.status(200).json(product);
};

// ── POST /api/v1/products ─────────────────────────────────────────────────────
const create = (req, res) => {
  const { nome, prezzo, categoria = 'generico', disponibile = true } = req.body;

  // Validazione tipo: prezzo deve essere un numero positivo
  if (typeof prezzo !== 'number' || prezzo <= 0) {
    return res.status(400).json({ error: 'prezzo deve essere un numero positivo' });
  }

  const newProduct = { id: nextId++, nome, prezzo, categoria, disponibile };
  products.push(newProduct);

  res
    .status(201)
    .header('Location', `/api/v1/products/${newProduct.id}`)
    .json(newProduct);
};

// ── PUT /api/v1/products/:id ──────────────────────────────────────────────────
const replace = (req, res) => {
  const index = findIndexById(req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Prodotto non trovato' });

  const { nome, prezzo, categoria = 'generico', disponibile = true } = req.body;

  if (typeof prezzo !== 'number' || prezzo <= 0) {
    return res.status(400).json({ error: 'prezzo deve essere un numero positivo' });
  }

  products[index] = { id: products[index].id, nome, prezzo, categoria, disponibile };
  res.status(200).json(products[index]);
};

// ── PATCH /api/v1/products/:id ────────────────────────────────────────────────
const update = (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Prodotto non trovato' });

  const campiAggiornabili = ['nome', 'prezzo', 'categoria', 'disponibile'];
  campiAggiornabili.forEach(campo => {
    if (req.body[campo] !== undefined) {
      product[campo] = req.body[campo];
    }
  });

  res.status(200).json(product);
};

// ── DELETE /api/v1/products/:id ───────────────────────────────────────────────
const remove = (req, res) => {
  const index = findIndexById(req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Prodotto non trovato' });

  products.splice(index, 1);
  res.status(204).send();
};

module.exports = { getAll, getOne, getByCategoria, create, replace, update, remove };
