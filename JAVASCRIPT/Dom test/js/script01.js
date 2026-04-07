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

// .querySelectorAll raccoglie tutti gli elementi che corrispondono al selettore creando una Nodelist chè un
// parete più stretto delle HTLM collection
let lis = document.querySelectorAll("li");
console.log(lis);
console.log(typeof lis);
lis.forEach(li => {
    console.log(li);
})


let lisBlue = document.querySelectorAll(".blue");
console.log(lisBlue);
console.log(typeof lisBlue);
lisBlue.forEach(li => {
    console.log(li);
})


let lisLibri = document.querySelectorAll("#listaLibri li");
console.log(lisLibri);
console.log(typeof lisLibri);
lisLibri.forEach(li => {
    console.log(li);
})


let lisLibriRossi = document.querySelectorAll("#listaLibri li.red");
console.log(lisLibriRossi);
console.log(typeof lisLibriRossi);
lisLibriRossi.forEach(li => {
    console.log(li);
})