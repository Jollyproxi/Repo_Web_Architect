// Esempio concreto: non lasciare url vuoto e non inviare body su GET
const url = "https://jsonplaceholder.typicode.com/posts/1";

fetch(url, {
    method: "GET", // o "POST", "PUT", "DELETE", PATCH, HEAD, OPTIONS
    // GET e HEAD non hanno un body
    headers: {
        'Content-Type': "application/json",
        'Authorization': "Bearer token"
    }
})
    // la fetch restituisce una Promise che si risolve con un oggetto Response e mi aspetto di ricevere dei dati in formato JSON, quindi uso il metodo json() per convertire la risposta in un oggetto JavaScript
    // IL CRUD Create, Read, Update, Delete è un acronimo che rappresenta le quattro operazioni fondamentali per la gestione dei dati in un'applicazione.
    // Queste operazioni sono comunemente utilizzate nelle applicazioni web per interagire con i database o con le API RESTful. Ecco una breve descrizione di ciascuna operazione:
    // Quando faccio una GET mi aspetto che mi venga restituito un oggetto JSON, quindi uso il metodo json() per convertire la risposta in un oggetto JavaScript. Se la risposta non è ok, lancio un errore.
    // La GET scrive nell'URL i parametri, mentre la POST li scrive nel body della richiesta. 
    // La GET è idempotente, cioè non modifica lo stato del server, mentre la POST può modificare lo stato del server. 
    // La GET è più veloce della POST, perché non ha un body da inviare. 
    // La GET è più adatta per recuperare dati, mentre la POST è più adatta per inviare dati.
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore con il seguente status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Si è verificato un errore:", error);
    });

fetch("https://jsonplaceholder.typicode.com/posts") // di default è una GET, quindi non è necessario specificare il metodo
    .then(response => {
        if (!response.ok)throw new Error("Errore con il seguente status: " + response.status);
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Si è verificato un errore:", error);
    });
