//Operatori matematici
let mioNum = 5;
mioNum *= 2;
console.log(mioNum);


//Operatori di confronto < > <= >= . Tutti questi generano un boolean
let num1 = 4;
let num2 = 8;

let confronto1 = num1 > num2; //False
let confronto2 = num1 < num2; // True
let confronto3 = num1 <= num2; // True
let confronto4 = num1 >= num2; // False

// Operatore == e ===
// == confronto solo il valore
// === confronto valore e tipo

let num3 = 5;
let num4 = "5";

let conf5 = num3 == num4; //True
let conf6 = num3 === num4; //False

console.log(conf5);
console.log(conf6);

//IF statement
//SINTASSI

let miaEta = -6;

if(miaEta >= 18){
    console.log("Sei maggiorenne");
}else if(miaEta < 0){
    console.log("Età non valida");
}else{
    console.log("Sei minorenne");
}

console.log("Logica ribaltata ma errata perché non potrà mai funzionare quando < 0");

if(miaEta < 18){
    console.log("Sei minorenne");
}else if( miaEta >= 18){
    console.log("Sei maggiorenne");
}else{
    console.log("Età non valida");
}

console.log("Utilizzo l'operatore == e ===");

let numCas = 9;
let numRan = "9";

if(numCas === numRan){
    console.log("I due numeri sono uguali nel tipo e nel valore");
}else if(numCas == numRan){
    console.log("I due numeri sono di identico valore ma non nel tipo");
}else{
    console.log("I due numeri sono diversi nel tipo e nel valore");
}

//OPERATORI Logici && (and) || (or) ! (not)
//Gioco 
let punti = 50;
let skills = 30;
let msg = "";
//Per poter accedere al livello successivo devo totalizzare più di 40 punti e più di 25 punti skills

if(punti >= 40 && skills >= 25){
    msg = "Bravo, hai superato il livello";
}else if(punti >= 40 && skills < 25){
    msg = "Mi spiace, non hai superato il livello a causa dei punti skills bassi"
}else if(punti < 40 && skills >= 25){
    msg = "Mi spiace, non hai superato il livello a causa dei punti bassi"
}else{
    msg = "Mi spiace, ritenta un'altra volta";
}

console.log(msg);

console.log("EASY MODE");
let msg2 = '';

if(punti >= 40 || skills >= 25){
    msg2 = "Bravo, hai superato il livello";
}else{
    msg2 = "Mi spiace, ritenta un'altra volta";
}

//Operatore Not logico : != (non uguale); !== (non strettamente uguale)

let parola = "ciao";

if(parola != "buongiorno"){
    console.log("Le due parole sono diverse ");
}else{
    console.log("Le due parole sono uguali");
}

let pioggia = true;

if(!pioggia){
    console.log("Non porto l'ombrello");
}else{
    console.log("Porto l'ombrello");
}

//OPERATORE TERNARIO

let msg3 = pioggia ? "Porto l'ombrello": "Non porto l'ombrello";
console.log(msg3);


let msgGioco = punti >= 40 || skills >= 25 ? "Bravo, hai superato il livello": "Non hai superato il livello";

console.log(msgGioco);
