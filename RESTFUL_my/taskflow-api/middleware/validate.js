// middleware/validate.js
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = (schema) => {
  const check = ajv.compile(schema);
  return (req, res, next) => {
    if (check(req.body)) return next();

    const campi = {};
    check.errors.forEach(err => {
      const campo = err.instancePath.replace('/', '') || err.params.missingProperty || 'body';
      campi[campo] = err.message;
    });
    res.status(400).json({ error: 'Validazione fallita', campi });
  };
};

module.exports = { validate };
