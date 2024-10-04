const express = require('express');
const { signUp, login } = require('../controllers/UserController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);

module.exports = router;
