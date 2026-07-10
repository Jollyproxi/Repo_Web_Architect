//FETCH classica. La fetch è una funzione nativa del browser, è una WEB API. 
//Questa WEB API invia le richieste http per restituire delle PROMISE. Non restituisce mai direttamente i dati

// console.log( fetch("https://jsonplaceholder.typicode.com/users")); 
//In questo caso la Promise che rappresenta una promessa futura si trova in uno stato di "pending". Senza questo stato di pending non riuscirei a fare più nulla sulla pagina. La Promise ci mette nella modalità asincrona. 

// Quando sono in Pending(anche pending è uno stato) dopo posso avere 2 risvolti:
// -fulfilled
// -rejected

//Su tutte le Promise è disponibile il metodo then che accetta funzioni di callback, solo quando la promise è fulfilled e riceve come argoment il valore risolto. 

let utenti = [];

//Usando la fetchAPI entro nella programmazione asincrona. Proprio perché la mia fetch è in pending(la risposta di rete non è ancora arrivata), non può bloccare il thread della pagina.
fetch("https://jsonplaceholder.typicode.com/users")
    //i metodi then sono disponibili su ogni Promise. Accettano funzioni di callback che vengono eseguite solo se la Promise diventa fulfilled, per poi ricevere in argomento il valore risolto
    .then(response => {
        //response è a tutti gli effetti un oggetto Response, NON è ancora il JSON
        return response.json(); //il metodo .json() restituisce un'altra promise che io tratterò con un altro then. In questo caso .json() parserizza il body della response
    }).then(data => {
        console.log(data); //Qui ci sono i dati
        utenti = data;
    })

let filtratiFuori = [];
//Provo una catena a 3 then: tecnicamente posso concatenere quanti then mi pare e piace
fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => {
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.body);
        // console.log(response.json());
        return response.json();
    }).then(posts => {
        return posts.filter(p => p.userId == 4);
    }).then(filtrati => {
        console.log(filtrati);
        localStorage.setItem("utentiFiltrati", JSON.stringify(filtrati));
    })
//Per adesso abbiamo "intercettato" la diramazione fulfilled della Promise con il metodo then. Se la Promise invece va in "rejected" ho bisogno del metodo catch per intercettare questo ramo e qualsiasi errore. Se qualcosa non va(server non funziona, i dati non ci sono, ho un errore) viene generata un'eccezione dalla then che verrà gestita dal metodo catch

//se gioco con il mio URL rompendo qualcosa genero un errore
fetch("http://jsonplaceholder.typicode.com/users/")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error("Qualcosa è andato storto: ", err))

//Come gestire gli errori 404 e 500 che fetch non taratte come rejection. Di solito si fa così
function stampaUtenti() {

    fetch("http://jsonplaceholder.typicode.com/users")
        .then(response => {
            if (!response.ok) {
                throw new Error(`La risposta HTTP: ${response.status}`); //con la parola chiave throw dovrò utilizzare un metodo per gestire l'errore lanciato in questa riga
            }
            return response.json();
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log("Errore gestito: ", err.message);
        }
        )
        //Att il finally viene eseguito sempre e comunque al termine della chiamata, independentemente dall'esito
        .finally(() => {
            console.log("Qui ho terminato la mia chiamata. Disabilito il pulsante");
            document.querySelector("#btn").setAttribute("disabled", true);
        })

}

document.querySelector("#btn").addEventListener("click", stampaUtenti);


//provo una POST utilizzando json-server come db
function registraUtente() {

    fetch("http://localhost:3000/utent", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: "6",
            nome: "Pier Pieri",
            email: "pier@mail.com"
        })
    }).then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }).then(creato => {
        console.log(`Utente creato con id ${creato.id}`);
    })
    .catch(err => console.error("Richiesta fallita", err))
    //Il finally in questo caso è stupido poiché il metodo viene sempre e comunque eseguito, indipendentemente dall'esito della chiamata
    .finally(() => {
        btnRegistra.setAttribute("disabled", true);
        console.log("Richiesta terminata")
        // location.href = "./utenteRegistrato.html";
        document.querySelector("#demo").innerHTML = "Sto registrando l'utente";
        setTimeout(() => {
            document.querySelector("#demo").innerHTML = "Utente registrato";
        }, 3000);
    });
}

const btnRegistra = document.querySelector("#btnRegistra");

btnRegistra.addEventListener("click", registraUtente);