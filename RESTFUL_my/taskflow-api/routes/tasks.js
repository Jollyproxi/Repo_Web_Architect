// routes/tasks.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tasksController');
const { validate } = require('../middleware/validate');
const { creaTask, aggiornaTask } = require('../schemas/taskSchema');
const { autentica, autorizza } = require('../middleware/auth');

// Lettura: pubblica
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Scrittura: richiede autenticazione
router.post('/',     autentica, validate(creaTask), ctrl.create);
router.put('/:id',   autentica, validate(creaTask), ctrl.replace);
router.patch('/:id', autentica, validate(aggiornaTask), ctrl.update);

// Eliminazione: solo admin
router.delete('/:id', autentica, autorizza('admin'), ctrl.remove);

module.exports = router;
