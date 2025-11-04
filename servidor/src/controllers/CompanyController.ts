import { Request, Response } from 'express';
import CompanyService from '../services/CompanyService';

class CompanyController {
    // GET /api/companies - Listar todas as empresas
    async index(req: Request, res: Response): Promise<Response> {
        try {
            const companies = await CompanyService.getAllCompanies();
            return res.json(companies);
        } catch (error) {
            console.error('Erro ao listar empresas:', error);
            return res.status(500).json({ error: 'Erro ao listar empresas' });
        }
    }

    // GET /api/companies/:id - Buscar empresa por ID
    async show(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const company = await CompanyService.getCompanyById(id);

            if (!company) {
                return res.status(404).json({ error: 'Empresa não encontrada' });
            }

            return res.json(company);
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            return res.status(500).json({ error: 'Erro ao buscar empresa' });
        }
    }

    // GET /api/companies/cnpj/:cnpj - Buscar empresa por CNPJ
    async showByCnpj(req: Request, res: Response): Promise<Response> {
        try {
            const { cnpj } = req.params;
            const company = await CompanyService.getCompanyByCnpj(cnpj);

            if (!company) {
                return res.status(404).json({ error: 'Empresa não encontrada' });
            }

            return res.json(company);
        } catch (error) {
            console.error('Erro ao buscar empresa por CNPJ:', error);
            return res.status(500).json({ error: 'Erro ao buscar empresa' });
        }
    }

    // POST /api/companies - Criar nova empresa
    async store(req: Request, res: Response): Promise<Response> {
        try {
            const companyData = req.body;

            // Validações básicas
            if (!companyData.cnpj || !companyData.razaoSocial || !companyData.nomeFantasia) {
                return res.status(400).json({ 
                    error: 'Campos obrigatórios: cnpj, razaoSocial, nomeFantasia' 
                });
            }

            const newCompany = await CompanyService.createCompany(companyData);
            return res.status(201).json(newCompany);
        } catch (error: any) {
            console.error('Erro ao criar empresa:', error);
            
            if (error.message === 'CNPJ já cadastrado') {
                return res.status(409).json({ error: error.message });
            }
            
            return res.status(500).json({ error: 'Erro ao criar empresa' });
        }
    }

    // PUT /api/companies/:id - Atualizar empresa
    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const companyData = req.body;

            const updatedCompany = await CompanyService.updateCompany(id, companyData);

            if (!updatedCompany) {
                return res.status(404).json({ error: 'Empresa não encontrada' });
            }

            return res.json(updatedCompany);
        } catch (error: any) {
            console.error('Erro ao atualizar empresa:', error);
            
            if (error.message === 'CNPJ já cadastrado para outra empresa') {
                return res.status(409).json({ error: error.message });
            }
            
            return res.status(500).json({ error: 'Erro ao atualizar empresa' });
        }
    }

    // DELETE /api/companies/:id - Deletar empresa
    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const deleted = await CompanyService.deleteCompany(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Empresa não encontrada' });
            }

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar empresa:', error);
            return res.status(500).json({ error: 'Erro ao deletar empresa' });
        }
    }
}

export default new CompanyController();
