const API_BASE_URL = 'http://localhost:3001/api';

// ============================================
// COMPANIES API
// ============================================

async function getCompanies() {
    try {
        const response = await fetch(`${API_BASE_URL}/companies`);
        if (!response.ok) throw new Error('Erro ao buscar empresas');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function getCompanyById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar empresa');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// ============================================
// PRODUCTS API
// ============================================

async function getProductsByCompany(companyId) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/products`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function getProductById(companyId, productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/products/${productId}`);
        if (!response.ok) throw new Error('Erro ao buscar produto');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function createProduct(companyId, productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao criar produto');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function updateProduct(companyId, productId, productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao atualizar produto');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function deleteProduct(companyId, productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao excluir produto');
        }
        
        return true;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// ============================================
// SERVICES API
// ============================================

async function getServicesByCompany(companyId) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/services`);
        if (!response.ok) throw new Error('Erro ao buscar serviços');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function getServiceById(companyId, serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/services/${serviceId}`);
        if (!response.ok) throw new Error('Erro ao buscar serviço');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function createService(companyId, serviceData) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao criar serviço');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function updateService(companyId, serviceId, serviceData) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/services/${serviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao atualizar serviço');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function deleteService(companyId, serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/services/${serviceId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao excluir serviço');
        }
        
        return true;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}
