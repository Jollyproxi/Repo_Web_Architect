import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './components/Card'


function App() {

  let nomeApp = "BEATLES"

  return (
    <>
      <h1>{nomeApp}</h1>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci, aliquid! Quisquam molestiae consequatur deleniti hic, sint illum laboriosam deserunt asperiores.</p>

{/* Nelle card sotto renderizzo i props definiti all'interno della card stessa come proprietà passate alla funzione che definisce il component stesso */}
      <div className="card-container">
        <Card
        isConosciuto={false}
        nome = "George Harrison"
        strumento = "Chitarra"
        imgUrl = "https://m.media-amazon.com/images/M/MV5BMTUyNjE0NzAzMl5BMl5BanBnXkFtZTYwMjQzMzU3._V1_FMjpg_UX1000_.jpg">
          
          Il migliore di tutti e 4
        </Card>
        
        <Card
        isConosciuto={false}
        nome = "John Lennon"
        strumento = "voce, chitarra"
        imgUrl = "https://m.media-amazon.com/images/M/MV5BMTYwMDE4MzgzMF5BMl5BanBnXkFtZTYwMDQzMzU3._V1_FMjpg_UX1000_.jpg">

          Il paroliere dei Beatles

        </Card>

        <Card
        isConosciuto={true}
        nome = "Paul McCartney"
        strumento = "voce basso"
        imgUrl = "https://www.retetoscanaclassica.it/wp-content/uploads/2022/06/Paul-McCartney-by-Eric-Koch-for-Anefo.jpg">

        Il Beatle più simpatico
        </Card>

        <Card
        isConosciuto={false}
        nome = {"Ringo Starr"}
        strumento = "batteria"
        imgUrl = "https://townsquare.media/site/295/files/2012/11/ringo-Keystone-hutton-archives-getty.jpg?w=780&q=75">
          Un Batterista poco apprezzato
        </Card>
      </div>



    </>
  )
}

export default App
