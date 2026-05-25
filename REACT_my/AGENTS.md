# REACT_my

## Ambito
Cartella contenente progetti React didattici con Vite. Ogni progetto dimostra progressivamente componenti, props e state.

## Regole operative
- Ogni progetto è una singola app React + Vite configurata per development/build
- No backend esterno, solo componenti locali e assets statici
- Mantieni la nomenclatura italiana dove presente (classi CSS, id, commenti)
- **Dipendenza da locale**: mantieni la coerenza tra componenti di projeto_1/project_2/project_3 quando si evolve uno pattern di insegnamento
- Usa children e destructuring per i props nei componenti (come in project_2 e project_3)
- Le card devono avere immagini normalizzate con `object-fit: cover` (vedi `project_2` e `project_3` per il pattern)

## Comandi utili

### Setup iniziale
```bash
cd project_1  # (o project_2, project_3)
npm install
```

### Development
```bash
npm run dev
```

### Build per produzione
```bash
npm run build
```

### Lint
```bash
npm lint
```

### Preview
```bash
npm run preview
```

## Verifica tipica
1. Apri il browser su `http://localhost:5173` (porta Vite di default)
2. Verifica che le card siano renderizzate correttamente
3. Controlla console per warning/errori con `npm run lint`

## Indice AGENTS.md specifici
- `project_1/AGENTS.md` — primo progetto, componenti base senza state
- `project_2/AGENTS.md` — pattern di card con children, foto normalizzate
- `project_3/AGENTS.md` — card + array beatles + filter/map + event handling

