/**
 * Migração: Sistema de Cargos e Permissões
 * Adiciona tabelas para gestão de cargos e suas permissões de ferramentas
 */

import { executeMigration, query, testConnection } from '../config/database-sqlite.js';

async function migrateCargos() {
  try {
    console.log('\n🔧 Iniciando migração de Cargos e Permissões...\n');
    
    const connected = testConnection();
    if (!connected) {
      throw new Error('Não foi possível conectar ao SQLite');
    }
    
    // SQL da migração
    const migration = `
      -- =====================================================
      -- TABELA: positions (cargos)
      -- =====================================================
      CREATE TABLE IF NOT EXISTS positions (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        UNIQUE(organization_id, name)
      );

      CREATE INDEX IF NOT EXISTS idx_positions_org ON positions(organization_id);
      CREATE INDEX IF NOT EXISTS idx_positions_active ON positions(is_active);

      -- =====================================================
      -- TABELA: position_tool_permissions
      -- Relaciona cargos com as ferramentas que podem acessar
      -- =====================================================
      CREATE TABLE IF NOT EXISTS position_tool_permissions (
        id TEXT PRIMARY KEY,
        position_id TEXT NOT NULL,
        tool_id TEXT NOT NULL,
        can_access INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
        FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
        UNIQUE(position_id, tool_id)
      );

      CREATE INDEX IF NOT EXISTS idx_permissions_position ON position_tool_permissions(position_id);
      CREATE INDEX IF NOT EXISTS idx_permissions_tool ON position_tool_permissions(tool_id);
    `;
    
    executeMigration(migration);
    console.log('✓ Tabelas criadas com sucesso!\n');
    
    // Adicionar coluna position_id na tabela users (se não existir)
    try {
      const tableInfo = query("PRAGMA table_info(users)");
      const hasPositionId = tableInfo.rows.some(col => col.name === 'position_id');
      
      if (!hasPositionId) {
        executeMigration("ALTER TABLE users ADD COLUMN position_id TEXT REFERENCES positions(id)");
        console.log('✓ Coluna position_id adicionada à tabela users\n');
      } else {
        console.log('✓ Coluna position_id já existe na tabela users\n');
      }
    } catch (error) {
      if (!error.message.includes('duplicate column')) {
        throw error;
      }
    }
    
    // Verificar estrutura
    console.log('📊 Estrutura das novas tabelas:\n');
    
    const positionsInfo = query("PRAGMA table_info(positions)");
    console.log('   Tabela: positions');
    positionsInfo.rows.forEach(col => {
      console.log(`     - ${col.name} (${col.type})`);
    });
    
    console.log('');
    
    const permissionsInfo = query("PRAGMA table_info(position_tool_permissions)");
    console.log('   Tabela: position_tool_permissions');
    permissionsInfo.rows.forEach(col => {
      console.log(`     - ${col.name} (${col.type})`);
    });
    
    console.log('\n✨ Migração concluída com sucesso!\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n✗ Erro na migração:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

migrateCargos();
