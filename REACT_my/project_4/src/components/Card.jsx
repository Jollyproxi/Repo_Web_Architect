import { useState } from 'react';
import './Card.css'


function Card({nome, imgUrl, strumento, children, isConosciuto}) {
  
   const [conosciuto, setConosciuto] = useState(isConosciuto)

    function handleConosciuto(){
       setConosciuto(!conosciuto);
       console.log(conosciuto);
    }

    return (
        // In React la parola class è una keyword
        <div className='card'>
            <div className="card-image">
                <img src={imgUrl} alt="" />
            </div>

            <h3>{nome}</h3>
            <p>{children}</p>
            <p>Suona: {strumento}</p>

            <hr />

            {/* {isConosciuto ? <span>L'ho conosciuto</span>: <span>Mai conosciuto</span>} */}

            {/* oppure */}
            {/* <span>{isConosciuto ? "L'ho conosciuto": "MAI conosciuto"}</span> */}

            {/* oppure */}
            {/* Molto usato */}
            {conosciuto && <span>L'ho conosciuto</span>}
            {!conosciuto && <span>MAI conosciuto</span>}


            <button onClick={handleConosciuto}>
                Clicca se lo hai conosciuto:
                {conosciuto? "Lo hai conosciuto": "Mai conosciuto"}
            </button>
        </div>
    )
}

export default Card;