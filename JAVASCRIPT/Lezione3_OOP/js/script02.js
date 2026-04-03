//Definizione attraverso la FUNZIONE COSTRUTTORE
function Studente(nome, cognome, corso, email){
    //Proprietà
    this.nome = nome;
    this.cognome = cognome;
    this.corso = corso;
    this.email = email;

    //Metodi
    this.presentati = function(){
        return `Ciao, mi chiamo ${this.nome} ${this.cognome} e sono iscritto al corso di ${this.corso}`;
    }
}

//con la parola chiave new invoco il costruttore dell'oggetto studente
let stud1 = new Studente("Anna", "Verdi", "WSA", "anna.verdi@mail.com");

let aula = [
    new Studente("Marco", "Rossi", "WSA", "m.rossi@mail.com"),
    new Studente("Luisa", "Verdi", "BID", "l.verdi@mail.com"),
    new Studente("Laura", "Gialli", "BAD", "l.gialli@mail.com"),
]

aula.forEach(stud => {
    console.log(stud.presentati()); 
});


//Definisco un oggetto con la classe
//Le classi sono state introdotte a partire da ECMAScript2015
//La classe definisce il tipo di dato (complesso) dell'istanza della classe stessa (oggetto)
class Docente{
    //metodo costruttore, gli passo dei parametri che valorizzeranno le properties
    constructor(nome, cognome, email, corsoAssegnato){
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.corsoAssegnato = corsoAssegnato;
    }

    insegna(){
        let info = `Docente: ${this.nome} ${this.cognome}`;

        if(this.corsoAssegnato != undefined && this.corsoAssegnato != ""){
            info += `\nCorso Assegnato ${this.corsoAssegnato}`;
        }else{
            info += "\nNessun corso assegnato";
        }

        return info;
    }
}

let doc1 = new Docente("Maria", "Bruni", "m.bruni@docmail.com", "WSA");
let doc2 = new Docente("Paolo", "Chiari", "p.chiari@docmail.com", "BID");
let doc3 = new Docente("Marco", "Marchi", "m.marchi@docmail.com");

console.log(doc1.insegna());
console.log(doc2.insegna());
console.log(doc3.insegna());
