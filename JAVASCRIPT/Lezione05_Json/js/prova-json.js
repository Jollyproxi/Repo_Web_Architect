const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const stampa = (titolo) => console.log(`Questo è un test con ajv : ${titolo}`);
stampa("PRIMA APP CON AJV");

const ok = (msg) => console.log(msg);
const ko = (msg) => console.log(msg);

const ajv = new Ajv({allErrors: true});
addFormats(ajv);

const schemaAutore = {
    type: 'object',
    properties: {
        nome: {type: 'string', minLength: 2, maxLength: 50},
        cognome: {type: 'string', minLength: 2, maxLength: 50},
        corsi: {type: 'array'},
        alunniIscritti: {type: 'integer', minimum: 0, maximum: 200},
        email: {type: 'string', format: 'email'}
    },
    required: ['nome', 'cognome', 'email'],
    additionalProperties: false //vengono rifiutati i campi non dichiarati sopra
}

const validaAutore = ajv.compile(schemaAutore);

let autore = {
    nome: "Dario",
    cognome: "Mennillo",
    corsi: ["JS", "Java", "React"],
    alunniIscritti: 50,
    email: "dario#mail.com"
}

if(!validaAutore(autore)){
    ko("Utente con dati non validi");
    validaAutore.errors.forEach(errore => {
        console.log(errore);
    });
}else{
    ok("Utente con dati validi")    
}
