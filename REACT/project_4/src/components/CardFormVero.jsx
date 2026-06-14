import { useState } from "react"

function CardFormVero({addBeatle}){

    const[formData, setFormData] = useState({
        nome: "",
        strumento: "",
        imgUrl: "",
        isConosciuto: false,
        descrizione: ""
    })

    const handleInputChanges = (event) => {
        const {name, value} = event.target;
        const inputValue = value;

        setFormData({
            ...formData,
            [name]: inputValue //[name]: inputValue aggiorna la proprietà dell'oggetto formData che corrisponderà al name del singolo campo input del form
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const beatle = {
            id: Math.ceil(Math.random() * 10),
            nome: formData.nome,
            imgUrl: formData.imgUrl,
            descrizione: formData.descrizione,
            strumento: formData.strumento
        }

        addBeatle(beatle);
    }

    return (
        <div className="formADD">
            <h3>Aggiungi un Beatle Veramente</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="nome"
                name="nome" 
                value={formData.nome}
                onChange={handleInputChanges} />

                <input type="text" placeholder="strumento"
                name="strumento"
                value={formData.strumento}
                onChange={handleInputChanges} />

                <input type="text" placeholder="descrizione"
                name="descrizione"
                value={formData.descrizione}
                onChange={handleInputChanges} />

                <input type="text" placeholder="immagine"
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleInputChanges} />

                <button type="submit">Aggiungi un Beatle</button>
            </form>
        </div>
    )

}

export default CardFormVero