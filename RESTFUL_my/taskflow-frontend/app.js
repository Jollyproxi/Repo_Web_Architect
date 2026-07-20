// app.js
const API = 'http://localhost:3000/api/v1';

// Lo stato dell'applicazione vive nel CLIENT (statelessness)
let token = null;
let ruolo = null;

// ── Riferimenti agli elementi ──────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

// ═══════════════════════════════════════════════════════════════════════════
// FUNZIONI DI COMUNICAZIONE CON L'API (tutte basate su fetch → Promise)
// ═══════════════════════════════════════════════════════════════════════════

// Helper generico: incapsula fetch, gestione errori e header di autenticazione.
async function chiamaAPI(percorso, opzioni = {}) {
  const headers = { 'Content-Type': 'application/json', ...opzioni.headers };

  // Se abbiamo un token, lo aggiungiamo all'header Authorization
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const risposta = await fetch(`${API}${percorso}`, { ...opzioni, headers });

  // IMPORTANTE: fetch NON lancia su 4xx/5xx. Controlliamo noi risposta.ok
  if (!risposta.ok) {
    const errore = await risposta.json().catch(() => ({ error: 'Errore sconosciuto' }));
    throw new Error(errore.error || `Errore HTTP ${risposta.status}`);
  }

  // 204 No Content non ha body da parsare
  if (risposta.status === 204) return null;

  return risposta.json();
}

// ── LOGIN — POST /auth/login ────────────────────────────────────────────────
function login(email, password) {
  return chiamaAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ── CARICA TASK — GET /tasks (con filtro opzionale) ─────────────────────────
function caricaTask(filtroStato = '') {
  const query = filtroStato ? `?stato=${filtroStato}&limit=50` : '?limit=50';
  return chiamaAPI(`/tasks${query}`);
}

// ── CREA TASK — POST /tasks ─────────────────────────────────────────────────
function creaTask(dati) {
  return chiamaAPI('/tasks', {
    method: 'POST',
    body: JSON.stringify(dati),
  });
}

// ── ELIMINA TASK — DELETE /tasks/:id ────────────────────────────────────────
function eliminaTask(id) {
  return chiamaAPI(`/tasks/${id}`, { method: 'DELETE' });
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════════════

function renderTask(risposta) {
  const lista = $('lista-task');
  const tasks = risposta.dati; // la risposta ha { dati, paginazione }

  if (tasks.length === 0) {
    lista.innerHTML = '<p class="caricamento">Nessuna task.</p>';
    return;
  }

  lista.innerHTML = tasks.map(t => `
    <div class="task priorita-${t.priorita}">
      <div class="task-info">
        <h3>${escapeHtml(t.titolo)}</h3>
        <p>${escapeHtml(t.descrizione || '')}</p>
        <div class="task-meta">
          <span class="badge stato-${t.stato}">${t.stato.replace('_', ' ')}</span>
          <span class="badge">priorità: ${t.priorita}</span>
        </div>
      </div>
      ${ruolo === 'admin' ? `<button class="btn-elimina" data-id="${t.id}">Elimina</button>` : ''}
    </div>
  `).join('');

  // Collega i bottoni elimina (solo se admin li ha renderizzati)
  document.querySelectorAll('.btn-elimina').forEach(btn => {
    btn.addEventListener('click', () => gestisciElimina(btn.dataset.id));
  });
}

// Previene l'iniezione di HTML dai dati (sicurezza di base lato client)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════════════
// GESTORI DEGLI EVENTI
// ═══════════════════════════════════════════════════════════════════════════

// LOGIN
$('btn-login').addEventListener('click', () => {
  const email = $('email').value;
  const password = $('password').value;
  $('errore-login').textContent = '';

  login(email, password)
    .then(dati => {
      token = dati.token;
      ruolo = dati.ruolo;

      $('stato-login').textContent = `Autenticato (${ruolo})`;
      $('stato-login').classList.add('attivo');
      $('sezione-login').classList.add('nascosto');
      $('sezione-crea').classList.remove('nascosto');

      aggiornaLista();
    })
    .catch(errore => {
      $('errore-login').textContent = errore.message;
    });
});

// CREA TASK
$('btn-crea').addEventListener('click', () => {
  const dati = {
    titolo: $('titolo').value,
    stato: $('stato').value,
    priorita: $('priorita').value,
  };
  $('errore-crea').textContent = '';

  (async () => {
    try {
      await creaTask(dati);
      $('titolo').value = '';
      aggiornaLista();
    } catch (errore) {
      $('errore-crea').textContent = errore.message;
    }
  })();
});

// ELIMINA TASK
function gestisciElimina(id) {
  eliminaTask(id)
    .then(() => aggiornaLista())
    .catch(errore => alert('Errore: ' + errore.message));
}

// FILTRO
$('filtro-stato').addEventListener('change', () => aggiornaLista());

// ═══════════════════════════════════════════════════════════════════════════
// FUNZIONE CENTRALE: ricarica la lista applicando il filtro corrente
// ═══════════════════════════════════════════════════════════════════════════
function aggiornaLista() {
  const filtro = $('filtro-stato').value;
  $('lista-task').innerHTML = '<p class="caricamento">Caricamento…</p>';

  caricaTask(filtro)
    .then(renderTask)
    .catch(errore => {
      $('lista-task').innerHTML = `<p class="caricamento">Errore: ${errore.message}</p>`;
    });
}

// ── Avvio: carica le task all'apertura della pagina ─────────────────────────
aggiornaLista();
