/**
 * API Client para HumanManagement
 */

const API_BASE_URL = 'http://localhost:3001/api';

const api = {
    /**
     * Faz requisição GET
     */
    get: async function(endpoint, options = {}) {
        return this.request('GET', endpoint, null, options);
    },

    /**
     * Faz requisição POST
     */
    post: async function(endpoint, data, options = {}) {
        return this.request('POST', endpoint, data, options);
    },

    /**
     * Faz requisição PUT
     */
    put: async function(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, data, options);
    },

    /**
     * Faz requisição DELETE
     */
    delete: async function(endpoint, options = {}) {
        return this.request('DELETE', endpoint, null, options);
    },

    /**
     * Requisição genérica
     */
    request: async function(method, endpoint, data = null, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        // Adiciona token se disponível
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Adiciona body se houver dados
        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            
            // Verifica se é 401 (não autorizado)
            if (response.status === 401) {
                // Token expirado ou inválido
                localStorage.removeItem('authToken');
                localStorage.removeItem('session');
                localStorage.removeItem('employee');
                
                // Se não estiver na página de login, redireciona
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
                
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || `Erro HTTP ${response.status}`);
            }

            return responseData;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    },

    /**
     * Verifica se está autenticado
     */
    isAuthenticated: function() {
        const token = localStorage.getItem('authToken');
        const session = localStorage.getItem('session');
        return !!(token && session);
    },

    /**
     * Faz logout
     */
    logout: async function() {
        try {
            await this.post('/auth/logout');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('session');
            localStorage.removeItem('employee');
            window.location.href = 'login.html';
        }
    },

    /**
     * Obtém dados do usuário logado
     */
    getMe: async function() {
        return this.get('/auth/me');
    },

    /**
     * Renova token
     */
    refreshToken: async function() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await this.post('/auth/refresh', { token });
        
        if (response.session) {
            localStorage.setItem('authToken', response.session.token);
            localStorage.setItem('session', JSON.stringify(response.session));
        }

        return response;
    }
};

// Exporta para uso global
window.api = api;
