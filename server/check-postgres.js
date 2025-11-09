/**
 * Script para verificar se PostgreSQL está disponível
 * e orientar o usuário sobre próximos passos
 */

import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const checkPostgreSQL = async () => {
  console.log('\n🔍 Verificando disponibilidade do PostgreSQL...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };

  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   User: ${config.user}\n`);

  try {
    const client = new Client(config);
    await client.connect();
    
    const result = await client.query('SELECT version()');
    await client.end();
    
    console.log('✅ PostgreSQL está DISPONÍVEL!\n');
    console.log(`   Versão: ${result.rows[0].version.split(',')[0]}\n`);
    console.log('📋 Próximos passos:\n');
    console.log('   1. Criar o banco de dados:');
    console.log('      node database/init-db.js\n');
    console.log('   2. Iniciar o servidor:');
    console.log('      npm start\n');
    
    return true;
    
  } catch (error) {
    console.log('❌ PostgreSQL NÃO está disponível\n');
    console.log(`   Erro: ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔴 Problema: PostgreSQL não está rodando ou não está instalado\n');
      console.log('💡 SOLUÇÕES:\n');
      console.log('   ┌─────────────────────────────────────────────────────┐');
      console.log('   │ OPÇÃO 1: Instalar PostgreSQL (RECOMENDADO)         │');
      console.log('   ├─────────────────────────────────────────────────────┤');
      console.log('   │ 1. Baixe o instalador:                             │');
      console.log('   │    https://www.postgresql.org/download/windows/    │');
      console.log('   │                                                     │');
      console.log('   │ 2. Execute o instalador                            │');
      console.log('   │    - Defina uma senha (ex: postgres123)            │');
      console.log('   │    - ANOTE A SENHA!                                │');
      console.log('   │                                                     │');
      console.log('   │ 3. Atualize o .env com a senha:                    │');
      console.log('   │    DB_PASSWORD=sua_senha_aqui                      │');
      console.log('   │                                                     │');
      console.log('   │ 4. Execute:                                        │');
      console.log('   │    node database/init-db.js                        │');
      console.log('   │    npm start                                       │');
      console.log('   └─────────────────────────────────────────────────────┘\n');
      
      console.log('   ┌─────────────────────────────────────────────────────┐');
      console.log('   │ OPÇÃO 2: Usar Docker                               │');
      console.log('   ├─────────────────────────────────────────────────────┤');
      console.log('   │ docker run --name ascenda-postgres \\               │');
      console.log('   │   -e POSTGRES_PASSWORD=postgres \\                  │');
      console.log('   │   -p 5432:5432 -d postgres:16                      │');
      console.log('   │                                                     │');
      console.log('   │ node database/init-db.js                           │');
      console.log('   │ npm start                                          │');
      console.log('   └─────────────────────────────────────────────────────┘\n');
      
      console.log('   ┌─────────────────────────────────────────────────────┐');
      console.log('   │ OPÇÃO 3: Voltar temporariamente para JSON          │');
      console.log('   ├─────────────────────────────────────────────────────┤');
      console.log('   │ Move-Item server.js server.js.postgresql           │');
      console.log('   │ Move-Item server.js.json-backup server.js          │');
      console.log('   │ npm start                                          │');
      console.log('   └─────────────────────────────────────────────────────┘\n');
      
    } else if (error.code === '28P01') {
      console.log('🔴 Problema: Senha do PostgreSQL incorreta\n');
      console.log('💡 SOLUÇÃO:\n');
      console.log('   1. Verifique a senha no arquivo .env:');
      console.log('      DB_PASSWORD=sua_senha_correta\n');
      console.log('   2. Teste a senha manualmente:');
      console.log('      psql -U postgres -W\n');
      
    } else {
      console.log('🔴 Problema desconhecido\n');
      console.log('💡 Detalhes do erro:');
      console.log(`   ${JSON.stringify(error, null, 2)}\n`);
    }
    
    console.log('📖 Documentação completa:');
    console.log('   COMO_INSTALAR_POSTGRESQL.md\n');
    
    return false;
  }
};

// Executar verificação
checkPostgreSQL();
