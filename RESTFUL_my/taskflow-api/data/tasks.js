// data/tasks.js
let tasks = [
  { id: 1, titolo: 'Studiare le REST API',   descrizione: 'Ripassare i metodi HTTP', stato: 'in_corso',   priorita: 'alta',  creata: new Date('2026-06-01T09:00:00Z').toISOString() },
  { id: 2, titolo: 'Configurare Express',     descrizione: 'Setup del server',        stato: 'completata', priorita: 'alta',  creata: new Date('2026-06-01T10:00:00Z').toISOString() },
  { id: 3, titolo: 'Scrivere la validazione', descrizione: 'Integrare ajv',           stato: 'da_fare',    priorita: 'media', creata: new Date('2026-06-02T09:00:00Z').toISOString() },
  { id: 4, titolo: 'Implementare JWT',        descrizione: 'Login e route protette',  stato: 'da_fare',    priorita: 'alta',  creata: new Date('2026-06-02T14:00:00Z').toISOString() },
  { id: 5, titolo: 'Testare con Postman',     descrizione: 'Coprire tutti i casi',    stato: 'da_fare',    priorita: 'bassa', creata: new Date('2026-06-03T08:00:00Z').toISOString() },
];

// Genera dati aggiuntivi per testare la paginazione
const stati = ['da_fare', 'in_corso', 'completata'];
const priorita = ['bassa', 'media', 'alta'];
for (let i = 6; i <= 50; i++) {
  tasks.push({
    id: i,
    titolo: `Task generata ${i}`,
    descrizione: `Descrizione ${i}`,
    stato: stati[i % 3],
    priorita: priorita[i % 3],
    creata: new Date(Date.now() - i * 3600000).toISOString(),
  });
}
let nextId = 51;

module.exports = {
  getAll:    () => tasks,
  getNextId: () => nextId++,
  reset:     (nuove) => { tasks = nuove; },
};
