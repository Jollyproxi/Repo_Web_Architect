# project_2

## Ambito
Secondo progetto React didattico con Vite. Dimostra:
- Componenti riusabili in sottocartella `components/`
- Props e children per flessibilità
- Normalizzazione immagini con `object-fit: cover`
- Struttura CSS separato per component

Contiene componente `Card.jsx` e relativo `Card.css`.

## Regole operative
- **Struttura Card**: `nome`, `imgUrl`, `strumento` come props + `children` per descrizione personalizzata
- **Immagini**: altezza fissa 200px, width 100%, `object-fit: cover` para cropping uniforme
- Mantieni `className` in italiano e coerente con `Card.jsx`
- CSS per card: width 24%, border, border-radius 10px, padding 20px
- Children pattern: è il modello da replicare in project_3

## Comandi utili

### Setup
```bash
cd project_2
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
1. Apri `http://localhost:5173` (dopo `npm run dev`)
2. Verifica che le 4 card di Beatles siano layout correttamente (4 colonne, spaced-between)
3. Controlla che le immagini siano normalizzate e non deformate
4. Lancia `npm run lint` per verifica errori

## File chiave
- `src/App.jsx` — App root, 4 card hard-coded con children
- `src/components/Card.jsx` — componente Card con children pattern (MODELO 3)
- `src/components/Card.css` — stili card con immagine normalizzata
- `src/App.css` — stili globali e `.card-container` con `display: flex; justify-content: space-between`

## Pattern importante
```jsx
<Card nome="..." imgUrl="..." strumento="...">
  {children come descrizione}
</Card>
```

## Note  
- Pattern di card **STANDARD** per il repository
- Base per replicare in project_3 con array + map

