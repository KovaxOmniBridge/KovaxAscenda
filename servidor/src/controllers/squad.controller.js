/**
 * Controller de Squads
 * Gerencia squads, membros e metas
 */

const db = require('../config/database');

// Listar squads por empresa
const listSquadsByCompany = (req, res) => {
    const { companyId } = req.params;
    
    db.all(`
        SELECT s.*, 
            (SELECT COUNT(*) FROM squad_members WHERE squad_id = s.id AND left_at IS NULL) as member_count,
            u.name as created_by_name
        FROM squads s
        LEFT JOIN users u ON s.created_by = u.id
        WHERE s.company_id = ?
        ORDER BY s.status, s.name
    `, [companyId], (err, squads) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar squads' });
        res.json(squads);
    });
};

// Criar squad
const createSquad = (req, res) => {
    const { company_id, name, description, squad_type, start_date, end_date } = req.body;
    
    if (!name || !squad_type || !start_date) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    db.run(`
        INSERT INTO squads (company_id, name, description, squad_type, status, start_date, end_date, created_by)
        VALUES (?, ?, ?, ?, 'active', ?, ?, ?)
    `, [company_id, name, description, squad_type, start_date, end_date, req.user.userId], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao criar squad' });
        res.status(201).json({ message: 'Squad criado com sucesso', id: this.lastID });
    });
};

// Atualizar squad
const updateSquad = (req, res) => {
    const { id } = req.params;
    const { name, description, squad_type, status, end_date } = req.body;
    
    db.run(`
        UPDATE squads
        SET name = ?, description = ?, squad_type = ?, status = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [name, description, squad_type, status, end_date, id], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar squad' });
        res.json({ message: 'Squad atualizado com sucesso' });
    });
};

// Deletar squad
const deleteSquad = (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM squads WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar squad' });
        res.json({ message: 'Squad deletado com sucesso' });
    });
};

// Listar membros do squad
const listSquadMembers = (req, res) => {
    const { id } = req.params;
    
    db.all(`
        SELECT sm.*, u.name, u.email, u.department, u.nivel
        FROM squad_members sm
        JOIN users u ON sm.user_id = u.id
        WHERE sm.squad_id = ? AND sm.left_at IS NULL
        ORDER BY sm.role, u.name
    `, [id], (err, members) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar membros' });
        res.json(members);
    });
};

// Adicionar membro ao squad
const addSquadMember = (req, res) => {
    const { id } = req.params;
    const { user_id, role, allocation_percent } = req.body;
    
    db.run(`
        INSERT INTO squad_members (squad_id, user_id, role, allocation_percent)
        VALUES (?, ?, ?, ?)
    `, [id, user_id, role || 'member', allocation_percent || 100], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao adicionar membro' });
        res.status(201).json({ message: 'Membro adicionado com sucesso' });
    });
};

// Atualizar membro do squad
const updateSquadMember = (req, res) => {
    const { memberId } = req.params;
    const { role, allocation_percent } = req.body;
    
    db.run(`
        UPDATE squad_members SET role = ?, allocation_percent = ? WHERE id = ?
    `, [role, allocation_percent, memberId], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar membro' });
        res.json({ message: 'Membro atualizado com sucesso' });
    });
};

// Remover membro do squad
const removeSquadMember = (req, res) => {
    const { memberId } = req.params;
    
    db.run(`UPDATE squad_members SET left_at = CURRENT_TIMESTAMP WHERE id = ?`, [memberId], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao remover membro' });
        res.json({ message: 'Membro removido com sucesso' });
    });
};

// Listar metas do squad
const listSquadGoals = (req, res) => {
    const { id } = req.params;
    
    db.all(`SELECT * FROM squad_goals WHERE squad_id = ? ORDER BY status, due_date`, [id], (err, goals) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar metas' });
        res.json(goals);
    });
};

module.exports = {
    listSquadsByCompany,
    createSquad,
    updateSquad,
    deleteSquad,
    listSquadMembers,
    addSquadMember,
    updateSquadMember,
    removeSquadMember,
    listSquadGoals
};
