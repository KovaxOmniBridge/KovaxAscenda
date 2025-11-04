import DatabaseService from '../database/DatabaseService';
import CompanyRepository from '../repositories/CompanyRepository';
import { ICompany } from '../interfaces';

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
