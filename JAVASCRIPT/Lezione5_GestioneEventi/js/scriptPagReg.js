const h1Benv = document.querySelector("#benvenuto");
const contBtn= document.querySelector("#contBtn");
const regConfermata = document.querySelector("#regConfermata");
const boxUtenti = document.querySelector("#boxUtenti"); 

function recuperaUtenteReg(){
    let userReg = JSON.parse( localStorage.getItem("nuovoUser") );
    if(userReg != null){
        h1Benv.textContent = `Grazie ${userReg.nome} per esserti registrato`;
        console.log(userReg);
    }
    return userReg;
}

//L'evento DOMContentLoaded permette di eseguire una funzione nel momento in cui viene caricata una pagina
document.addEventListener("DOMContentLoaded", function(){
    if(recuperaUtenteReg() != null ){
        contBtn.appendChild(creaBTNConferma());
    }
});

function creaBTNConferma(){
    let btn = document.createElement("button");
    btn.textContent = "Conferma la tua registrazione";
    btn.addEventListener("click", function(){
        regConfermata.innerHTML = "<h3>Registrazione confermata!</h3>";
        setTimeout(function(){
            regConfermata.innerHTML = "";
            contBtn.removeChild(btn);
            creaBtnStampaListaUtenti();
        },1500)
        

    }
    )
    return btn;
}

function creaBtnStampaListaUtenti(){
    let btn = document.createElement("button");
    btn.textContent = "Stampa lista utenti registrati";
    btn.addEventListener("click", function(){
        console.log("Sto stampando la lista degli utenti registrati");
    })
    boxUtenti.appendChild(btn);
}


let listaUtenti=[] ;
function creaListaUtenti(){
    let ultimoUtente = JSON.parse( localStorage.getItem("nuovoUser") );
    listaUtenti.push(ultimoUtente);
    localStorage.setItem("listaUtenti", JSON.stringify(listaUtenti));
}
