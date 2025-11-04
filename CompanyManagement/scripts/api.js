// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';

// Funções de API
const API = {
    // Listar todas as empresas
    async getCompanies() {
        try {
            const response = await fetch(`${API_BASE_URL}/companies`);
            if (!response.ok) throw new Error('Erro ao buscar empresas');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    // Buscar empresa por ID
    async getCompanyById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${id}`);
            if (!response.ok) throw new Error('Erro ao buscar empresa');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    // Criar nova empresa
    async createCompany(companyData) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData)
            });
            if (!response.ok) throw new Error('Erro ao criar empresa');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    // Atualizar empresa
    async updateCompany(id, companyData) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData)
            });
            if (!response.ok) throw new Error('Erro ao atualizar empresa');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    // Deletar empresa
    async deleteCompany(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao deletar empresa');
            return true;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
};
