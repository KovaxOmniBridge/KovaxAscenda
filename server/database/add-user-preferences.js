// =====================================================
// MIGRAÇÃO: Adicionar Tabela de Preferências de Ferramentas do Usuário
// =====================================================

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'ascenda.db');
const db = new Database(dbPath);

console.log('📦 Iniciando migração: user_tool_preferences...');

try {
  // Criar tabela de preferências
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_tool_preferences (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tool_id TEXT NOT NULL,
      is_enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
      UNIQUE(user_id, tool_id)
    );
  `);

  console.log('✅ Tabela user_tool_preferences criada');

  // Criar índices para performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_tool_prefs_user 
    ON user_tool_preferences(user_id);
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_tool_prefs_tool 
    ON user_tool_preferences(tool_id);
  `);

  console.log('✅ Índices criados');

  // Criar trigger para updated_at
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_user_tool_preferences_timestamp 
    AFTER UPDATE ON user_tool_preferences
    FOR EACH ROW
    BEGIN
      UPDATE user_tool_preferences 
      SET updated_at = datetime('now')
      WHERE id = NEW.id;
    END;
  `);

  console.log('✅ Trigger criado');

  console.log('');
  console.log('🎉 Migração concluída com sucesso!');
  console.log('');
  console.log('📋 Estrutura criada:');
  console.log('   - Tabela: user_tool_preferences');
  console.log('   - Índices: user_id, tool_id');
  console.log('   - Trigger: updated_at automático');
  console.log('');

} catch (error) {
  console.error('❌ Erro na migração:', error.message);
  process.exit(1);
} finally {
  db.close();
}
