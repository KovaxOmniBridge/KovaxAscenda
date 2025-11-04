#!/usr/bin/env node

/**
 * Script de inicialização para produção
 * Verifica dependências e inicia o servidor
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando servidor em modo produção...\n');

// Verificar se o código foi compilado
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
    console.error('❌ Erro: Código não compilado!');
    console.log('📦 Execute "npm run build" primeiro\n');
    process.exit(1);
}

// Verificar se o arquivo principal existe
const serverPath = path.join(distPath, 'server.js');
if (!fs.existsSync(serverPath)) {
    console.error('❌ Erro: server.js não encontrado em dist/');
    console.log('📦 Execute "npm run build" novamente\n');
    process.exit(1);
}

// Verificar se o diretório de dados existe
const dataPath = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataPath)) {
    console.log('📁 Criando diretório data/...');
    fs.mkdirSync(dataPath, { recursive: true });
}

console.log('✅ Verificações concluídas');
console.log('🔧 Iniciando servidor...\n');

// Carregar variáveis de ambiente de produção se existir
const envProdPath = path.join(__dirname, '..', '.env.production');
if (fs.existsSync(envProdPath)) {
    require('dotenv').config({ path: envProdPath });
    console.log('📋 Variáveis de produção carregadas\n');
}

// Iniciar servidor
require(serverPath);
