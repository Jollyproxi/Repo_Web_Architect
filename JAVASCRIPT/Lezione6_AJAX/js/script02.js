let url = "";

fetch(url,{
    method: 'GET',   //GET, POST , PUT, PATCH, DELETE, HEAD, OPTIONS
    headers:{
        'Content-Type': "application/json",
        'Authorization': 'Bearer Token'
    },
})

//Quando faccio una GET mi aspetto di ricevere dei dati.
//La GET scrive nello URL
//Di solito nello svolgere una GET non ho bisogno di specificare il configuration object

fetch("https://jsonplaceholder.typicode.com/posts")
.then(response =>{
    if(response.ok){
        console.log(response);
        console.log(response.body);
        return response.json();
    }else{
        throw new Error("Errore con il seguente status: ", response.status);
    }
}).then(data => {
    console.log(data);   
}
)


fetch("https://pokeapi.co/api/v2/pokemon/charmander")
.then(response =>{
    return response.json();
})
.then(data =>{
    console.log(data);
})
