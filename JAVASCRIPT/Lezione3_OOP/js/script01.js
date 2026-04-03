//OOP Object Oriented Programming
//Javascript è un linguaggio prototype based

//Definire un oggetto con notazione letterale. Le {} identificano gli oggetti
// let docente = new Object();

let studente = {
    //elaboro le proprietà del mio oggetto. 
    nome: "Dario",
    cognome: "Mennillo",
    citta: "Torino",
    eta: 36,
    sede: "ITS",
    presenza: true,
    dataLezione: new Date(),

    //elaboro dei metodi
    superaEsame: function(){
        console.log("Ciao " + this.nome + " " + this.cognome + " hai superato l'esame");
    },

    presentati: function(nome){
        let presentazione  = `Ciao ${nome}, mi chiamo ${this.nome}`;
        return presentazione;
    }
};


//Accedo a prop o metodi
console.log("Ciao " + studente.nome);
studente.superaEsame();
console.log(studente.presentati("Pasquale"));


//Questo sotto non si fa così, è solo un oggetto letterale 
let docente = {
    nome: "",
    cognome: "",
    materia: "",

    costruisciDocente: function(nome, cognome, materia){
        this.nome = nome;
        this.cognome = cognome;
        this.materia = materia;
    },

    presentati: function(){
        return `Sono il docente ${this.nome} ${this.cognome} e insegno ${this.materia}`;
    }
}

docente.costruisciDocente("Pippo", "Rossi", "Python");
console.log(docente.presentati());

///Altro Esempio. Array di oggetti
let aula = [
    {nome: "Luca", cognome: "Gialli", corso: "WSA"},
    {nome: "Laura", cognome: "Verdi", corso: "WSA"},
    {nome: "Anna", cognome: "Bianchi", corso: "WSA"}
]

//Stampo i nomi degli studenti
aula.forEach(s => {
    console.log(s.nome + " " + s.cognome);
})