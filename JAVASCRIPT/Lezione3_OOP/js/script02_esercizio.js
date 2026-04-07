class Studente {

    //Le prop static appartengono alla classe, non all'istanza. E' una sorta di prop condivisa tra tutti gli oggetti
    static matricola = 0;
    //Questa è una prop private
    #codFisc;
    #nome;
    #cognome;

    constructor(nome, cognome, corso, email) {
        //Proprietà
        this.matricola = Studente.matricola++;
        this.#nome = nome;
        this.#cognome = cognome;
        this.corso = corso;
        this.email = email;
    }

    getNome(){
        return this.#nome;
    }

    getCognome(){
        return this.#cognome
    }

    getCodFisc(user, pass) {
        if (user == "Pippo" && pass == "abcd") {
            return this.#codFisc;
        } else {
            return null;
        }

    }

    setCodFisc(user, pass, codFisc) {
        if (user == "Pippo" && pass == "abcd") {
            this.#codFisc = codFisc;
        } else {
            return "Non hai accesso a questa modifica"
        }
    }

    //Metodi
    presentati() {
        return `Ciao, mi chiamo ${this.#nome} ${this.#cognome} e sono iscritto al corso di ${this.corso}`;
    };

    infoStudente() {
        return `Studente matricola ${this.matricola}\nNome: ${this.#nome} ${this.#cognome}\nCorso: ${this.corso}`;
    }

}

let stu = new Studente("A", "B", "corso", "a@mail.com");
let stu1 = new Studente("A", "B", "corso", "a@mail.com");
let stu2 = new Studente("A", "B", "corso", "a@mail.com");
let stu3 = new Studente("A", "B", "corso", "a@mail.com");
console.log(stu.infoStudente());
console.log(stu1.infoStudente());
console.log(stu2.infoStudente());
stu2.setCodFisc("SADFGHDJHT65436SS");
console.log(stu2.getCodFisc());
console.log(stu2.matricola);
console.log(stu2.getNome());








const btn = document.getElementById("btn");
const btnStampa = document.getElementById("btnStampa");
const demo = document.getElementById("demo");

let listaStudenti = []

function iscriviStudente() {
    // Recupera i singoli value dei campi input e costruisce l'oggetto. Insersci lo studente nell'array "listaStudenti"

}

function clearForm() {

}

btn.addEventListener("click", iscriviStudente)

/**
 * @param {Array[Studente]} listaStudenti 
 */
function stampaStudenti(listaStudenti) {

}

btnStampa.addEventListener("click", function () {

    //Stampo gli studenti
})