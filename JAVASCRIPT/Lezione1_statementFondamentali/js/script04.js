//SWITCH mi permette di controllare il valore di una varibile applicando una casistica

let msg = "";
let livello = "uno";

//Nel gioco ci sono 3 livelli dall' 1 al 3. Per ogni livello mando un messaggio al mio utente

switch(livello){
    case 1:
        msg = "Benvenuto al primo livello. Giusto per iniziare";
    break;
    case 2:
        msg = "Sei al secondo livello. Vediamo come te la cavi";
    break;
    case 3:
        msg = "Sei arrivato al terzo livello. Adesso affronterai il boss finale";
    break;

    default:
        msg = "Ciao giocatore, non ti trovi in nessun livello";
    break
}

console.log(msg);

//In base alla selezione dell'utente fai partire un gioco nella modalità scelta

const sceltaMod = document.getElementById("sceltaMod");
const btn = document.getElementById("btn");
const demo = document.getElementById("demo");

btn.addEventListener("click", function(){

    let sceltaModValore = sceltaMod.value;

    switch(sceltaModValore){
        case "easyMode":
            demo.innerHTML = `<h4> Caro utente, hai scelta la modalità facile: ${sceltaMod[sceltaMod.selectedIndex].textContent} </h4>`;
        break;

        case "intermMode":
            demo.innerHTML = `<h4> Caro utente, hai scelto la modalità intermedia: ${sceltaMod[sceltaMod.selectedIndex].textContent} </h4>`;
        break;

        case "hardMode":
            demo.innerHTML = `<h4> Caro utente, hai scelto la modalità difficile: ${sceltaMod[sceltaMod.selectedIndex].textContent} </h4>`;
        break;

        default:
            demo.innerHTML = "<h4>Caro utente, non hai ancora scelto nulla </h4>";
    }
    
})

//Più casi contemporaneamente
switch(livello){
    case 1:
    case "1":
    case "uno":
        msg = "Benvenuto al primo livello. Giusto per iniziare";
    break;
    case 2:
        msg = "Sei al secondo livello. Vediamo come te la cavi";
    break;
    case 3:
        msg = "Sei arrivato al terzo livello. Adesso affronterai il boss finale";
    break;

    default:
        msg = "Ciao giocatore, non ti trovi in nessun livello";
    break
}

console.log(msg);
