import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_NAME = process.env.DB_NAME || 'ascenda_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

// Conexão para criar o banco (conecta no postgres default)
const createDatabaseClient = new Client({
  host: DB_HOST,
  port: DB_PORT,
  database: 'postgres',
  user: DB_USER,
  password: DB_PASSWORD,
});

// Conexão para o banco da aplicação
const appDatabaseClient = new Client({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

async function databaseExists() {
  try {
    await createDatabaseClient.connect();
    const result = await createDatabaseClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );
    await createDatabaseClient.end();
    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao verificar banco de dados:', error.message);
    await createDatabaseClient.end();
    throw error;
  }
}

async function createDatabase() {
  try {
    await createDatabaseClient.connect();
    console.log(`\n📦 Criando banco de dados "${DB_NAME}"...`);
    await createDatabaseClient.query(`CREATE DATABASE ${DB_NAME}`);
    await createDatabaseClient.end();
    console.log(`✓ Banco de dados "${DB_NAME}" criado com sucesso!\n`);
  } catch (error) {
    await createDatabaseClient.end();
    throw error;
  }
}

async function runSchemaScript() {
  try {
    console.log('📋 Executando schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    
    await appDatabaseClient.connect();
    await appDatabaseClient.query(schema);
    console.log('✓ Schema criado com sucesso!\n');
  } catch (error) {
    console.error('✗ Erro ao executar schema:', error.message);
    throw error;
  }
}

async function runSeedScript() {
  try {
    console.log('🌱 Executando seed.sql...');
    const seedPath = path.join(__dirname, 'seed.sql');
    const seed = await fs.readFile(seedPath, 'utf-8');
    
    await appDatabaseClient.query(seed);
    console.log('✓ Dados iniciais inseridos com sucesso!\n');
  } catch (error) {
    console.error('✗ Erro ao executar seed:', error.message);
    throw error;
  }
}

async function showSummary() {
  try {
    console.log('📊 Resumo dos dados inseridos:\n');
    
    const orgs = await appDatabaseClient.query('SELECT COUNT(*) FROM organizations');
    console.log(`   Organizações: ${orgs.rows[0].count}`);
    
    const devs = await appDatabaseClient.query('SELECT COUNT(*) FROM developers');
    console.log(`   Desenvolvedores: ${devs.rows[0].count}`);
    
    const users = await appDatabaseClient.query('SELECT COUNT(*) FROM users');
    console.log(`   Usuários: ${users.rows[0].count}`);
    
    const tools = await appDatabaseClient.query('SELECT COUNT(*) FROM tools');
    console.log(`   Ferramentas: ${tools.rows[0].count}`);
    
    console.log('\n✨ Banco de dados inicializado com sucesso!\n');
    console.log('📝 Credenciais de teste:');
    console.log('   Desenvolvedor: dev@ascenda.com / Dev@2024!Super');
    console.log('   Admin: admin@ascenda.com / Admin@2024!Master');
    console.log('   Usuários: ceo@empresa.com, diretor@empresa.com, etc / senha123\n');
    
  } catch (error) {
    console.error('Erro ao exibir resumo:', error.message);
  }
}

async function initDatabase() {
  try {
    console.log('\n🚀 Iniciando configuração do banco de dados PostgreSQL\n');
    console.log(`   Host: ${DB_HOST}:${DB_PORT}`);
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   User: ${DB_USER}\n`);
    
    // Verificar se o banco já existe
    const exists = await databaseExists();
    
    if (!exists) {
      await createDatabase();
    } else {
      console.log(`✓ Banco de dados "${DB_NAME}" já existe\n`);
      await appDatabaseClient.connect();
    }
    
    // Executar schema e seed
    await runSchemaScript();
    await runSeedScript();
    await showSummary();
    
  } catch (error) {
    console.error('\n✗ Erro fatal na inicialização:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await appDatabaseClient.end();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase();
}

export { initDatabase };
