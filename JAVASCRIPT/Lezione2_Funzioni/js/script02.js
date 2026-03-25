//FUNZIONI PARAMETRICHE
//I parametri sono dati in ingresso: argomenti

//Nome della funzione + paramentri: Signature (Firma)
//OSS: i paramentri sono dei placeholder, dei segnalini. Possono avere il nome che più mi piace


/**
 * Questi sono i JS doc, attenzione, utilizzararli non vuol dire tipizzare
 * @param {String} nome 
 */
function saluta(nome){
    console.log(`ciao ${nome}`); 
}

saluta("Anna");
saluta(8);


/**
 * @param {String} nome 
 * @param {String} cognome 
 * @param {String} email 
 * @param {Number} eta 
 */


const demo = document.getElementById("demo");
const btn = document.getElementById("btnReg")

// function salutaStudente (nome, cognome, eta, email){
//     console.log(`Ciao, mi chiamo ${nome} ${cognome} e ho ${eta} anni, la mia email è ${email}`);
//     demo.innerHTML = `<h3>Ciao, mi chiamo ${nome} ${cognome} e ho ${eta} anni, la mia email è ${email} </h3>`;
// }

//Faccio la stessa cosa ma con un return. Quando utilizzo una funzione con return devo poi sempre andare a raccogliere il risultato in uscita

/**
 * 
 * @param {*} nome 
 * @param {*} cognome 
 * @param {*} eta 
 * @param {*} email 
 * @returns 
 */
function salutaStudente(nome, cognome, eta, email){
    return `<h3>Ciao, mi chiamo ${nome} ${cognome} e ho ${eta} anni, la mia email è ${email} </h3>`;   
}

function recuperaDaForm(){
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let cognome = document.getElementById("cognome").value;
    let eta = document.getElementById("eta").value;
    demo.innerHTML = salutaStudente(nome, cognome, eta, email );
}

btnReg.addEventListener("click", recuperaDaForm);

//ESEMPIO CON RETURN 

function calcolaArea(base, altezza){
    let area = base * altezza;
    return area;
}

function calcolcaVolume(base, altezza, profondita){
    let area = calcolaArea(base, altezza);
    let volume = area * profondita;
    return volume;
}

/**
 * 
 * @param {Function} area 
 * ATT: PASSARE UNA FUNZIONE COME PARAMETRO DI UN'ALTRA FUNZIONE è POSSIBILE. SI CHIAMANO CALLBACK FUNCTION
 * @param {Number} profondita 
 * @returns 
 */
function calcolaVolume2(area, profondita){
    return area * profondita;
}

calcolaVolume2(calcolaArea(5,4),8)


//Altri tipologie di parametri da passare alle funzioni
//Funzioni con parametri di default
function presentaCorso(titolo="WSA", sede = "ITS", materie = ['HTML', 'Js', 'Css']){
    let presentazione = `Titolo corso: ${titolo}\nSede: ${sede}\nMaterie: `;

    for(let i = 0; i < materie.length; i++){
        presentazione += `\n${materie[i]}`;
    }

    return presentazione;
}

//In questo caso posso semplicemente richiamare la funzione senza passare il valore dei parametri
console.log(presentaCorso());
console.log(presentaCorso("BID", "Piazza dei Mestieri", ["KPI", "AZURE"]));


//REST PARAMETERS
//L'operatore ... chiamato operatore spread mi trasforma una serie di numeri in un array
/**
 * 
 * @param  {...Number} numeri 
 * @returns 
 */
function sommaNumeri(...numeri){
    let totale = 0;
    for( let n of numeri){
        totale += n;
    }

    return totale
}

console.log(sommaNumeri(9,5,12,1,45,4,0));
