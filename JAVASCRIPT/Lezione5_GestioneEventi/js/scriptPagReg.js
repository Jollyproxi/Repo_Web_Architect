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
        

    }
    )
    return btn;
}