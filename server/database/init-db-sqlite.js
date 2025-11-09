/**
 * Script para inicializar o banco SQLite
 * Cria as tabelas e insere dados iniciais
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { executeMigration, query, testConnection } from '../config/database-sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  try {
    console.log('\n🚀 Iniciando configuração do banco SQLite\n');
    
    // Testar conexão
    console.log('📋 Testando conexão...');
    const connected = testConnection();
    if (!connected) {
      throw new Error('Não foi possível conectar ao SQLite');
    }
    
    // Executar schema
    console.log('\n📋 Executando schema-sqlite.sql...');
    const schemaPath = path.join(__dirname, 'schema-sqlite.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    executeMigration(schema);
    console.log('✓ Schema criado com sucesso!\n');
    
    // Executar seed
    console.log('🌱 Executando seed-sqlite.sql...');
    const seedPath = path.join(__dirname, 'seed-sqlite.sql');
    const seed = await fs.readFile(seedPath, 'utf-8');
    executeMigration(seed);
    console.log('✓ Dados iniciais inseridos com sucesso!\n');
    
    // Mostrar resumo
    console.log('📊 Resumo dos dados inseridos:\n');
    
    const orgs = query('SELECT COUNT(*) as count FROM organizations');
    console.log(`   Organizações: ${orgs.rows[0].count}`);
    
    const devs = query('SELECT COUNT(*) as count FROM developers');
    console.log(`   Desenvolvedores: ${devs.rows[0].count}`);
    
    const users = query('SELECT COUNT(*) as count FROM users');
    console.log(`   Usuários: ${users.rows[0].count}`);
    
    const categories = query('SELECT COUNT(*) as count FROM tool_categories');
    console.log(`   Categorias: ${categories.rows[0].count}`);
    
    const tools = query('SELECT COUNT(*) as count FROM tools');
    console.log(`   Ferramentas: ${tools.rows[0].count}`);
    
    console.log('\n✨ Banco de dados SQLite inicializado com sucesso!\n');
    console.log('📝 Credenciais de teste:');
    console.log('   Desenvolvedor: dev@ascenda.com / Dev@2024!Super');
    console.log('   Admin: admin@ascenda.com / Admin@2024!Master');
    console.log('   Usuários: ceo@empresa.com, diretor@empresa.com, etc / senha123\n');
    console.log('🚀 Agora execute: npm start\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n✗ Erro fatal na inicialização:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar
initDatabase();
