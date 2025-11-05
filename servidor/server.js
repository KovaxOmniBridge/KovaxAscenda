/**
 * ============================================================================
 * ASCENDA FLEX - SERVIDOR API
 * ============================================================================
 * 
 * Servidor Express com SQLite para gerenciamento organizacional híbrido
 * Arquitetura: MVC Pattern
 * 
 * Stack: Node.js + Express 4.18.2 + SQLite3 5.1.6 + JWT + bcrypt
 * Porta: 3000 (padrão)
 * 
 * Última Refatoração: 05/11/2025
 * ============================================================================
 */

const app = require('./src/app');
const { initializeSchema } = require('./src/database/schema');

const PORT = process.env.PORT || 3000;

// Inicializar banco de dados e depois iniciar servidor
initializeSchema()
    .then(() => {
        console.log('✓ Banco de dados inicializado com sucesso\n');
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('='.repeat(60));
            console.log('🚀 SERVIDOR ASCENDA FLEX INICIADO');
            console.log('='.repeat(60));
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📊 Banco de Dados: SQLite (ascenda.db)`);
            console.log(`🔐 Autenticação: JWT (24h expiration)`);
            console.log(`🏗️  Arquitetura: MVC Pattern`);
            console.log('='.repeat(60));
            console.log('✨ Pronto para receber requisições!\n');
        });
    })
    .catch((err) => {
        console.error('❌ Erro ao inicializar banco de dados:', err);
        process.exit(1);
    });
