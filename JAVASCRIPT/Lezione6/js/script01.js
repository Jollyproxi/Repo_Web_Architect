const demo = document.querySelector("#demo");

const URL ="https://jsonplaceholder.typicode.com/users";

let utenti = [];
fetch(URL)
    .then(data => {
        console.log("Qui è il punto dove aspetto i dati");
        return data.json();
    })

    .then(response => {
         console.log(response);
         utenti = response;
        console.log("I miei utenti sono "+ utenti.length);
        console.log(utenti);
    })
    .catch(err => console.error('Fetch fallita:', err));

console.log("I miei utenti sono "+ utenti.length);
console.log(utenti);
