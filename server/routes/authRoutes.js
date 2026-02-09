const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Route for registration: http://localhost:5000/api/auth/register
router.post('/register', register);
router.post('/login', login);
// Route for login (We will build the login logic next)
// router.post('/login', login);

module.exports = router;