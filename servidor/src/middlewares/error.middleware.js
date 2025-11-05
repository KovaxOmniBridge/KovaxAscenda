/**
 * Middleware para tratamento de erros global
 */

function errorHandler(err, req, res, next) {
    console.error('❌ Erro:', err);

    // Erro de validação
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Erro de validação',
            details: err.message
        });
    }

    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido'
        });
    }

    // Erro padrão
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor'
    });
}

module.exports = { errorHandler };
