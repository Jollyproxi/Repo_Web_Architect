

//Obj notazione letterale
let persona = {
    nome: "Anna",
    cognome: "Rossi",
    eta: 25,
    presenza: true,
    corsi: [
        {titolo: "WSA", docenti: ["Paolo Verdi", "Maria Gialli"]},
        {titolo: "BID", docenti: ["Laura Gialli", "Marco Bianchi"]}
    ],
    zaino: {
        astuccio: ["Penna", "Matita", "Calcolatrice"],
        lunchBox: {
            scomparto1: "Pasta al sugo",
            scomparto2: "Insalata"
        }
    },

    presentaPersona(){
        return `Ciao, mi chiamo ${this.nome} ${this.cognome}`;
    },

    iscriviAlcorso(nome){
        return `Ciao ${this.nome}, ti stai iscrivendo al corso ${nome}`
    }
}

//Accedo alle prop o metodi dell'oggetto

console.log(persona.nome); //Anna
console.log(persona.cognome); //Rossi

//Sovraascrivo una prop
persona.eta = 35;
console.log(persona.eta);

//Richiamo dei metodi
persona.presentaPersona();

//Accedo al contenuto dello scomparto2
console.log(persona.zaino.lunchBox.scomparto2);

//Leggo il nome dei docenti del corso BID
console.log(persona.corsi[1].docenti);
console.log(persona.zaino.astuccio[0]);


persona.corsi[1].docenti.forEach(doc =>{console.log(doc);})
console.log(persona);

//NOTAZIONE JSON
let personaJSON = JSON.stringify(persona);
console.log(personaJSON);

let personaOBJ = JSON.parse(personaJSON);
console.log(personaOBJ);

console.log(personaOBJ.corsi[0].titolo);

class PersonaApp{
    constructor(nome, cognome, corso){
        this.nome = nome;
        this.cognome = cognome;
        this.corso = corso;
    }

    presentaPersona(){
        return `Ciao, mi chiamo ${this.nome} e sono iscritta al corso ${this.corso}`;
    }

}

let nuovaPersonaApp = new PersonaApp(
    personaOBJ.nome,
    personaOBJ.cognome,
    personaOBJ.corsi[0].titolo
);

console.log(nuovaPersonaApp.presentaPersona());
