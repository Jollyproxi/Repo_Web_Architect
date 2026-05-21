# 1. Cos'è React


### Prerequisiti
- Node.js
- Vite (for Scaffolding and locahost server). Serve anche a far funzionare il JSX (Cioè la possibilità di scrivere html in un file .js dato che questo fa React). Insomma questo permette di fare lo start del project `npm install vite`
- Alternative a Vite: Create React App, online tool
- 

### SetUp a Projects
- react.new in un qualsiasi browser e ci porta in una sandbox da cui è possibile sviluppare quello che mi pare.
  - Una volta scaricato il progetto poi lanciare sempre `npm install` per scaricare le dipendenze
- Versione Locale:
  - `npm create vite@latest nomeProgetto `
  - Seguire le istruzioni (Scegli React) (Scegli Javascript)
  - Spostarsi nella cartella del progetto e lanciare `npm install`. Installerà i node modules e la mappa per le dipendenze
  - Poi `npm run dev`
  - Successivamente cancellare quello che c'è nei vari css e jsx tranne il main
  
### Estensioni per React

1. ES7 React Redux
2. ES7 React Snippet

## Struttura del progetto React

* **Node Modules:** Contiene tutti i pacchetti necessari per far funzionare il progetto.
* **Public:** Contiene risorse pubbliche come la sitemap, il file robots.txt e la favicon.
* **Source:** Cartella principale dove si trova il codice del progetto.
* **.eslintrc.cjs:** File di configurazione per ESLint (strumento per il controllo dello stile del codice).
* **.gitignore:** Contiene i file e le cartelle che Git dovrebbe ignorare durante il controllo della versione.
* **index.html:** Punto di ingresso principale dell'applicazione web.
* **package.json:** Contiene metadati sul progetto, come dipendenze e script.
* **package-lock.json:** Registra le versioni esatte di tutte le dipendenze del progetto, plugin ecc.
* **README.md:** File di descrizione del progetto.
* **vite.config.js:** Configura Vite, il motore di build utilizzato.

**Source (approfondimento):**

* **Assets:** Contiene risorse come immagini e file SVG.
* **App.css/App.jsx:** File CSS e JSX (una estensione di JavaScript) correlati
* **index.css:** Fogli di stile per l'index.html
* **main.jsx:** Il file principale dell'applicazione, scritto in JSX.


# 2. I componenti
Il primo componente che vediamo è proprio App()

## Componenti in React (in Lezione 1)

* **Cos'è un componente?** Un blocco di codice riutilizzabile che definisce una parte dell'interfaccia utente. Pensa ai componenti come a dei "mattoncini" che puoi combinare per costruire interfacce più complesse.
* **Perché usare i componenti?** Evitare la ripetizione di codice, rendendo il tuo progetto più organizzato e facile da mantenere.
* **Componenti in React:** Implementati come funzioni JavaScript che restituiscono JSX (simile all'HTML). In sostanza sono funzioni PURE che renderizzano dell'html
* **Componente come classe** Questo approccio è andato in disuso in REACT. Il concetto di classe è identico a quello della OOP
* **Esempi di componenti:** `Navbar` e `Link`
* **Componenti annidati:** Possono contenere altri componenti per creare strutture complesse.
* **Passare dati ai componenti:** Usare "props" per personalizzare i componenti.
* **Children:** Inserire elementi all'interno dei tag di un componente per accedervi tramite la prop `children`.

### Regole per component 
1. Mai definire un component dentro un altro component. Posso sempre utilizzare invece un component dentro l'altro 
2. Il `return()` di una funzione deve restituire SEMPRE un solo elemento radice
   ES: 
   ```html
   <div>
   <section></section>
   </div>

   ```
3. Se ho la necessità di passare più elementi posso utilizzare i frammenti ` <> </> ` a wrappare del codice al posto di utilizzare sempre `<div> ` o `<span> `
```html
    <>
    <nav></nav>
    <section></section>
    </>
```

## Utilizzo delle {}
Le { } sono necessarie per inserire codice JS all'interno dei nostri component

## Template Literals per utilizzo di classi dinamiche
Posso avere delle fusioni di stringhe e codice, per poterlo fare uso le { }

```
  className={`box rounded ${x < 11 ? "rotated": ""}`}
```

# 3. Props in React

In React, **props** (abbreviazione di "properties") sono un meccanismo per passare dati da un componente genitore a un componente figlio. Da considerarsi come argomenti di funzioni per i componenti React.


* **Passaggio di dati:** Le props consentono di rendere i componenti dinamici e riutilizzabili, passando loro informazioni specifiche.
* **Solo lettura:** Le props sono "read-only" (solo lettura) all'interno del componente figlio. Un componente figlio non può modificare le props che riceve.
* **Comunicazione unidirezionale:** I dati fluiscono in una sola direzione, dal genitore al figlio.
