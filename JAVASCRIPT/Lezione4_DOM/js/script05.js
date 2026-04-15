let li = document.querySelector("#listaSpesa li#uno");
console.log(li);
// Leggo gli attributi
console.log(li.getAttribute("id"));
console.log(li.getAttribute("class"));

if(li.hasAttribute("class")){
    let valoreClasse = li.getAttribute("class");
    console.log("La classe vale: " + valoreClasse);
}

let li2 = document.querySelector("#listaSpesa li#due");
li2.setAttribute("class", "under red upper");

let img = document.querySelector("img");
img.setAttribute("src", "./img/torino_autunno.jpg");
img.setAttribute("style", "width: 200px; height: auto");
img.setAttribute("alt", "Veduta di Torino in autunno");

//remove attribute per rimuovere completamente un attributo, non solo il valore
let liAcqua = document.querySelector("#listaSpesa").lastElementChild;
liAcqua.removeAttribute("class");

//Voglio giocare con le classi non solo con gli attributes
let liBeer = document.querySelector("#liBeer");

console.log(liBeer.classList); //classList recupera e mette in una DOMtokenList (parente degli array) tutti gli elementi della classe

liBeer.classList.remove("blue");
liBeer.classList.remove("under");
liBeer.classList.add("red");
liBeer.classList.replace("upper", "under");

liBeer.addEventListener("click", function(){
    liBeer.classList.toggle("red");
    console.log( liBeer.classList.contains("red"));
})

