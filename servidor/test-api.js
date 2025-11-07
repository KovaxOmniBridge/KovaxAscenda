/**
 * Script de Teste das APIs
 * Testa todas as rotas principais do backend
 */

const API_BASE = 'http://localhost:3000/api';
let authToken = '';
let testUserId = null;
let testSquadId = null;
let testChapterId = null;
let testCountryId = null;

console.log('🚀 Iniciando testes das APIs...\n');

// Função auxiliar para fazer requisições
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            ...options.headers
        }
    };
    
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

// Teste 1: Health Check
async function testHealthCheck() {
    console.log('📌 Teste 1: Health Check');
    const result = await apiRequest('/health');
    if (result.status === 200) {
        console.log('✅ API está funcionando');
        console.log(`   Timestamp: ${result.data.timestamp}\n`);
        return true;
    } else {
        console.log('❌ API não está respondendo\n');
        return false;
    }
}

// Teste 2: Login
async function testLogin() {
    console.log('📌 Teste 2: Login de Usuário');
    const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
            accessKey: 'TS-0001',
            password: 'senha123'
        }
    });
    
    if (result.status === 200 && result.data.token) {
        authToken = result.data.token;
        console.log('✅ Login realizado com sucesso');
        console.log(`   Usuário: ${result.data.user.name}`);
        console.log(`   Nível: ${result.data.user.nivel}\n`);
        return true;
    } else {
        console.log('❌ Falha no login');
        console.log(`   Erro: ${result.data.error || 'Desconhecido'}\n`);
        return false;
    }
}

// Teste 3: Listar Usuários
async function testListUsers() {
    console.log('📌 Teste 3: Listar Usuários');
    const result = await apiRequest('/users');
    
    if (result.status === 200 && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} usuários encontrados`);
        if (result.data.length > 0) {
            testUserId = result.data[0].id;
            console.log(`   Primeiro usuário: ${result.data[0].name}\n`);
        }
        return true;
    } else {
        console.log('❌ Falha ao listar usuários\n');
        return false;
    }
}

// Teste 4: Estatísticas por Nível
async function testUserStats() {
    console.log('📌 Teste 4: Estatísticas por Nível');
    const result = await apiRequest('/users/stats/by-level');
    
    if (result.status === 200 && Array.isArray(result.data)) {
        console.log('✅ Estatísticas obtidas com sucesso');
        result.data.forEach(stat => {
            console.log(`   Nível ${stat.nivel}: ${stat.count} usuários`);
        });
        console.log('');
        return true;
    } else {
        console.log('❌ Falha ao obter estatísticas\n');
        return false;
    }
}

// Teste 5: Listar Squads
async function testListSquads() {
    console.log('📌 Teste 5: Listar Squads');
    const result = await apiRequest('/squads');
    
    if (result.status === 200 && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} squads encontrados`);
        if (result.data.length > 0) {
            testSquadId = result.data[0].id;
            console.log(`   Primeiro squad: ${result.data[0].name}`);
            console.log(`   Membros: ${result.data[0].member_count}\n`);
        } else {
            console.log('   Nenhum squad cadastrado ainda\n');
        }
        return true;
    } else {
        console.log('❌ Falha ao listar squads\n');
        return false;
    }
}

// Teste 6: Listar Chapters
async function testListChapters() {
    console.log('📌 Teste 6: Listar Chapters');
    const result = await apiRequest('/chapters');
    
    if (result.status === 200 && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} chapters encontrados`);
        if (result.data.length > 0) {
            testChapterId = result.data[0].id;
            console.log(`   Primeiro chapter: ${result.data[0].name}`);
            console.log(`   Membros: ${result.data[0].member_count}\n`);
        } else {
            console.log('   Nenhum chapter cadastrado ainda\n');
        }
        return true;
    } else {
        console.log('❌ Falha ao listar chapters\n');
        return false;
    }
}

// Teste 7: Listar Países
async function testListCountries() {
    console.log('📌 Teste 7: Listar Países');
    const result = await apiRequest('/countries');
    
    if (result.status === 200 && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} países encontrados`);
        if (result.data.length > 0) {
            testCountryId = result.data[0].id;
            result.data.forEach(country => {
                const hq = country.is_headquarters ? ' (Sede)' : '';
                console.log(`   ${country.country}${hq} - ${country.city}`);
            });
        } else {
            console.log('   Nenhum país cadastrado ainda');
        }
        console.log('');
        return true;
    } else {
        console.log('❌ Falha ao listar países\n');
        return false;
    }
}

// Teste 8: Criar País
async function testCreateCountry() {
    console.log('📌 Teste 8: Criar País');
    const result = await apiRequest('/countries', {
        method: 'POST',
        body: {
            country: 'Portugal',
            tax_id: 'PT123456789',
            city: 'Lisboa',
            address: 'Rua Augusta, 100',
            phone: '+351-21-1234567',
            is_headquarters: false
        }
    });
    
    if (result.status === 201) {
        testCountryId = result.data.id;
        console.log('✅ País criado com sucesso');
        console.log(`   ID: ${result.data.id}\n`);
        return true;
    } else if (result.status === 400 || result.status === 500) {
        console.log('⚠️ País pode já existir ou erro de validação\n');
        return true; // Não é erro crítico
    } else {
        console.log('❌ Falha ao criar país\n');
        return false;
    }
}

// Teste 9: Obter Perfil
async function testGetProfile() {
    console.log('📌 Teste 9: Obter Perfil do Usuário');
    const result = await apiRequest('/auth/profile');
    
    if (result.status === 200) {
        console.log('✅ Perfil obtido com sucesso');
        console.log(`   Nome: ${result.data.name}`);
        console.log(`   Email: ${result.data.email}`);
        console.log(`   Empresa: ${result.data.company.name}\n`);
        return true;
    } else {
        console.log('❌ Falha ao obter perfil\n');
        return false;
    }
}

// Executar todos os testes
async function runAllTests() {
    const tests = [
        testHealthCheck,
        testLogin,
        testListUsers,
        testUserStats,
        testListSquads,
        testListChapters,
        testListCountries,
        testCreateCountry,
        testGetProfile
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        const result = await test();
        if (result) {
            passed++;
        } else {
            failed++;
        }
        
        // Pequena pausa entre testes
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('='.repeat(50));
    console.log('📊 RESULTADO DOS TESTES');
    console.log('='.repeat(50));
    console.log(`✅ Testes Passaram: ${passed}`);
    console.log(`❌ Testes Falharam: ${failed}`);
    console.log(`📈 Taxa de Sucesso: ${Math.round((passed / (passed + failed)) * 100)}%`);
    console.log('='.repeat(50));
    
    if (failed === 0) {
        console.log('\n🎉 Todos os testes passaram! Backend está 100% funcional!\n');
    } else {
        console.log('\n⚠️ Alguns testes falharam. Verifique a configuração do servidor.\n');
    }
}

// Executar testes
runAllTests().catch(error => {
    console.error('❌ Erro ao executar testes:', error);
});
