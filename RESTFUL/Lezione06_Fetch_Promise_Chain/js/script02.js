function recuperaDati(nome){
    const URLendpoint = `https://jsonplaceholder.typicode.com/users?name=${nome}`;

    fetch(URLendpoint)
    .then(response => response.json())
    .then(data => {
        let user = data[0];
        console.log(user);
        console.log(user.id);
        
        //Queste fetch "annidate" verrano rese più leggibili e gestibili utilizzando i metodi async await
        fetchPostsConUserId(user.id);
        
    })
}

function fetchPostsConUserId(userId){
    
    fetch(`https://jsonplaceholder.typicode.com/posts/?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        console.log(`Questi sono i posts dell'utente con id = ${user.id}`, data);
    })
}

//Esempio per fingere una chiamata simultanea nell'eventListener.
function recuperaAltriDati(){
    fetch("http://localhost:3000/versioneDistribuita")
    .then(response=>response.json())
    .then(data => console.log(data))
}


document.addEventListener("DOMContentLoaded", function(){
    let username = document.querySelector("#username").textContent; //Ervin Howell
    recuperaDati(username);
    recuperaAltriDati();
})
