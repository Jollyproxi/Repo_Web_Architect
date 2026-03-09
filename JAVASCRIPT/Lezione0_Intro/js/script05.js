// let libri = new Array();
// libri[0] = "Shogun";
// libri[1] = "Ubik";
// libri[2] = "Guerra e Pace";

let libri = [
    "Shogun",
    "Ubik",
    "Guerra e Pace",
    "The Dubliners",
    "Solaris",
    "Orgoglio e Pregiudizio"
]

//Stampo all'interno di elenco libri
let elencoLibri = document.getElementById("elencoLibri");

libri.sort();

libri.forEach(libro => {
    elencoLibri.innerHTML += `<li> ${libro} </li>`;
})

let btn = document.getElementById("btn");

btn.addEventListener("click", function(){
    //Recupero il value (quello che scrive l'utente) del mio campo input
    // let titoloLibro = document.getElementById("titoloLibro").value;
    let elInputTitoloLibro = document.getElementById("titoloLibro");
    let titoloLibro = elInputTitoloLibro.value;

    console.log(titoloLibro);
    libri.push(titoloLibro);
    elencoLibri.innerHTML += `<li> ${titoloLibro} </li>`;

    elInputTitoloLibro.value = "";
})


