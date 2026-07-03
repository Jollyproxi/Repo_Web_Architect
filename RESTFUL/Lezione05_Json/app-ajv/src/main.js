import { validaUtente } from "./validator.js";


document.querySelector("#app").innerHTML = `
   <div class="container">
      <h1>Registra Utente</h1>
      <p>Validazione con AJV</p>

      <div class="campo">
        <label for="nome">Nome</label>
        <input type="text" id="nome" placeholder="Mario Rossi" autocomplete="off">
        <div class="errore" id="err-nome"></div>
      </div>

      <div class="campo">
        <label for="email">Email</label>
        <input type="text" id="email" placeholder="mario@mail.com" autocomplete="off">
        <div class="errore" id="err-email"></div>
      </div>

      <div class="campo">
        <label for="eta">Età</label>
        <input type="number" id="eta" placeholder="30">
        <div class="errore" id="err-eta"></div>
      </div>

      <div class="campo">
        <label for="ruolo">Ruolo</label>
        <select name="ruolo" id="ruolo">
          <option value="admin">Admin</option>
          <option value="base">Base</option>
        </select>
        <div class="errore" id="err-ruolo"></div>
      </div>

      <button id="invia">Registrati</button>

      <div class="risultato" id="risultato"></div>
    </div>
`


//Funzione che raccoglie i dati da un form (per adesso non abbiamo)
function raccogliDati(){
  //l'utente deve essere composto utilizzando i campi input del form
  let utenteRAW = {
    nome: document.querySelector("#nome").value,
    email: document.querySelector("#email").value,
    eta: Number(document.querySelector("#eta").value),
    ruolo: document.querySelector("#ruolo").value || undefined
  }
  return utenteRAW;
}

const CAMPI = ["nome", "email", "eta", "ruolo"];

function stampaErrori(errori){
  CAMPI.forEach((c)=>{
    let input = document.querySelector(`#${c}`);
    let boxErrore = document.querySelector(`#err-${c}`);
    
    if(errori[c]){
      boxErrore.textContent = errori[c];
    }else{
      boxErrore.textContent = "";
    }
  })
}

function valida(){
  // const dati = raccogliDati();
  // validaUtente(dati);
  const  { errori } = validaUtente(raccogliDati());
  stampaErrori(errori);
}

CAMPI.forEach((c)=>{
  document.querySelector(`#${c}`).addEventListener("input", valida);
})