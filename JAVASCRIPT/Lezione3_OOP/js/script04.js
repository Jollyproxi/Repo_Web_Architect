let oggi = new Date();
console.log(oggi);

let est = new Date("04/07/2023"); //mese/giorno/anno
console.log(est);

let anniTrascorsi = oggi.getFullYear() - est.getFullYear();
console.log(anniTrascorsi);

const orologioDigitale = document.getElementById("orologioDigitale");

setInterval(() => {
    let oraEsatta = new Date();
    let ora = (oraEsatta.getHours() < 10 ? "0" : "") + oraEsatta.getHours();
    let min = (oraEsatta.getMinutes() < 10 ? "0" : "") + oraEsatta.getMinutes();
    let sec = (oraEsatta.getSeconds() < 10 ? "0" : "") + oraEsatta.getSeconds();
    orologioDigitale.textContent = ora + ":" + min + ":" + sec;
}, 1000);


///////Math
let valAbs = Math.abs(-8);
let arrCeil = Math.ceil(3.2); //arrotonda all'intero maggiornate
let arrFloor = Math.floor(3.2); //arrotonda all'intero minorante

console.log(valAbs);
console.log(arrCeil);
console.log(arrFloor);

//Number
let mioNum = 25.398742577;
console.log( mioNum.toPrecision(5));

//String
let miaStringa = "Ciao";
console.log( miaStringa.startsWith("Ci") );

