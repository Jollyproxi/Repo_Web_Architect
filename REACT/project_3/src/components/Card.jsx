import './Card.css'

// MODO 1 per lavorare con i props
// function Card(props) {
//     const nome = props.nome;
//     const description = props.description;
//     const strumento = props.strumento;
//     const imgUrl = props.imgUrl;
  
//     return (
//         // In React la parola class è una keyword
//         <div className='card'>
//             <div className="card-image">
//                 <img src={imgUrl} alt="" />
//             </div>

//             <h3>{nome}</h3>
//             <p>{description}</p>
//             <p>Suona: {strumento}</p>
//         </div>
//     )
// }

//MODO 2: passo direttamente l'oggetto e non props
// function Card({nome, description, strumento, imgUrl}) {
//     //in questo caso non ho bisogno di sviluppare delle proprietà ma uso direttamente le props dell'oggetto che sto passando al component
//     return (
//         // In React la parola class è una keyword
//         <div className='card'>
//             <div className="card-image">
//                 <img src={imgUrl} alt="" />
//             </div>

//             <h3>{nome}</h3>
//             <p>{description}</p>
//             <p>Suona: {strumento}</p>
//         </div>
//     )
// }


//MODO 3. Oltre all'oggetto gli passo la parola chiave "children" che voglio utilizzare al posto di description. Con questa parola chiave posso renderizzare quello che inseirsco tra il selettore di Card

function Card({nome, imgUrl, strumento, children, isConosciuto}) {
  
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
            <span>{isConosciuto ? "L'ho conosciuto": "MAI conosciuto"}</span>

            {/* oppure */}
            {/* Molto usato */}
            {isConosciuto && <span>L'ho conosciuto</span>}
            {!isConosciuto && <span>MAI conosciuto</span>}

        </div>
    )
}

export default Card;