# taskflow-frontend

## Ambito
Frontend vanilla HTML/CSS/JS per l'applicazione TaskFlow. Consuma l'API backend con `fetch` e Promise.

## Regole operative
- Il frontend comunica con `http://localhost:3000/api/v1` (costante `API` in `app.js`).
- Il backend deve essere avviato prima del frontend.
- Non usare framework: solo JavaScript vanilla, DOM manipulation, fetch.
- Usa `addEventListener` per gli eventi (mai handler inline nell'HTML).
- Tutti gli stili sono in `style.css` (nessun CSS inline).

## File chiave
- `index.html` — struttura HTML (login, form creazione, filtri, lista task)
- `style.css` — stili con classi per priorità e stato
- `app.js` — logica applicativa, chiamate API, rendering, event handler

## Comandi utili
```bash
# Opzione 1: Live Server di VS Code (consigliato)
# Opzione 2: npx serve
npx serve

# Il frontend gira su http://localhost:3000 (serve) o sulla porta di Live Server
```

## Verifica tipica
1. Aprire `index.html` con Live Server
2. Login con `admin@taskflow.it` / `admin123` → mostra "Autenticato (admin)"
3. Creare una task → appare nella lista
4. Filtrare per stato → la lista si aggiorna
5. Eliminare una task (solo admin) → sparisce dalla lista
6. Controllare DevTools → Network per vedere le richieste fetch
