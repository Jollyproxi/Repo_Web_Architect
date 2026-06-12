import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './components/Card'
import CardForm from './components/CardForm'
import CardFormVero from './components/CardFormVero'


function App() {

  // useState è un HOOK direttamente importato da react. Mi permette di "agganciarmi" ad altri fiunzionalità. Con l'utilizzo dello useState imposto uno "stato iniziale" del mio component. Questo stato è possibile modificarlo attraverso una funzione che lo controlla.

  //Il valore iniziale dello useState, cioè lo 0, viene assegnato a counter. Il counter viene modificato attraverso la funzione setCount

  // Gestisco lo state di una variabile
  const [counter, setCount] = useState(0);

  const handleCounter = () => {
    setCount((count) => count + 1);
  }

  //Gestisco lo state di un array
  const [items, setItems] = useState([1, 2, 3]);

  const aggiungiItem = () => {
    //1. aggiorno il counter
    handleCounter();
    //2. utilizzo il valore del counter nel setItems
    setItems([...items, counter]);
  }

  //gestisco lo state di un oggetto 
  const [user, setUser] = useState({ nome: "Mario", eta: 25 });

  const updateUser = () => {
    let updatedUser = { ...user, nome: "Lello" };
    setUser(updatedUser);
    console.log("Adesso l'utente è: ", user);
  }

  useEffect(() => {
    console.log(user);

  }, [user]);

  let nomeApp = "BEATLES"

  const [beatles, setBeatles] = useState([
    {
      id: 0,
      isConosciuto: false,
      nome: "John Lennon",
      description: "Il paroliere dei beatles",
      strumento: "voce, chitarra",
      imgUrl: "https://m.media-amazon.com/images/M/MV5BMTYwMDE4MzgzMF5BMl5BanBnXkFtZTYwMDQzMzU3._V1_FMjpg_UX1000_.jpg"
    },
    {
      id: 1,
      isConosciuto: false,
      nome: "George Harrison",
      description: "Il miglior beatle",
      strumento: "chitarra",
      imgUrl: "https://m.media-amazon.com/images/M/MV5BMTUyNjE0NzAzMl5BMl5BanBnXkFtZTYwMjQzMzU3._V1_FMjpg_UX1000_.jpg"
    },
    {
      id: 2,
      isConosciuto: true,
      nome: "Paul McCartney",
      description: "Il beatle più simpatico",
      strumento: "voce, chitarra",
      imgUrl: "https://www.retetoscanaclassica.it/wp-content/uploads/2022/06/Paul-McCartney-by-Eric-Koch-for-Anefo.jpg"
    },
    {
      id: 3,
      isConosciuto: false,
      nome: "Ringo Starr",
      description: "Un batterista sottovalutato",
      strumento: "batteria",
      imgUrl: "https://townsquare.media/site/295/files/2012/11/ringo-Keystone-hutton-archives-getty.jpg?w=780&q=75"
    }
  ]);

  const addBeatle = (newBeatle) => {
    setBeatles([...beatles, newBeatle]);
  }

  return (
    <>

      <h1>{nomeApp}</h1>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci, aliquid! Quisquam molestiae consequatur deleniti hic, sint illum laboriosam deserunt asperiores.</p>

      <div className="counter">

        {/* <button onClick={() => { addBeatle({ id: 4, nome: "Pippo Rossi", strumento: "citofono" }) }
        }>
          Aggiungi un beatle
        </button> */}
        
        {/* addBeatle (sx) è la props del child. addBeatle(dx) è il nome della funzione, della funzione, del parametroe ecc */}
        <CardForm addBeatle={addBeatle}></CardForm>

      </div>
        
      <div className="counter">
        <CardFormVero addBeatle={addBeatle}></CardFormVero>
      </div>


      <br />
      <div className="card-container">

        {beatles.map((beatle) => (
          <Card
            key={beatle.id}
            nome={beatle.nome}
            strumento={beatle.strumento}
            imgUrl={beatle.imgUrl}
            isConosciuto={beatle.isConosciuto}
          >
            {beatle.description}
          </Card>
        ))}
      </div>

      <hr />

      <h2>I beatles che ho conosciuto</h2>
      <div className="card-container">

        {beatles
          .filter(beatle => beatle.isConosciuto)
          .map((beatle) => (
            <Card
              key={beatle.id}
              isConosciuto={beatle.isConosciuto}
              nome={beatle.nome}
              strumento={beatle.strumento}
              imgUrl={beatle.imgUrl}
            >
              {beatle.description}
            </Card>
          ))}

      </div>

      <div className="container">
        <h2>Gestione dello Use State</h2>

        <div className='counter'>

          {/* USE STATE è lo stato di un'app, cioè i dati interni, quello che in C# possiamo chiamre come stato della classe.
        Quello che succede è che ogni volta che viene "aggiornato" lo state viene "tenuto a mente" da REACT  */}
          <button onClick={handleCounter}>
            Contatore {counter}
          </button>

          <br />

          <button onClick={() => setCount((count) => count + 1)}>
            Contatore {counter}
          </button>

        </div>

        <br />
        <div className="counter">
          <button onClick={aggiungiItem}>
            Aggiungi un Item all'array
          </button>
          <br />

          {items}
        </div>

        <br />

        <div className="counter">
          <button onClick={updateUser}>Aggiorna lo User</button>
          <p>Adesso lo user è {user.nome}</p>
        </div>
      </div>
      <br />

    </>
  )
}

export default App
