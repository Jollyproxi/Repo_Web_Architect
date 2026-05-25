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
      nome: "Jhon Lennon",
      description: "Il paroliere dei beatles"
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
