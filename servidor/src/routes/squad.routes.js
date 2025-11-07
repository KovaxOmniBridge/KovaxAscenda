/**
 * Rotas de Squads
 */

const express = require('express');
const router = express.Router();
const squadController = require('../controllers/squad.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Todas as rotas de squads são protegidas
router.get('/', authenticateToken, squadController.listAllSquads);
router.get('/company/:companyId', authenticateToken, squadController.listSquadsByCompany);
router.post('/', authenticateToken, squadController.createSquad);
router.put('/:id', authenticateToken, squadController.updateSquad);
router.delete('/:id', authenticateToken, squadController.deleteSquad);

// Membros
router.get('/:id/members', authenticateToken, squadController.listSquadMembers);
router.post('/:id/members', authenticateToken, squadController.addSquadMember);
router.put('/:id/members/:memberId', authenticateToken, squadController.updateSquadMember);
router.delete('/:id/members/:memberId', authenticateToken, squadController.removeSquadMember);

// Metas
router.get('/:id/goals', authenticateToken, squadController.listSquadGoals);

module.exports = router;
