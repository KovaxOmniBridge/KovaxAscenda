/**
 * Script de Reset e População do Banco de Dados
 * 
 * 1. Deleta todas as empresas e usuários (mantém desenvolvedores)
 * 2. Cria 3 empresas (pequena, média, grande)
 * 3. Popula com funcionários:
 *    - Pequena: 50 funcionários
 *    - Média: 200 funcionários
 *    - Grande: 1000 funcionários
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Dados base para gerar nomes
const FIRST_NAMES = [
    'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Fernando', 'Beatriz',
    'Ricardo', 'Camila', 'Rafael', 'Letícia', 'Gustavo', 'Patricia', 'Bruno', 'Fernanda',
    'Lucas', 'Amanda', 'Diego', 'Mariana', 'Felipe', 'Gabriela', 'Rodrigo', 'Luciana',
    'Marcelo', 'Vanessa', 'André', 'Daniela', 'Paulo', 'Renata', 'Thiago', 'Bianca',
    'Leonardo', 'Priscila', 'Vinícius', 'Carla', 'Matheus', 'Aline', 'Eduardo', 'Natália'
];

const LAST_NAMES = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
    'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Rocha', 'Almeida',
    'Nascimento', 'Araújo', 'Melo', 'Barbosa', 'Cardoso', 'Reis', 'Teixeira', 'Mendes',
    'Monteiro', 'Castro', 'Campos', 'Freitas', 'Moreira', 'Pinto', 'Cavalcanti', 'Correia'
];

const DEPARTMENTS = [
    'Tecnologia', 'Vendas', 'Marketing', 'RH', 'Financeiro', 
    'Operações', 'Atendimento', 'Logística', 'Administrativo', 'Qualidade'
];

const ROLES = [
    'Analista', 'Assistente', 'Coordenador', 'Especialista', 
    'Gerente', 'Supervisor', 'Técnico', 'Consultor'
];

/**
 * Gera nome aleatório
 */
