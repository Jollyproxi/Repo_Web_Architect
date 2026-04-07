//GetElementById - recupera solo attraverso l'id
let listaSpesa = document.getElementById("listaSpesa");
console.log(listaSpesa);
console.log(typeof listaSpesa);

//GetElementsByClassName - > Recupero tutti gli elementi con quella classe e vengono inseriti in una HTMLcollection (lontano parente dell'array)
let listaBlue = document.getElementsByClassName("blue");
console.log(listaBlue);
console.log(typeof listaBlue);
[...listaBlue].forEach(li => {
    console.log(li.textContent);
})

//QUERYSELECTOR e QUERYSELECTORALL (cssSelector)
//#nomeId
//.nomeClasse
//nomeTag

//.querySelector() raccoglie 1 e 1 solo elemento
let listaCose = document.querySelector("#listaSpesa");
console.log("Lista spesa", listaCose);

let itemBlue = document.querySelector(".blue"); //In questo caso recupererà la prima occorrenza
console.log("Item blue", itemBlue);

let body = document.querySelector("body");
console.log(body);

//.querySelectorAll() Questo recupera tutti gli elementi che rispettano quel selettore CSS. Crea una Nodelist (parenti più stretti degli array)
let lis = document.querySelectorAll("li");
console.log(lis);
console.log(typeof lis);
lis.forEach(li => {
    console.log(li.textContent);
})

//voglio gli li di classe blue
console.log("===== LI di classe blue ====");

let lisBlue = document.querySelectorAll("li.blue");
console.log(lisBlue);

//voglio solo gli li dei libri
console.log("==== LI dei libri ====");
let lisLibri = document.querySelectorAll("#listaLibri li");
console.log(lisLibri);

//voglio solo li rossi della lista libri
console.log("==== LI rossi della lista libnri ====");
let lisLibriRossi = document.querySelectorAll("#listaLibri li.red");
console.log(lisLibriRossi);







