const API_URL = 'http://localhost:3000';

export function isDeveloperAuthenticated() {
  const token = localStorage.getItem('dev_token');
  const user = localStorage.getItem('dev_user');
  return !!(token && user);
}

export function getCurrentDeveloper() {
  try {
    const userStr = localStorage.getItem('dev_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
}

export function logoutDeveloper() {
  localStorage.removeItem('dev_token');
  localStorage.removeItem('dev_user');
  window.location.href = 'login.html';
}

if (window.location.pathname.includes('login.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    if (isDeveloperAuthenticated()) {
      window.location.href = 'dashboard.html';
      return;
    }

    const form = document.getElementById('dev-login-form');
    if (form) form.addEventListener('submit', handleLogin);
  });
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('dev-email').value;
  const password = document.getElementById('dev-password').value;
  const errorDiv = document.getElementById('dev-login-error');

  if (errorDiv) errorDiv.classList.add('d-none');

  try {
    const response = await fetch(API_URL + '/api/auth/login/developer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    localStorage.setItem('dev_token', data.token);
    localStorage.setItem('dev_user', JSON.stringify(data.user));
    window.location.href = 'dashboard.html';

  } catch (error) {
    if (errorDiv) {
      errorDiv.textContent = error.message;
      errorDiv.classList.remove('d-none');
    }
  }
}
