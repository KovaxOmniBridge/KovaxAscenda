/**
 * Controller de Autenticação
 * Gerencia login, registro e perfil de usuários
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Login de usuário
 * POST /api/auth/login
 */
const login = (req, res) => {
    const { companyId, accessKey, password } = req.body;

    if (!companyId || !accessKey || !password) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Buscar usuário com dados da empresa
    db.get(`
        SELECT u.*, c.name as company_name, c.website
        FROM users u
        JOIN companies c ON u.company_id = c.id
        WHERE u.company_id = ? AND u.access_key = ?
    `, [companyId, accessKey], (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao processar login' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Chave de acesso ou senha incorretos' });
        }

        // Verificar senha com bcrypt
        const isValidPassword = bcrypt.compareSync(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Chave de acesso ou senha incorretos' });
        }

        // Gerar token JWT (válido por 24h)
        const token = jwt.sign(
            {
                userId: user.id,
                companyId: user.company_id,
                accessKey: user.access_key,
                role: user.role,
                nivel: user.nivel || 1
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar token e dados do usuário (sem a senha)
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                nivel: user.nivel || 1,
                isPrimary: user.is_primary === 1,
                department: user.department,
                company: {
                    id: user.company_id,
                    name: user.company_name,
                    website: user.website
                }
            }
        });
    });
};

/**
 * Obter perfil do usuário autenticado
 * GET /api/auth/profile
 */
const getProfile = (req, res) => {
    db.get(`
        SELECT u.id, u.name, u.email, u.phone, u.department, u.role, u.nivel, u.is_primary, 
               c.id as company_id, c.name as company_name, c.website
        FROM users u
        JOIN companies c ON u.company_id = c.id
        WHERE u.id = ?
    `, [req.user.userId], (err, user) => {
        if (err) {
            console.error('Erro ao buscar perfil:', err);
            return res.status(500).json({ error: 'Erro ao buscar perfil' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            department: user.department,
            role: user.role,
            nivel: user.nivel || 1,
            isPrimary: user.is_primary === 1,
            company: {
                id: user.company_id,
                name: user.company_name,
                website: user.website
            }
        });
    });
};

module.exports = {
    login,
    getProfile
};
