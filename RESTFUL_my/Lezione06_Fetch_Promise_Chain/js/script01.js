//FETCH classica. La fetch è una funzione nativa del browser, è una WEB API. 
//Questa WEB API invia le richieste http per restituire delle PROMISE. Non restituisce mai direttamente i dati

// console.log( fetch("https://jsonplaceholder.typicode.com/users")); 
//In questo caso la Promise che rappresenta una promessa futura si trova in uno stato di "pending". Senza questo stato di pending non riuscirei a fare più nulla sulla pagina. La Promise ci mette nella modalità asincrona. 

// Quando sono in Pending(anche pending è uno stato) dopo posso avere 2 risvolti:
// -fulfilled
// -rejected

//Su tutte le Promise è disponibile il metodo then che accetta dunzioni di callback, solo quando la promise è fulfilled e riceve come argoment il valore risolto. 

let utenti = [];


//USANDO FETCH API entro nella programmazione asincrona. Se la fetch è in pending, il codice continua a girare e non si blocca. La fetch è asincrona.
fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => {
        //response è a tutti gli effetti un oggetto Response, NON è ancora il JSON
        return response.json(); //il metodo .json() restituisce un'altra promise che io tratterò con un altro then. In questo caso .json() parserizza il body della response

    }).then(data => {
        // console.log(data); //Qui ci sono i dati
        //console.log(utenti);
        utenti = data;

    })

fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => {
        return response.json();
    }).then(posts => {
        return posts.filter(post => post.userId == 4); //restituisce un array di post filtrati per userId
    }).then(filteredPosts => {
        console.log(filteredPosts);
    })
//per adesso abbiamo intercettato la diramazione fulfilled, ma non quella rejected. Per intercettare la diramazione rejected si usa il metodo catch. Il metodo catch intercetta gli errori che possono verificarsi in qualsiasi punto della catena di promise.
// se qualcosa va storto, la promise va in rejected e il catch intercetta l'errore. La then genera un eccezzione che verrà intercettata dal catch. Il catch intercetta anche gli errori di parsing del json.

fetch("https://jsonplaceolder.typicode.com/users")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });



fetch("https://jsonplaceholder.typicode.om/users")
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
        }
        return response.json()
    }
    )
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log("Errore nella richiesta: " + err.message);
    });