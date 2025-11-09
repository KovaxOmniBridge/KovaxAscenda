/**
 * =====================================================
 * DEV AUTH - Autenticação de Desenvolvedores
 * =====================================================
 */

const API_URL = 'http://localhost:3000';

/**
 * Inicialização
 */
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se já está autenticado como desenvolvedor
  if (isDeveloperAuthenticated()) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Configurar form de login
  const loginForm = document.getElementById('dev-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleDevLogin);
  }
});

/**
 * Handle developer login
 */
async function handleDevLogin(e) {
  e.preventDefault();

  const email = document.getElementById('dev-email').value;
  const password = document.getElementById('dev-password').value;
  const errorDiv = document.getElementById('dev-login-error');

  // Limpar erro anterior
  errorDiv.classList.add('d-none');

  try {
    const response = await fetch(`${API_URL}/api/auth/login/developer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    // Salvar token e dados do desenvolvedor
    localStorage.setItem('dev-token', data.token);
    localStorage.setItem('dev-user', JSON.stringify(data.user));
    localStorage.setItem('user-type', 'developer');

    // Log de segurança
    console.log('✅ Login de desenvolvedor bem-sucedido');
    console.log('🔐 Tipo de usuário:', data.user.role);

    // Redirecionar para dashboard
    window.location.href = 'dashboard.html';

  } catch (error) {
    console.error('❌ Erro no login:', error);
    errorDiv.textContent = error.message || 'Credenciais inválidas ou acesso não autorizado';
    errorDiv.classList.remove('d-none');
  }
}

/**
 * Verificar se desenvolvedor está autenticado
 */
function isDeveloperAuthenticated() {
  const token = localStorage.getItem('dev-token');
  const userType = localStorage.getItem('user-type');
  
  return token && userType === 'developer';
}

/**
 * Obter desenvolvedor atual
 */
export function getCurrentDeveloper() {
  const userStr = localStorage.getItem('dev-user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Obter token do desenvolvedor
 */
export function getDevToken() {
  return localStorage.getItem('dev-token');
}

/**
 * Logout de desenvolvedor
 */
export function logoutDeveloper() {
  localStorage.removeItem('dev-token');
  localStorage.removeItem('dev-user');
  localStorage.removeItem('user-type');
  
  window.location.href = 'login.html';
}

/**
 * API Request com autenticação de desenvolvedor
 */
export async function devApiRequest(endpoint, options = {}) {
  const token = getDevToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      logoutDeveloper();
      throw new Error('Sessão expirada');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('DEV API Request error:', error);
    throw error;
  }
}
