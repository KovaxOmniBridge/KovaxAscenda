import { API_BASE_URL } from '../utils/constants.js'

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  if (!response.ok) {
    throw new Error('Credenciais inválidas')
  }
  
  const data = await response.json()
  
  // Armazena token e usuário
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  
  return data
}

export async function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/index.html'
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}
