//Callback functions: sono funzioni passate come parametri ad altre funzioni le quali verranno richiamate in un secondo momento

function saluta(nome, callback){
    console.log(`Ciao ${nome}`);
    callback(); //questa funzione verrà eseguita dopo il console.log()
}

//In questo caso la funzione dopoSaluta(), avendo il nome è una funzione definita
function dopoSaluta(){
    console.log("Come stai ?");    
}

saluta("Dario", dopoSaluta); //ATT: nel richiamare una funzione di callback non devo passare le parentesi tonde

//Callback function anonime

function eseguiOperazione(a,b, operazione){
    let risultato = operazione(a,b);
    return risultato
}

//Definita
function somma(a,b){
    return a+b;
}

console.log(eseguiOperazione(5,3, somma));

//Anonima con arrow function e senza
console.log(eseguiOperazione(5,4, (a,b) => a + b));
console.log(eseguiOperazione(5,4, (a,b) => a * b));
console.log(eseguiOperazione(5,4, function(a,b){ return a / b}));


//UTilizzo di funzioni di callback anonime
console.log("START");

setTimeout(function(){
    console.log("Ciao, dopo 3 secondi");
}, 3000)

//oppure
setTimeout(() => {console.log("Ciao, dopo 3 secondi")}, 3000)
let counter = 0;

let intervallo = setInterval( ()=> {
    counter++;
    console.log(`Valore attuale del counter ${counter}`);

    if(counter == 5){
        clearInterval(intervallo);
        console.log("STOP");
    }
    
}, 1000);


//esempio con foreach
let nomi = ["Paola", "Francesco", "Anna", "Luisa"];
let cognomi =["Rossi", "Verdi", "Bianchi", "Gialli"];

nomi.forEach(nome => {console.log(nome);})

nomi.map((nome, index)=>{
    let cognome = cognomi[index];
    console.log(nome + " " + cognome);
})

//filter restituisce un array in base alla condizione
// let filtro = nomi.filter(nome => {return nome.length == 5 });
let filtro = nomi.filter(nome => nome.length == 5 );
console.log(filtro);

//find restituisce la prima occorrenza in base alla condizione
let ricerca = nomi.find(nome =>{return nome.length == 5})
console.log(ricerca);
