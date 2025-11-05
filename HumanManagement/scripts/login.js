/**
 * Script de login do portal HumanManagement
 */

const form = document.getElementById('loginForm');
const accessKeyInput = document.getElementById('accessKey');
const roleSelect = document.getElementById('role');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const togglePasswordBtn = document.getElementById('togglePassword');

// Toggle mostrar/ocultar senha
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Verifica se já está logado
window.addEventListener('DOMContentLoaded', () => {
    const session = getSession();
    if (session) {
        // Já está logado, redireciona para dashboard
        redirectToDashboard(session.role);
    }

    // Preenche dados salvos (remember me)
    const rememberedKey = localStorage.getItem('rememberedAccessKey');
    if (rememberedKey) {
        accessKeyInput.value = rememberedKey;
        document.getElementById('rememberMe').checked = true;
    }
});

// Submissão do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const accessKey = accessKeyInput.value.trim();
    const role = roleSelect.value || undefined;
    const password = passwordInput.value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!accessKey || !password) {
        showError('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    try {
        hideError();
        setLoading(true);

        const response = await api.post('/auth/login', {
            accessKey,
            password,
            role
        });

        if (response.session && response.employee) {
            // Salva sessão
            saveSession(response.session, response.employee);

            // Remember me
            if (rememberMe) {
                localStorage.setItem('rememberedAccessKey', accessKey);
            } else {
                localStorage.removeItem('rememberedAccessKey');
            }

            // Redireciona para dashboard
            redirectToDashboard(response.employee.role);
        } else {
            showError('Erro ao processar login');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        
        if (error.message.includes('401')) {
            showError('Chave de acesso ou senha incorretos');
        } else if (error.message.includes('cargo')) {
            showError('Cargo selecionado não corresponde ao seu perfil');
        } else {
            showError('Erro ao fazer login. Tente novamente.');
        }
    } finally {
        setLoading(false);
    }
});

/**
 * Salva sessão no localStorage
 */
function saveSession(session, employee) {
    localStorage.setItem('authToken', session.token);
    localStorage.setItem('session', JSON.stringify(session));
    localStorage.setItem('employee', JSON.stringify(employee));
}

/**
 * Recupera sessão do localStorage
 */
function getSession() {
    const token = localStorage.getItem('authToken');
    const sessionStr = localStorage.getItem('session');
    
    if (!token || !sessionStr) {
        return null;
    }

    try {
        const session = JSON.parse(sessionStr);
        
        // Verifica se token expirou
        const expiresAt = new Date(session.expiresAt);
        if (expiresAt < new Date()) {
            clearSession();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Erro ao ler sessão:', error);
        clearSession();
        return null;
    }
}

/**
 * Limpa sessão
 */
function clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('session');
    localStorage.removeItem('employee');
}

/**
 * Redireciona para dashboard apropriado
 */
function redirectToDashboard(role) {
    const dashboardMap = {
        'ADMIN': 'admin-dashboard.html',
        'MANAGER': 'manager-dashboard.html',
        'SUPERVISOR': 'manager-dashboard.html',
        'HR': 'hr-dashboard.html',
        'ACCOUNTANT': 'accountant-dashboard.html',
        'SALES': 'employee-dashboard.html',
        'STOCK_KEEPER': 'employee-dashboard.html',
        'CASHIER': 'employee-dashboard.html',
        'ATTENDANT': 'employee-dashboard.html',
        'SECURITY': 'employee-dashboard.html',
        'CLEANER': 'employee-dashboard.html',
        'MAINTENANCE': 'employee-dashboard.html',
        'DRIVER': 'employee-dashboard.html',
        'ASSISTANT': 'employee-dashboard.html',
        'INTERN': 'employee-dashboard.html'
    };

    const dashboard = dashboardMap[role] || 'employee-dashboard.html';
    
    // Animação de saída
    document.querySelector('.login-card').style.animation = 'slideDown 0.5s ease-in';
    
    setTimeout(() => {
        window.location.href = dashboard;
    }, 500);
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
}

/**
 * Esconde mensagem de erro
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * Define estado de carregamento
 */
function setLoading(loading) {
    btnLogin.disabled = loading;
    if (loading) {
        btnLogin.classList.add('loading');
    } else {
        btnLogin.classList.remove('loading');
    }
}

// Animação de saída
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        to {
            opacity: 0;
            transform: translateY(30px);
        }
    }
`;
document.head.appendChild(style);
