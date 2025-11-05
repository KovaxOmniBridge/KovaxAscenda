/**
 * Controller de Chapters
 * Gerencia chapters e seus membros
 */

const db = require('../config/database');

// Listar chapters por empresa
const listChaptersByCompany = (req, res) => {
    const { companyId } = req.params;
    
    db.all(`
        SELECT c.*, u.name as lead_name,
               (SELECT COUNT(*) FROM chapter_members WHERE chapter_id = c.id) as member_count
        FROM chapters c
        LEFT JOIN users u ON c.lead_user_id = u.id
        WHERE c.company_id = ?
        ORDER BY c.name
    `, [companyId], (err, chapters) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar chapters' });
        res.json(chapters);
    });
};

// Criar chapter
const createChapter = (req, res) => {
    const { company_id, name, description, specialty, lead_user_id } = req.body;
    
    db.run(`
        INSERT INTO chapters (company_id, name, description, specialty, lead_user_id)
        VALUES (?, ?, ?, ?, ?)
    `, [company_id, name, description, specialty, lead_user_id], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao criar chapter' });
        res.status(201).json({ message: 'Chapter criado com sucesso', id: this.lastID });
    });
};

// Atualizar chapter
const updateChapter = (req, res) => {
    const { id } = req.params;
    const { name, description, specialty, lead_user_id } = req.body;
    
    db.run(`
        UPDATE chapters
        SET name = ?, description = ?, specialty = ?, lead_user_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [name, description, specialty, lead_user_id, id], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar chapter' });
        res.json({ message: 'Chapter atualizado com sucesso' });
    });
};

// Deletar chapter
const deleteChapter = (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM chapters WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar chapter' });
        res.json({ message: 'Chapter deletado com sucesso' });
    });
};

// Listar membros do chapter
const listChapterMembers = (req, res) => {
    const { id } = req.params;
    
    db.all(`
        SELECT cm.*, u.name, u.email, u.department, u.nivel
        FROM chapter_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.chapter_id = ?
        ORDER BY cm.role, u.name
    `, [id], (err, members) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar membros' });
        res.json(members);
    });
};

// Adicionar membro ao chapter
const addChapterMember = (req, res) => {
    const { id } = req.params;
    const { user_id, role } = req.body;
    
    db.run(`
        INSERT INTO chapter_members (chapter_id, user_id, role)
        VALUES (?, ?, ?)
    `, [id, user_id, role || 'member'], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao adicionar membro' });
        res.status(201).json({ message: 'Membro adicionado com sucesso' });
    });
};

// Atualizar membro do chapter
const updateChapterMember = (req, res) => {
    const { memberId } = req.params;
    const { role } = req.body;
    
    db.run(`UPDATE chapter_members SET role = ? WHERE id = ?`, [role, memberId], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar membro' });
        res.json({ message: 'Membro atualizado com sucesso' });
    });
};

// Remover membro do chapter
const removeChapterMember = (req, res) => {
    const { memberId } = req.params;
    
    db.run('DELETE FROM chapter_members WHERE id = ?', [memberId], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao remover membro' });
        res.json({ message: 'Membro removido com sucesso' });
    });
};

module.exports = {
    listChaptersByCompany,
    createChapter,
    updateChapter,
    deleteChapter,
    listChapterMembers,
    addChapterMember,
    updateChapterMember,
    removeChapterMember
};
