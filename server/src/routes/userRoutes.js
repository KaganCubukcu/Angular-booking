const express = require('express');
const { signUp, login, getCurrentUser } = require('../controllers/UserController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.get('/me', auth, getCurrentUser);

module.exports = router;
