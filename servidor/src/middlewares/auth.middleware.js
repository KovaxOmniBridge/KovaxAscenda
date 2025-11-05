/**
 * Middleware de Autenticação JWT
 * Valida tokens JWT e protege rotas
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rotas que requerem autenticação
 * Valida o token JWT enviado no header Authorization
 * Adiciona req.user com os dados do usuário decodificado
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }
        req.user = user; // Disponibiliza dados do usuário nas rotas protegidas
        next();
    });
}

module.exports = { authenticateToken };
