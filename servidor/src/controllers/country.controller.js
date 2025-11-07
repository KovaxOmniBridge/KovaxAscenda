/**
 * Controller de Países
 * Gerencia países/operações das empresas
 */

const db = require('../config/database');

/**
 * Listar todos os países da empresa do usuário
 * GET /api/countries
 */
const listCountries = (req, res) => {
    const companyId = req.user.companyId;
    
    db.all(`
        SELECT 
            id,
            country,
            tax_id,
            city,
            address,
            phone,
            is_headquarters,
            created_at
        FROM countries
        WHERE company_id = ?
        ORDER BY is_headquarters DESC, country ASC
    `, [companyId], (err, countries) => {
        if (err) {
            console.error('Erro ao buscar países:', err);
            return res.status(500).json({ error: 'Erro ao buscar países' });
        }
        res.json(countries);
    });
};

/**
 * Obter detalhes de um país
 * GET /api/countries/:id
 */
const getCountry = (req, res) => {
    const { id } = req.params;
    const companyId = req.user.companyId;
    
    db.get(`
        SELECT * FROM countries
        WHERE id = ? AND company_id = ?
    `, [id, companyId], (err, country) => {
        if (err) {
            console.error('Erro ao buscar país:', err);
            return res.status(500).json({ error: 'Erro ao buscar país' });
        }
        if (!country) {
            return res.status(404).json({ error: 'País não encontrado' });
        }
        res.json(country);
    });
};

/**
 * Criar novo país
 * POST /api/countries
 */
const createCountry = (req, res) => {
    const { country, tax_id, city, address, phone, is_headquarters } = req.body;
    const companyId = req.user.companyId;
    
    if (!country || !tax_id || !city) {
        return res.status(400).json({ error: 'Dados incompletos (país, documento fiscal e cidade são obrigatórios)' });
    }
    
    db.run(`
        INSERT INTO countries (company_id, country, tax_id, city, address, phone, is_headquarters)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        companyId,
        country,
        tax_id,
        city,
        address || '',
        phone || '',
        is_headquarters ? 1 : 0
    ], function(err) {
        if (err) {
            console.error('Erro ao criar país:', err);
            return res.status(500).json({ error: 'Erro ao criar país' });
        }
        
        res.status(201).json({
            message: 'País adicionado com sucesso',
            id: this.lastID
        });
    });
};

/**
 * Atualizar país
 * PUT /api/countries/:id
 */
const updateCountry = (req, res) => {
    const { id } = req.params;
    const { country, tax_id, city, address, phone, is_headquarters } = req.body;
    const companyId = req.user.companyId;
    
    // Verificar se o país pertence à empresa
    db.get('SELECT company_id FROM countries WHERE id = ?', [id], (err, countryData) => {
        if (err) {
            console.error('Erro ao buscar país:', err);
            return res.status(500).json({ error: 'Erro ao buscar país' });
        }
        
        if (!countryData) {
            return res.status(404).json({ error: 'País não encontrado' });
        }
        
        if (countryData.company_id !== companyId) {
            return res.status(403).json({ error: 'Sem permissão para editar este país' });
        }
        
        db.run(`
            UPDATE countries
            SET country = ?, tax_id = ?, city = ?, address = ?, phone = ?, is_headquarters = ?
            WHERE id = ?
        `, [country, tax_id, city, address, phone, is_headquarters ? 1 : 0, id], function(err) {
            if (err) {
                console.error('Erro ao atualizar país:', err);
                return res.status(500).json({ error: 'Erro ao atualizar país' });
            }
            
            res.json({ message: 'País atualizado com sucesso' });
        });
    });
};

/**
 * Deletar país
 * DELETE /api/countries/:id
 */
const deleteCountry = (req, res) => {
    const { id } = req.params;
    const companyId = req.user.companyId;
    
    // Verificar se o país pertence à empresa
    db.get('SELECT company_id, is_headquarters FROM countries WHERE id = ?', [id], (err, countryData) => {
        if (err) {
            console.error('Erro ao buscar país:', err);
            return res.status(500).json({ error: 'Erro ao buscar país' });
        }
        
        if (!countryData) {
            return res.status(404).json({ error: 'País não encontrado' });
        }
        
        if (countryData.company_id !== companyId) {
            return res.status(403).json({ error: 'Sem permissão para excluir este país' });
        }
        
        if (countryData.is_headquarters === 1) {
            return res.status(400).json({ error: 'Não é possível excluir a sede principal' });
        }
        
        db.run('DELETE FROM countries WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Erro ao deletar país:', err);
                return res.status(500).json({ error: 'Erro ao deletar país' });
            }
            
            res.json({ message: 'País excluído com sucesso' });
        });
    });
};

/**
 * Obter contagem de países
 * GET /api/countries/stats/count
 */
const getCountriesCount = (req, res) => {
    const companyId = req.user.companyId;
    
    db.get(`
        SELECT COUNT(*) as count
        FROM countries
        WHERE company_id = ?
    `, [companyId], (err, result) => {
        if (err) {
            console.error('Erro ao contar países:', err);
            return res.status(500).json({ error: 'Erro ao contar países' });
        }
        res.json({ count: result.count });
    });
};

module.exports = {
    listCountries,
    getCountry,
    createCountry,
    updateCountry,
    deleteCountry,
    getCountriesCount
};
