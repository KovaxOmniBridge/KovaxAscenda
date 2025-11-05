/**
 * Middleware de Autenticação JWT
 * Valida tokens JWT e protege rotas
 */

const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Middleware para proteger rotas que requerem autenticação de usuário
 * Valida o token JWT enviado no header Authorization
 * Adiciona req.user com os dados do usuário decodificado
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }
        
        // Verificar se é token de desenvolvedor com acesso universal
        if (decoded.devId && decoded.isDeveloper) {
            req.isDeveloper = true;
            req.developer = decoded;
            req.user = decoded; // Desenvolvedor tem acesso universal
            return next();
        }
        
        // Token de usuário normal
        req.user = decoded;
        next();
    });
}

/**
 * Middleware para proteger rotas do painel de desenvolvedor
 * Valida o token JWT de desenvolvedor
 * Adiciona req.developer com os dados do desenvolvedor decodificado
 */
function authenticateDevToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Token de desenvolvedor não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token de desenvolvedor inválido ou expirado' });
        }

        // Verificar se é realmente um token de desenvolvedor
        if (!decoded.devId || !decoded.isDeveloper) {
            return res.status(403).json({ error: 'Token inválido. Use credenciais de desenvolvedor.' });
        }

        req.developer = decoded;
        req.isDeveloper = true;
        next();
    });
}

/**
 * Middleware que permite desenvolvedor ou usuário normal
 * Usado em rotas que ambos podem acessar
 */
function authenticateAny(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }

        if (decoded.devId && decoded.isDeveloper) {
            req.isDeveloper = true;
            req.developer = decoded;
            req.user = decoded; // Dev tem acesso universal
        } else {
            req.user = decoded;
        }

        next();
    });
}

module.exports = { 
    authenticateToken,
    authenticateDevToken,
    authenticateAny
};
