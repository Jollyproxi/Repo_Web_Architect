// Genera una todo list raccogliendo dai due campi input le informazioni: item e data. Stampa, sotto nello ul, la lista di cose da fare. Con il pulsante aggiungi inserisci il nuovo item sia nello ul sia in un array chiamato items.

//ES: ["Andare dal dentista - 10/03/2026", "...", "...", "..."]

let items = [];

const item = document.getElementById("item");
const data = document.getElementById("data");
const btnAdd = document.getElementById("btnAdd");
const listaItems = document.getElementById("listaItems");

btnAdd.addEventListener("click", function(){
    let itemValue = item.value;
    let dataValue = new Date(data.value);

    let meseCorrente = dataValue.getMonth() + 1
    let formatMonth = (meseCorrente < 10 ? "0" + meseCorrente: meseCorrente);

    let dataCompleta = dataValue.getDate() + "/" +  formatMonth + "/" + dataValue.getFullYear();

    let todo = itemValue + " - " + dataCompleta;

    items.push(todo);

    items.forEach(todo => {
        listaItems.innerHTML += `<li> ${todo} </li>`;
        
    })
 
})
