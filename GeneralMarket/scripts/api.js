// ============================================
// API CONFIGURATION
// ============================================

const API_URL = 'http://localhost:3001/api';

// ============================================
// COMPANIES API
// ============================================

async function getAllCompanies() {
    try {
        const response = await fetch(`${API_URL}/companies`);
        if (!response.ok) throw new Error('Erro ao buscar empresas');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
    }
}

async function getCompanyById(id) {
    try {
        const response = await fetch(`${API_URL}/companies/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar empresa');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        throw error;
    }
}

// ============================================
// PRODUCTS API
// ============================================

async function getAllProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
}

async function getProductsByCompany(companyId) {
    try {
        const response = await fetch(`${API_URL}/products?companyId=${companyId}`);
        if (!response.ok) throw new Error('Erro ao buscar produtos da empresa');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar produtos da empresa:', error);
        throw error;
    }
}

// ============================================
// SERVICES API
// ============================================

async function getAllServices() {
    try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) throw new Error('Erro ao buscar serviços');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        throw error;
    }
}

async function getServicesByCompany(companyId) {
    try {
        const response = await fetch(`${API_URL}/services?companyId=${companyId}`);
        if (!response.ok) throw new Error('Erro ao buscar serviços da empresa');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar serviços da empresa:', error);
        throw error;
    }
}
