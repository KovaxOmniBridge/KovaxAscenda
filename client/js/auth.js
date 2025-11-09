/* ============================================
   AUTHENTICATION - LOGIN & SESSION
   ============================================ */

const API_URL = 'http://localhost:3000/api';

// Login Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Check if already logged in
  checkAuthStatus();
});

/**
 * Handle login form submission
 */
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError');
  const submitButton = event.target.querySelector('button[type="submit"]');

  // Clear previous errors
  loginError.classList.add('d-none');
  loginError.textContent = '';

  // Disable submit button
  submitButton.disabled = true;
  submitButton.textContent = 'Entrando...';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
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

    // Store authentication data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Show success message briefly
    showSuccessMessage('Login realizado com sucesso! Redirecionando...');

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'client/pages/dashboard.html';
    }, 1000);

  } catch (error) {
    console.error('Login error:', error);
    
    // Show error message
    loginError.textContent = error.message;
    loginError.classList.remove('d-none');

    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = 'Entrar na Plataforma';
  }
}

/**
 * Check if user is already authenticated
 */
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // If on login page and already authenticated, redirect to dashboard
  if (token && user && window.location.pathname.includes('index.html')) {
    window.location.href = 'client/pages/dashboard.html';
  }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
  const loginError = document.getElementById('loginError');
  loginError.textContent = message;
  loginError.classList.remove('alert-error');
  loginError.classList.add('alert-success');
  loginError.classList.remove('d-none');
}

/**
 * Logout user
 */
export function logout() {
  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to login page
  window.location.href = 'index.html';
}

/**
 * Get current user from storage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get authentication token
 */
export function getAuthToken() {
  return localStorage.getItem('token');
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;

  return user.permissions[permission] === true;
}

/**
 * Check if user can access a tool category
 */
export function canAccessCategory(categoryKey) {
  const user = getCurrentUser();
  if (!user || !user.permissions || !user.permissions.toolCategories) return false;

  return user.permissions.toolCategories.includes(categoryKey);
}

/**
 * Get user's accessible tool categories
 */
export function getAccessibleCategories() {
  const user = getCurrentUser();
  if (!user || !user.permissions || !user.permissions.toolCategories) return [];

  return user.permissions.toolCategories;
}

/**
 * API Request helper with authentication
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
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

    // Handle unauthorized
    if (response.status === 401) {
      logout();
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('API Request error:', error);
    throw error;
  }
}
