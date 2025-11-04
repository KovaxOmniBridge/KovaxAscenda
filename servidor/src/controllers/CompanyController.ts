import { Request, Response } from 'express';
import { CompanyService } from '../services/CompanyService';

export class CompanyController {
  private companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  async listAll(req: Request, res: Response): Promise<void> {
    try {
      const companies = await this.companyService.listAll();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar empresas' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const company = await this.companyService.getById(id);
      
      if (!company) {
        res.status(404).json({ error: 'Empresa não encontrada' });
        return;
      }
      
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
  }

  async getByCnpj(req: Request, res: Response): Promise<void> {
    try {
      const { cnpj } = req.params;
      const company = await this.companyService.getByCnpj(cnpj);
      
      if (!company) {
        res.status(404).json({ error: 'Empresa não encontrada' });
        return;
      }
      
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const companyData = req.body;
      
      // Validar CNPJ
      if (!this.companyService.validateCnpj(companyData.cnpj)) {
        res.status(400).json({ error: 'CNPJ inválido' });
        return;
      }

      const company = await this.companyService.create(companyData);
      res.status(201).json(company);
    } catch (error: any) {
      if (error.message === 'CNPJ já cadastrado') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao criar empresa' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyData = req.body;

      const company = await this.companyService.update(id, companyData);
      res.json(company);
    } catch (error: any) {
      if (error.message === 'Empresa não encontrada') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.companyService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Empresa não encontrada') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao deletar empresa' });
      }
    }
  }
}
