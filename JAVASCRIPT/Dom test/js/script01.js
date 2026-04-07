let listaSpesa = document.getElementById("listaSpesa");
console.log(listaSpesa);
console.log(typeof listaSpesa);




// HTML collection
let listaBlue = document.getElementsByClassName("blue");
console.log(listaBlue);
console.log(typeof listaBlue);
// per il foreach devo spereaddare
[...listaBlue].forEach(li => {
    console.log(li);
    li.style.color = "blue";
})

//.querySelector raccoglie solo un elemento, il primo che trova
let listaCose = document.querySelector("#listaSpesa");
console.log("Lista spesa", listaCose);



let itemBlue = document.querySelector(".blue");
console.log("Item blue", itemBlue);

