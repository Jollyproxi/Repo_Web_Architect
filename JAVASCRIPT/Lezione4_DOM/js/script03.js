//innerHTML - legge/scrive testo e HTML
let item1 = document.querySelector("li#uno");
console.log(item1.innerHTML);
item1.innerHTML = "<h1> Pane al farro </h1>";

//textContent legge/scrive solo il testo
let li4 = document.querySelector("li#quattro");
console.log(li4.textContent);
li4.textContent = "<h1>Biscotti integrali</h1>"; //Questo h1 non verrà renderizzato

// let li6 = document.querySelector("li#sei");
// li6.innerText = "Ciao";//ASSOLUTAMENTE DA EVITARE