// Cadastro de Empresa - Ascenda
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('empresa-form');
  if (form) {
    form.addEventListener('submit', handleCadastroEmpresa);
  }
});

async function handleCadastroEmpresa(event) {
  event.preventDefault();
  const btn = document.getElementById('empresa-btn');
  const errorDiv = document.getElementById('empresa-error');
  const successDiv = document.getElementById('empresa-success');

  // Dados do formulário
  const nome = document.getElementById('nome').value.trim();
  const slug = document.getElementById('slug').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const logo = document.getElementById('logo').value.trim();

  // Limpa mensagens
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';
  successDiv.style.display = 'none';
  successDiv.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Cadastrando...';

  try {
    const response = await fetch(`${API_URL}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nome,
        slug: slug,
        description: descricao,
        logo_url: logo
      })
    });
    const data = await response.json();
    if (response.ok && data.success) {
      successDiv.textContent = 'Empresa cadastrada com sucesso!';
      successDiv.style.display = 'block';
      btn.textContent = '✓ Cadastrado';
      setTimeout(() => {
        window.location.href = '../../index.html';
      }, 1200);
    } else {
      throw new Error(data.message || 'Erro ao cadastrar empresa');
    }
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Cadastrar Empresa';
  }
}
