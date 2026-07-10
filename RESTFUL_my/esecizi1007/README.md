Usa il seguente JSON con json-server per l'esercizio 

{ "prodotti": [ { "id": 1, "nome": "Tastiera meccanica", "prezzo": 79.90, "categoria": "periferiche", "disponibile": true }, { "id": 2, "nome": "Monitor 27 pollici", "prezzo": 219.00, "categoria": "monitor", "disponibile": true }, { "id": 3, "nome": "Mouse wireless", "prezzo": 24.50, "categoria": "periferiche", "disponibile": false }, { "id": 4, "nome": "Webcam HD", "prezzo": 45.00, "categoria": "periferiche", "disponibile": true }, { "id": 5, "nome": "Hub USB-C", "prezzo": 18.90, "categoria": "accessori", "disponibile": true } ], "ordini": [ { "id": 1, "prodottoId": 1, "quantita": 2, "stato": "spedito" }, { "id": 2, "prodottoId": 3, "quantita": 1, "stato": "in_attesa" } ] }


Esercizio 1 — GET collezione intera
Sintassi richiesta: chain .then()/.catch()/.finally()

Recuperare tutti i prodotti da GET /prodotti, stampare in console quanti elementi sono stati ricevuti e i loro nomi. Il .finally() deve stampare un messaggio di completamento indipendentemente dall'esito.

Verifica manuale (Thunder Client/Postman)

Esercizio 2 — GET singolo con gestione 404
Sintassi richiesta: async/await con try/catch

Scrivere una funzione getProdotto(id) che esegue GET /prodotti/:id. Deve:

lanciare un errore esplicito se response.ok è falso,
ritornare l'oggetto prodotto se la richiesta va a buon fine.
Testare la funzione due volte: una con id = 2 (esiste), una con id = 999 (non esiste — json-server risponde 404).

Verifica manuale

Esercizio 3 — GET con query string (filtro)
Sintassi richiesta: chain .then()/.catch()

json-server supporta filtri diretti via query string sui campi del record. Recuperare solo i prodotti con categoria=periferiche usando GET /prodotti?categoria=periferiche, poi stampare quanti risultati arrivano e verificare che siano effettivamente filtrati lato server (non filtrare in JS l'array già ricevuto — il filtro deve avvenire nell'URL).