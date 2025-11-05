/**
 * Rotas de Chapters
 */

const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapter.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Todas as rotas de chapters são protegidas
router.get('/company/:companyId', authenticateToken, chapterController.listChaptersByCompany);
router.post('/', authenticateToken, chapterController.createChapter);
router.put('/:id', authenticateToken, chapterController.updateChapter);
router.delete('/:id', authenticateToken, chapterController.deleteChapter);

// Membros
router.get('/:id/members', authenticateToken, chapterController.listChapterMembers);
router.post('/:id/members', authenticateToken, chapterController.addChapterMember);
router.put('/:id/members/:memberId', authenticateToken, chapterController.updateChapterMember);
router.delete('/:id/members/:memberId', authenticateToken, chapterController.removeChapterMember);

module.exports = router;
