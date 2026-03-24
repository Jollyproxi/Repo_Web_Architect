//Raccolgo tutti i campi input all'esterno mentre nelle funzioni raccoglierò i value

const elNome = document.getElementById("nome");
const elCognome = document.getElementById("cognome");
const elEta = document.getElementById("eta");
const elEmail = document.getElementById("email");
const elCodFisc = document.getElementById("codFisc")
const elCorso = document.getElementById("corso");

const btnInvia = document.getElementById("btnInvia");
const feed = document.getElementById("feed");


/**
 * @param {String} nome 
 */
function validaNomeCognome(nome){
    // if(nome.trim() !== ""){
    //     return true;
    // }else{
    //     return false;
    // }

    const regex = /^[a-zA-Z]{2,}$/;
    return regex.test(nome);
    // return nome.match(regex);
}

/**
 * @param {String} email 
 */
function validaEmail(email){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return email.match(regex);
}

/**
 * 
 * @param {Number} eta 
 */
function validaEta(eta){
    if(eta < 18){
        return false;
    }else{
        return true;
    }
}

/**
 * 
 * @param {String} codFisc 
 * @returns Boolean
 */
function validaCodFisc(codFisc){
    const regex = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/
    return codFisc.match(regex);
}

function validaCorso(corso){
    if(corso == ""){
        return false;
    }else{
        return true;
    }
}

//valido tutto campo per campo
function validaForm(){
    let msgErrors = []

    //Valida nome
    if(elNome.value.trim() == ""){
        msgErrors.push("Nome non inserito");
        elNome.setAttribute("class", "brdRed")
    }else if(!validaNomeCognome(elNome.value)){
        msgErrors.push("Nome non valido");
    }

    //Valida cognome
    if(elCognome.value.trim() == ""){
        msgErrors.push("Cognome non inserito");
    }else if(!validaNomeCognome(elCognome.value)){
        msgErrors.push("Cognome non valido");
    }

    if(!validaEmail(elEmail.value)){
        msgErrors.push("Email non valida");
    }

    if(!validaEta(elEta.value)){
        msgErrors.push("Età non valida per l'iscrizione ai corsi")
    }

    if(!validaCodFisc(elCodFisc.value)){
        msgErrors.push("Codice Fiscale non valido");
    }

    if(!validaCorso(elCorso.value)){
        msgErrors.push("Corso non selezionato")
    }
    

    if(msgErrors.length > 0){
        //pulire il campo feed
        feed.innerHTML = "";
        msgErrors.forEach(msg => {
            feed.innerHTML += `<li> ${msg} </li>`;
        })
    }else{
        feed.innerHTML = "<h3> Registrazione avvenuta </h3>";
        feed.innerHTML += `<p> ${elNome.value} ${elCognome.value} </p>`;
        feed.innerHTML += `<p> Codice Fiscale ${elCodFisc.value}</p>`;
        feed.innerHTML += `<p> Email: ${elEmail.value}</p>`;
        feed.innerHTML += `<p> Corso Scelto: ${elCorso.value}</p>`;
    }


}

btnInvia.addEventListener("click", validaForm); 