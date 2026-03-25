// Lista di parole per il gioco
const parole = ["javascript", "html", "css", "programmazione", "algoritmo", "variabile", "funzione"];

// Variabili del gioco
let parolaSegreta = "";
let tentativiRimasti = 7;
let parolaIndovinata = [];
let lettereTentate = [];

// Inizializzazione del gioco
function inizializzaGioco() {
    // Seleziona una parola casuale
    parolaSegreta = parole[Math.floor(Math.random() * parole.length)];
    
    // Inizializza l'array con i caratteri nascosti
    parolaIndovinata = Array(parolaSegreta.length).fill("_");
    
    // Resetta le variabili
    tentativiRimasti = 7;
    lettereTentate = [];
    
    // Aggiorna l'interfaccia
    aggiornaUI();
    pulisciInput();
}

// Gestisce il tentativo di una lettera
function provaTentativo() {
    const inputElement = document.getElementById("lettera");
    const lettera = inputElement.value.toLowerCase();
    
    // Validazione input
    if (!lettera || lettera.length !== 1 || !/[a-z]/.test(lettera)) {
        alert("Inserisci una sola lettera valida!");
        pulisciInput();
        return;
    }
    
    // Verifica se la lettera è già stata tentata
    if (lettereTentate.includes(lettera)) {
        alert("Hai già tentato questa lettera!");
        pulisciInput();
        return;
    }
    
    // Aggiunge la lettera alle tentate
    lettereTentate.push(lettera);
    
    // Verifica se la lettera è nella parola
    let letteraTrovata = false;
    for (let i = 0; i < parolaSegreta.length; i++) {
        if (parolaSegreta[i] === lettera) {
            parolaIndovinata[i] = lettera;
            letteraTrovata = true;
        }
    }
    
    // Se la lettera non è trovata, diminuisci i tentativi
    if (!letteraTrovata) {
        tentativiRimasti--;
    }
    
    // Aggiorna l'interfaccia
    aggiornaUI();
    
    // Verifica se il gioco è finito
    verificaFinGioco();
    
    // Pulisci l'input
    pulisciInput();
}

// Aggiorna l'interfaccia del gioco
function aggiornaUI() {
    // Aggiorna i tentativi rimanenti
    document.getElementById("tentativi").textContent = tentativiRimasti;
    
    // Mostra le lettere tentate
    document.getElementById("lettereProva").innerHTML = 
        "<strong>Lettere tentate:</strong> " + lettereTentate.join(", ");
    
    // Mostra la parola con le lettere indovinate
    document.getElementById("risultato").innerHTML = 
        "<strong>Parola:</strong> " + parolaIndovinata.join(" ");
}

// Verifica se il gioco è finito
function verificaFinGioco() {
    const parolaCompleta = parolaIndovinata.join("");
    
    // Se la parola è completa
    if (parolaCompleta === parolaSegreta) {
        alert("🎉 Hai vinto! La parola era: " + parolaSegreta);
        inizializzaGioco();
        return;
    }
    
    // Se i tentativi sono finiti
    if (tentativiRimasti === 0) {
        alert("❌ Hai perso! La parola era: " + parolaSegreta);
        inizializzaGioco();
    }
}

// Pulisce l'input field
function pulisciInput() {
    document.getElementById("lettera").value = "";
    document.getElementById("lettera").focus();
}

// Event listeners
document.getElementById("btnTest").addEventListener("click", provaTentativo);

// Permetti l'invio con il tasto Enter
document.getElementById("lettera").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        provaTentativo();
    }
});

// Inizializza il gioco al caricamento
inizializzaGioco();
