const btn = document.querySelector("#btn");
const demo = document.querySelector("#demo");

function scaricaDati(){
    const URLEND = "http://localhost:3000/docenti";

    fetch(URLEND)
    .then(data => data.json())
    .then(response => {
        console.log(response);
        stampaDati(response);
    })
}

/**
 * 
 * @param {Object[]} docenti 
 */
function stampaDati(docenti){
    docenti.forEach(d =>{
        let li = document.createElement("li");
        li.textContent = d.nome;
        demo.appendChild(li);
    })
}

btn.addEventListener("click", scaricaDati)