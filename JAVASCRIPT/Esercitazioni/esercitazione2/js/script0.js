const PAROLA = "COMPUTER";

const risultato = document.getElementById("risultato");

function caricaParola(){
    let parolaGhost = "";

    PAROLA.split("").forEach(lettera => {
        parolaGhost += "_ ";
    })

    risultato.innerHTML += `<h2 class='txtCenter'> ${parolaGhost} </h2>`
}

document.addEventListener("DOMContentLoaded", caricaParola)