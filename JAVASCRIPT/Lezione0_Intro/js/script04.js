//Array: memorizzato sempre all'interno di una variabile, rappresenta un contenitore di elementi simili tra loro (tutti dello stesso tipo).
//CARATTERISTICHE:
//- 0-based
//- Indicizzati
//- Dimensione dinamica

//Dichiaro un array
// let nuovoArray = new Array("Ciao", "Come", "stai"); //Dichiarazione con costruttore ormai desueta
                //   0        1       2        3    
let arrayParole = ["Ciao", "Dario", "Oggi", "Lunedì"];

//prop length
console.log(arrayParole.length); // 4

//Richiamo gli elementi
console.log(arrayParole[0]);
console.log(arrayParole[1]);
console.log(arrayParole[2]);
console.log(arrayParole[arrayParole.length - 1]);



//Lavorare con gli array
//aggiungere al fondo un elemento
arrayParole.push("Buongiorno");
arrayParole.push("Buonasera");
arrayParole.push("Arrivederci");

//Elimina l'ultimo elemento dell'array
arrayParole.pop();

console.log(arrayParole);

arrayParole.sort(); //ordina l'array
arrayParole.reverse(); //inverte

console.log(arrayParole);

//Estraggo degli elementi
console.log(arrayParole.slice(2,4)); //il valore finale non è compreso

//Eliminare o sostituire degli elementi, in questo caso viene modificato direttamente l'array originale
console.log(arrayParole.splice(0,1, "ITS PIEMONTE"));
console.log(arrayParole);

//Rimuovere il primo elemento
arrayParole.shift();
console.log(arrayParole);

//Unshift aggiunge all'inizio
arrayParole.unshift("Corso WSA");
console.log(arrayParole);

//Metodi per la ricerca di elementi
console.log(arrayParole.indexOf("Dario")); //restituisce l'indice nel quale si trova quell'elemento alla prima occorrenza
console.log(arrayParole.indexOf("Anna")); //-1

console.log(arrayParole.lastIndexOf("Dario")); //ultima occorrenza


//Il foreach è un metodo per gli array che mi permette di ciclare su di essi
arrayParole.forEach(parola => {
    console.log(parola);
});

let demo = document.getElementById("demo");

arrayParole.forEach(parola =>{
    demo.innerHTML += `<li> ${parola} </li>`;
});

let filtro = arrayParole.filter(parola => parola.length > 7);
console.log(filtro);

let trovato = arrayParole.find(parola => parola.length == 50);
console.log(trovato);


let arrayStudenti = ["Mirko", "Leonida", "Stefano", "Hussni"];

//Unire 2 array
//... si chiama operatore spread. Serve a diffondere gli elementi di un array dentro l'altro
let arrayUnito = [...arrayParole, ...arrayStudenti];
console.log(arrayUnito);

//Unire gli elementi di un array. Al metodo posso passare un "pattern" separatore
console.log(arrayStudenti.join(" - "));

//Separare una stringa in un array
let miaStringa = "ciao";

//Se a .split("") passo una stringa vuota separà carattere per carattere
console.log(miaStringa.split(""));

let miaString2 = "Ciao, come stai? Tutto bene grazie";
console.log(miaString2.split(" "));

let miaStringa3 = "programmazione";
let miaStringa3Rev = miaStringa3.split("").reverse().join("");
console.log(miaStringa3Rev);


//Posso avere array fatti con qualsiasi tipo di dato
let numeri = [4,7,22,1,10,9,2,4];
let booleani = [true, false, false, true, true];

//Fattibile l'array misto ma non ha molto senso
let arrayMisto = ["Dario", 36, "ITS", true, 25.9];