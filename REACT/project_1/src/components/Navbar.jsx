//Devo importare il css per poterlo utilizzare nel mio component
import Link from "./Link";
import "./Navbar.css"

function Navbar(){
    //Qui sono in JS
    let miaVariabile = "Paolo"


    //Uso la parola chiave return per poter renderizzare porzioni di html


    return(
        //IL marker <></> viene utilizzato quando sto renderizzando più tag html e non solo 1
        <>
        <nav className="navbar">
            <ul>
                <li>Home</li>
                <li>Chi Siamo</li>
                <li>Contatti</li>
                {/* Per poter richiamre il valore di una variabile uso il {} */}
                <li>{miaVariabile}</li>

                {/* Le parentesi {} non servono solo a renderizzare qualcosa di js ma mi permettono anche di eleborare una logica */}
                <li>{miaVariabile == "Dario" ? "Ciao " + miaVariabile: "Utente non riconosciuto"}</li>
            </ul>

            {/* Costruisco un altro ul. Imparo a passare una string ad ogni singolo Link tramite i props */}
            <ul>
                <Link></Link>
                <Link></Link>
                <Link></Link>
                <Link></Link>
                <Link></Link>
            </ul>
        
        </nav>
        
        </>
    )



}

export default Navbar;