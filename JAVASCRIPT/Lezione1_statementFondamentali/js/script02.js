//FOR statement. 
// Il ciclo for fa parte della famiglia dei cicli definiti 
//Mi serve a ripetere un blocco di codice, delle istruzioni. Tutto questo fin tanto che la condizione risulta essere true
/**
 * SINTASSI
 */

//  inizializzazione   condizione   aggiornamento
for( let i = 0;        i < 3;       i++){
    console.log("Ciao " + i);
}

//1° giro (i = 0; 0 < 3; 1) -> Ciao 0
//2° giro (i = 1; 1 < 3; 2) -> Ciao 1
//3° giro (i = 2; 2 < 3; 3) -> Ciao 2
//4° giro (i = 3; 3 < 3; XXXXXXX) -> XXXXXX In questo caso la condizione non è rispettata e si interrompe il ciclofor 

//ciclo inverso
console.log("Ciclo al contrario");

for(let i = 2; i >= 0; i--){
    console.log("Ciao " + i);
}

let listaNumeri = [3,7,1,5,66,7,0];

//Scorro, leggo l'array utilizzando proprio un ciclo for
for(let i = 0; i < listaNumeri.length; i++){
    console.log("Numero in posizione " + i + ": " + listaNumeri[i]);
}

console.log("Leggo l'array al contrario");

for(let i = listaNumeri.length - 1; i >= 0; i--){
    console.log("Numero in posizione " + i + ": " + listaNumeri[i]);
}


//SINTASSI FOREACH
// Array.forEach(..callback function)

//FOREACH è tarato sugli array
listaNumeri.forEach(num => {
    if( num == 7){
        console.log(`Hai trovato un ${num}`);
    }else{
        console.log(num)
    }
})


//FOR of
for(let numero of listaNumeri){
    console.log("Numero: " + numero);
}


//FOR IN - fatto per scalare gli oggetti che, ATTENZIONE, non fanno parte della famiglia degli Iterables
let object = {
    nome: "Dario",
    cognome: "Mennillo",
    eta: 36,
    presenza: true
}

for (const key in object ) {
    const valore = object[key];
    console.log(valore);
}