/**
 * Controller de Aprovações Presidenciais
 * Gerencia aprovações de investimentos, contratações, projetos, etc.
 */

const db = require('../config/database');

/**
 * GET /api/approvals/company/:companyId
 * Lista aprovações de uma empresa (com filtro opcional por status)
 */
exports.listApprovals = (req, res) => {
    const { companyId } = req.params;
    const { status } = req.query;
    
    let query = `
        SELECT 
            a.*,
            u.name as requester_name,
            u.email as requester_email,
            d.name as decider_name
        FROM approvals a
        LEFT JOIN users u ON a.requester_id = u.id
        LEFT JOIN users d ON a.decided_by = d.id
        WHERE a.company_id = ?
    `;
    
    const params = [companyId];
    
    if (status) {
        query += ' AND a.status = ?';
        params.push(status);
    }
    
    query += ' ORDER BY a.created_at DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('❌ Erro ao listar aprovações:', err);
            return res.status(500).json({ error: 'Erro ao listar aprovações' });
        }
        
        console.log(`✅ ${rows.length} aprovações encontradas (company: ${companyId})`);
        res.json(rows);
    });
};

/**
 * GET /api/approvals/:id
 * Detalhes de uma aprovação
 */
exports.getApproval = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT 
            a.*,
            u.name as requester_name,
            u.email as requester_email,
            u.department as requester_department,
            d.name as decider_name
        FROM approvals a
        LEFT JOIN users u ON a.requester_id = u.id
        LEFT JOIN users d ON a.decided_by = d.id
        WHERE a.id = ?
    `;
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('❌ Erro ao buscar aprovação:', err);
            return res.status(500).json({ error: 'Erro ao buscar aprovação' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Aprovação não encontrada' });
        }
        
        console.log(`✅ Aprovação ${id} encontrada`);
        res.json(row);
    });
};

/**
 * POST /api/approvals
 * Criar nova aprovação
 */
exports.createApproval = (req, res) => {
    const {
        company_id,
        type,
        title,
        description,
        requester_id,
        department,
        priority = 'normal',
        amount,
        justification,
        impact
    } = req.body;
    
    // Validações
    if (!company_id || !type || !title || !description || !requester_id || !department) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios: company_id, type, title, description, requester_id, department' 
        });
    }
    
    // Tipos válidos
    const validTypes = ['hiring', 'investment', 'project', 'structure', 'budget', 'partnership', 'other'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ 
            error: `Tipo inválido. Use: ${validTypes.join(', ')}` 
        });
    }
    
    // Prioridades válidas
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
        return res.status(400).json({ 
            error: `Prioridade inválida. Use: ${validPriorities.join(', ')}` 
        });
    }
    
    const query = `
        INSERT INTO approvals (
            company_id, type, title, description, requester_id,
            department, priority, amount, justification, impact
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        company_id, type, title, description, requester_id,
        department, priority, amount || null, justification || null, impact || null
    ];
    
    db.run(query, params, function(err) {
        if (err) {
            console.error('❌ Erro ao criar aprovação:', err);
            return res.status(500).json({ error: 'Erro ao criar aprovação' });
        }
        
        const approvalId = this.lastID;
        console.log(`✅ Aprovação ${approvalId} criada (${type}: ${title})`);
        
        res.status(201).json({
            message: 'Aprovação criada com sucesso',
            approvalId,
            status: 'pending'
        });
    });
};

/**
 * PATCH /api/approvals/:id/approve
 * Aprovar uma solicitação
 */
exports.approveApproval = (req, res) => {
    const { id } = req.params;
    const { decision_notes, decided_by } = req.body;
    
    if (!decided_by) {
        return res.status(400).json({ error: 'decided_by é obrigatório' });
    }
    
    const query = `
        UPDATE approvals
        SET status = 'approved',
            decision_notes = ?,
            decided_by = ?,
            decided_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'pending'
    `;
    
    db.run(query, [decision_notes || null, decided_by, id], function(err) {
        if (err) {
            console.error('❌ Erro ao aprovar:', err);
            return res.status(500).json({ error: 'Erro ao aprovar aprovação' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                error: 'Aprovação não encontrada ou já foi processada' 
            });
        }
        
        console.log(`✅ Aprovação ${id} aprovada`);
        res.json({
            message: 'Aprovação aprovada com sucesso',
            approvalId: id,
            status: 'approved'
        });
    });
};

/**
 * PATCH /api/approvals/:id/reject
 * Rejeitar uma solicitação
 */
exports.rejectApproval = (req, res) => {
    const { id } = req.params;
    const { decision_notes, decided_by } = req.body;
    
    if (!decided_by) {
        return res.status(400).json({ error: 'decided_by é obrigatório' });
    }
    
    if (!decision_notes) {
        return res.status(400).json({ 
            error: 'decision_notes é obrigatório ao rejeitar' 
        });
    }
    
    const query = `
        UPDATE approvals
        SET status = 'rejected',
            decision_notes = ?,
            decided_by = ?,
            decided_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'pending'
    `;
    
    db.run(query, [decision_notes, decided_by, id], function(err) {
        if (err) {
            console.error('❌ Erro ao rejeitar:', err);
            return res.status(500).json({ error: 'Erro ao rejeitar aprovação' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                error: 'Aprovação não encontrada ou já foi processada' 
            });
        }
        
        console.log(`✅ Aprovação ${id} rejeitada`);
        res.json({
            message: 'Aprovação rejeitada',
            approvalId: id,
            status: 'rejected'
        });
    });
};

/**
 * DELETE /api/approvals/:id
 * Deletar uma aprovação (apenas pendentes)
 */
exports.deleteApproval = (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM approvals WHERE id = ? AND status = \'pending\'';
    
    db.run(query, [id], function(err) {
        if (err) {
            console.error('❌ Erro ao deletar aprovação:', err);
            return res.status(500).json({ error: 'Erro ao deletar aprovação' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                error: 'Aprovação não encontrada ou já foi processada' 
            });
        }
        
        console.log(`✅ Aprovação ${id} deletada`);
        res.json({ message: 'Aprovação deletada com sucesso' });
    });
};

/**
 * GET /api/approvals/stats/company/:companyId
 * Estatísticas de aprovações de uma empresa
 */
exports.getApprovalStats = (req, res) => {
    const { companyId } = req.params;
    
    const query = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN priority = 'urgent' AND status = 'pending' THEN 1 ELSE 0 END) as urgent_pending,
            SUM(amount) as total_amount,
            SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as approved_amount
        FROM approvals
        WHERE company_id = ?
    `;
    
    db.get(query, [companyId], (err, row) => {
        if (err) {
            console.error('❌ Erro ao buscar estatísticas:', err);
            return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        }
        
        console.log(`✅ Estatísticas de aprovações (company: ${companyId})`);
        res.json(row);
    });
};
