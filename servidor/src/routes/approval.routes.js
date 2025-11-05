/**
 * Rotas de Aprovações Presidenciais
 * Endpoints protegidos por autenticação JWT
 */

const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approval.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// ==================== ROTAS PROTEGIDAS ====================

// Listar aprovações de uma empresa
router.get('/company/:companyId', authenticateToken, approvalController.listApprovals);

// Estatísticas de aprovações
router.get('/stats/company/:companyId', authenticateToken, approvalController.getApprovalStats);

// Detalhes de uma aprovação
router.get('/:id', authenticateToken, approvalController.getApproval);

// Criar nova aprovação
router.post('/', authenticateToken, approvalController.createApproval);

// Aprovar
router.patch('/:id/approve', authenticateToken, approvalController.approveApproval);

// Rejeitar
router.patch('/:id/reject', authenticateToken, approvalController.rejectApproval);

// Deletar (apenas pendentes)
router.delete('/:id', authenticateToken, approvalController.deleteApproval);

module.exports = router;
