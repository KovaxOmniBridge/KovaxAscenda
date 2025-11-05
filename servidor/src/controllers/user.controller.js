/**
 * Controller de Usuários
 * Gerencia CRUD de usuários
 */

const bcrypt = require('bcryptjs');
const db = require('../config/database');

/**
 * Listar usuários de uma empresa
 * GET /api/users/company/:companyId
 */
const listUsersByCompany = (req, res) => {
    const { companyId } = req.params;
    
    // Verificar permissão
    if (req.user.companyId != companyId) {
        return res.status(403).json({ error: 'Sem permissão para acessar usuários desta empresa' });
    }
    
    db.all(`
        SELECT id, name, email, phone, department, access_key, role, nivel, is_primary, created_at
        FROM users
        WHERE company_id = ?
        ORDER BY nivel ASC, is_primary DESC, name ASC
    `, [companyId], (err, users) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
        res.json(users);
    });
};

/**
 * Obter detalhes de um usuário
 * GET /api/users/:id
 */
const getUser = (req, res) => {
    const { id } = req.params;
    
    db.get(`
        SELECT id, name, email, phone, department, access_key, role, nivel, is_primary, superior_id, created_at
        FROM users
        WHERE id = ?
    `, [id], (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        // Verificar se pertence à mesma empresa
        db.get('SELECT company_id FROM users WHERE id = ?', [id], (err, userData) => {
            if (userData && userData.company_id != req.user.companyId) {
                return res.status(403).json({ error: 'Sem permissão' });
            }
            res.json(user);
        });
    });
};

/**
 * Criar novo usuário
 * POST /api/users
 */
const createUser = async (req, res) => {
    const { companyId, name, email, phone, department, accessKey, role, password, isPrimary, nivel } = req.body;
    
    // Verificar permissão
    if (req.user.companyId != companyId) {
        return res.status(403).json({ error: 'Sem permissão para criar usuários nesta empresa' });
    }
    
    // Validações
    if (!name || !email || !accessKey || !password || !role) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    // Verificar se access_key já existe
    db.get('SELECT id FROM users WHERE access_key = ?', [accessKey], async (err, existingUser) => {
        if (err) {
            console.error('Erro ao verificar access_key:', err);
            return res.status(500).json({ error: 'Erro ao verificar chave de acesso' });
        }
        
        if (existingUser) {
            return res.status(400).json({ error: 'Nome de usuário já está em uso' });
        }
        
        // Hash da senha
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        // Inserir usuário
        db.run(`
            INSERT INTO users (company_id, name, email, phone, department, access_key, password, role, is_primary, nivel)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            companyId,
            name,
            email,
            phone || '',
            department,
            accessKey,
            hashedPassword,
            role,
            isPrimary ? 1 : 0,
            nivel || 7 // Padrão: Nível 7 - Operacional
        ], function(err) {
            if (err) {
                console.error('Erro ao inserir usuário:', err);
                return res.status(500).json({ error: 'Erro ao criar usuário' });
            }
            
            res.status(201).json({
                message: 'Usuário criado com sucesso',
                userId: this.lastID
            });
        });
    });
};

/**
 * Atualizar usuário
 * PUT /api/users/:id
 */
const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, department, role, nivel } = req.body;
    
    // Verificar se o usuário pertence à mesma empresa
    db.get('SELECT company_id FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        if (user.company_id != req.user.companyId) {
            return res.status(403).json({ error: 'Sem permissão para editar este usuário' });
        }
        
        db.run(`
            UPDATE users 
            SET name = ?, email = ?, phone = ?, department = ?, role = ?, nivel = ?
            WHERE id = ?
        `, [name, email, phone, department, role, nivel || 7, id], function(err) {
            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar usuário' });
            }
            
            res.json({ message: 'Usuário atualizado com sucesso' });
        });
    });
};

/**
 * Deletar usuário
 * DELETE /api/users/:id
 */
const deleteUser = (req, res) => {
    const { id } = req.params;
    
    // Verificar se o usuário pertence à mesma empresa e não é primário
    db.get('SELECT company_id, is_primary FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        if (user.company_id != req.user.companyId) {
            return res.status(403).json({ error: 'Sem permissão para excluir este usuário' });
        }
        
        if (user.is_primary === 1) {
            return res.status(400).json({ error: 'Não é possível excluir um administrador principal' });
        }
        
        db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Erro ao deletar usuário:', err);
                return res.status(500).json({ error: 'Erro ao deletar usuário' });
            }
            
            res.json({ message: 'Usuário excluído com sucesso' });
        });
    });
};

module.exports = {
    listUsersByCompany,
    getUser,
    createUser,
    updateUser,
    deleteUser
};
