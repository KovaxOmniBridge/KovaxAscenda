/**
 * Configuração do banco de dados SQLite
 * Alternativa leve ao PostgreSQL - não requer instalação
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho do banco de dados
const DB_PATH = join(__dirname, '../database/ascenda.db');

// Criar diretório se não existir
const dbDir = dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Criar/conectar ao banco
const db = new Database(DB_PATH);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Habilitar WAL mode para melhor performance
db.pragma('journal_mode = WAL');

console.log(`✓ Conectado ao SQLite: ${DB_PATH}`);

/**
 * Executar query (SELECT)
 */
export const query = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    // better-sqlite3 aceita ...spread de params individuais
    const rows = stmt.all(...params);
    return {
      rows,
      rowCount: rows.length
    };
  } catch (error) {
    console.error('❌ Erro ao executar query:', error.message);
    console.error('   SQL:', sql);
    console.error('   Params:', params);
    throw error;
  }
};

/**
 * Executar comando (INSERT, UPDATE, DELETE)
 */
export const execute = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    // better-sqlite3 aceita ...spread de params individuais
    const result = stmt.run(...params);
    return {
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid
    };
  } catch (error) {
    console.error('❌ Erro ao executar comando:', error.message);
    console.error('   SQL:', sql);
    console.error('   Params:', params);
    throw error;
  }
};

/**
 * Executar múltiplos comandos SQL (migration)
 */
export const executeMigration = (sqlScript) => {
  try {
    db.exec(sqlScript);
    return true;
  } catch (error) {
    console.error('Erro ao executar migration:', error.message);
    throw error;
  }
};

/**
 * Iniciar transação
 */
export const beginTransaction = () => {
  db.prepare('BEGIN').run();
};

/**
 * Commit transação
 */
export const commit = () => {
  db.prepare('COMMIT').run();
};

/**
 * Rollback transação
 */
export const rollback = () => {
  db.prepare('ROLLBACK').run();
};

/**
 * Fechar conexão
 */
export const close = () => {
  db.close();
  console.log('✓ Conexão com SQLite fechada');
};

/**
 * Testar conexão
 */
export const testConnection = () => {
  try {
    const result = db.prepare("SELECT datetime('now') as now").get();
    console.log('✓ Conexão com SQLite bem-sucedida:', result.now);
    return true;
  } catch (error) {
    console.error('✗ Erro ao conectar ao SQLite:', error.message);
    return false;
  }
};

// Exportar database instance
export { db };

export default {
  query,
  execute,
  executeMigration,
  beginTransaction,
  commit,
  rollback,
  close,
  testConnection,
  db
};
