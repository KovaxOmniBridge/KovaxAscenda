const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let allUsers = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadCompanyData();
    loadUsers();
    setupLogout();
    setupUserForm();
});

// Carregar dados da empresa
async function loadCompanyData() {
    const companyId = localStorage.getItem('companyId');
    
    if (!companyId) {
        alert('❌ Sessão inválida');
        window.location.href = '/index.html';
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

// Carregar usuários
async function loadUsers() {
    const companyId = localStorage.getItem('companyId');
    const grid = document.getElementById('usersGrid');
    
    try {
        const response = await fetch(`${API_BASE}/users/company/${companyId}`);
        if (response.ok) {
            allUsers = await response.json();
            displayUsers(allUsers);
        } else {
            grid.innerHTML = '<p class="loading">Erro ao carregar usuários</p>';
        }
    } catch (error) {
        console.error('Erro:', error);
        grid.innerHTML = '<p class="loading">Erro ao carregar usuários</p>';
    }
}

// Exibir usuários
function displayUsers(users) {
    const grid = document.getElementById('usersGrid');
    
    if (users.length === 0) {
        grid.innerHTML = '<p class="loading">Nenhum usuário encontrado</p>';
        return;
    }
    
    const levelNames = {
        0: 'Presidentes',
        1: 'Administradores Gerais',
        2: 'Diretores Executivos',
        3: 'Gerentes',
        4: 'Coordenadores',
        5: 'Supervisores',
        6: 'Especialistas',
        7: 'Operacional'
    };
    
    grid.innerHTML = users.map(user => {
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        return `
            <div class="user-card">
                <div class="user-header">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>ID: ${user.id}</p>
                    </div>
                </div>
                <div class="user-level">Nível ${user.hierarchical_level} - ${levelNames[user.hierarchical_level]}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-actions">
                    <button class="btn btn-secondary" onclick="editUser(${user.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id}, '${user.name.replace(/'/g, "\\'")}')">Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

// Filtrar usuários
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const levelFilter = document.getElementById('levelFilter').value;
    
    let filtered = allUsers;
    
    if (searchTerm) {
        filtered = filtered.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }
    
    if (levelFilter !== '') {
        filtered = filtered.filter(user => user.hierarchical_level === parseInt(levelFilter));
    }
    
    displayUsers(filtered);
}

// Abrir modal adicionar
function openAddUserModal() {
    document.getElementById('userModal').classList.add('show');
    document.getElementById('modalTitle').textContent = 'Novo Usuário';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
}

// Fechar modal
function closeUserModal() {
    document.getElementById('userModal').classList.remove('show');
}

// Setup form
function setupUserForm() {
    document.getElementById('userForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const data = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            password: document.getElementById('userPassword').value,
            hierarchical_level: parseInt(document.getElementById('userLevel').value),
            company_id: parseInt(localStorage.getItem('companyId'))
        };
        
        try {
            const url = userId ? `${API_BASE}/users/${userId}` : `${API_BASE}/users`;
            const method = userId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert(userId ? '✅ Usuário atualizado!' : '✅ Usuário criado!');
                closeUserModal();
                loadUsers();
            } else {
                const error = await response.json();
                alert('❌ Erro: ' + (error.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao salvar usuário');
        }
    });
}

// Editar usuário
async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        if (response.ok) {
            const user = await response.json();
            
            document.getElementById('userModal').classList.add('show');
            document.getElementById('modalTitle').textContent = 'Editar Usuário';
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').value = ''; // Não mostrar senha
            document.getElementById('userLevel').value = user.hierarchical_level;
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao carregar usuário');
    }
}

// Deletar usuário
async function deleteUser(userId, userName) {
    if (!confirm(`⚠️ Deseja realmente excluir "${userName}"?\n\nEsta ação não pode ser desfeita.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Usuário excluído!');
            loadUsers();
        } else {
            alert('❌ Erro ao excluir usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao excluir usuário');
    }
}

// Setup logout
function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Deseja realmente sair?')) {
            localStorage.clear();
            window.location.href = '/index.html';
        }
    });
}
