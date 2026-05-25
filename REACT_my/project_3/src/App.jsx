import './App.css'
import Card from './components/Card'

function App() {
    let nomeApp = "Beatles"

    const beatles = [
        {
            id: 0,
            nome: "John Lennon",
            description: "Il paroliere dei Beatles, noto per la sua creatività e il suo impegno sociale.",
            strumento: "Voce e chitarra",
            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/John-wa-portrait.jpg/250px-John-wa-portrait.jpg",
            isConosciuto: true
        },
        {
            id: 1,
            nome: "George Harrison",
            description: "Il chitarrista dei Beatles, noto per il suo stile unico e le sue influenze orientali.",
            strumento: "Voce e chitarra",
            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/George_Harrison_1974_colorized.jpg",
            isConosciuto: false
        },
        {
            id: 2,
            nome: "Paul McCartney",
            description: "Il bassista dei Beatles, noto per la sua voce melodica e le sue abilità musicali.",
            strumento: "Voce e basso",
            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/McCartneyO2101224_p2_%2814_of_191%29_%2854225063096%29_%28cropped%29.jpg",
            isConosciuto: true
        },
        {
            id: 3,
            nome: "Ringo Starr",
            description: "Il batterista dei Beatles, noto per il suo stile di batteria distintivo e il suo senso dell'umorismo.",
            strumento: "Batteria",
            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/McCartneyO2101224_p2_%28179_of_191%29_%2854224150247%29_%28cropped%29.jpg",
            isConosciuto: false
        }
    ]

    function chiamaAlert(){
        console.log("Ciao dal bottone 2")

    }
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
            <div className="card-container">
                {beatles.map((element) => (
                    <Card
                        key={element.id}
                        nome={element.nome}
                        strumento={element.strumento}
                        imgUrl={element.imgUrl}
                    >
                        {element.description}
                    </Card>
                ))}
            </div>

            <hr/>

            <h2>I Beatles che ho conosciuto</h2>
            <div className="card-container">
                {beatles
                    .filter((beatle) => beatle.isConosciuto)
                    .map((beatle) => (
                        <Card
                            key={beatle.id}
                            nome={beatle.nome}
                            strumento={beatle.strumento}
                            imgUrl={beatle.imgUrl}
                        >
                            {beatle.description}
                        </Card>
                    ))}
            </div>

            <hr/>

            <div className="card">
                {/*METTO GESTIONE EVENTI*/}
                <button type='button' className="counter" onClick={() => {
                    alert("Ciao, sono un alert")
                }}>Cliccami</button>
                <button type='button' className="counter" onClick={() => {chiamaAlert()}}>Cliccami</button>
                <input type="text" placeholder="Inserisci il tuo nome" onChange={() => chiamaAlert()}/>
            </div>
        </>
    )
}

export default App
