import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './components/Card'

function App() {
    const [count, setCount] = useState(0)
    let nomeApp = "Beatles"

    const beatles = [
        {
            id:0,
            nome:"John Lennon",
            description:"Il paroliere dei Beatles, noto per la sua creatività e il suo impegno sociale.",
            img:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/John-wa-portrait.jpg/250px-John-wa-portrait.jpg"
        },
        {
            id:1,
            nome:"George Harrison",
            description: "Il chitarrista dei Beatles, noto per il suo stile unico e le sue influenze orientali.",
            img:"https://upload.wikimedia.org/wikipedia/commons/4/4e/George_Harrison_1974_colorized.jpg"
        },
        {
            id:2,
            nome:"Paul McCartney",
            description: "Il bassista dei Beatles, noto per la sua voce melodica e le sue abilità musicali.",
            img:"https://upload.wikimedia.org/wikipedia/commons/e/ea/McCartneyO2101224_p2_%2814_of_191%29_%2854225063096%29_%28cropped%29.jpg"
        },
        {
            id:3,
            nome:"Ringo Starr",
            description: "Il batterista dei Beatles, noto per il suo stile di batteria distintivo e il suo senso dell'umorismo.",
            img:"https://upload.wikimedia.org/wikipedia/commons/0/0c/McCartneyO2101224_p2_%28179_of_191%29_%2854224150247%29_%28cropped%29.jpg"
        }
    ]
    return (
        //renderizzo più cose insieme
        <>
            <h1>{nomeApp}</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, vero?</p>
            {/*
          * elimino card per array di oggetti
          * creo un array di oggetti con titolo, testo e immagine
          * uso map per renderizzare più card
         */}


        </>
    )
}

export default App
