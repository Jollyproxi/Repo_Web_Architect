bottone1 = document.querySelector("#btn1");
bottone2 = document.querySelector("#btn2");
bottone3 = document.querySelector("#btn3");

bottone1.addEventListener("click", esercizio1);
bottone2.addEventListener("click", esercizio2);
bottone3.addEventListener("click", esercizio3);


function esercizio1() {
    //Recuperare tutti i prodotti da GET /prodotti, stampare in console quanti elementi sono stati ricevuti e i loro nomi.
    //  Il .finally() deve stampare un messaggio di completamento indipendentemente dall'esito.
    // lo metto dentro il div con appendChild e per gli elemnti creo una ul e li metto dentro la ul con appendChild
    // rimuovere il contenuto del div prima di aggiungere i nuovi elementi
    let h41 = document.querySelector("#numeroProdotti");
    let h42 = document.querySelector("#dichiarazioneProdotti");
    let ul = document.querySelector("#ul1");
    if (h41) {
        h41.remove();
    }
    if (h42) {
        h42.remove();
    }
    if (ul) {
        ul.remove();
    }

    fetch("http://localhost:3000/prodotti")
    .then((response) => response.json())
    .then((data) => {
        console.log(`Numero di prodotti ricevuti: ${data.length}`);
        data.forEach((prodotto) => {
            console.log(`Nome prodotto: ${prodotto.nome}`);
        });
        let esercizio1Div = document.querySelector("#esercizio1");
        let h41 = document.createElement("h4");
        h41.id = "numeroProdotti";
        h41.textContent = "Numero di prodotti ricevuti: " + data.length;
        esercizio1Div.appendChild(h41);
        let h42 = document.createElement("h4");
        h42.id = "dichiarazioneProdotti";
        h42.textContent = "I Prodotti ricevuti sono: ";
        esercizio1Div.appendChild(h42);
        let ul = document.createElement("ul");
        ul.id = "ul1";
        data.forEach((prodotto) => {
            let li = document.createElement("li");
            li.textContent = prodotto.nome;
            ul.appendChild(li);
        });
        esercizio1Div.appendChild(ul);

    })
    .finally(() => {
        console.log("Operazione completata.");
    }); 
}


async function esercizio2() {
// Esercizio 2 — GET singolo con gestione 404
// Sintassi richiesta: async/await con try/catch

// Scrivere una funzione getProdotto(id) che esegue GET /prodotti/:id. Deve:

// lanciare un errore esplicito se response.ok è falso,
// ritornare l'oggetto prodotto se la richiesta va a buon fine.
// Testare la funzione due volte: una con id = 2 (esiste), una con id = 999 (non esiste — json-server risponde 404).
    let h43 = document.querySelector("#prodottoTrovato");
    let h44 = document.querySelector("#prodottoNonTrovato");
    if (h43) {
        h43.remove();
    }
    if (h44) {
        h44.remove();
    }
    
    async function getProdotto(id) {
        try {
            let response = await fetch(`http://localhost:3000/prodotti/${id}`);
            if (!response.ok) {
                throw new Error(`Errore nella richiesta per il prodotto con id ${id}`);
            }
            return await response.json();
        } 
        catch (error) {
            console.error("Si è verificato un errore:", error);
            throw error;
        }
    }
    let esercizio2Div = document.querySelector("#esercizio2");

    // Test con id = 2 (esiste)
    try {
        let prodotto1 = await getProdotto(2);
        let h43 = document.createElement("h4");
        h43.id = "prodottoTrovato";
        h43.textContent = `Prodotto trovato: ${prodotto1.nome}`;
        esercizio2Div.appendChild(h43);
    } catch (err) {
        console.error("Errore nel recupero del prodotto 2:", err);
    }

    // Test con id = 999 (non esiste)
    try {
        let prodotto2 = await getProdotto(999);
    } catch (err) {
        let h44 = document.createElement("h4");
        h44.id = "prodottoNonTrovato";
        h44.textContent = "Prodotto con id 999 non trovato";
        esercizio2Div.appendChild(h44);
    }
}


// Esercizio 3 — GET con query string (filtro)
// Sintassi richiesta: chain .then()/.catch()

// json-server supporta filtri diretti via query string sui campi del record. Recuperare solo i prodotti con categoria=periferiche usando GET /prodotti?categoria=periferiche, poi stampare quanti risultati arrivano e verificare che siano effettivamente filtrati lato server (non filtrare in JS l'array già ricevuto — il filtro deve avvenire nell'URL).
function esercizio3() {
    let h45 = document.querySelector("#numeroProdottiFiltrati");
    let h46 = document.querySelector("#dichiarazioneProdottiFiltrati");
    let ul2 = document.querySelector("#ul2");
    if (h45) {
        h45.remove();
    }
    if (h46) {
        h46.remove();
    }
    if (ul2) {
        ul2.remove();
    }
    fetch("http://localhost:3000/prodotti?categoria=periferiche")
    .then((response) => response.json())
    .then((data) => {
        console.log(`Numero di prodotti filtrati ricevuti: ${data.length}`);
        let esercizio3Div = document.querySelector("#esercizio3");
        let h45 = document.createElement("h4");
        h45.id = "numeroProdottiFiltrati";
        h45.textContent = "Numero di prodotti filtrati ricevuti: " + data.length;
        esercizio3Div.appendChild(h45);
        let h46 = document.createElement("h4");
        h46.id = "dichiarazioneProdottiFiltrati";
        h46.textContent = "I Prodotti filtrati ricevuti sono: ";
        esercizio3Div.appendChild(h46);
        let ul2 = document.createElement("ul");
        ul2.id = "ul2";
        data.forEach((prodotto) => {
            let li2 = document.createElement("li");
            li2.textContent = prodotto.nome;
            ul2.appendChild(li2);
        });
        esercizio3Div.appendChild(ul2);
    })
    .catch((error) => {
        console.error("Si è verificato un errore:", error);
    })
    .finally(() => {
        console.log("Operazione completata.");
    });
}   
