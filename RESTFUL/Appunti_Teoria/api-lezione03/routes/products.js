// routes/products.js
// Definisce le route per la risorsa /products.
// Stessa struttura di users.js — pattern replicabile per ogni nuova risorsa.

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/productsController');
const { validateBody } = require('../middleware/validateBody');

// ── Collezione ────────────────────────────────────────────────────────────────
router.get('/',  ctrl.getAll);                                           // GET  /api/v1/products
router.post('/', validateBody(['nome', 'prezzo']), ctrl.create);         // POST /api/v1/products

// ── Singola risorsa ───────────────────────────────────────────────────────────
router.get('/:id',    ctrl.getOne);                                      // GET    /api/v1/products/:id
router.put('/:id',    validateBody(['nome', 'prezzo']), ctrl.replace);   // PUT    /api/v1/products/:id
router.patch('/:id',  ctrl.update);                                      // PATCH  /api/v1/products/:id
router.delete('/:id', ctrl.remove);                                      // DELETE /api/v1/products/:id

// ── Rotta annidata: prodotti per categoria ─────────────────────────────────────
// GET /api/v1/products/categoria/:categoria
// Esempio di under-1-level nesting: la categoria filtra la collezione.
router.get('/categoria/:categoria', ctrl.getByCategoria);

module.exports = router;
