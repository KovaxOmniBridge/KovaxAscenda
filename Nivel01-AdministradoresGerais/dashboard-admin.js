// Configuração da API
const API_URL = 'http://localhost:3000/api';

// Dados do usuário logado
let currentUser = null;
let currentCompany = null;
let allUsers = [];
let allCountries = [];

// Lista de países disponíveis
const countriesList = [
    "Brasil", "Estados Unidos", "Canadá", "México", "Argentina", "Chile", "Colômbia",
    "Peru", "Uruguai", "Venezuela", "Portugal", "Espanha", "Reino Unido", "França",
    "Alemanha", "Itália", "Holanda", "Bélgica", "Suíça", "Áustria", "Polônia",
    "República Tcheca", "Rússia", "China", "Japão", "Coreia do Sul", "Índia",
    "Austrália", "Nova Zelândia", "África do Sul", "Nigéria", "Egito", "Emirados Árabes"
];

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const devToken = localStorage.getItem('devToken');

    // Se tem devToken, está em modo desenvolvedor (God Mode)
    if (devToken) {
        currentUser = { name: 'Desenvolvedor (God Mode)', role: 'Administrador' };
        await loadDashboardData();
        populateCountrySelect();
        return;
    }

    if (!token || !user) {
        window.location.href = '../index.html';
        return;
    }

    currentUser = JSON.parse(user);
    await loadDashboardData();
    populateCountrySelect();
});

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        // Atualizar informações do header
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = currentUser.role;
        document.getElementById('companyName').textContent = currentUser.company.name;
        
        // Iniciais do avatar
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('userAvatar').textContent = initials;

        // Carregar dados da empresa
        await loadCompanyData();
        
        // Carregar usuários
        await loadUsers();
        
        // Carregar países
        await loadCountries();
        
        // Atualizar estatísticas
        updateStats();
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showMessage('Erro ao carregar dados do dashboard', 'error');
    }
}

