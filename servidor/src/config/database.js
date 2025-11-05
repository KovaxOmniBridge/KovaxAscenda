/**
 * Configuração da Conexão com Banco de Dados SQLite
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const DB_PATH = path.join(__dirname, '..', '..', 'db', 'ascenda.db');

// Criar/conectar ao banco de dados
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    } else {
        console.log('✓ Conectado ao banco de dados SQLite');
    }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
