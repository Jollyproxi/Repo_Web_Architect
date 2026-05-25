import './Card.css'


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
            {/* <span>{isConosciuto ? "L'ho conosciuto": "MAI conosciuto"}</span> */}

            {/* oppure */}
            {/* Molto usato */}
            {isConosciuto && <span>L'ho conosciuto</span>}
            {!isConosciuto && <span>MAI conosciuto</span>}

        </div>
    )
}

export default Card;