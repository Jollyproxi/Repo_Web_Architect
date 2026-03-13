// ============================================================
// STATEMENT FONDAMENTALI IN JAVASCRIPT
// ============================================================

// ────────────────────────────────────────────────────────────
// 1. OPERATORI DI CONFRONTO
// ────────────────────────────────────────────────────────────

let a = 10;
let b = 20;

console.log("=== OPERATORI DI CONFRONTO ===");

// Minore di  <
console.log("a < b  →", a < b);       // true
console.log("b < a  →", b < a);       // false

// Minore o uguale  <=
console.log("a <= 10 →", a <= 10);    // true
console.log("a <= 9  →", a <= 9);     // false

// Maggiore di  >
console.log("b > a  →", b > a);       // true
console.log("a > b  →", a > b);       // false

// Maggiore o uguale  >=
console.log("b >= 20 →", b >= 20);    // true
console.log("b >= 21 →", b >= 21);    // false

// Uguale con coercizione  ==
console.log('10 == "10" →', 10 == "10");   // true  (coercizione di tipo)
console.log('10 == 10   →', 10 == 10);     // true

// Strettamente uguale === (nessuna coercizione)
console.log('10 === "10" →', 10 === "10"); // false (tipi diversi)
console.log('10 === 10   →', 10 === 10);   // true

// Diverso con coercizione  !=
console.log('10 != "10" →', 10 != "10");   // false
console.log('10 != 20   →', 10 != 20);     // true

// Strettamente diverso  !==


console.log('10 !== "10" →', 10 !== "10"); // true
console.log('10 !== 10   →', 10 !== 10);   // false


// ────────────────────────────────────────────────────────────
// 2. OPERATORI LOGICI
// ────────────────────────────────────────────────────────────

console.log("\n=== OPERATORI LOGICI ===");

let isAdult = true;
let hasTicket = false;

// AND  &&  → entrambe le condizioni devono essere vere
console.log("isAdult && hasTicket →", isAdult && hasTicket); // false
console.log("isAdult && true     →", isAdult && true);       // true

// OR  ||  → almeno una condizione deve essere vera
console.log("isAdult || hasTicket →", isAdult || hasTicket); // true
console.log("false   || hasTicket →", false || hasTicket);   // false

// NOT  !  → nega il valore booleano
console.log("!isAdult  →", !isAdult);   // false
console.log("!hasTicket →", !hasTicket); // true


// ────────────────────────────────────────────────────────────
// 3. IF / ELSE IF / ELSE
// ────────────────────────────────────────────────────────────

console.log("\n=== IF / ELSE IF / ELSE ===");

let voto = 75;

if (voto >= 90) {
    console.log("Voto: A — Eccellente!");
} else if (voto >= 75) {
    console.log("Voto: B — Buono!");
} else if (voto >= 60) {
    console.log("Voto: C — Sufficiente.");
} else {
    console.log("Voto: Insufficiente.");
}

// Esempio con operatori combinati
let eta = 17;
let accompagnato = true;

if (eta >= 18 || (eta >= 16 && accompagnato)) {
    console.log("Accesso consentito.");
} else {
    console.log("Accesso negato.");
}


// ────────────────────────────────────────────────────────────
// 4. OPERATORE TERNARIO  ?  :
// ────────────────────────────────────────────────────────────

console.log("\n=== OPERATORE TERNARIO ===");

let temperatura = 30;
let meteo = temperatura > 25 ? "Fa caldo ☀️" : "Temperatura nella norma 🌤️";
console.log(meteo); // Fa caldo ☀️

let numero = -5;
let segno = numero > 0 ? "positivo" : numero < 0 ? "negativo" : "zero";
console.log(`${numero} è ${segno}`); // -5 è negativo


// ────────────────────────────────────────────────────────────
// 5. SWITCH
// ────────────────────────────────────────────────────────────

console.log("\n=== SWITCH ===");

let giorno = "Lunedì";

