import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './components/Card'


function App() {

  let nomeApp = "BEATLES"

  const beatles = [
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
  ]

  function chiamaAlert(){
    console.log("Ciao dalla funzione su pulsante 2");
    alert("Queto è l'alert del pulsante 2")
  }


  function handleChange(event){
    console.log(event);
    console.log(event.target.value);
       
  }


  function handleSub(event){
    event.preventDefault(); //Se non uso il preventDEfault perdo il senso dell'intero framework strutturato per produrre delle SPA
    console.log(event);
    
  }
  return (
    <>
      <h1>{nomeApp}</h1>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci, aliquid! Quisquam molestiae consequatur deleniti hic, sint illum laboriosam deserunt asperiores.</p>
      {/* In questo progetto ho eliminato le card sostituendo le properties con un array di oggetti */}

      {/* <Card
      nome={beatles[0].nome}
      imgUrl={beatles[0].imgUrl}
      strumento={beatles[0].strumento}
      >
        {beatles[0].description}
      </Card> */}

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


      <br />
      <h2>Gestione degli eventi</h2>
      <div className="card">
        {/* GESTIONE degli EVENTI */}
        
        {/* Posso gestire un evento con una function anonima */}
        <button type='button' className='counter' onClick={() => {
          alert("Ciao dall'evento del pulsante 1")
        }}> Pulsante 1</button>
        
        <br />
        
        {/* Gestisco un evento attraverso una funzione. ATT: anche in questo caso non uso le () dopo la funzione */}
        <button type='button' className='counter' onClick={chiamaAlert}>Pulsante 2</button>
        
        <br />
        {/* Provo con un input. "handleChange" è una funzione*/}
        <input type="text" onChange={handleChange} />

        <br />
        {/* Provo con un form più piccolo */}
        <form onSubmit={handleSub}>

          <button type='submit' className='counter'>
            Invia
          </button>
        </form>


      </div>

    </>
  )
}

export default App
