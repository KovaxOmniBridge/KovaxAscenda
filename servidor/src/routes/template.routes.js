/**
 * Rotas de Templates Organizacionais
 */

const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Rotas protegidas
router.get('/:companyId', authenticateToken, templateController.getTemplate);
router.put('/:companyId', authenticateToken, templateController.updateTemplate);

module.exports = router;
