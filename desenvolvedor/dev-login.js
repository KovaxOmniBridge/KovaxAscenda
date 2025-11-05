const API_BASE = 'http://localhost:3000/api';

// ==================== NAVEGAÇÃO ENTRE ABAS ====================

function showTab(tabName) {
    // Atualizar botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Atualizar painéis
    document.querySelectorAll('.form-panel').forEach(panel => panel.classList.remove('active'));
    if (tabName === 'login') {
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('registerForm').classList.add('active');
    }
}

// ==================== TOAST NOTIFICATIONS ====================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ==================== LOGIN ====================

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '🔄 Autenticando...';
    
    try {
        const response = await fetch(`${API_BASE}/dev/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Salvar token (API retorna devToken, não token)
            localStorage.setItem('devToken', data.devToken);
            localStorage.setItem('devUser', JSON.stringify(data.developer));
            
            console.log('✅ Login realizado com sucesso!', data);
            showToast('✅ Login realizado com sucesso!', 'success');
            
            // Redirecionar para o painel dev
            setTimeout(() => {
                window.location.href = 'dev-dashboard.html';
            }, 1000);
        } else {
            showToast(`❌ ${data.error || 'Erro ao fazer login'}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Acessar Painel Dev';
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('❌ Erro de conexão com o servidor', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Acessar Painel Dev';
    }
}

// ==================== CADASTRO ====================

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const role = document.getElementById('registerRole').value;
    
    // Validar senhas
    if (password !== passwordConfirm) {
        showToast('❌ As senhas não coincidem', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('❌ A senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '🔄 Criando conta...';
    
    try {
        const response = await fetch(`${API_BASE}/dev/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('✅ Conta criada com sucesso! Faça login.', 'success');
            
            // Limpar formulário
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerPasswordConfirm').value = '';
            document.getElementById('registerRole').value = '';
            
            // Mudar para aba de login
            setTimeout(() => {
                document.querySelector('.tab-btn').click();
                document.getElementById('loginEmail').value = email;
                document.getElementById('loginPassword').focus();
            }, 1500);
            
            submitBtn.disabled = false;
            submitBtn.textContent = '✨ Criar Conta Dev';
        } else {
            showToast(`❌ ${data.error || 'Erro ao criar conta'}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = '✨ Criar Conta Dev';
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('❌ Erro de conexão com o servidor', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '✨ Criar Conta Dev';
    }
}

// ==================== VERIFICAR AUTENTICAÇÃO ====================

function checkAuth() {
    const token = localStorage.getItem('devToken');
    
    if (token) {
        // Já está autenticado, redirecionar
        window.location.href = 'dev-dashboard.html';
    }
}

// Verificar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Exportar funções para uso global
window.showTab = showTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
