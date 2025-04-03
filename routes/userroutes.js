const express = require('express');
const router = express.Router();
const { registerUser } = require('../controller/usercontroller');

// Register route
router.post('/register', registerUser);

// You can add login controller too if needed:
const { loginUser } = require('../controller/usercontroller');
router.post('/login', loginUser);
const ADMIN = require('../config/admin');

module.exports = router;
