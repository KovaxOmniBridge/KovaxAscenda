/**
 * Adiciona coluna status à tabela organizations
 */

import { executeMigration, query, testConnection } from '../config/database-sqlite.js';

async function addStatusColumn() {
  try {
    console.log('\n🔧 Adicionando campo status...\n');
    
    const connected = testConnection();
    if (!connected) {
      throw new Error('Não foi possível conectar ao SQLite');
    }
    
    // Verificar se a coluna já existe
    const tableInfo = query("PRAGMA table_info(organizations)");
    const hasStatus = tableInfo.rows.some(col => col.name === 'status');
    
    if (hasStatus) {
      console.log('✓ Coluna status já existe!\n');
      process.exit(0);
    }
    
    // Adicionar coluna
    try {
      executeMigration("ALTER TABLE organizations ADD COLUMN status TEXT DEFAULT 'ativo'");
      console.log('✓ Coluna status adicionada!\n');
      
      // Atualizar registros existentes
      executeMigration("UPDATE organizations SET status = 'ativo' WHERE status IS NULL");
      console.log('✓ Registros atualizados!\n');
      
      // Verificar
      const orgs = query('SELECT id, name, status FROM organizations');
      console.log('📊 Organizações:');
      orgs.rows.forEach(org => {
        console.log(`   ${org.name}: ${org.status}`);
      });
      
      console.log('\n✨ Migração concluída com sucesso!\n');
      
    } catch (error) {
      if (error.message.includes('duplicate column')) {
        console.log('✓ Coluna status já existe!\n');
      } else {
        throw error;
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n✗ Erro:', error.message);
    process.exit(1);
  }
}

addStatusColumn();
