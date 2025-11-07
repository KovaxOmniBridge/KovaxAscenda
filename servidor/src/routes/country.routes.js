/**
 * Rotas de Países
 */

const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Todas as rotas de países são protegidas
router.get('/', authenticateToken, countryController.listCountries);
router.get('/stats/count', authenticateToken, countryController.getCountriesCount);
router.get('/:id', authenticateToken, countryController.getCountry);
router.post('/', authenticateToken, countryController.createCountry);
router.put('/:id', authenticateToken, countryController.updateCountry);
router.delete('/:id', authenticateToken, countryController.deleteCountry);

module.exports = router;
