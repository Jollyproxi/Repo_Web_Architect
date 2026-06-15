const es2 = document.querySelector("#esercizio2");
const carte = document.querySelectorAll(".carte");
const btnScopriCorsi = document.querySelector("#scopri-corsi");
const formcontrol = document.querySelector("#form-control");
const mioForm = document.querySelector("#mioForm");
const validationWarns = document.querySelector("#validation-warns");
const validationList = document.querySelector("#validation-list");
const iscritti = JSON.parse(localStorage.getItem("iscritti")) || [];
let iscrizioniContainer = document.querySelector("#iscrizioni-container");
let iscrizioniList = document.querySelector("#iscrizioni-list");
const typicodURL = "https://jsonplaceholder.typicode.com/users";
const btnCaricaDocenti = document.querySelector("#carica-docenti");
const docentiContainer = document.querySelector("#docenti-container");

toggleformcontrol();
toggleIscritti();

btnScopriCorsi.addEventListener("click", toggleCourses);
btnCaricaDocenti.addEventListener("click", fetchDocenti);
mioForm.addEventListener("submit", (event) => formSubmit(event));

class Utente 
{
    constructor(nome, email, eta, corso) 
    {
        this.nome = nome;
        this.email = email;
        this.eta = eta;
        this.corso = corso;
    }
}
function toggleformcontrol()
{
    carte.forEach
        (carta => {
            const option = document.createElement("option");
            option.value = carta.querySelector("h3").textContent;
            option.textContent = carta.querySelector("h3").textContent;
            formcontrol.appendChild(option);
        }
        );
}
function toggleIscritti() {
    if (!iscrizioniContainer && iscritti.length > 0) {
        createIscrizioniSection();
        iscrizioniContainer = document.querySelector("#iscrizioni-container");
        iscrizioniList = document.querySelector("#iscrizioni-list");
        iscritti.forEach(
            utente => {
                const li = document.createElement("li");
                li.textContent = utente.nome + " - " + utente.email + " - " + utente.corso;
                iscrizioniList.appendChild(li);
            }
        );
    }
}
function toggleCourses() {
    const coursesSection = document.querySelector(".courses");
    coursesSection.classList.toggle("d-none");
}
function formSubmit(event) {
    event.preventDefault();
    const nome = document.querySelector("#nome").value.trim();
    const email = document.querySelector("#email").value.trim();
    const eta = document.querySelector("#eta").value.trim();
    const corso = formcontrol.value;
    const errori = arrayErrori(nome, email, eta, corso);
    // Se ci sono errori
    if (errori.length > 0) {
        validationWarns.classList.remove("d-none");
        validationList.innerHTML = "";
        errori.forEach(
            err => {
                const li = document.createElement("li");
                li.textContent = err;
                validationList.appendChild(li);
            }
        );
    }
    // Dati validi
    else {
        validationWarns.classList.add("d-none");
        validationList.innerHTML = "";
        if (!iscrizioniContainer) {
            createIscrizioniSection();
            let iscrizioniContainer = document.querySelector("#iscrizioni-container");
            let iscrizioniList = document.querySelector("#iscrizioni-list");
        }
        const li = document.createElement("li");
        li.textContent = nome + " - " + email + " - " + corso;
        iscrizioniList.appendChild(li);

        mioForm.reset();
        formcontrol.value = "Seleziona il tuo corso";

        // Salvo l'iscritto in localStorage
        const utente = new Utente(nome, email, eta, corso);
        iscritti.push(utente);
        localStorage.setItem("iscritti", JSON.stringify(iscritti));
    }
}
function arrayErrori(nome, email, eta, corso) {
    const errori = [];
    if (nome === "") {
        errori.push("Il campo Nome è obbligatorio");
    }
    if (email === "") {
        errori.push("Il campo Email è obbligatorio");
    } else if (!validationMail(email)) {
        errori.push("Il campo Email non è valido");
    }
    if (eta === "") {
        errori.push("Il campo Età è obbligatorio");
    } else if (isNaN(eta) || (Number(eta) <= 0 || Number(eta) >= 150)) {
        errori.push("Il campo Età deve essere un numero maggiore di 0 e minore di 150");
    }
    if (corso === "Seleziona il tuo corso") {
        errori.push("Seleziona un corso");
    }
    return errori;
}
function validationMail(email) {
    const regexEmail = /^[^@]+@[^@]+\.[^@]+$/;
    return regexEmail.test(email); //true or false
}
function createIscrizioniSection() {
    const container = document.createElement("div");
    container.id = "iscrizioni-container";
    container.classList.add("mt-4");
    //non uso inner html per massimo controllo
    const iscrizioniricevute = document.createElement("h4");
    iscrizioniricevute.textContent = "Iscrizioni ricevute";

    const listaiscrizioni = document.createElement("ul");
    listaiscrizioni.id = "iscrizioni-list";
    listaiscrizioni.classList.add("list-group");

    container.appendChild(iscrizioniricevute);
    container.appendChild(listaiscrizioni);

    es2.appendChild(container);
}
function fetchDocenti() {
    fetch(typicodURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Errore nella richiesta: " + response.status);
            }
        })
        .then(data => {
            docentiContainer.classList.toggle("d-none");
            docentiContainer.innerHTML = '<h3>Docenti</h3>'; // reset per evitare duplicazioni
            data.forEach((docente, i) => {
                const card = document.createElement("div");
                card.id = "docente-" + i;
                card.classList.add("card");

                // non uso inner html per massimo controllo
                const row = document.createElement("div");
                row.classList.add("row", "g-0");

                const colBody = document.createElement("div");

                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                const title = document.createElement("h5");
                title.classList.add("card-title");
                title.textContent = docente.name;

                const emailD = document.createElement("p");
                emailD.classList.add("card-text");
                emailD.textContent = "Email: " + docente.email;

                const aziendaD = document.createElement("p");
                aziendaD.classList.add("card-text");
                aziendaD.textContent = "Azienda: " + docente.company.name;

                cardBody.appendChild(title);
                cardBody.appendChild(emailD);
                cardBody.appendChild(aziendaD);
                colBody.appendChild(cardBody);
                row.appendChild(colBody);
                card.appendChild(row);
                docentiContainer.appendChild(card);
            });

        })
        //  gestisci l'errore con .catch mostrando un messaggio nella pagina invece che in console
        .catch(error => {
            //azzera il contenuto del container e mostra un messaggio di errore
            docentiContainer.innerHTML = "";
            docentiContainer.classList.toggle("d-none");

            const errorMessage = document.createElement("p");
            errorMessage.classList.add("text-danger");
            errorMessage.textContent = "Errore nel caricamento dei docenti: " + error.message;
            docentiContainer.appendChild(errorMessage);
        })
        .finally(() => {
            console.log("Caricamento terminato");
        });
}

