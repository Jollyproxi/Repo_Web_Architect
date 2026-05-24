// esempio funzionante: usare un endpoint valido invece di una stringa vuota
const url = "https://jsonplaceholder.typicode.com/posts/1";

// Esempio di GET con header: non includere body in una GET
fetch(url, {
    method: 'GET', // GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Token'
    }
})

//Quando faccio una GET mi aspetto di ricevere dei dati.
//La GET scrive nello URL
//Di solito nello svolgere una GET non ho bisogno di specificare il configuration object

fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => {
        if (response.ok) {
            console.log(response);
            // response.body è uno stream; di solito si usa response.json()
            return response.json();
        } else {
            throw new Error("Errore con il seguente status: " + response.status);
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => console.error('Fetch fallita:', err));


fetch("https://pokeapi.co/api/v2/pokemon/charmander")
.then(response =>{
    return response.json();
})
.then(data =>{
    console.log(data);
})
