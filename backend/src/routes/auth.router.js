// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registro de usuarios (solo uso interno)
router.post('/register', authController.register);

// Login: devuelve token JWT
router.post('/login', authController.login);

module.exports = router;