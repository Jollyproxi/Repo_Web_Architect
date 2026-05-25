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
      nome: "John Lennon",
      description: "Il paroliere dei beatles",
      strumento: "voce, chitarra",
      imgUrl: "https://m.media-amazon.com/images/M/MV5BMTYwMDE4MzgzMF5BMl5BanBnXkFtZTYwMDQzMzU3._V1_FMjpg_UX1000_.jpg"
    },
    {
      id: 1,
      nome: "George Harrison",
      description: "Il miglior beatle",
      strumento: "chitarra",
      imgUrl: "https://m.media-amazon.com/images/M/MV5BMTUyNjE0NzAzMl5BMl5BanBnXkFtZTYwMjQzMzU3._V1_FMjpg_UX1000_.jpg"
    },
    {
      id: 2,
      nome: "Paul McCartney",
      description: "Il beatle più simpatico",
      strumento: "voce, chitarra",
      imgUrl: "https://www.retetoscanaclassica.it/wp-content/uploads/2022/06/Paul-McCartney-by-Eric-Koch-for-Anefo.jpg"
    },
    {
      id: 0,
      nome: "Ringo Starr",
      description: "Un batterista sottovalutato",
      strumento: "batteria",
      imgUrl: "https://townsquare.media/site/295/files/2012/11/ringo-Keystone-hutton-archives-getty.jpg?w=780&q=75"
    }
  ]

  return (
    <>
      <h1>{nomeApp}</h1>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci, aliquid! Quisquam molestiae consequatur deleniti hic, sint illum laboriosam deserunt asperiores.</p>
      {/* In questo progetto ho eliminato le card sostituendo le properties con un array di oggetti */}

    
    </>
  )
}

export default App
