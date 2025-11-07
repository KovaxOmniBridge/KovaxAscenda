/**
 * Rotas de Usuários
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Todas as rotas de usuários são protegidas
router.get('/', authenticateToken, userController.listAllUsers);
router.get('/stats/by-level', authenticateToken, userController.getUserStatsByLevel);
router.get('/company/:companyId', authenticateToken, userController.listUsersByCompany);
router.get('/:id', authenticateToken, userController.getUser);
router.post('/', authenticateToken, userController.createUser);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
