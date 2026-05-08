let url = "";

fetch(url, {
    method: "GET", // o "POST", "PUT", "DELETE", PATCH, HeADER, OPTIONS 
    // GET e HEAD non hanno un body, mentre POST, PUT, DELETE e PATCH devono avere un body
    headers: {
        'Content-Type': "application/json", // che serve a specificare il tipo di dati che stiamo inviando
        'Authorization': "Bearer token" // se serve un token di autenticazione
    },
    body: JSON.stringify({
        key: "value"
    })
})
    // la fetch restituisce una Promise che si risolve con un oggetto Response e mi aspetto di ricevere dei dati in formato JSON, quindi uso il metodo json() per convertire la risposta in un oggetto JavaScript
    // IL CRUD Create, Read, Update, Delete è un acronimo che rappresenta le quattro operazioni fondamentali per la gestione dei dati in un'applicazione.
    // Queste operazioni sono comunemente utilizzate nelle applicazioni web per interagire con i database o con le API RESTful. Ecco una breve descrizione di ciascuna operazione:
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nella richiesta");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Si è verificato un errore:", error);
    });