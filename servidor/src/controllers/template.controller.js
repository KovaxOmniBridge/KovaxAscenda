/**
 * Controller de Templates Organizacionais
 * Gerencia templates de estrutura hierárquica
 */

const db = require('../config/database');

// Obter template da empresa
const getTemplate = (req, res) => {
    const { companyId } = req.params;
    
    db.get(`
        SELECT id, template_type, active_levels, level_names, created_at, updated_at
        FROM organization_templates
        WHERE company_id = ?
    `, [companyId], (err, template) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar template' });
        
        if (!template) {
            // Template padrão Corporate
            return res.json({
                template_type: 'corporate',
                active_levels: '0,1,2,3,4,5,6,7',
                level_names: JSON.stringify({
                    "0": "Presidentes",
                    "1": "Administradores Gerais",
                    "2": "Diretores Executivos",
                    "3": "Gerentes",
                    "4": "Coordenadores",
                    "5": "Supervisores",
                    "6": "Especialistas",
                    "7": "Operacional"
                })
            });
        }
        
        template.level_names = JSON.parse(template.level_names);
        res.json(template);
    });
};

// Atualizar template
const updateTemplate = (req, res) => {
    const { companyId } = req.params;
    const { template_type, active_levels, level_names } = req.body;
    
    if (!template_type || !active_levels || !level_names) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    const levelNamesStr = typeof level_names === 'string' ? level_names : JSON.stringify(level_names);
    
    db.get('SELECT id FROM organization_templates WHERE company_id = ?', [companyId], (err, existing) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar template' });
        
        if (existing) {
            // Atualizar
            db.run(`
                UPDATE organization_templates
                SET template_type = ?, active_levels = ?, level_names = ?, updated_at = CURRENT_TIMESTAMP
                WHERE company_id = ?
            `, [template_type, active_levels, levelNamesStr, companyId], (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao atualizar template' });
                res.json({ message: 'Template atualizado com sucesso' });
            });
        } else {
            // Criar
            db.run(`
                INSERT INTO organization_templates (company_id, template_type, active_levels, level_names)
                VALUES (?, ?, ?, ?)
            `, [companyId, template_type, active_levels, levelNamesStr], (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao criar template' });
                res.json({ message: 'Template criado com sucesso' });
            });
        }
    });
};

module.exports = {
    getTemplate,
    updateTemplate
};
