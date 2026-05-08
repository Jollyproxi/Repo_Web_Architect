const demo = document.querySelector("#demo");

const URL = "https://jsonplaceholder.typicode.com/users"; //endpoint

let utenti = [];

fetch(URL)
.then(data =>{
    console.log("Qui sto aspettando i dati dal server"); //Questo è il punto in cui metto lo spinner
    console.log(data.status);
    
    return data.json();
})
.then(response =>{
    console.log(response);
    utenti = response;
    console.log("I miei utenti sono: ", utenti);
})
.finally( ()=>{

    console.log("Fetch Terminata");
}
)


console.log("I miei utenti sono: ", utenti); //Qui sono fuori dalla fetch, quindi sono in ASINCRONO, non vedo i dati


