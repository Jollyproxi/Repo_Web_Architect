// schemas/taskSchema.js

// Schema per la creazione (POST) — titolo obbligatorio
const creaTask = {
  type: 'object',
  properties: {
    titolo:      { type: 'string', minLength: 3, maxLength: 100 },
    descrizione: { type: 'string', maxLength: 500 },
    stato:       { type: 'string', enum: ['da_fare', 'in_corso', 'completata'] },
    priorita:    { type: 'string', enum: ['bassa', 'media', 'alta'] },
  },
  required: ['titolo'],
  additionalProperties: false,
};

// Schema per l'aggiornamento parziale (PATCH) — nessun campo obbligatorio
const aggiornaTask = {
  type: 'object',
  properties: {
    titolo:      { type: 'string', minLength: 3, maxLength: 100 },
    descrizione: { type: 'string', maxLength: 500 },
    stato:       { type: 'string', enum: ['da_fare', 'in_corso', 'completata'] },
    priorita:    { type: 'string', enum: ['bassa', 'media', 'alta'] },
  },
  additionalProperties: false,
  minProperties: 1, // almeno un campo da aggiornare
};

module.exports = { creaTask, aggiornaTask };
