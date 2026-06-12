//IDEA: al click sul pulsante del form viene invocata una funzione che inserisce un nuovoBeatle passandolo ad un props che nel parent sarà la funzione che gestisce l'aggiunta di un beatle
function CardForm({addBeatle}) {

    const aggiungiBeatle = () => {

        const nuovoBeatle = {
            id: 4,
            isConosciuto: false,
            nome: "Pippo Baudo",
            description: "Cosa sarebbero i beatles senza di lui",
            strumento: "citofono",
            imgUrl: "https://media.gqitalia.it/photos/68a177627384d626da235ead/master/w_2560%2Cc_limit/GettyImages-496271384.jpg"
        }
        addBeatle(nuovoBeatle)
    }
    return (
        <div className="formADD">
            <h3>Aggiungi un Beatle</h3>
            <input type="text" placeholder="nome" />
            <input type="text" placeholder="strumento" />
            <input type="text" placeholder="descrizione" />
            <input type="text" placeholder="immagine" />
            <button onClick={aggiungiBeatle}>Aggiungi un Beatle</button>
        </div>
    )
}

export default CardForm