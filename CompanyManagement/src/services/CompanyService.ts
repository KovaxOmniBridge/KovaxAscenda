import { ICompany } from '../interfaces';
import { ICompanyRepository } from '../repositories/ICompanyRepository';
import { CompanyRepository } from '../repositories/CompanyRepository';

export class CompanyService {
  private repository: ICompanyRepository;

  constructor(repository?: ICompanyRepository) {
    this.repository = repository || new CompanyRepository();
  }

  async listAll(): Promise<ICompany[]> {
    return await this.repository.findAll();
  }

  async getById(id: string): Promise<ICompany | null> {
    return await this.repository.findById(id);
  }

  async getByCnpj(cnpj: string): Promise<ICompany | null> {
    return await this.repository.findByCnpj(cnpj);
  }

  async create(company: ICompany): Promise<ICompany> {
    // Validar se CNPJ já existe
    const existing = await this.repository.findByCnpj(company.cnpj);
    if (existing) {
      throw new Error('CNPJ já cadastrado');
    }

    return await this.repository.save(company);
  }

  async update(id: string, companyData: Partial<ICompany>): Promise<ICompany> {
    return await this.repository.update(id, companyData);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  validateCnpj(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const numbers = cnpj.replace(/\D/g, '');

    // Verifica se tem 14 dígitos
    if (numbers.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numbers)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    let pos = 5;

    // Primeiro dígito verificador
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers.charAt(i)) * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (digit !== parseInt(numbers.charAt(12))) return false;

    // Segundo dígito verificador
    sum = 0;
    pos = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers.charAt(i)) * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return digit === parseInt(numbers.charAt(13));
  }

  formatCnpj(cnpj: string): string {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
