/**
 * Middleware de Auditoria
 * Registra todas as ações dos desenvolvedores
 */

const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de log
const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'dev-audit.log');

// Criar diretório de logs se não existir
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Middleware que registra ações de desenvolvedores
 * Logs incluem: timestamp, devId, email, ação, dados
 */
function auditLog(req, res, next) {
    // Só auditar se for desenvolvedor
    if (!req.developer && !req.isDeveloper) {
        return next();
    }

    // Capturar dados da requisição
    const logEntry = {
        timestamp: new Date().toISOString(),
        developer: {
            id: req.developer?.devId || 'unknown',
            email: req.developer?.email || 'unknown',
            role: req.developer?.role || 'unknown'
        },
        request: {
            method: req.method,
            url: req.originalUrl || req.url,
            path: req.path,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        },
        body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
        params: req.params,
        query: req.query
    };

    // Interceptar resposta para logar resultado
    const originalSend = res.send;
    res.send = function(data) {
        logEntry.response = {
            statusCode: res.statusCode,
            timestamp: new Date().toISOString()
        };

        // Escrever log
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFile(LOG_FILE, logLine, (err) => {
            if (err) console.error('Erro ao escrever log de auditoria:', err);
        });

        // Continuar com resposta original
        originalSend.call(this, data);
    };

    next();
}

/**
 * Remove dados sensíveis do body antes de logar
 */
function sanitizeBody(body) {
    if (!body) return undefined;
    
    const sanitized = { ...body };
    
    // Remover senhas
    if (sanitized.password) sanitized.password = '***REDACTED***';
    if (sanitized.admins) {
        sanitized.admins = sanitized.admins.map(admin => ({
            ...admin,
            password: '***REDACTED***'
        }));
    }
    
    return sanitized;
}

/**
 * Obter logs de auditoria (último N registros)
 */
function getAuditLogs(limit = 100) {
    return new Promise((resolve, reject) => {
        fs.readFile(LOG_FILE, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return resolve([]);
                }
                return reject(err);
            }

            const lines = data.trim().split('\n');
            const logs = lines
                .slice(-limit)
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(log => log !== null);

            resolve(logs);
        });
    });
}

module.exports = {
    auditLog,
    getAuditLogs
};
