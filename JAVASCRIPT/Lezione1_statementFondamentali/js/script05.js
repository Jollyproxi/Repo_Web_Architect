//WHILE fa parte della famiglia dei cicli indefiniti poiché io non so a priori quante volte verrà eseguito il codice

//Simulare il ciclo for con un while

let i = 0;

let msg = "";

//Il codice viene eseguito fin quando la condizione risulta essere true

while(i < 5){
    msg = `Ciao ${i}`;
    console.log(msg);
    i++;
}

//do - while

//Scrivo la tabellina del 6

let y = 1;

do{
    console.log(`${y} x 6 = ${y * 6}` );
    y++;    
}while(y <= 10)


// GIOCHINO LUCCHETTO CON NUMERO SEGRETO
const NUM_SEGRETO = 9;

let tentativo = 0;

let numTentativi = 0;

while(tentativo != NUM_SEGRETO){
    tentativo = prompt("Inserisci un numero per aprire il lucchetto");
    numTentativi++;

    if(tentativo == NUM_SEGRETO){
        console.log(`Bravo, hai aperto il lucchetto dopo ${numTentativi} tentativi`);
        break;
    }else if(tentativo < NUM_SEGRETO){
        console.log("Il numero segreto è più grande");
    }else{
        console.log("IL numero segreto è più piccolo");
    }
}


//DIFFERENZE TRA LET E VAR

var miaVariabile = 6; //Questa ha uno scope di funzione. Visibile dappertutto nella funzione anche se dichiarata in uno statement

let tuaVariabile = 9; //Questa ha uno scope di blocco. Visibile solo nel blocco in cui è dichiarata.

//ATT: nella programmazione moderna si usa solo let

for(var f = 0; f < 5; f++){
    console.log(`Vale: ${f}`);
}

console.log(f); //f essendo dichiarata con var è visibile anche fuori dal blocco del for

for(let x = 0; x < 5; x++){
    console.log(`La mia x vale: ${x}`);
    
}

console.log(x); //x essendo dichiarata con let non è visibile al di fuori del blocco


//Posso ridichirare una variabile con var
var h = 0;
var h = 4;

//NON posso ridichiarare con let
// let c = 9;
// let c = 10;



