//Break e continue si utilizzano all'interno di if annidati

//BREAK - Interrompe un ciclo
let numeri = [1,9,5,12,8,99,4,32,5,4];
let numDaCercare = 8; 
let trovato = false;

//Appena trovo il numero 4 devo interrompere il ciclo
for(let i = 0 ; i < numeri.length; i++){

    if(numeri[i] == numDaCercare){
        console.log(`TROVATOOO il numero ${numDaCercare} in posizione ${i}`);
        trovato = true;
        break;
    }
    console.log(numeri[i]);
}

console.log(trovato ? "Ricerca completata": "Nessuna corrispondenza");

//CONTINUE mi permette di "saltare un'iterazione": risale nel for senza eseguire quello che si trova sotto
//Scorri l'array di numeri e quando trovi un numero pari mi avvisi

for(let i = 0; i < numeri.length; i++){
    if(numeri[i] % 2  == 0){
        console.log(`Il numero ${numeri[i]} è un numero pari`);
        continue;
    }
    console.log(numeri[i]);
}