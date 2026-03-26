//FUNZIONI
//Utili a wrappare codice sotto un unico nome. Permettono di essere più efficaci e di poter riutilizzare il codice

//dichiaro una funzione
function saluta(){
    let nomeUser = "Dario";
    let cognomeUser = "Mennillo";

    console.log(`Ciao ${nomeUser} ${cognomeUser}`);
}

//richiamo la funzione
saluta();

for(let i = 0; i < 5; i++){
    saluta();
}

//ATT: le funzioni hanno indipendenza tra la chiamata e la dichiarazione
salutaDocente();


function salutaDocente(){
    let docente = "Francesco Russo";
    console.log(`Ciao ${docente}`);
    //Posso richiamare una funzione dentro un'altra
    saluta();
}

//Lancio la funzione al click sul pulsante
const btn = document.getElementById("btn");
const demo = document.getElementById("demo");

function salutaStudente(){
    let studente = "Mario Rossi";
    demo.innerHTML = `<h3> Ciao ${studente} </h3>`;
}

//Quando richiamo una funzione in un Listener non devo mettere le parentesi tonde
btn.addEventListener("click", salutaStudente); 

//Scope e visibilità delle variabili

//respoCorso ha uno scope globale: massima visibilità, visibilità di script
let respoCorso = "Anna Verdi";

function attivaCorso(){
    //docente e studente hanno uno scope locale: visibilità legata alla funzione stessa. All'esterno non so cos'è docente e studente
    let docente = "Dario Mennillo";
    let studente = "Laura Bianchi";

    console.log(`Il corso è stato attivato da ${respoCorso}.\nDocente: ${docente}\nStudente: ${studente}`);
}

attivaCorso();

console.log(`Ciao ${respoCorso}`);

// console.log(`Ciao ${studente}`);

let demo2 = document.getElementById("demo2");

function cambiaColore(){
    demo2.classList.add("bgBlue");
    console.log("Sto cambiando colore al div");
}

function togliColore(){
    demo2.classList.remove("bgBlue");
    console.log("Sto togliendo il colore di sfondo");
}

demo2.addEventListener("mouseenter", cambiaColore);

demo2.addEventListener("mouseleave", togliColore);