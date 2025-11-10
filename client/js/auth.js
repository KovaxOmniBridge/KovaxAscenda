/* ============================================
   CLIENT AUTHENTICATION - LOGIN & SESSION
   ============================================ */

const API_URL = 'http://localhost:3000/api';

// Check if user is already logged in
function checkExistingSession() {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Verify token is still valid
    fetch(`${API_URL}/user/my-tools`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        // Token is valid, redirect to dashboard
        window.location.href = '../pages/dashboard.html';
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
      }
    })
    .catch(error => {
      console.error('Session check error:', error);
    });
  }
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();

  const loginBtn = document.getElementById('login-btn');
  const errorMessage = document.getElementById('error-message');
  
  // Get form data
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  // Clear previous errors
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';

  // Validate inputs
  if (!email || !password) {
    showError('Por favor, preencha todos os campos.');
    return;
  }

  // Disable button and show loading state
  loginBtn.disabled = true;
  loginBtn.textContent = 'Entrando...';

  try {
    const response = await fetch(`${API_URL}/auth/login/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store token
      localStorage.setItem('token', data.data.token);
      
      // Store user info
      localStorage.setItem('user', JSON.stringify({
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        position: data.data.user.position_name,
        organization: data.data.user.organization_name
      }));

      // If remember me is checked, store email
      if (remember) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      // Success feedback
      loginBtn.textContent = '✓ Sucesso!';
      loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '../pages/dashboard.html';
      }, 500);

    } else {
      // Show error message from server
      showError(data.message || 'Email ou senha incorretos.');
      resetButton();
    }

  } catch (error) {
    console.error('Login error:', error);
    showError('Erro ao conectar com o servidor. Tente novamente.');
    resetButton();
  }
}

// Show error message
function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

// Reset login button
function resetButton() {
  const loginBtn = document.getElementById('login-btn');
  loginBtn.disabled = false;
  loginBtn.textContent = 'Entrar';
  loginBtn.style.background = '';
}

// Pre-fill email if remembered
function loadRememberedEmail() {
  const rememberedEmail = localStorage.getItem('remembered_email');
  
  if (rememberedEmail) {
    const emailInput = document.getElementById('email');
    const rememberCheckbox = document.getElementById('remember');
    
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
  }
}

// Handle Enter key in form inputs
function setupKeyboardShortcuts() {
  const form = document.getElementById('login-form');
  
  if (form) {
    form.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleLogin(event);
      }
    });
  }
}


// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  checkExistingSession();
  
  // Load remembered email
  loadRememberedEmail();
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Attach form submit handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Focus on email input
  setTimeout(() => {
    const emailInput = document.getElementById('email');
    if (emailInput) {
      if (!emailInput.value) {
        emailInput.focus();
      } else {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
          passwordInput.focus();
        }
      }
    }
  }, 100);
});

// Handle visibility change (detect when user returns to tab)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    checkExistingSession();
  }
});

/**
 * Logout user
 */
export function logout() {
  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to login page
  window.location.href = '../../index.html';
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
