/**
 * Middleware de Proteção para Área de Desenvolvedor
 * Garante que apenas desenvolvedores autenticados possam acessar rotas /dev
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica se o token JWT é de um desenvolvedor
 * Diferente do auth.middleware.js (que valida tokens de usuários normais)
 */
const devAuth = (req, res, next) => {
    try {
        // Obter token do header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Acesso negado',
                message: 'Token de autenticação não fornecido'
            });
        }
        
        const token = authHeader.replace('Bearer ', '');
        
        // Verificar e decodificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ascenda_flex_secret_key_2024');
        
        // VERIFICAÇÃO CRÍTICA: Token deve ser de desenvolvedor
        if (!decoded.isDeveloper || !decoded.devId) {
            console.error('🚫 BLOQUEADO: Tentativa de acesso à área dev com token de usuário normal');
            console.error('Token tipo:', decoded.userId ? 'USUÁRIO NORMAL' : 'INVÁLIDO');
            
            return res.status(403).json({ 
                error: 'Acesso negado',
                message: 'Esta área é restrita apenas para desenvolvedores. Usuários normais não podem acessar.',
                type: 'DEV_ACCESS_DENIED'
            });
        }
        
        // VERIFICAÇÃO ADICIONAL: Não pode ter userId (marca de usuário normal)
        if (decoded.userId || decoded.companyId) {
            console.error('🚫 BLOQUEADO: Token de usuário normal detectado na área dev');
            
            return res.status(403).json({ 
                error: 'Acesso negado',
                message: 'Token de usuário normal não é válido para área de desenvolvimento',
                type: 'WRONG_TOKEN_TYPE'
            });
        }
        
        // Token válido de desenvolvedor
        req.dev = {
            id: decoded.devId,
            email: decoded.email,
            role: decoded.role,
            isDeveloper: true
        };
        
        console.log('✅ Dev Auth: Desenvolvedor autenticado:', req.dev.email);
        
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expirado',
                message: 'Sua sessão expirou. Faça login novamente.'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Token inválido',
                message: 'Token de autenticação inválido'
            });
        }
        
        console.error('❌ Erro no middleware devAuth:', error);
        return res.status(500).json({ 
            error: 'Erro de autenticação',
            message: 'Erro ao validar credenciais'
        });
    }
};

/**
 * Middleware opcional que permite acesso público mas adiciona info do dev se autenticado
 */
const devAuthOptional = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            req.dev = null;
            return next();
        }
        
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ascenda_flex_secret_key_2024');
        
        if (decoded.isDeveloper && decoded.devId) {
            req.dev = {
                id: decoded.devId,
                email: decoded.email,
                role: decoded.role,
                isDeveloper: true
            };
        } else {
            req.dev = null;
        }
        
        next();
        
    } catch (error) {
        req.dev = null;
        next();
    }
};

module.exports = { devAuth, devAuthOptional };