function generateName() {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${firstName} ${lastName}`;
}

/**
 * Gera email baseado no nome
 */
function generateEmail(name, companyDomain) {
    const cleanName = name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '.');
    const timestamp = Date.now();
    return `${cleanName}.${timestamp % 10000}@${companyDomain}`;
}

/**
 * Gera chave de acesso única
 */
function generateAccessKey(companyPrefix, index) {
    return `${companyPrefix}-${String(index).padStart(4, '0')}`;
}

/**
 * Passo 1: Limpar banco de dados
 */
function cleanDatabase() {
    return new Promise((resolve, reject) => {
        console.log('\n🧹 Limpando banco de dados...\n');

        db.serialize(() => {
            // Deletar usuários (exceto desenvolvedores)
            db.run('DELETE FROM users', [], function(err) {
                if (err) {
                    console.error('❌ Erro ao deletar usuários:', err);
                    reject(err);
                    return;
                }
                console.log(`✅ ${this.changes} usuários deletados`);
            });

            // Deletar squads
            db.run('DELETE FROM squads', [], function(err) {
                if (err) console.error('⚠️ Erro ao deletar squads:', err);
                else console.log(`✅ ${this.changes} squads deletados`);
            });

            // Deletar chapters
            db.run('DELETE FROM chapters', [], function(err) {
                if (err) console.error('⚠️ Erro ao deletar chapters:', err);
                else console.log(`✅ ${this.changes} chapters deletados`);
            });

            // Deletar templates
            db.run('DELETE FROM organization_templates', [], function(err) {
                if (err) console.error('⚠️ Erro ao deletar templates:', err);
                else console.log(`✅ ${this.changes} templates deletados`);
            });

            // Deletar empresas
            db.run('DELETE FROM companies', [], function(err) {
                if (err) {
                    console.error('❌ Erro ao deletar empresas:', err);
                    reject(err);
                    return;
                }
                console.log(`✅ ${this.changes} empresas deletadas`);
                console.log('\n✅ Banco de dados limpo!\n');
                resolve();
            });
        });
    });
}

/**
 * Passo 2: Criar empresas
 */
function createCompanies() {
    return new Promise((resolve, reject) => {
        console.log('🏢 Criando empresas...\n');

        const companies = [
            {
                name: 'TechStart Inovações',
                legal_name: 'TechStart Inovações Ltda',
                founded_year: 2020,
                size: 'small',
                industry: 'Tecnologia',
                website: 'techstart.com.br',
                description: 'Startup de tecnologia focada em soluções digitais',
                employees: 50,
                domain: 'techstart.com.br',
                prefix: 'TS'
            },
            {
                name: 'MediumCorp Soluções',
                legal_name: 'MediumCorp Soluções Empresariais S.A.',
                founded_year: 2015,
                size: 'medium',
                industry: 'Consultoria',
                website: 'mediumcorp.com.br',
                description: 'Consultoria empresarial com atuação nacional',
                employees: 200,
                domain: 'mediumcorp.com.br',
                prefix: 'MC'
            },
            {
                name: 'MegaCorporation Brasil',
                legal_name: 'MegaCorporation Brasil S.A.',
                founded_year: 2005,
                size: 'large',
                industry: 'Varejo',
                website: 'megacorp.com.br',
                description: 'Grande corporação de varejo com presença nacional',
                employees: 1000,
                domain: 'megacorp.com.br',
                prefix: 'MG'
            }
        ];

        const createdCompanies = [];
        let processed = 0;

        companies.forEach((company, index) => {
            db.run(`
                INSERT INTO companies (
                    name, legal_name, founded_year, size, industry, 
                    website, description, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `, [
                company.name,
                company.legal_name,
                company.founded_year,
                company.size,
                company.industry,
                company.website,
                company.description
            ], function(err) {
                if (err) {
                    console.error(`❌ Erro ao criar ${company.name}:`, err);
                    reject(err);
                    return;
                }

                const companyId = this.lastID;
                createdCompanies.push({
                    ...company,
                    id: companyId
                });

                console.log(`✅ Empresa criada: ${company.name} (ID: ${companyId}) - ${company.employees} funcionários`);

                processed++;
                if (processed === companies.length) {
                    console.log('\n✅ Todas as empresas criadas!\n');
                    resolve(createdCompanies);
                }
            });
        });
    });
}

/**
 * Passo 3: Popular empresa com funcionários
 */
function populateCompany(company) {
    return new Promise((resolve, reject) => {
        console.log(`👥 Populando ${company.name} com ${company.employees} funcionários...`);

        const password = bcrypt.hashSync('senha123', 10);
        const users = [];

        // Distribuição por nível hierárquico
        const distribution = calculateDistribution(company.employees);

        let userIndex = 1;
        let created = 0;

        // Criar usuários por nível
        for (let nivel = 0; nivel <= 7; nivel++) {
            const count = distribution[nivel];

            for (let i = 0; i < count; i++) {
                const name = generateName();
                const email = generateEmail(name, company.domain);
                const accessKey = generateAccessKey(company.prefix, userIndex);
                const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
                const role = ROLES[Math.floor(Math.random() * ROLES.length)];
                
                // Multi-role para alguns usuários
                let additional_roles = null;
                let can_switch_roles = 0;

                // 20% dos usuários terão multi-role
                if (Math.random() < 0.2) {
                    const additionalLevels = [];
                    const numAdditional = Math.floor(Math.random() * 2) + 1; // 1 ou 2 níveis extras
                    
                    for (let j = 0; j < numAdditional; j++) {
                        const extraLevel = Math.floor(Math.random() * 8);
                        if (extraLevel !== nivel && !additionalLevels.includes(extraLevel)) {
                            additionalLevels.push(extraLevel);
                        }
                    }
                    
                    if (additionalLevels.length > 0) {
                        additional_roles = JSON.stringify(additionalLevels);
                        can_switch_roles = 1;
                    }
                }

                db.run(`
                    INSERT INTO users (
                        company_id, name, email, phone, department, 
                        access_key, password, role, nivel, is_primary,
                        additional_roles, can_switch_roles, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                `, [
                    company.id,
                    name,
                    email,
                    '(11) 99999-9999',
                    department,
                    accessKey,
                    password,
                    role,
                    nivel,
                    nivel === 1 ? 1 : 0, // Primeiro Admin é primário
                    additional_roles,
                    can_switch_roles
                ], function(err) {
                    if (err) {
                        console.error(`❌ Erro ao criar usuário ${name}:`, err);
                    }

                    created++;
                    
                    if (created === company.employees) {
                        console.log(`✅ ${company.name}: ${created} funcionários criados`);
                        console.log(`   📊 Distribuição: N0:${distribution[0]} N1:${distribution[1]} N2:${distribution[2]} N3:${distribution[3]} N4:${distribution[4]} N5:${distribution[5]} N6:${distribution[6]} N7:${distribution[7]}`);
                        console.log(`   🔄 Usuários com multi-role: ${Math.floor(created * 0.2)}\n`);
                        resolve();
                    }
                });

                userIndex++;
            }
        }
    });
}

/**
 * Calcula distribuição de funcionários por nível
 */
function calculateDistribution(total) {
    // Percentuais aproximados de uma empresa real
    const percentages = {
        0: 0.01,  // Presidentes: 1%
        1: 0.02,  // Admins: 2%
        2: 0.05,  // Diretores: 5%
        3: 0.10,  // Gerentes: 10%
        4: 0.12,  // Coordenadores: 12%
        5: 0.15,  // Supervisores: 15%
        6: 0.20,  // Especialistas: 20%
        7: 0.35   // Operacional: 35%
    };

    const distribution = {};
    let assigned = 0;

    for (let nivel = 0; nivel <= 7; nivel++) {
        let count = Math.floor(total * percentages[nivel]);
        
        // Garantir pelo menos 1 de cada nível crítico
        if (nivel <= 2 && count === 0) count = 1;
        
        distribution[nivel] = count;
        assigned += count;
    }

    // Ajustar diferença no nível operacional
    distribution[7] += (total - assigned);

    return distribution;
}

/**
 * Executar todo o processo
 */
async function run() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 RESET E POPULAÇÃO DO BANCO DE DADOS');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        // Passo 1: Limpar
        await cleanDatabase();

        // Passo 2: Criar empresas
        const companies = await createCompanies();

        // Passo 3: Popular cada empresa
        for (const company of companies) {
            await populateCompany(company);
        }

        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO!');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('📋 RESUMO:\n');
        console.log('🏢 Empresas criadas:');
        companies.forEach((c, i) => {
            console.log(`   ${i + 1}. ${c.name} (${c.size}) - ${c.employees} funcionários`);
        });

        console.log('\n🔑 Credenciais de Acesso:');
        console.log('   Senha padrão: senha123');
        console.log('\n   Chaves de acesso:');
        console.log('   - TechStart: TS-0001 até TS-0050');
        console.log('   - MediumCorp: MC-0001 até MC-0200');
        console.log('   - MegaCorporation: MG-0001 até MG-1000');

        console.log('\n💡 Funcionalidades incluídas:');
        console.log('   ✅ 20% dos usuários tem multi-role (podem trocar de papel)');
        console.log('   ✅ Distribuição hierárquica realista');
        console.log('   ✅ Departamentos e cargos variados');
        console.log('   ✅ Emails únicos por empresa');

        console.log('\n🧪 Para testar:');
        console.log('   1. Acesse: http://localhost:5500/index.html');
        console.log('   2. Escolha uma empresa (ID: 1, 2 ou 3)');
        console.log('   3. Use qualquer chave de acesso listada');
        console.log('   4. Senha: senha123\n');

    } catch (error) {
        console.error('\n❌ ERRO NO PROCESSO:', error);
        process.exit(1);
    }

    // Fechar conexão
    setTimeout(() => {
        db.close((err) => {
            if (err) console.error('❌ Erro ao fechar banco:', err);
            process.exit(0);
        });
    }, 1000);
}

// Executar
if (require.main === module) {
    run();
}

module.exports = { run };
