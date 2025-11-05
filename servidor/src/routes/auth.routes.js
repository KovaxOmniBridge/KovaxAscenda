/**
 * Rotas de Autenticação
 * POST /api/auth/login
 * GET /api/auth/profile
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Login de usuário (público)
router.post('/login', authController.login);

// Perfil do usuário autenticado (protegido)
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
