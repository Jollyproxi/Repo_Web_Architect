//CLOSURE: sono funzioni che ricordano le variabili del loro ambiente esterno, anche dopo che la funzione esterna è stata eseguita.
//Terra terra: è una funzione creata dentro un'altra funzione che accede alle variabili della funzione che la contiene

function esterna(){
    let saluto = "Ciao, come stai ?";

    function interna(){
        console.log(saluto);
    }

    return interna;
}

let miaClosure = esterna();

miaClosure();


// esempio
function creaContatore(){
    let contatore = 0;

    function aumentaContatore(){
        contatore++;
        return contatore;
    }

    return aumentaContatore;
}

let mioContatore = creaContatore();

console.log(mioContatore()); //1
console.log(mioContatore()); //2
console.log(mioContatore()); //3
console.log(mioContatore()); //4
console.log(mioContatore()); //5


//esempio con parametri
function moltiplicatore(fattore){
    return function(numero){
        return numero * fattore;
    }
}

let raddoppia = moltiplicatore(2);
let numeroRaddoppiato = raddoppia(5);
console.log(numeroRaddoppiato);

let triplica = moltiplicatore(3);
let numTriplicato = triplica(9);
console.log(numTriplicato);



//Altro esempio + SPOILER oggetti
function altroContatore(){
    let mioCounter = 0;

    return{
        incrementa: function(){
            console.log(mioCounter++);
        },
        decrementa: function(){
            console.log(mioCounter--);
        },
        leggiValAttuale: function(){
            console.log(mioCounter);
        }
    }
}

let counter = altroContatore();
counter.incrementa();
counter.incrementa();
counter.incrementa();
counter.incrementa();
counter.decrementa();
counter.decrementa();
counter.decrementa();
counter.decrementa();
counter.decrementa();
counter.decrementa();
counter.decrementa();
counter.leggiValAttuale();


//ESEMPIO CON LE STRINGHE
function saluta(nome){
    let msg = "Ciao";
    function stampaSaluto(){
        console.log(msg + " " + nome);
    }

    return stampaSaluto;
}

let salutaDario = saluta("Dario");
salutaDario();