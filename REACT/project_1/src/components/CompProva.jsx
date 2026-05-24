import './CompProva.css'

function CompProva(){

    let miaVariabile = "Ciao";

    let mioStile = {
        height: "50px",
        width: "400px",
        border: "1px solid white"
    }

    let x = 10;

    return(
        <>
        <h3>Sono un component di Prova</h3>

        {/* OPZ 1 */}
        <div style={mioStile}>
            Questo è un div al quale fornisco uno stile tramite una variabile oggetto
        </div>

        {/* OPZ 2 */}
        <div style={{ height: "50px",width: "400px",border: "1px solid white"}}>
            Questo è un altro div
        </div>

        {/* OPZ 3 - importante: si utilizza className e non class (quest'ulòtima è una parola vietata)*/}
        <div className="stileDiv">Ultimo Div</div>
 
        {/* OPZ 4 - USO dei literals. Inserisco le classi nelle ''  perché sono delle stringhe, dei literals*/}

        <div className={`stileDiv rounded ${x >= 10 ? "rotated": ""}`}>
            Ultimissimo DIV
        </div>
        
        
        </>

        
    )
}

export default CompProva;