switch (giorno) {
    case "Lunedì":
    case "Martedì":
    case "Mercoledì":
    case "Giovedì":
    case "Venerdì":
        console.log(`${giorno} → giorno lavorativo 💼`);
        break;
    case "Sabato":
    case "Domenica":
        console.log(`${giorno} → weekend 🎉`);
        break;
    default:
        console.log("Giorno non riconosciuto.");
}

// Switch con valori numerici
let mese = 4;
switch (mese) {
    case 1:  console.log("Gennaio");   break;
    case 2:  console.log("Febbraio");  break;
    case 3:  console.log("Marzo");     break;
    case 4:  console.log("Aprile");    break;
    case 12: console.log("Dicembre");  break;
    default: console.log("Altro mese");
}


// ────────────────────────────────────────────────────────────
// 6. CICLO FOR
// ────────────────────────────────────────────────────────────

console.log("\n=== CICLO FOR ===");

// Stampa i numeri da 1 a 5
for (let i = 1; i <= 5; i++) {
    console.log(`Iterazione ${i}`);
}

// Somma degli elementi di un array
let numeri = [3, 7, 2, 9, 4];
let somma = 0;
for (let i = 0; i < numeri.length; i++) {
    somma += numeri[i];
}
console.log("Somma array:", somma); // 25

// Conta alla rovescia
for (let i = 5; i >= 1; i--) {
    console.log(`Conto alla rovescia: ${i}`);
}


// ────────────────────────────────────────────────────────────
// 7. CICLO WHILE
// ────────────────────────────────────────────────────────────

console.log("\n=== CICLO WHILE ===");

let contatore = 0;
while (contatore < 5) {
    console.log(`Contatore while: ${contatore}`);
    contatore++;
}

// Ricerca del primo numero maggiore di 15 in un array
let valori = [4, 8, 12, 17, 22];
let indice = 0;
while (indice < valori.length && valori[indice] <= 15) {
    indice++;
}
console.log(`Primo valore > 15: ${valori[indice]} all'indice ${indice}`);


// ────────────────────────────────────────────────────────────
// 8. CICLO DO…WHILE
// ────────────────────────────────────────────────────────────

console.log("\n=== CICLO DO...WHILE ===");

// Viene eseguito almeno una volta, anche se la condizione è falsa da subito
let x = 10;
do {
    console.log(`do...while x = ${x}`);
    x++;
} while (x < 5);
// Stampa una sola volta perché x=10 non è < 5

// Esempio classico: accumulo fino a soglia
let totale = 0;
let passo = 1;
do {
    totale += passo;
    passo++;
} while (totale < 20);
console.log(`Somma progressiva ≥ 20 ottenuta al passo ${passo - 1}: totale = ${totale}`);


// ────────────────────────────────────────────────────────────
// 9. FOR…OF  (itera sui valori)
// ────────────────────────────────────────────────────────────

console.log("\n=== FOR...OF ===");

let frutti = ["🍎 Mela", "🍌 Banana", "🍊 Arancia"];
for (let frutto of frutti) {
    console.log(frutto);
}

// Su una stringa
let parola = "Ciao";
for (let lettera of parola) {
    console.log(lettera);
}


// ────────────────────────────────────────────────────────────
// 10. FOR…IN  (itera sulle chiavi di un oggetto)
// ────────────────────────────────────────────────────────────

console.log("\n=== FOR...IN ===");

let persona = {
    nome: "Alice",
    eta: 28,
    citta: "Milano"
};

for (let chiave in persona) {
    console.log(`${chiave}: ${persona[chiave]}`);
}


// ────────────────────────────────────────────────────────────
// 11. BREAK E CONTINUE
// ────────────────────────────────────────────────────────────

console.log("\n=== BREAK E CONTINUE ===");

// break → interrompe il ciclo
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        console.log(`break al valore ${i}`);
        break;
    }
    console.log("i =", i);
}

