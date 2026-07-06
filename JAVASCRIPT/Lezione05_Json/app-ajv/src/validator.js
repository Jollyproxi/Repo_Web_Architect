import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';

const ajv = new Ajv({ allErrors: false });
addFormats(ajv);

export const schemaUtente = {
    type: 'object',
    properties: {
        nome: { type: 'string', minLength: 2, maxLength: 20 },
        email: { type: 'string', format: 'email' },
        eta: { type: 'integer', minimum: 18, maximum: 120 },
        ruolo: { type: 'string', enum: ['admin', 'base'] }
    },
    required: ['nome', 'email', 'eta', 'ruolo'],
    additionalProperties: false
}

const validate = ajv.compile(schemaUtente);

//In questo punto crea mappatura dei messaggi che produce ajv
const messaggi = {
    minLength: "nome troppo corto",
    maxLength: "nome troppo lungo",
    format: "formato email non valido",
    minimum: "valore troppo basso",
    maximum: "valore troppo alto",
    type: "tipo non valido",
    enum: "valore non ammesso",
    required: "campo obbligatorio"
}

//Sviluppo la funzione esportata che riceve i dati
export function validaUtente(dati) {
    const valido = validate(dati);
    if(valido) return {valido: true, errori: {} };
    
    const errori = {};
    validate.errors.forEach((err) => {
        const campo = err.instancePath.replace("/", "") || err.params.missingProperty;
        if(campo){
            errori[campo] = messaggi[err.keyword] || err.message;
        }
    });

    return {valido: false, errori};

}