const btnTest = document.getElementById("btnTest");
const risultato = document.getElementById("risultato");
const elLettera = document.getElementById("lettera");
const elTentativi = document.getElementById("tentativi");

const PAROLASEGRETA = "CASA";
let TENTATIVI = 7;
let parolaMostrata = [];

function inizializzaGioco(){
    let parolaGhost = "";

    PAROLASEGRETA.split("").forEach(lettera => {
        parolaGhost += "_ ";
        parolaMostrata.push("_");
    })
    // parolaGhost = PAROLASEGRETA.split("").fill("_").join(" ");
    risultato.innerHTML += `<h2 class='txtCenter'> ${parolaGhost} </h2>`
}

/**
 * 
 * @param {String} lettera 
 */
function controllaLettera(lettera){
    lettera = lettera.toUpperCase();

    if(TENTATIVI > 0){

        for(let i = 0; i < PAROLASEGRETA.length; i++){
            if(PAROLASEGRETA[i] === lettera && parolaMostrata[i] != lettera){
                parolaMostrata[i] = lettera;
            }    
        }   
        TENTATIVI--;
        elTentativi.innerHTML = TENTATIVI + " tentativi";  
        risultato.innerHTML = parolaMostrata.join(" ");

        if(parolaMostrata.join("").toLocaleUpperCase() == PAROLASEGRETA){
            risultato.innerHTML += "<br>BRAVO, hai vinto !!";
        };
        
    }else{
        risultato.innerHTML = "Mi spiace, non hai trovato la parola segreta";
    }
}

btnTest.addEventListener("click", function(){
    controllaLettera(elLettera.value);
})

document.addEventListener("DOMContentLoaded", inizializzaGioco)