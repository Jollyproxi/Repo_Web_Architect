//FETCH classica. La fetch è una funzione nativa del browser, è una WEB API. 
//Questa WEB API invia le richieste http per restituire delle PROMISE. Non restituisce mai direttamente i dati

// console.log( fetch("https://jsonplaceholder.typicode.com/users")); 
//In questo caso la Promise che rappresenta una promessa futura si trova in uno stato di "pending". Senza questo stato di pending non riuscirei a fare più nulla sulla pagina. La Promise ci mette nella modalità asincrona. 

// Quando sono in Pending(anche pending è uno stato) dopo posso avere 2 risvolti:
// -fulfilled
// -rejected

//Su tutte le Promise è disponibile il metodo then che accetta dunzioni di callback, solo quando la promise è fulfilled e riceve come argoment il valore risolto. 

let utenti =[];

fetch("https://jsonplaceholder.typicode.com/users")
.then(response=>{
    //response è a tutti gli effetti un oggetto Response, NON è ancora il JSON
    return response.json(); //il metodo .json() restituisce un'altra promise che io tratterò con un altro then. In questo caso .json() parserizza il body della response
}).then(data =>{
    // console.log(data); //Qui ci sono i dati
    utenti = data;
    console.log(utenti);
})

