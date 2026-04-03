class Studente {
    
    static matricola = 0;

    constructor(nome, cognome, corso, email) {
        //Proprietà
        this.matricola = Studente.matricola++;
        this.nome = nome;
        this.cognome = cognome;
        this.corso = corso;
        this.email = email;
    }
    
    //Metodi
    presentati() {
        return `Ciao, mi chiamo ${this.nome} ${this.cognome} e sono iscritto al corso di ${this.corso}`;
    };

    infoStudente() {
        return `Studente matricola ${this.matricola}\nNome: ${this.nome} ${this.cognome}\nCorso: ${this.corso}`;
    }

}

let stu = new Studente("A", "B", "corso", "a@mail.com");
let stu1 = new Studente("A", "B", "corso", "a@mail.com");
let stu2= new Studente("A", "B", "corso", "a@mail.com");
let stu3= new Studente("A", "B", "corso", "a@mail.com");
console.log(stu.infoStudente());
console.log(stu1.infoStudente());
console.log(stu2.infoStudente());


const btn = document.getElementById("btn");
const btnStampa = document.getElementById("btnStampa");
const demo = document.getElementById("demo");

let listaStudenti = []

function iscriviStudente(){
    // Recupera i singoli value dei campi input e costruisce l'oggetto. Insersci lo studente nell'array "listaStudenti"

}

function clearForm(){

}

btn.addEventListener("click", iscriviStudente)

/**
 * @param {Array[Studente]} listaStudenti 
 */
function stampaStudenti(listaStudenti){

}

btnStampa.addEventListener("click", function(){

    //Stampo gli studenti
})