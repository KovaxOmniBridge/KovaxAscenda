const API_URL = 'http://localhost:3001/api';

const api = {
    // Assets
    async getAssets() {
        const response = await fetch(`${API_URL}/assets`);
        if (!response.ok) throw new Error('Erro ao buscar ativos');
        return response.json();
    },

    async getAssetsByCompany(companyId) {
        const response = await fetch(`${API_URL}/assets/company/${companyId}`);
        if (!response.ok) throw new Error('Erro ao buscar ativos da empresa');
        return response.json();
    },

    async getAssetById(id) {
        const response = await fetch(`${API_URL}/assets/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar ativo');
        return response.json();
    },

    async createAsset(data) {
        const response = await fetch(`${API_URL}/assets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar ativo');
        }
        return response.json();
    },

    async updateAsset(id, data) {
        const response = await fetch(`${API_URL}/assets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar ativo');
        }
        return response.json();
    },

    async deleteAsset(id) {
        const response = await fetch(`${API_URL}/assets/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao deletar ativo');
    },

    async getAssetStats(companyId) {
        const response = await fetch(`${API_URL}/assets/stats/${companyId}`);
        if (!response.ok) throw new Error('Erro ao buscar estatísticas');
        return response.json();
    },

    async addDocument(assetId, document) {
        const response = await fetch(`${API_URL}/assets/${assetId}/documents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(document)
        });
        if (!response.ok) throw new Error('Erro ao adicionar documento');
        return response.json();
    },

    async addPhoto(assetId, url) {
        const response = await fetch(`${API_URL}/assets/${assetId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        if (!response.ok) throw new Error('Erro ao adicionar foto');
        return response.json();
    },

    async addExpense(assetId, expense) {
        const response = await fetch(`${API_URL}/assets/${assetId}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        if (!response.ok) throw new Error('Erro ao adicionar despesa');
        return response.json();
    },

    // Companies
    async getCompanies() {
        const response = await fetch(`${API_URL}/companies`);
        if (!response.ok) throw new Error('Erro ao buscar empresas');
        return response.json();
    }
};
