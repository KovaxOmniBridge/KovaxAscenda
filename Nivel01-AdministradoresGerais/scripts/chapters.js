const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let allChapters = [];
let allUsers = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadCompanyData();
    loadChapters();
    loadUsers();
    setupForms();
    setupLogout();
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
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Carregar chapters
async function loadChapters() {
    const companyId = localStorage.getItem('companyId');
    const grid = document.getElementById('chaptersGrid');
    
    try {
        const response = await fetch(`${API_BASE}/chapters/company/${companyId}`);
        if (response.ok) {
            allChapters = await response.json();
            displayChapters(allChapters);
        } else {
            grid.innerHTML = '<p class="loading">Erro ao carregar chapters</p>';
        }
    } catch (error) {
        console.error('Erro:', error);
        grid.innerHTML = '<p class="loading">Erro ao carregar chapters</p>';
    }
}

// Exibir chapters
function displayChapters(chapters) {
    const grid = document.getElementById('chaptersGrid');
    
    if (chapters.length === 0) {
        grid.innerHTML = '<p class="loading">Nenhum chapter cadastrado. Clique em "+ Novo Chapter" para começar.</p>';
        return;
    }
    
    const specialtyIcons = {
        'Backend Development': '⚙️',
        'Frontend Development': '🎨',
        'UX/UI Design': '✨',
        'Data Science': '📊',
        'DevOps': '🔧',
        'QA Testing': '🧪',
        'Product Management': '📱',
        'Business Analysis': '💼',
        'Mobile Development': '📱',
        'Security': '🔒'
    };
    
    grid.innerHTML = chapters.map(chapter => `
        <div class="squad-card">
            <div class="squad-header">
                <div class="squad-icon">${specialtyIcons[chapter.specialty] || '📚'}</div>
                <div class="squad-title">
                    <h3>${chapter.name}</h3>
                    <p class="specialty-badge">${chapter.specialty}</p>
                </div>
            </div>
            <p class="squad-desc">${chapter.description || 'Sem descrição'}</p>
            <div class="squad-info">
                <div class="info-item">
                    <span class="info-label">Lead:</span>
                    <span class="info-value">${chapter.lead_name || 'Não definido'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Membros:</span>
                    <span class="info-value">${chapter.member_count || 0}</span>
                </div>
            </div>
            <div class="squad-actions">
                <button class="btn btn-secondary" onclick="openMembersModal(${chapter.id}, '${chapter.name.replace(/'/g, "\\'")}')">
                    👥 Membros
                </button>
                <button class="btn btn-secondary" onclick="editChapter(${chapter.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteChapter(${chapter.id}, '${chapter.name.replace(/'/g, "\\'")}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

// Carregar usuários
async function loadUsers() {
    const companyId = localStorage.getItem('companyId');
    
    try {
        const response = await fetch(`${API_BASE}/users/company/${companyId}`);
        if (response.ok) {
            allUsers = await response.json();
            
            const leadSelect = document.getElementById('chapterLead');
            const memberSelect = document.getElementById('memberUserId');
            
            const options = allUsers.map(user => 
                `<option value="${user.id}">${user.name} (${user.email})</option>`
            ).join('');
            
            leadSelect.innerHTML = '<option value="">Selecione o líder...</option>' + options;
            memberSelect.innerHTML = '<option value="">Selecione usuário...</option>' + options;
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Setup forms
function setupForms() {
    // Novo chapter
    document.getElementById('newChapterBtn').addEventListener('click', () => {
        document.getElementById('chapterModal').classList.add('show');
        document.getElementById('modalTitle').textContent = 'Novo Chapter';
        document.getElementById('chapterForm').reset();
        document.getElementById('chapterId').value = '';
    });
    
    // Submit chapter
    document.getElementById('chapterForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const chapterId = document.getElementById('chapterId').value;
        const data = {
            name: document.getElementById('chapterName').value,
            specialty: document.getElementById('chapterSpecialty').value,
            description: document.getElementById('chapterDescription').value,
            lead_id: parseInt(document.getElementById('chapterLead').value),
            company_id: parseInt(localStorage.getItem('companyId'))
        };
        
        try {
            const url = chapterId ? `${API_BASE}/chapters/${chapterId}` : `${API_BASE}/chapters`;
            const method = chapterId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert(chapterId ? '✅ Chapter atualizado!' : '✅ Chapter criado!');
                closeModal();
                loadChapters();
            } else {
                alert('❌ Erro ao salvar chapter');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao salvar chapter');
        }
    });
    
    // Filtros
    document.getElementById('filterSpecialty').addEventListener('change', filterChapters);
    document.getElementById('searchInput').addEventListener('keyup', filterChapters);
    
    // Adicionar membro
    document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const chapterId = document.getElementById('currentChapterId').value;
        const data = {
            chapter_id: parseInt(chapterId),
            user_id: parseInt(document.getElementById('memberUserId').value),
            role: document.getElementById('memberRole').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/chapters/${chapterId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert('✅ Membro adicionado!');
                loadChapterMembers(chapterId);
                document.getElementById('addMemberForm').reset();
            } else {
                const error = await response.json();
                alert('❌ ' + (error.message || 'Erro ao adicionar membro'));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao adicionar membro');
        }
    });
}

// Filtrar chapters
function filterChapters() {
    const specialty = document.getElementById('filterSpecialty').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allChapters;
    
    if (specialty) {
        filtered = filtered.filter(c => c.specialty === specialty);
    }
    
    if (search) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(search) ||
            (c.description && c.description.toLowerCase().includes(search))
        );
    }
    
    displayChapters(filtered);
}

// Editar chapter
async function editChapter(chapterId) {
    try {
        const response = await fetch(`${API_BASE}/chapters/${chapterId}`);
        if (response.ok) {
            const chapter = await response.json();
            
            document.getElementById('chapterModal').classList.add('show');
            document.getElementById('modalTitle').textContent = 'Editar Chapter';
            document.getElementById('chapterId').value = chapter.id;
            document.getElementById('chapterName').value = chapter.name;
            document.getElementById('chapterSpecialty').value = chapter.specialty;
            document.getElementById('chapterDescription').value = chapter.description || '';
            document.getElementById('chapterLead').value = chapter.lead_id;
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao carregar chapter');
    }
}

// Deletar chapter
async function deleteChapter(chapterId, chapterName) {
    if (!confirm(`⚠️ Deseja realmente excluir "${chapterName}"?\n\nTodos os membros serão removidos.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/chapters/${chapterId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Chapter excluído!');
            loadChapters();
        } else {
            alert('❌ Erro ao excluir chapter');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao excluir chapter');
    }
}

// Abrir modal de membros
async function openMembersModal(chapterId, chapterName) {
    document.getElementById('membersModal').classList.add('show');
    document.getElementById('membersModalTitle').textContent = `Membros - ${chapterName}`;
    document.getElementById('currentChapterId').value = chapterId;
    loadChapterMembers(chapterId);
}

// Carregar membros do chapter
async function loadChapterMembers(chapterId) {
    const container = document.getElementById('membersList');
    
    try {
        const response = await fetch(`${API_BASE}/chapters/${chapterId}/members`);
        if (response.ok) {
            const members = await response.json();
            
            if (members.length === 0) {
                container.innerHTML = '<p class="loading">Nenhum membro no chapter</p>';
                return;
            }
            
            container.innerHTML = members.map(member => `
                <div class="member-item">
                    <div class="member-info">
                        <strong>${member.user_name}</strong>
                        <span class="member-role role-${member.role}">${member.role}</span>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeMember(${chapterId}, ${member.user_id}, '${member.user_name}')">
                        Remover
                    </button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p class="loading">Erro ao carregar membros</p>';
    }
}

// Remover membro
async function removeMember(chapterId, userId, userName) {
    if (!confirm(`Remover ${userName} do chapter?`)) return;
    
    try {
        const response = await fetch(`${API_BASE}/chapters/${chapterId}/members/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Membro removido!');
            loadChapterMembers(chapterId);
            loadChapters();
        } else {
            alert('❌ Erro ao remover membro');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao remover membro');
    }
}

// Fechar modals
function closeModal() {
    document.getElementById('chapterModal').classList.remove('show');
}

function closeMembersModal() {
    document.getElementById('membersModal').classList.remove('show');
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
