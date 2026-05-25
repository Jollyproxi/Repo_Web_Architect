# project_3

## Ambito
Terzo progetto React didattico con Vite. Dimostra:
- Array di oggetti e `.map()` per renderizzare card dinamiche
- Filtering con `.filter()` per sottosezioni
- Event handling (click, onChange)
- Mantiene il pattern Card di project_2

Contiene componente `Card.jsx` + `App.jsx` con data array beatles.

## Regole operative
- **Card component**: identico a project_2 (nome, imgUrl, strumento come props + children)
- **Data structure**: array beatles con id, nome, description, strumento, imgUrl, isConosciuto
- **Rendering list**: `.map((element) => <Card key={element.id} ... >{element.description}</Card>)`
- **Filter + Map**: `.filter((beatle) => beatle.isConosciuto).map(...)`
- **Event handling**: button onclick, input onChange con handler funzioni
- CSS: stessi stili card di project_2, `.card-container` con flex layout
- **Niente stato globale**: le funzioni di handling sono semplici handler

## Comandi utili

### Setup
```bash
cd project_3
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
2. Verifica che tutte le 4 card beatles appaiano nella prima sezione (map)
3. Verifica che la sezione "I Beatles che ho conosciuto" mostri solo 2 card (John + Paul, filtrati)
4. Clicca i bottoni e prova input per verificare event handling
5. Lancia `npm run lint` per verifica errori

## File chiave
- `src/App.jsx` — App root, array beatles, due map (completo + filtrato)
- `src/components/Card.jsx` — componente Card identico a project_2
- `src/components/Card.css` — stili card identici a project_2
- `src/App.css` — stili globali + `.card-container` flex

## Pattern importante - Array + Map
```jsx
const beatles = [{id: 0, nome: "...", description: "...", strumento: "...", imgUrl: "...", isConosciuto: true/false}]

// Render tutto
{beatles.map((element) => (
  <Card key={element.id} nome={element.nome} strumento={element.strumento} imgUrl={element.imgUrl}>
    {element.description}
  </Card>
))}

// Render filtrato
{beatles.filter((beatle) => beatle.isConosciuto).map((beatle) => (...))}
```

## Pattern importante - Event Handling
```jsx
<button onClick={() => alert("msg")}>Cliccami</button>
<input onChange={() => console.log("changed")} />
```

## Note  
- Replicazione di project_2 con data dinamica
- Introduzione a liste dinamiche e filtering
- Base per form/input didattici