// Carregar dados da empresa
async function loadCompanyData() {
    try {
        const response = await fetch(`${API_URL}/companies/${currentUser.company.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar empresa');

        currentCompany = await response.json();
        
        // Preencher formulário da empresa
        document.getElementById('companyNameField').value = currentCompany.name;
        document.getElementById('companyLegalNameField').value = currentCompany.legal_name;
        document.getElementById('companyFoundedYearField').value = currentCompany.founded_year;
        document.getElementById('companySizeField').value = currentCompany.size;
        document.getElementById('companyIndustryField').value = currentCompany.industry;
        document.getElementById('companyWebsiteField').value = currentCompany.website;
        document.getElementById('companyDescriptionField').value = currentCompany.description;

        // Preencher configurações do perfil
        document.getElementById('profileName').value = currentUser.name;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileDepartment').value = currentUser.department || '';

    } catch (error) {
        console.error('Erro ao carregar empresa:', error);
    }
}

// Carregar usuários
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users/company/${currentUser.company.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar usuários');

        allUsers = await response.json();
        renderUsers(allUsers);

    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        document.getElementById('usersTableBody').innerHTML = `
            <tr><td colspan="6" class="loading">Erro ao carregar usuários</td></tr>
        `;
    }
}

// Renderizar tabela de usuários
function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Nenhum usuário encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.department}</td>
            <td>
                <span class="status-badge ${user.is_primary ? 'primary' : 'active'}">
                    ${user.is_primary ? '👑 Principal' : '✓ Ativo'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editUser(${user.id})" title="Editar">✏️</button>
                    <button class="btn-icon danger" onclick="deleteUser(${user.id})" title="Excluir" 
                        ${user.is_primary ? 'disabled' : ''}>🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filtrar usuários
function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;

    const filtered = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm) ||
                            user.department.toLowerCase().includes(searchTerm);
        
        const matchesRole = !roleFilter || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    renderUsers(filtered);
}

// Event listener para busca
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }
});

// Carregar países
async function loadCountries() {
    try {
        const response = await fetch(`${API_URL}/countries/company/${currentUser.company.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar países');

        allCountries = await response.json();
        renderCountries();

    } catch (error) {
        console.error('Erro ao carregar países:', error);
    }
}

// Renderizar países
function renderCountries() {
    const grid = document.getElementById('countriesGrid');

    if (allCountries.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🌍</span>
                <p>Nenhum país cadastrado ainda.</p>
                <button class="btn-primary" onclick="openAddCountryModal()">Adicionar Primeiro País</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = allCountries.map(country => `
        <div class="country-card ${country.is_headquarters ? 'headquarters' : ''}">
            <h3>${country.country}</h3>
            <p><strong>Documento:</strong> ${country.tax_id}</p>
            <p><strong>Cidade:</strong> ${country.city}</p>
            <p><strong>Endereço:</strong> ${country.address}</p>
            <p><strong>Telefone:</strong> ${country.phone}</p>
            ${country.is_headquarters ? '<p><strong>⭐ Sede Principal</strong></p>' : ''}
            <div class="country-card-actions">
                <button class="btn-icon" onclick="editCountry(${country.id})" title="Editar">✏️</button>
                <button class="btn-icon danger" onclick="deleteCountry(${country.id})" title="Excluir">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('totalUsers').textContent = allUsers.length;
    document.getElementById('totalCountries').textContent = allCountries.length;
    document.getElementById('totalAdmins').textContent = allUsers.filter(u => u.role === 'Administrador Geral').length;
    
    if (currentCompany) {
        const age = new Date().getFullYear() - currentCompany.founded_year;
        document.getElementById('companyAge').textContent = age;
    }
}

// Navegação entre seções
function showSection(sectionName) {
    // Remover active de todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remover active de todos os nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Ativar seção selecionada
    document.getElementById(`section-${sectionName}`).classList.add('active');
    
    // Ativar nav item correspondente
    event.target.closest('.nav-item').classList.add('active');

    // Atualizar título
    const titles = {
        'overview': 'Visão Geral',
        'users': 'Gerenciamento de Usuários',
        'company': 'Informações da Empresa',
        'countries': 'Países de Atuação',
        'settings': 'Configurações'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName];
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Modal: Adicionar Usuário
function openAddUserModal() {
    document.getElementById('addUserModal').classList.add('active');
    document.getElementById('addUserForm').reset();
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.remove('active');
}

// Adicionar usuário
async function handleAddUser(event) {
    event.preventDefault();

    const name = document.getElementById('newUserName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const phone = document.getElementById('newUserPhone').value.trim();
    const department = document.getElementById('newUserDepartment').value.trim();
    const accessKey = document.getElementById('newUserAccessKey').value.trim();
    const role = document.getElementById('newUserRole').value;
    const password = document.getElementById('newUserPassword').value;
    const confirmPassword = document.getElementById('newUserConfirmPassword').value;
    const isPrimary = document.getElementById('newUserIsPrimary').checked;

    // Validações
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage('A senha deve ter pelo menos 8 caracteres', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                companyId: currentUser.company.id,
                name,
                email,
                phone,
                department,
                accessKey,
                role,
                password,
                isPrimary
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || 'Erro ao adicionar usuário', 'error');
            return;
        }

        showMessage('Usuário adicionado com sucesso!', 'success');
        closeAddUserModal();
        await loadUsers();
        updateStats();

    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        showMessage('Erro ao conectar com o servidor', 'error');
    }
}

// Modal: Adicionar País
function openAddCountryModal() {
    document.getElementById('addCountryModal').classList.add('active');
    document.getElementById('addCountryForm').reset();
}

function closeAddCountryModal() {
    document.getElementById('addCountryModal').classList.remove('active');
}

// Preencher select de países
function populateCountrySelect() {
    const select = document.getElementById('newCountryName');
    if (select) {
        select.innerHTML = '<option value="">Selecione um país</option>' +
            countriesList.map(country => `<option value="${country}">${country}</option>`).join('');
    }
}

// Adicionar país
async function handleAddCountry(event) {
    event.preventDefault();

    const country = document.getElementById('newCountryName').value;
    const taxId = document.getElementById('newCountryTaxId').value.trim();
    const city = document.getElementById('newCountryCity').value.trim();
    const address = document.getElementById('newCountryAddress').value.trim();
    const phone = document.getElementById('newCountryPhone').value.trim();
    const isHeadquarters = document.getElementById('newCountryIsHeadquarters').checked;

    try {
        const response = await fetch(`${API_URL}/countries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                companyId: currentUser.company.id,
                country,
                taxId,
                city,
                address,
                phone,
                isHeadquarters
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || 'Erro ao adicionar país', 'error');
            return;
        }

        showMessage('País adicionado com sucesso!', 'success');
        closeAddCountryModal();
        await loadCountries();
        updateStats();

    } catch (error) {
        console.error('Erro ao adicionar país:', error);
        showMessage('Erro ao conectar com o servidor', 'error');
    }
}

// Editar/Deletar funções (placeholder)
function editUser(userId) {
    showMessage('Funcionalidade de edição em desenvolvimento', 'warning');
}

async function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            showMessage(data.error || 'Erro ao excluir usuário', 'error');
            return;
        }

        showMessage('Usuário excluído com sucesso', 'success');
        await loadUsers();
        updateStats();

    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showMessage('Erro ao conectar com o servidor', 'error');
    }
}

function editCountry(countryId) {
    showMessage('Funcionalidade de edição em desenvolvimento', 'warning');
}

async function deleteCountry(countryId) {
    if (!confirm('Tem certeza que deseja excluir este país?')) return;

    try {
        const response = await fetch(`${API_URL}/countries/${countryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            showMessage(data.error || 'Erro ao excluir país', 'error');
            return;
        }

        showMessage('País excluído com sucesso', 'success');
        await loadCountries();
        updateStats();

    } catch (error) {
        console.error('Erro ao excluir país:', error);
        showMessage('Erro ao conectar com o servidor', 'error');
    }
}

// Editar empresa
function enableCompanyEdit() {
    const fields = ['companyNameField', 'companyLegalNameField', 'companyFoundedYearField', 
                   'companySizeField', 'companyIndustryField', 'companyDescriptionField'];
    
    fields.forEach(fieldId => {
        document.getElementById(fieldId).disabled = false;
    });

    document.getElementById('companyFormActions').classList.remove('hidden');
}

function cancelCompanyEdit() {
    loadCompanyData();
    
    const fields = ['companyNameField', 'companyLegalNameField', 'companyFoundedYearField', 
                   'companySizeField', 'companyIndustryField', 'companyDescriptionField'];
    
    fields.forEach(fieldId => {
        document.getElementById(fieldId).disabled = true;
    });

    document.getElementById('companyFormActions').classList.add('hidden');
}

// Logout
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    }
}

// Função para exibir mensagens
function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        max-width: 400px;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#10b981';
        messageDiv.style.color = 'white';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#ef4444';
        messageDiv.style.color = 'white';
    } else if (type === 'warning') {
        messageDiv.style.backgroundColor = '#f59e0b';
        messageDiv.style.color = 'white';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
