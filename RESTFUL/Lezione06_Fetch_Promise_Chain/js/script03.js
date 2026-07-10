//Async Await, introdotti nel 2017 con ECMA17, sono semplicemente una sintassi diversa per trattare le Promise. Le Promise non vengono eliminate, vengono solo nascoste dietro una sintassi più simile alla programmazione funzionale. Ci sono 2 termini: 
//- async viene legato alla funzione asincrona che si occuperà di fare la chiamata
//- await "dice" a JS: " sospendi l'esecuzione di questa funzione finché la Promise non si risolve, alla fine restituiscimi il valore risolto, senza .then"

async function recuperaDati(){
    const urlEndpoint = "https://jsonplaceholder.typicode.com/users";

    //REGOLA FONDAMENTALE: non posso avere un await "sciolto", a caso, nello script globale. L'await deve sempre essere all'interno di una funzione async
    try {
        let res = await fetch(urlEndpoint);
        let data = await res.json();
        console.log(data);
        data.forEach(u => {
            demo.innerHTML += `<li> ${u.name} </li>`
        });
        
    } catch (error) {
        console.log(error);
    }
}

let btn = document.querySelector("#btn");
let demo = document.querySelector("#demo");

btn.addEventListener("click", function(){
    recuperaDati();
    recuperaSingoloUser();    
    recuperaPostById();
    //OSS: scritto così ho gli stessi problemi del then di prima. Await blocca l'esecuzione di quella funzione finché la Promise non si risolve. Se ho due richieste dipendenti, la seconda parte solo dopo che la prima è risolta. Ho lo stesso comportamento delle due then annidate ma non sono più una dentro l'altra
})


async function recuperaSingoloUser(){
    let response = await fetch("https://jsonplaceholder.typicode.com/users/1");

    if(!response.ok){
        throw new Error(`HTTP: ${response.status}`)
    }

    let user = await response.json();

    console.log(user);
    
}


async function recuperaPostById() {
    let posts = await fetch("https://jsonplaceholder.typicode.com/posts/?userId=1").then(r => r.json())
    console.log(posts);
}