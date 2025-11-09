import { login } from './services/authService.js'

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form')
  const errorMessage = document.getElementById('error-message')
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    
    try {
      await login(email, password)
      window.location.href = '/pages/dashboard.html'
    } catch (error) {
      errorMessage.textContent = error.message
    }
  })
})
