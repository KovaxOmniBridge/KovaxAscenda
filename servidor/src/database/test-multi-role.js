/**
 * Script de Teste: Sistema Multi-Role
 * 
 * Este script cria usuários de exemplo com múltiplos papéis
 * para testar o sistema de troca de interfaces.
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');

function createTestUsers() {
    console.log('🧪 Criando usuários de teste para Sistema Multi-Role...\n');

    // Exemplos de usuários com múltiplos papéis
    const testUsers = [
        {
            name: 'João Silva (Dono)',
            email: 'joao.silva@empresa.com',
            access_key: 'JOAO-001',
            password: 'senha123',
            nivel: 0, // Presidente
            additional_roles: '[1, 5]', // Admin + Supervisor
            can_switch_roles: 1,
            description: 'Dono de pequena empresa que também gerencia operações'
        },
        {
            name: 'Maria Santos (Gerente Multi)',
            email: 'maria.santos@empresa.com',
            access_key: 'MARIA-001',
            password: 'senha123',
            nivel: 3, // Gerente
            additional_roles: '[4, 7]', // Coordenador + Operacional
            can_switch_roles: 1,
            description: 'Gerente que também coordena projetos e atua operacionalmente'
        },
        {
            name: 'Pedro Costa (Admin/Diretor)',
            email: 'pedro.costa@empresa.com',
            access_key: 'PEDRO-001',
            password: 'senha123',
            nivel: 1, // Admin
            additional_roles: '[2]', // Diretor
            can_switch_roles: 1,
            description: 'Administrador que também atua como diretor executivo'
        },
        {
            name: 'Ana Paula (Papel Único)',
            email: 'ana.paula@empresa.com',
            access_key: 'ANA-001',
            password: 'senha123',
            nivel: 5, // Supervisor
            additional_roles: null, // Sem papéis adicionais
            can_switch_roles: 0,
            description: 'Usuário com papel único (não verá seletor)'
        }
    ];

    // Buscar primeira empresa (ou criar se não existir)
    db.get('SELECT id FROM companies LIMIT 1', [], (err, company) => {
        if (err) {
            console.error('❌ Erro ao buscar empresa:', err);
            return;
        }

        if (!company) {
            console.log('⚠️  Nenhuma empresa encontrada. Crie uma empresa primeiro.');
            return;
        }

        const companyId = company.id;
        console.log(`📍 Usando empresa ID: ${companyId}\n`);

        // Criar cada usuário
        testUsers.forEach((user, index) => {
            const hashedPassword = bcrypt.hashSync(user.password, 10);

            db.run(`
                INSERT INTO users (
                    company_id, name, email, phone, department, 
                    access_key, password, role, nivel, 
                    additional_roles, can_switch_roles
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                companyId,
                user.name,
                user.email,
                '(11) 99999-9999',
                'Administração',
                user.access_key,
                hashedPassword,
                'Multi-Role Test',
                user.nivel,
                user.additional_roles,
                user.can_switch_roles
            ], function(err) {
                if (err) {
                    console.error(`❌ Erro ao criar ${user.name}:`, err.message);
                } else {
                    console.log(`✅ Usuário ${index + 1}/4 criado: ${user.name}`);
                    console.log(`   📧 Email: ${user.email}`);
                    console.log(`   🔑 Chave: ${user.access_key}`);
                    console.log(`   🔐 Senha: ${user.password}`);
                    console.log(`   👤 Nível Principal: ${user.nivel}`);
                    console.log(`   🔄 Papéis Adicionais: ${user.additional_roles || 'Nenhum'}`);
                    console.log(`   💡 ${user.description}\n`);
                }

                // Se for o último, mostrar instruções
                if (index === testUsers.length - 1) {
                    setTimeout(() => {
                        console.log('\n' + '='.repeat(60));
                        console.log('📋 INSTRUÇÕES PARA TESTE:');
                        console.log('='.repeat(60));
                        console.log('\n1. Acesse: http://localhost:5500/index.html');
                        console.log('2. Faça login com qualquer usuário acima');
                        console.log('3. Observe o comportamento:');
                        console.log('   • Usuários 1, 2 e 3: Verão tela de seleção de papel');
                        console.log('   • Usuária 4 (Ana): Vai direto para seu dashboard');
                        console.log('\n4. Após login, teste:');
                        console.log('   • Botão "🔄 Papel: [Atual]" no header');
                        console.log('   • Trocar entre papéis disponíveis');
                        console.log('   • Verificar redirecionamento correto');
                        console.log('\n5. Cenários de teste:');
                        console.log('   • João (0+1+5): Presidente → Admin → Supervisor');
                        console.log('   • Maria (3+4+7): Gerente → Coordenador → Operacional');
                        console.log('   • Pedro (1+2): Admin → Diretor');
                        console.log('   • Ana (5): Apenas Supervisor (sem troca)');
                        console.log('\n' + '='.repeat(60));
                    }, 500);
                }
            });
        });
    });
}

// Executar se for chamado diretamente
if (require.main === module) {
    createTestUsers();
    
    // Fechar conexão após 2 segundos
    setTimeout(() => {
        db.close((err) => {
            if (err) {
                console.error('❌ Erro ao fechar banco:', err);
            }
            process.exit(0);
        });
    }, 2000);
}

module.exports = { createTestUsers };
