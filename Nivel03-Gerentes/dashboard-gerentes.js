const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let currentUser = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadCompanyData();
    loadSquads();
    simulateKPIs();
});

// Carregar dados do usuário
async function loadUserData() {
    const companyId = localStorage.getItem('companyId');
    const userId = localStorage.getItem('userId');
    const devToken = localStorage.getItem('devToken');
    
    // Se tem devToken, está em modo desenvolvedor (God Mode)
    if (devToken) {
        document.getElementById('userName').textContent = 'Desenvolvedor (God Mode)';
        return; // Permite acesso total
    }
    
    if (!companyId || !userId) {
        alert('❌ Sessão inválida. Redirecionando para login...');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('userName').textContent = currentUser.name;
            
            // Verificar se é nível 0 (Presidente)
            if (currentUser.hierarchical_level !== 0) {
                alert('❌ Acesso negado. Apenas Presidentes podem acessar este painel.');
                window.location.href = '/index.html';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
    }
}

// Carregar dados da empresa
async function loadCompanyData() {
    const companyId = localStorage.getItem('companyId');
    
    if (!companyId) {
        document.getElementById('companyName').textContent = 'Empresa não definida';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/companies/${companyId}`);
        if (response.ok) {
            currentCompany = await response.json();
            document.getElementById('companyName').textContent = currentCompany.name;
        }
    } catch (error) {
        console.error('Erro ao carregar empresa:', error);
    }
}

// Carregar squads estratégicos
async function loadSquads() {
    const companyId = localStorage.getItem('companyId');
    const container = document.getElementById('squadsContainer');
    
    try {
        const response = await fetch(`${API_BASE}/squads/company/${companyId}`);
        if (response.ok) {
            const squads = await response.json();
            
            if (squads.length === 0) {
                container.innerHTML = '<p class="loading">Nenhum squad cadastrado</p>';
                return;
            }
            
            container.innerHTML = '';
            squads.slice(0, 6).forEach(squad => {
                const card = document.createElement('div');
                card.className = 'squad-mini-card';
                card.innerHTML = `
                    <h4>${squad.name}</h4>
                    <p>${squad.member_count || 0} membros</p>
                `;
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar squads:', error);
        container.innerHTML = '<p class="loading">Erro ao carregar squads</p>';
    }
}

// Simular KPIs (dados demo)
function simulateKPIs() {
    // Receita
    const revenue = Math.floor(Math.random() * 50000000) + 10000000;
    document.getElementById('revenue').textContent = 
        'R$ ' + revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    
    // EBITDA
    const ebitda = (Math.random() * 30 + 10).toFixed(1);
    document.getElementById('ebitda').textContent = ebitda + '%';
    
    // Colaboradores
    const companyId = localStorage.getItem('companyId');
    fetch(`${API_BASE}/users/company/${companyId}`)
        .then(res => res.json())
        .then(users => {
            document.getElementById('totalEmployees').textContent = users.length;
        })
        .catch(() => {
            document.getElementById('totalEmployees').textContent = '0';
        });
    
    // NPS
    const nps = Math.floor(Math.random() * 40) + 60;
    document.getElementById('nps').textContent = nps;
}

// Navegação
function navigateTo(path) {
    window.location.href = `http://localhost:3000/${path}`;
}

// Logout
function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.clear();
        window.location.href = '/index.html';
    }
}
