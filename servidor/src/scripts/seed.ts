import DatabaseService from '../database/DatabaseService';
import CompanyRepository from '../repositories/CompanyRepository';
import { ICompany } from '../interfaces';
import Database from 'better-sqlite3';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { ICreateEmployee, EmployeeRole, EmployeeStatus, ContractType, AccessLevel } from '../interfaces/IEmployee';

const seedData: Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        cnpj: '00.000.000/0001-00',
        razaoSocial: 'Empresa Exemplo Ltda',
        nomeFantasia: 'Exemplo Corp',
        porte: 'ME',
        regimeTributario: 'SIMPLES_NACIONAL',
        situacaoCadastral: 'ATIVA',
        dataAbertura: new Date('2024-01-01'),
        endereco: {
            cep: '01000-000',
            logradouro: 'Rua Exemplo',
            numero: '100',
            complemento: 'Sala 1',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP',
            pais: 'Brasil'
        },
        contatos: [
            {
                tipo: 'EMAIL',
                valor: 'contato@exemplo.com.br',
                principal: true
            },
            {
                tipo: 'TELEFONE',
                valor: '(11) 1234-5678',
                principal: true
            }
        ]
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seed do banco de dados...');

        // Limpar banco de dados existente
        const db = DatabaseService.getConnection();
        console.log('🗑️  Limpando dados antigos...');
        db.prepare('DELETE FROM partners').run();
        db.prepare('DELETE FROM contacts').run();
        db.prepare('DELETE FROM companies').run();

        // Inserir dados de exemplo
        let companyId = '';
        for (const data of seedData) {
            const company = await CompanyRepository.create(data);
            companyId = company.id;
            console.log(`✅ Empresa "${data.nomeFantasia}" criada com sucesso!`);
        }

        // Criar funcionário admin para teste
        console.log('\n👤 Criando funcionário administrador de teste...');
        
        const employeeRepository = new EmployeeRepository(db);
        
        // Verifica se já existe admin
        const existingAdmin = employeeRepository.findByAccessKey('ADMIN-2024');
        
        if (existingAdmin) {
            console.log('⚠️  Funcionário admin já existe!');
            console.log('\n📋 CREDENCIAIS DE ACESSO:\n');
            console.log('   Chave de Acesso: ADMIN-2024');
            console.log('   Senha: admin123');
            console.log('   Email:', existingAdmin.email);
            console.log('\n🌐 Acesse: http://localhost:5500/HumanManagement/login.html\n');
        } else {
            const adminData: ICreateEmployee = {
                companyId: companyId,
                fullName: 'Administrador Sistema',
                email: 'admin@ascenda.com.br',
                phone: '11999999999',
                birthDate: '1990-01-01',
                gender: 'male',
                documents: {
                    cpf: '12345678901',
                    rg: '123456789'
                },
                address: {
                    street: 'Rua Principal',
                    number: '123',
                    neighborhood: 'Centro',
                    city: 'São Paulo',
                    state: 'SP',
                    zipCode: '01000000',
                    country: 'Brasil'
                },
                role: EmployeeRole.ADMIN,
                jobTitle: 'Administrador do Sistema',
                contractType: ContractType.CLT,
                hireDate: '2024-01-01',
                status: EmployeeStatus.ACTIVE,
                salary: 15000,
                paymentDay: 5,
                hasBenefits: true,
                accessKey: 'ADMIN-2024',
                password: 'admin123',
                accessLevel: AccessLevel.FULL,
                workSchedule: {
                    startTime: '09:00',
                    endTime: '18:00',
                    workDays: [1, 2, 3, 4, 5],
                    lunchBreak: 60
                }
            };

            const admin = await employeeRepository.create(adminData, 'system', 'Sistema');

            console.log('✅ Funcionário admin criado!\n');
            console.log('════════════════════════════════════════════════');
            console.log('📋 CREDENCIAIS DE ACESSO');
            console.log('════════════════════════════════════════════════\n');
            console.log('   Nome:', admin.fullName);
            console.log('   Email:', admin.email);
            console.log('   Chave de Acesso: ADMIN-2024');
            console.log('   Senha: admin123');
            console.log('   Cargo: Administrador\n');
            console.log('════════════════════════════════════════════════\n');
            console.log('🌐 Acesse: http://localhost:5500/HumanManagement/login.html\n');
        }

        console.log('🎉 Seed concluído com sucesso!');
        DatabaseService.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        DatabaseService.close();
        process.exit(1);
    }
}

seedDatabase();
