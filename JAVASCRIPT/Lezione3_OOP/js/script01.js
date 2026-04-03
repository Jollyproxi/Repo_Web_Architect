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

//Esempio automobile

let auto = {
    marca: "Fiat",
    modello: "500 Abarth",
    colore: "Rosso",
    cilindrata: 1200,
    marce: 6,
    velocita: 0,
    num_giri: 0,
    acceso: false,

    //modo abbreviato di dichiarare un metodo
    presentaAuto(){
        return `L'auto che hai selezionato è una ${this.marca} ${this.modello}. Colore ${this.colore}. Cilindrata ${this.cilindrata}`;
    },

    //Attraverso i metodi posso modificare delle propr
    modificaGiri(num_giri){
        this.num_giri = num_giri; 
        return `Giri motore: ${this.num_giri}`;
    },

    calcolaVel(){
        if(this.num_giri != 0 && this.acceso){
            this.velocita = this.num_giri * this.marce;
            return `La tua velecità attuale è ${this.velocita}`;
        }else{
            return "La tua auto non è accesa e i giri sono a 0";
        }
    },

    accendi_spegni(){
        this.acceso = !this.acceso;
        if(this.acceso){
            return true
        }else{
            return false
        }
    }
}


// auto.accendi_spegni();
console.log( auto.modificaGiri(2000) );
console.log(auto.calcolaVel());


//Esempio for-in tipico per gli oggetti
//Si riesce a scorrere un oggetto con un ciclo for pur non essendo della famiglia degli enumerabili (cioè che hanno un indice)


//Att: la chiave è una string.
for(const key in studente){
    if(typeof studente[key] != "function"){
        console.log(key + ": " + studente[key]);
    }
}


//Oltre alla notazione studente.nome io posso risalire attraverso quest'altra notazione studente['nome']