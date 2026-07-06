//Serializzare un OGGETTO con Stringify

//userDemo è un oggetto letterale
let userDemo = {
    nome: "Paolo Rossi",
    email: "paolo@mail.com",
    eta: 30,
    presenza: false,
    materiaPreferita: "Matematica",
    studia(){
        //ATT: i metodi degli oggetti non vengono serializzati
        console.log(`Sto studiando ${this.materiaPreferita}`);
    }
}

//Trasformo userDemo in un JSON per poterlo inviare ad una API
let userDemoJSON = JSON.stringify(userDemo);
 
console.log(userDemoJSON);
console.log(typeof userDemoJSON);


//Adesso serializzo un oggetto derivante da una classe
class Admin{
    constructor(nome, cognome, password, dataIscr, ruolo){
        this.nome = nome;
        this.cognome = cognome;
        this.password = password;
        this.dataIscr = dataIscr;
        this.ruolo = ruolo;
    }

    ammettiUser(nuovoUser, nuovoNome){
        if(nuovoUser.nome == nuovoNome){
            console.log("Utente approvato");
        }
    }
}

let adminBase = new Admin("Anna", "Verdi", "qwerty123", "26/06/26", "Base");
console.log(adminBase);

let adminBaseJSON = JSON.stringify(adminBase);
console.log(adminBaseJSON);
console.log(typeof adminBaseJSON);

//Una volta trasformato l'oggetto in JSON questo può essere inviato presso una API


//SERIALIZZARE filtrando l'oggetto --- REPLACER
//In questo modo il mio oggetto viene serializzato parzialmente andando ad includere un array di chiavi da serializzare
let adminBaseJSON_replacer = JSON.stringify(adminBase, ['nome', 'cognome', 'ruolo']);
console.log(adminBaseJSON_replacer);

//Il replacer può anche essere usato come funzione
let adminBaseJSON_replacer2 = JSON.stringify(adminBase, (chiave, valore) => {
    if (chiave == "password"){
        return undefined;
    }
    return valore;
});

console.log(adminBaseJSON_replacer2);

