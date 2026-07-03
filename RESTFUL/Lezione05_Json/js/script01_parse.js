//DESERIALIZZARE un JSON con il metodo PARSE
let studenteJSON = '{"id": 1, "nome":"Maria Gialli", "presenza":true, "eta":25}';

console.log(typeof studenteJSON);

let studenteOBJ = JSON.parse(studenteJSON);
console.log(studenteOBJ);
//non avendo una classe a disposizione devo programmare "al buio"
console.log(studenteOBJ.nome);
console.log(studenteOBJ.presenza);

/////////////////

let docenteJSON = '{"id": 1, "nome":"Maria Gialli", "presenza":true, "eta":25}';

class Docente{
    constructor(id, nome, presenza, eta){
        this.id = id;
        this.nome = nome;
        this.presenza = presenza;
        this.eta = eta
    }
}

let docenteOBJ = JSON.parse(docenteJSON);

//Questo sotto è abbastanza una cafonata, si risolverà con JSON schema
let docenteClasse = new Docente(docenteOBJ.id, docenteOBJ.nome, docenteOBJ.presenza, docenteOBJ.eta);

console.log("Il docente si chiama: " + docenteClasse.nome + " e ha " + docenteClasse.eta + " anni ");

