import { ICompany } from '../interfaces';
import CompanyRepository from '../repositories/CompanyRepository';

class CompanyService {
    async getAllCompanies(): Promise<ICompany[]> {
        return await CompanyRepository.findAll();
    }

    async getCompanyById(id: string): Promise<ICompany | null> {
        return await CompanyRepository.findById(id);
    }

    async getCompanyByCnpj(cnpj: string): Promise<ICompany | null> {
        return await CompanyRepository.findByCnpj(cnpj);
    }

    async createCompany(companyData: Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICompany> {
        // Validar se CNPJ já existe
        const existingCompany = await CompanyRepository.findByCnpj(companyData.cnpj);
        if (existingCompany) {
            throw new Error('CNPJ já cadastrado');
        }

        return await CompanyRepository.create(companyData);
    }

    async updateCompany(id: string, companyData: Partial<ICompany>): Promise<ICompany | null> {
        // Verificar se a empresa existe
        const existingCompany = await CompanyRepository.findById(id);
        if (!existingCompany) {
            return null;
        }

        // Se estiver alterando o CNPJ, verificar se já não existe outro com o mesmo CNPJ
        if (companyData.cnpj && companyData.cnpj !== existingCompany.cnpj) {
            const companyWithSameCnpj = await CompanyRepository.findByCnpj(companyData.cnpj);
            if (companyWithSameCnpj) {
                throw new Error('CNPJ já cadastrado para outra empresa');
            }
        }

        return await CompanyRepository.update(id, companyData);
    }

    async deleteCompany(id: string): Promise<boolean> {
        return await CompanyRepository.delete(id);
    }
}

export default new CompanyService();
