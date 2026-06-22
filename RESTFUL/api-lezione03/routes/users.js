// routes/users.js
// Definisce le route per la risorsa /users.
// Le URL sono relative al prefisso su cui questo router è montato (/api/v1/users).
// Questo file non contiene logica: solo il mapping URL+metodo → controller.

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/usersController');
const { validateBody } = require('../middleware/validateBody');

// ── Collezione ────────────────────────────────────────────────────────────────
router.get('/',  ctrl.getAll);                               // GET  /api/v1/users
router.post('/', validateBody(['nome', 'email']), ctrl.create); // POST /api/v1/users

// ── Singola risorsa ───────────────────────────────────────────────────────────
router.get('/:id',    ctrl.getOne);                                        // GET    /api/v1/users/:id
router.put('/:id',    validateBody(['nome', 'email']), ctrl.replace);      // PUT    /api/v1/users/:id
router.patch('/:id',  ctrl.update);                                        // PATCH  /api/v1/users/:id
router.delete('/:id', ctrl.remove);                                        // DELETE /api/v1/users/:id

module.exports = router;
