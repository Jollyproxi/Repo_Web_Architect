# project_1

## Ambito
Primo progetto React didattico con Vite. Dimostra i concetti base di:
- Componenti e JSX
- Props e destructuring
- Rendering condizionale

Contiene principalmente `App.jsx` senza sottocartella `components/`.

## Regole operative
- App.jsx è il punto di ingresso principale
- Componenti semplici inline o come funzioni pure
- Niente state complesso (`useState` solo se necessario per demo)
- Mantieni il layout semplice con flex container
- Evita refactor se il codice è stabile per scopo didattico

## Comandi utili

### Setup
```bash
cd project_1
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## Verifica tipica
1. Esegui `npm run dev` e apri `http://localhost:5173`
2. Verifica che le card/contenuti siano renderizzati
3. Controlla console con `npm run lint`

## File chiave
- `index.html` — entry HTML
- `src/main.jsx` — bootstrap React
- `src/App.jsx` — componente principale
- `src/App.css` — stili globali
- `package.json` — dipendenze e script

## Note
- Primo passo nell'apprendimento di React con Vite
- Pattern da confermare con project_2 e project_3