// continue → salta all'iterazione successiva
for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) continue; // salta i pari
    console.log("Dispari:", i);
}


// ────────────────────────────────────────────────────────────
// 12. CONFRONTO TRA TIPI DIVERSI (coercizione vs strict)
// ────────────────────────────────────────────────────────────

console.log("\n=== CONFRONTO TRA TIPI DIVERSI ===");

// null e undefined
console.log("null == undefined   →", null == undefined);   // true  (regola speciale)
console.log("null === undefined  →", null === undefined);  // false (tipi diversi)
console.log("null == 0           →", null == 0);           // false
console.log("null >= 0           →", null >= 0);           // true  (curiosità JS!)
console.log("null > 0            →", null > 0);            // false

// NaN non è uguale a nulla, nemmeno a sé stesso
console.log("NaN === NaN         →", NaN === NaN);         // false
console.log("isNaN(NaN)          →", isNaN(NaN));          // true
console.log("Number.isNaN(NaN)   →", Number.isNaN(NaN));   // true (più sicuro)

// Confronto tra stringhe (ordine lessicografico)
console.log('"banana" > "apple"  →', "banana" > "apple"); // true
console.log('"abc" < "abd"       →', "abc" < "abd");      // true
console.log('"Z" < "a"           →', "Z" < "a");          // true (codice ASCII: Z=90, a=97)

// Confronto misto stringa-numero con >
console.log('"5" > 3             →', "5" > 3);            // true (coercizione)
console.log('"5" > "10"          →', "5" > "10");         // true (lessicografico: "5" > "1")


// ────────────────────────────────────────────────────────────
// 13. OPERATORI DI ASSEGNAZIONE COMPOSTI
// ────────────────────────────────────────────────────────────

console.log("\n=== OPERATORI DI ASSEGNAZIONE COMPOSTI ===");

let n = 10;
console.log("n =", n);       // 10

n += 5;  console.log("n += 5  →", n);  // 15
n -= 3;  console.log("n -= 3  →", n);  // 12
n *= 2;  console.log("n *= 2  →", n);  // 24
n /= 4;  console.log("n /= 4  →", n);  // 6
n %= 4;  console.log("n %= 4  →", n);  // 2
n **= 3; console.log("n **= 3 →", n);  // 8

// Incremento e decremento
let c = 5;
console.log("c++  →", c++, " (poi c =", c, ")"); // 5  poi 6  (post-incremento)
console.log("++c  →", ++c, " (c già aggiornato)"); // 7          (pre-incremento)
console.log("c--  →", c--, " (poi c =", c, ")"); // 7  poi 6  (post-decremento)
console.log("--c  →", --c, " (c già aggiornato)"); // 5          (pre-decremento)


// ────────────────────────────────────────────────────────────
// 14. NULLISH COALESCING  ??  e  OPTIONAL CHAINING  ?.
// ────────────────────────────────────────────────────────────

console.log("\n=== NULLISH COALESCING ?? ===");

//  restituisce il valore di destra solo se quello di sinistra è null o undefined
let username = null;
console.log("username ?? 'Ospite'  →", username ?? "Ospite"); // Ospite

let punteggio = 0;
console.log("punteggio ?? 100     →", punteggio ?? 100);  // 0  (0 NON è null/undefined)
console.log("punteggio || 100     →", punteggio || 100);  // 100 (0 è falsy per ||)

// assegna solo se la variabile è null/undefined
let config = null;
config ??= "default";
console.log("config ??= 'default' →", config); // default

console.log("\n=== OPTIONAL CHAINING ?. ===");

let utente = {
    nome: "Marco",
    indirizzo: {
        citta: "Roma"
    }
};

// Senza optional chaining andrebbe in errore se la proprietà non esiste
console.log("utente?.nome              →", utente?.nome);               // Marco
console.log("utente?.telefono          →", utente?.telefono);           // undefined (no errore)
console.log("utente?.indirizzo?.citta  →", utente?.indirizzo?.citta);  // Roma
console.log("utente?.indirizzo?.cap    →", utente?.indirizzo?.cap);    // undefined

