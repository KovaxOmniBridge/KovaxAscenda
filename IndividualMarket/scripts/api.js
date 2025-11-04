// ============================================
// API CONFIGURATION
// ============================================

const API_URL = 'http://localhost:3001/api';

// ============================================
// COMPANIES API
// ============================================

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

async function getCompanySettings(companyId) {
    try {
        const response = await fetch(`${API_URL}/companies/${companyId}/site`);
        if (response.status === 404) {
            // Company doesn't have a site configured yet, return null
            return null;
        }
        if (!response.ok) throw new Error('Erro ao buscar configurações');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        return null;
    }
}

async function getCompanyBySlug(slug) {
    try {
        const response = await fetch(`${API_URL}/sites/${slug}`);
        if (!response.ok) throw new Error('Erro ao buscar site');
        const siteConfig = await response.json();
        
        // Get company data
        const company = await getCompanyById(siteConfig.companyId);
        
        return { company, siteConfig };
    } catch (error) {
        console.error('Erro ao buscar site por slug:', error);
        throw error;
    }
}

// ============================================
// PRODUCTS API
// ============================================

async function getProductsByCompany(companyId) {
    try {
        const response = await fetch(`${API_URL}/products?companyId=${companyId}`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        const allProducts = await response.json();
        
        // Filter by companyId (in case backend doesn't filter)
        return allProducts.filter(p => p.companyId === companyId);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
}

// ============================================
// SERVICES API
// ============================================

async function getServicesByCompany(companyId) {
    try {
        const response = await fetch(`${API_URL}/services?companyId=${companyId}`);
        if (!response.ok) throw new Error('Erro ao buscar serviços');
        const allServices = await response.json();
        
        // Filter by companyId (in case backend doesn't filter)
        return allServices.filter(s => s.companyId === companyId);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        throw error;
    }
}
