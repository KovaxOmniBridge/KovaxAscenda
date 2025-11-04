import DatabaseService from '../database/DatabaseService';
import CompanyRepository from '../repositories/CompanyRepository';
import { ICompany } from '../interfaces';

const seedData: Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'Tech Solutions Ltda',
        nomeFantasia: 'TechSol',
        porte: 'ME',
        regimeTributario: 'SIMPLES_NACIONAL',
        situacaoCadastral: 'ATIVA',
        dataAbertura: new Date('2020-01-15'),
        endereco: {
            cep: '01310-100',
            logradouro: 'Avenida Paulista',
            numero: '1000',
            complemento: 'Sala 101',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP',
            pais: 'Brasil'
        },
        contatos: [
            {
                tipo: 'EMAIL',
                valor: 'contato@techsol.com.br',
                principal: true
            },
            {
                tipo: 'TELEFONE',
                valor: '(11) 3000-0000',
                principal: true
            }
        ]
    },
    {
        cnpj: '98.765.432/0001-10',
        razaoSocial: 'Comércio Digital S.A.',
        nomeFantasia: 'DigiShop',
        porte: 'EPP',
        regimeTributario: 'LUCRO_PRESUMIDO',
        situacaoCadastral: 'ATIVA',
        dataAbertura: new Date('2019-06-20'),
        endereco: {
            cep: '22041-001',
            logradouro: 'Avenida Atlântica',
            numero: '2000',
            bairro: 'Copacabana',
            cidade: 'Rio de Janeiro',
            estado: 'RJ',
            pais: 'Brasil'
        },
        contatos: [
            {
                tipo: 'EMAIL',
                valor: 'contato@digishop.com.br',
                principal: true
            }
        ]
    },
    {
        cnpj: '11.222.333/0001-44',
        razaoSocial: 'Consultoria Empresarial ME',
        nomeFantasia: 'ConsultaBiz',
        porte: 'ME',
        regimeTributario: 'SIMPLES_NACIONAL',
        situacaoCadastral: 'ATIVA',
        dataAbertura: new Date('2021-03-10'),
        endereco: {
            cep: '30130-010',
            logradouro: 'Avenida Afonso Pena',
            numero: '1500',
            complemento: 'Conjunto 202',
            bairro: 'Centro',
            cidade: 'Belo Horizonte',
            estado: 'MG',
            pais: 'Brasil'
        }
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seed do banco de dados...');

        // Verificar se já existem dados
        const companies = await CompanyRepository.findAll();
        if (companies.length > 0) {
            console.log('⚠️  Banco já contém dados. Seed cancelado.');
            return;
        }

        // Inserir dados de exemplo
        for (const data of seedData) {
            await CompanyRepository.create(data);
            console.log(`✅ Empresa "${data.nomeFantasia}" criada com sucesso!`);
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
