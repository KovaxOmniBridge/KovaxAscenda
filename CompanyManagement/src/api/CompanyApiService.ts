import { ICompany } from '../interfaces';

const API_URL = 'http://localhost:3001/api/companies';

export class CompanyApiService {
  async listAll(): Promise<ICompany[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erro ao buscar empresas');
    }
    return response.json();
  }

  async getById(id: string): Promise<ICompany> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Empresa não encontrada');
    }
    return response.json();
  }

  async getByCnpj(cnpj: string): Promise<ICompany> {
    const response = await fetch(`${API_URL}/cnpj/${cnpj}`);
    if (!response.ok) {
      throw new Error('Empresa não encontrada');
    }
    return response.json();
  }

  async create(company: Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICompany> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(company),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar empresa');
    }
    
    return response.json();
  }

  async update(id: string, company: Partial<ICompany>): Promise<ICompany> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(company),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar empresa');
    }
    
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar empresa');
    }
  }
}
