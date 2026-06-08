// routes/index.js
// Aggrega tutti i router dell'applicazione in un unico punto.
// app.js monta questo router su /api/v1, quindi le URL finali sono:
//   /api/v1/users
//   /api/v1/products

const express = require('express');
const router = express.Router();

const usersRouter    = require('./users');
const productsRouter = require('./products');

router.use('/users',    usersRouter);
router.use('/products', productsRouter);

module.exports = router;
