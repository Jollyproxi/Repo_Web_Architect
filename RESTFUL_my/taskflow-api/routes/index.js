// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/tasks', require('./tasks'));
router.use('/auth',  require('./auth'));

module.exports = router;
