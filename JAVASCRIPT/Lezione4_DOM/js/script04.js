//Aggiungere un elemento alla lista della spesa
let listaSpesa = document.querySelector("#listaSpesa");

// listaSpesa.innerHTML += "<li> Hamburger </li>"; //Questo vale quanto una stringa

let nuovoLi = document.createElement("li"); //Questo è a tutti gli effetti un oggetto di tipo HTML

nuovoLi.textContent = "Hamburger";

nuovoLi.addEventListener("click", function(){
    alert("Stai guardando la scheda dell'hamburger");
});

listaSpesa.appendChild(nuovoLi);

let altroLi = document.createElement("li");
let contenutoTxt = document.createTextNode("Insalata");
altroLi.appendChild(contenutoTxt);
listaSpesa.appendChild(altroLi);

const item = document.querySelector("#item");
const btnAdd = document.querySelector("#btnAdd")

function aggiungiItem(){
    let li = document.createElement("li");
    li.textContent = item.value;
    
    let btnRem = document.createElement("button");
    btnRem.textContent = " X ";

    li.appendChild(btnRem);

    listaSpesa.appendChild(li);
    
    li.addEventListener("click", function(){
        alert("Stai guardando la scheda di " + this.textContent);
    })

    btnRem.addEventListener("click", function(){
        //parent.removeChild(childNode)
        listaSpesa.removeChild(li);
    })
}

btnAdd.addEventListener("click", aggiungiItem);


function parseLiVecchi() {
    let lis = document.querySelectorAll("#listaSpesa li");
    console.log(lis);
    
    lis.forEach(li => {
       let btn = document.createElement("button");
       btn.textContent = " X ";
       li.appendChild(btn);
       btn.addEventListener("click", function(){
        listaSpesa.removeChild(li);
       }) 
    });
}

document.addEventListener("DOMContentLoaded", parseLiVecchi);