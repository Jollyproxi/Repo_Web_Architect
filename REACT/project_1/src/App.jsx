import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar';
import CompProva from './components/CompProva';



const nomeApp = "Prima App React";
//QUesta funzione è un COMPONENT (blocco di codice riutilizzabile definito come funzione). Questo blocco mi permette di definire l'interfaccia utente.
//Regola: non posso definire un component dentro l'altro, posso solo utilizzare un component dentro l'altro
function App() {
  const [count, setCount] = useState(0)
  let nomeUtente = "Dario";

  return (
    <>
    <Navbar></Navbar>

     <h1>LA mia prima app in React</h1>

     <p>Questo è il component principale della mia {nomeApp}</p>

     <p>Powered by {nomeUtente}</p>

     <button 
     type='button' 
     className='counter' 
     onClick={()=>setCount((count) => count+1)}> Conta {count}</button>

     <hr />

     <CompProva></CompProva>
    </>
  )
}

export default App
