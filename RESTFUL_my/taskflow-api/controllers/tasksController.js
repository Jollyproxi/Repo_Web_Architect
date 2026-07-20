// controllers/tasksController.js
const crypto = require('crypto');
const db = require('../data/tasks');
const { notFound, badReq } = require('../utils/errors');

const findById = (id) => db.getAll().find(t => t.id === parseInt(id));

// GET /api/v1/tasks — con filtri, ordinamento, paginazione
const getAll = (req, res, next) => {
  const { stato, priorita, sort, order = 'asc' } = req.query;

  let risultati = [...db.getAll()];

  // 1. FILTRI
  if (stato) risultati = risultati.filter(t => t.stato === stato);
  if (priorita) risultati = risultati.filter(t => t.priorita === priorita);

  // 2. ORDINAMENTO (con whitelist)
  if (sort) {
    const campiValidi = ['titolo', 'stato', 'priorita', 'creata'];
    if (!campiValidi.includes(sort)) {
      return next(badReq(`sort non valido. Ammessi: ${campiValidi.join(', ')}`));
    }
    const dir = order === 'desc' ? -1 : 1;
    risultati.sort((a, b) => a[sort] < b[sort] ? -dir : a[sort] > b[sort] ? dir : 0);
  }

  // 3. PAGINAZIONE
  const page  = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const totale = risultati.length;
  const pagina = risultati.slice(offset, offset + limit);

  res.status(200).json({
    dati: pagina,
    paginazione: {
      pagina: page,
      per_pagina: limit,
      totale,
      pagine_totali: Math.ceil(totale / limit),
    },
  });
};

// GET /api/v1/tasks/:id — con ETag
const getOne = (req, res, next) => {
  const task = findById(req.params.id);
  if (!task) return next(notFound(`Task ${req.params.id} non trovata`));

  const etag = crypto.createHash('md5').update(JSON.stringify(task)).digest('hex');

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.set('ETag', etag);
  res.status(200).json(task);
};

// POST /api/v1/tasks
const create = (req, res) => {
  const { titolo, descrizione = '', stato = 'da_fare', priorita = 'media' } = req.body;

  const nuova = {
    id: db.getNextId(),
    titolo, descrizione, stato, priorita,
    creata: new Date().toISOString(),
  };
  db.getAll().push(nuova);

  res.status(201).header('Location', `/api/v1/tasks/${nuova.id}`).json(nuova);
};

// PUT /api/v1/tasks/:id — sostituzione completa
const replace = (req, res, next) => {
  const task = findById(req.params.id);
  if (!task) return next(notFound(`Task ${req.params.id} non trovata`));

  const { titolo, descrizione = '', stato = 'da_fare', priorita = 'media' } = req.body;

  task.titolo = titolo;
  task.descrizione = descrizione;
  task.stato = stato;
  task.priorita = priorita;

  res.status(200).json(task);
};

// PATCH /api/v1/tasks/:id — aggiornamento parziale
const update = (req, res, next) => {
  const task = findById(req.params.id);
  if (!task) return next(notFound(`Task ${req.params.id} non trovata`));

  ['titolo', 'descrizione', 'stato', 'priorita'].forEach(campo => {
    if (req.body[campo] !== undefined) task[campo] = req.body[campo];
  });

  res.status(200).json(task);
};

// DELETE /api/v1/tasks/:id
const remove = (req, res, next) => {
  const tasks = db.getAll();
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return next(notFound(`Task ${req.params.id} non trovata`));

  tasks.splice(index, 1);
  res.status(204).send();
};

module.exports = { getAll, getOne, create, replace, update, remove };
