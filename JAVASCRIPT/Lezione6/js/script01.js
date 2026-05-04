const demo = document.querySelector("#demo");

const URL ="https://jsonplaceholder.typicode.com/users";

let utenti = [];
fetch(URL)
    .then(data => {
        console.log("Qui è il punto dove aspetto i dati");
        return data.json();
    })

    .then(resoponse => {
         console.log(resoponse);
         utenti = resoponse;
        console.log("I miei utenti sono "+ utenti.length);
        console.log(utenti);
    });

console.log("I miei utenti sono "+ utenti.length);
console.log(utenti);
