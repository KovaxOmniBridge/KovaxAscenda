import { ICompany, CompanySize, TaxRegime, CompanyStatus, ContactType } from '../interfaces';
import { ICompanyRepository } from './ICompanyRepository';

// Dados mockados para teste inicial
const mockCompanies: ICompany[] = [
  {
    id: '1',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tech Solutions Ltda',
    nomeFantasia: 'TechSol',
    inscricaoEstadual: '123456789',
    dataAbertura: new Date('2020-01-15'),
    porte: CompanySize.ME,
    naturezaJuridica: 'Sociedade Empresária Limitada',
    regimeTributario: TaxRegime.SIMPLES_NACIONAL,
    situacaoCadastral: CompanyStatus.ATIVA,
    endereco: {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      complemento: 'Sala 501',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      pais: 'Brasil'
    },
    contatos: [
      {
        tipo: ContactType.EMAIL,
        valor: 'contato@techsol.com.br',
        principal: true
      },
      {
        tipo: ContactType.TELEFONE,
        valor: '(11) 3000-1000',
        principal: false
      }
    ],
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '2',
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'Comércio Brasileiro S.A.',
    nomeFantasia: 'Comércio BR',
    inscricaoEstadual: '987654321',
    dataAbertura: new Date('2018-05-20'),
    porte: CompanySize.EPP,
    naturezaJuridica: 'Sociedade Anônima',
    regimeTributario: TaxRegime.LUCRO_PRESUMIDO,
    situacaoCadastral: CompanyStatus.ATIVA,
    endereco: {
      cep: '20040-020',
      logradouro: 'Avenida Rio Branco',
      numero: '156',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      pais: 'Brasil'
    },
    contatos: [
      {
        tipo: ContactType.EMAIL,
        valor: 'contato@comerciobr.com.br',
        principal: true
      },
      {
        tipo: ContactType.WHATSAPP,
        valor: '(21) 98000-2000',
        principal: false
      }
    ],
    createdAt: new Date('2018-05-20'),
    updatedAt: new Date('2024-10-15')
  },
  {
    id: '3',
    cnpj: '11.222.333/0001-44',
    razaoSocial: 'Indústria Nacional Ltda',
    nomeFantasia: 'IndNacional',
    inscricaoEstadual: '112233445',
    dataAbertura: new Date('2015-03-10'),
    porte: CompanySize.MEDIO_PORTE,
    naturezaJuridica: 'Sociedade Empresária Limitada',
    regimeTributario: TaxRegime.LUCRO_REAL,
    situacaoCadastral: CompanyStatus.ATIVA,
    endereco: {
      cep: '30130-000',
      logradouro: 'Avenida Afonso Pena',
      numero: '3000',
      complemento: 'Galpão 2',
      bairro: 'Centro',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      pais: 'Brasil'
    },
    contatos: [
      {
        tipo: ContactType.EMAIL,
        valor: 'contato@indnacional.com.br',
        principal: true
      },
      {
        tipo: ContactType.TELEFONE,
        valor: '(31) 3200-3000',
        principal: false
      }
    ],
    createdAt: new Date('2015-03-10'),
    updatedAt: new Date('2024-11-04')
  }
];

export class CompanyRepository implements ICompanyRepository {
  private companies: ICompany[] = [...mockCompanies];

  async findAll(): Promise<ICompany[]> {
    return Promise.resolve([...this.companies]);
  }

  async findById(id: string): Promise<ICompany | null> {
    const company = this.companies.find(c => c.id === id);
    return Promise.resolve(company || null);
  }

  async findByCnpj(cnpj: string): Promise<ICompany | null> {
    const company = this.companies.find(c => c.cnpj === cnpj);
    return Promise.resolve(company || null);
  }

  async save(company: ICompany): Promise<ICompany> {
    const newCompany = {
      ...company,
      id: String(this.companies.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.companies.push(newCompany);
    return Promise.resolve(newCompany);
  }

  async update(id: string, companyData: Partial<ICompany>): Promise<ICompany> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Empresa não encontrada');
    }

    this.companies[index] = {
      ...this.companies[index],
      ...companyData,
      id,
      updatedAt: new Date()
    };

    return Promise.resolve(this.companies[index]);
  }

  async delete(id: string): Promise<void> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Empresa não encontrada');
    }
    this.companies.splice(index, 1);
    return Promise.resolve();
  }
}