// Optional chaining con metodi
let stringa = "hello";
console.log("stringa?.toUpperCase()   →", stringa?.toUpperCase());  // HELLO
let vuoto = null;
console.log("vuoto?.toUpperCase()     →", vuoto?.toUpperCase());    // undefined (no errore)


// ────────────────────────────────────────────────────────────
// 15. TYPEOF  e  INSTANCEOF
// ────────────────────────────────────────────────────────────

console.log("\n=== TYPEOF ===");

console.log("typeof 42          →", typeof 42);           // number
console.log("typeof 'testo'     →", typeof "testo");      // string
console.log("typeof true        →", typeof true);         // boolean
console.log("typeof undefined   →", typeof undefined);    // undefined
console.log("typeof null        →", typeof null);         // object  ← curiosità storica JS
console.log("typeof {}          →", typeof {});           // object
console.log("typeof []          →", typeof []);           // object  ← anche array è object
console.log("typeof function(){} →", typeof function(){}); // function
console.log("typeof Symbol()    →", typeof Symbol());     // symbol

// instanceof  → verifica se un oggetto è istanza di una classe
let arr = [1, 2, 3];
let data = new Date();
console.log("\n=== INSTANCEOF ===");
console.log("arr instanceof Array  →", arr instanceof Array);   // true
console.log("arr instanceof Object →", arr instanceof Object);  // true  (Array estende Object)
console.log("data instanceof Date  →", data instanceof Date);   // true


// ────────────────────────────────────────────────────────────
// 16. TRY / CATCH / FINALLY
// ────────────────────────────────────────────────────────────

console.log("\n=== TRY / CATCH / FINALLY ===");

// Gestione di un errore generico
try {
    let risultato = 10 / 0;
    console.log("10 / 0 =", risultato); // Infinity (non lancia errore in JS)

    // Questo lancia un errore
    let obj = null;
    console.log(obj.proprietà);         // TypeError
} catch (errore) {
    console.log("Errore catturato:", errore.message);
} finally {
    console.log("finally: eseguito sempre, con o senza errore.");
}

// Lanciare un errore personalizzato
function dividi(a, b) {
    if (b === 0) throw new Error("Divisione per zero non consentita!");
    return a / b;
}

try {
    console.log("dividi(10, 2) =", dividi(10, 2));  // 5
    console.log("dividi(5, 0)  =", dividi(5, 0));   // lancia errore
} catch (e) {
    console.log("Errore personalizzato:", e.message);
}


// ────────────────────────────────────────────────────────────
// 17. FOR ANNIDATO  (nested loop)
// ────────────────────────────────────────────────────────────

console.log("\n=== FOR ANNIDATO (tabellina del 3) ===");

for (let riga = 1; riga <= 3; riga++) {
    let rigaOutput = "";
    for (let col = 1; col <= 5; col++) {
        rigaOutput += `${riga}x${col}=${riga * col}  `;
    }
    console.log(rigaOutput.trim());
}

// Iterare una matrice 2D
console.log("\n=== MATRICE 2D ===");
let matrice = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

for (let r = 0; r < matrice.length; r++) {
    let riga = "";
    for (let c = 0; c < matrice[r].length; c++) {
        riga += matrice[r][c] + " ";
    }
    console.log(riga.trim());
}


// ────────────────────────────────────────────────────────────
// 18. LABEL (etichette per break/continue su cicli annidati)
// ────────────────────────────────────────────────────────────

console.log("\n=== LABEL ===");

esterno: for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        if (j === 2) {
            console.log(`  break esterno: i=${i}, j=${j} → salto tutto il ciclo esterno`);
            break esterno; // esce dal ciclo esterno, non solo da quello interno
        }
        console.log(`  i=${i}, j=${j}`);
    }
}

