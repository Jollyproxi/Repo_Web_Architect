import './Card.css'

/*
========================================
  METODO 1: Accesso diretto a props
========================================
Accede alle proprietà tramite props.nomeProprieta.
Pro: esplicito e facile da capire per principianti
Contro: più verboso e ripetitivo
*/
/*
function Card(props) {

    const nome = props.nome;
    const description = props.description;
    const strumento = props.strumento;
    const imgURL = props.imgURL;
    return (
        <div className="card">
            <div className="card-image">
                <img src={imgURL} alt={nome}/>
            </div>
            <h3>{nome}</h3>
            <p>{description}</p>
            <p>Suona :{strumento}</p>
        </div>
    )
}
 */

/*
========================================
   METODO 2: Destructuring (Alternativa)
========================================
Estrae le proprietà direttamente nei parametri della funzione.
Pro: codice più pulito e leggibile
Contro: meno flessibile se le props variano
*/
/*
function Card({nome, description, strumento, imgURL}) {
    return (
        <div className="card">
            <div className="card-image">
                <img src={imgURL} alt={nome}/>
            </div>
            <h3>{nome}</h3>
            <p>{description}</p>
            <p>Suona :{strumento}</p>
        </div>
    )
}
*/

/*
========================================
   METODO 3: Children (ATTIVO) ✅
========================================
Permette di passare elementi figli che verranno renderizzati dentro il componente.
Pro: maggiore flessibilità, contenuti dinamici
Contro: meno strutturato, richiede wrapping esterno

Utilizzo:
<Card nome="John" imgURL="...">
    <p>Contenuto personalizzato</p>
</Card>
*/

function Card({nome, imgURL, strumento, children, isConosciuto}) {
    return (
        <div className="card">
            <div className="card-image">
                <img src={imgURL} alt={nome}/>
            </div>
            <h3>{nome}</h3>
            {children}
            <p>Suona: <br/> {strumento}</p>
            <hr/>
            {isConosciuto ? <span>Conosciuto</span> : <span>Non conosciuto</span>}
            {/*oppure*/}
            {<span>{isConosciuto ? "Conosciuto" : "Non conosciuto"}</span>}
            {/*oppure*/}
            {isConosciuto && <span>Conosciuto</span>}
            {!isConosciuto && <span>Non conosciuto</span>}
        </div>
    )
}




export default Card