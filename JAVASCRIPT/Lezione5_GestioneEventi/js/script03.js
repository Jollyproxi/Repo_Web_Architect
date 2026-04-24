const mioForm = document.querySelector("#mioForm");
const validationWarns = document.querySelector("#validationWarns");
const demo = document.querySelector("#demo");

//L'evento submit è direttamente legato al form
mioForm.addEventListener("submit", function (event) {
    event.preventDefault(); //Evita che il form venga sottoscritto 

    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const eta = document.querySelector("#eta").value;
    const nazionalita = document.querySelector("#nazionalita").value;

    const validationErrors = [];

    if(nome == ""){
        validationErrors.push("Inserisci un nome")
    }

    if(!validationMail(email)){
        validationErrors.push("Email non valida");
    }

    if(isNaN(eta) || eta < 0 || eta == ""){
        validationErrors.push("Età non valida");
    }

    if(nazionalita == ""){
        validationErrors.push("Non hai selezionato una nazionalità");
    }

    if(validationErrors.length > 0){
        event.preventDefault(); 
        printErrors(validationErrors);
        return;
    }

    mioForm.reset();
    validationWarns.innerHTML = "";
    location.replace("./paginaRegistrato.html")
    printInfoDemo(nome, email, eta, nazionalita);

})

function validationMail(email){
    const regexEmail = /^[^@]+@[^@]+\.[^@]+$/;
    return regexEmail.test(email); //true or false
}

/**
 * @param {String[]} errors 
 */
function printErrors(errors){
    const warningDiv = document.createElement("div");
    validationWarns.innerHTML = "";

    warningDiv.setAttribute("class", "warningTxt");

    const ul = document.createElement("ul");

    errors.forEach(error =>{
        const li = document.createElement("li");
        li.textContent = error;
        ul.appendChild(li);
    })

    warningDiv.appendChild(ul);
    validationWarns.appendChild(warningDiv);
}

function printInfoDemo(...info){
    info.forEach(infoUser => {
        console.log(infoUser);
        
    })
}