// Label con continue
console.log("--- label + continue ---");
loop1: for (let i = 0; i < 3; i++) {
    loop2: for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            continue loop1; // salta all'iterazione successiva del ciclo esterno
        }
        console.log(`  i=${i}, j=${j}`);
    }
}


// ────────────────────────────────────────────────────────────
// 19. OPERATORE  IN  (proprietà in oggetto)  e  DELETE
// ────────────────────────────────────────────────────────────

console.log("\n=== OPERATORE IN ===");

let auto = { marca: "Fiat", modello: "500", anno: 2020 };

console.log('"marca" in auto   →', "marca" in auto);    // true
console.log('"colore" in auto  →', "colore" in auto);   // false
console.log('"toString" in auto →', "toString" in auto); // true (eredità da Object)

// Verifica indice in array
let colori = ["rosso", "verde", "blu"];
console.log("1 in colori →", 1 in colori); // true  (esiste l'indice 1)
console.log("5 in colori →", 5 in colori); // false (indice 5 non esiste)

// delete → rimuove una proprietà
console.log("\n=== DELETE ===");
console.log("auto prima del delete:", auto);
delete auto.anno;
console.log("auto dopo delete auto.anno:", auto);
console.log('"anno" in auto  →', "anno" in auto); // false


// ────────────────────────────────────────────────────────────
// 20. SPREAD  ...  e  REST  ...
// ────────────────────────────────────────────────────────────

console.log("\n=== SPREAD OPERATOR ===");

let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let unito = [...arr1, ...arr2];
console.log("unito:", unito); // [1, 2, 3, 4, 5, 6]

let copia = [...arr1];
copia.push(99);
console.log("arr1 originale:", arr1); // [1,2,3] — non modificato
console.log("copia:",           copia); // [1,2,3,99]

// Spread su oggetti
let base = { colore: "rosso", taglia: "M" };
let extra = { prezzo: 29.99, taglia: "L" };
let prodotto = { ...base, ...extra }; // extra sovrascrive base dove c'è conflitto
console.log("prodotto:", prodotto);

// REST nei parametri di funzione
console.log("\n=== REST PARAMETERS ===");

function sommaRest(...numeri) {
    return numeri.reduce((acc, val) => acc + val, 0);
}
console.log("sommaRest(1,2,3)         →", sommaRest(1, 2, 3));         // 6
console.log("sommaRest(10,20,30,40)   →", sommaRest(10, 20, 30, 40)); // 100

function stampaInfo(nome, ...hobbies) {
    console.log(`${nome} ama: ${hobbies.join(", ")}`);
}
stampaInfo("Luca", "corsa", "lettura", "cucina");


// ────────────────────────────────────────────────────────────
// 21. DESTRUCTURING  (destrutturazione)
// ────────────────────────────────────────────────────────────

console.log("\n=== DESTRUCTURING ARRAY ===");

let [primo, secondo, ...resto] = [10, 20, 30, 40, 50];
console.log("primo:", primo);     // 10
console.log("secondo:", secondo); // 20
console.log("resto:", resto);     // [30, 40, 50]

// Scambio di variabili
let p = 1, q = 2;
[p, q] = [q, p];
console.log("dopo swap: p =", p, " q =", q); // p=2 q=1

// Valori di default
let [alpha = "A", beta = "B", gamma = "C"] = ["X", "Y"];
console.log("alpha:", alpha, "beta:", beta, "gamma:", gamma); // X Y C

console.log("\n=== DESTRUCTURING OGGETTO ===");

let { nome: nomeUtente, eta: etaUtente = 0, ruolo = "utente" } = {
    nome: "Sara",
    eta: 25
};
console.log("nomeUtente:", nomeUtente); // Sara
console.log("etaUtente:", etaUtente);   // 25
console.log("ruolo:", ruolo);           // utente (valore di default)

// Destrutturazione annidata
let { indirizzo: { citta: cittaRes } } = {
    indirizzo: { citta: "Napoli" }
};
console.log("cittaRes:", cittaRes); // Napoli


