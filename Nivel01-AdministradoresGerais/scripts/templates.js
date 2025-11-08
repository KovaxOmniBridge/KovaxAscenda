// Verificar autenticação
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token || !user.id) {
    window.location.href = '../index.html';
}

// Verificar se é administrador (nivel 0 ou 1)
if (user.nivel > 1) {
    alert('Acesso negado. Apenas administradores podem acessar esta página.');
    window.location.href = '../index.html';
}

// Configurações de templates predefinidos
const TEMPLATES = {
    startup: {
        name: 'Startup',
        active_levels: '0,1,2,5,6,7',
        level_names: {
            "0": "CEO/Fundador",
            "1": "Co-Fundador",
            "2": "Líder de Área",
            "3": "",
            "4": "",
            "5": "Coordenador",
            "6": "Analista",
            "7": "Assistente"
        }
    },
    scaleup: {
        name: 'Scale-up',
        active_levels: '0,1,2,3,5,6,7',
        level_names: {
            "0": "CEO",
            "1": "Administrador Geral",
            "2": "Diretor Executivo",
            "3": "Gerente",
            "4": "",
            "5": "Supervisor",
            "6": "Analista",
            "7": "Assistente"
        }
    },
    corporate: {
        name: 'Corporate',
        active_levels: '0,1,2,3,4,5,6,7',
        level_names: {
            "0": "CEO/Fundador",
            "1": "Administrador Geral",
            "2": "Diretor Executivo",
            "3": "Gerente",
            "4": "Coordenador",
            "5": "Supervisor",
            "6": "Analista",
            "7": "Assistente"
        }
    },
    custom: {
        name: 'Personalizado',
        active_levels: '0,1,2,3,4,5,6,7',
        level_names: {
            "0": "CEO/Fundador",
            "1": "Administrador Geral",
            "2": "Diretor Executivo",
            "3": "Gerente",
            "4": "Coordenador",
            "5": "Supervisor",
            "6": "Analista",
            "7": "Assistente"
        }
    }
};

let currentConfig = null;
let selectedTemplate = null;

// Elementos DOM
const userName = document.getElementById('userName');
const templateCards = document.querySelectorAll('.template-card');
const currentConfigSection = document.getElementById('currentConfig');
const currentTemplateSpan = document.getElementById('currentTemplate');
const activeLevelsCountSpan = document.getElementById('activeLevelsCount');
const levelsConfigDiv = document.getElementById('levelsConfig');
const saveConfigBtn = document.getElementById('saveConfigBtn');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    userName.textContent = user.name;
    loadCurrentTemplate();
    setupEventListeners();
});

// Carregar template atual
async function loadCurrentTemplate() {
    try {
        const response = await fetch(`http://localhost:3000/api/templates/${user.company_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            currentConfig = await response.json();
            highlightCurrentTemplate();
        }
    } catch (error) {
        console.error('Erro ao carregar template:', error);
    }
}

// Destacar template atual
function highlightCurrentTemplate() {
    if (currentConfig && currentConfig.template_type) {
        const currentCard = document.querySelector(`[data-template="${currentConfig.template_type}"]`);
        if (currentCard) {
            currentCard.classList.add('selected');
        }
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Selecionar template
    templateCards.forEach(card => {
        const selectBtn = card.querySelector('.btn-select');
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const template = card.dataset.template;
            selectTemplate(template);
        });

        card.addEventListener('click', () => {
            const template = card.dataset.template;
            selectTemplate(template);
        });
    });

    // Salvar configuração
    saveConfigBtn.addEventListener('click', saveConfiguration);

    // Cancelar
    cancelBtn.addEventListener('click', () => {
        currentConfigSection.style.display = 'none';
        templateCards.forEach(card => card.classList.remove('selected'));
        if (currentConfig) {
            highlightCurrentTemplate();
        }
    });

    // Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '../index.html';
    });
}

// Selecionar template
function selectTemplate(templateType) {
    selectedTemplate = templateType;
    
    // Atualizar UI dos cards
    templateCards.forEach(card => {
        if (card.dataset.template === templateType) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    // Mostrar configuração
    showConfiguration(templateType);
}

// Mostrar configuração do template
function showConfiguration(templateType) {
    const template = TEMPLATES[templateType];
    
    // Atualizar resumo
    currentTemplateSpan.textContent = template.name;
    const activeLevels = template.active_levels.split(',');
    activeLevelsCountSpan.textContent = `${activeLevels.length} de 8 níveis`;

    // Construir configuração de níveis
    levelsConfigDiv.innerHTML = '';
    
    for (let i = 0; i <= 7; i++) {
        const isActive = activeLevels.includes(String(i));
        const levelName = template.level_names[String(i)] || '';
        
        const levelItem = document.createElement('div');
        levelItem.className = `level-item ${!isActive ? 'inactive' : ''}`;
        levelItem.innerHTML = `
            <div class="level-number">N${i}</div>
            <div class="level-default-name">Nível ${i}</div>
            <input 
                type="text" 
                class="level-input" 
                placeholder="Nome do cargo/nível"
                value="${levelName}"
                data-level="${i}"
                ${!isActive ? 'disabled' : ''}
            >
            <label class="level-toggle">
                <div class="toggle-switch">
                    <input 
                        type="checkbox" 
                        ${isActive ? 'checked' : ''}
                        data-level="${i}"
                        onchange="toggleLevel(${i})"
                    >
                    <span class="toggle-slider"></span>
                </div>
            </label>
        `;
        
        levelsConfigDiv.appendChild(levelItem);
    }

    // Mostrar seção
    currentConfigSection.style.display = 'block';
    
    // Scroll suave até a configuração
    currentConfigSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toggle nível
window.toggleLevel = function(level) {
    const levelItem = document.querySelector(`.level-item:nth-child(${level + 1})`);
    const input = levelItem.querySelector('.level-input');
    const checkbox = levelItem.querySelector('input[type="checkbox"]');
    
    if (checkbox.checked) {
        levelItem.classList.remove('inactive');
        input.disabled = false;
    } else {
        levelItem.classList.add('inactive');
        input.disabled = true;
        input.value = '';
    }
}

// Salvar configuração
async function saveConfiguration() {
    if (!selectedTemplate) {
        alert('Selecione um template primeiro');
        return;
    }

    // Coletar dados
    const activeLevels = [];
    const levelNames = {};
    
    const checkboxes = levelsConfigDiv.querySelectorAll('input[type="checkbox"]');
    const inputs = levelsConfigDiv.querySelectorAll('.level-input');
    
    checkboxes.forEach((checkbox, index) => {
        const level = checkbox.dataset.level;
        if (checkbox.checked) {
            activeLevels.push(level);
        }
    });
    
    inputs.forEach(input => {
        const level = input.dataset.level;
        levelNames[level] = input.value.trim();
    });

    // Validação
    if (activeLevels.length === 0) {
        alert('Ative pelo menos um nível hierárquico');
        return;
    }

    // Validar que níveis 0 ou 1 estejam ativos
    if (!activeLevels.includes('0') && !activeLevels.includes('1')) {
        alert('Pelo menos o nível 0 (CEO) ou 1 (Administrador) deve estar ativo');
        return;
    }

    const data = {
        template_type: selectedTemplate,
        active_levels: activeLevels.join(','),
        level_names: levelNames
    };

    try {
        saveConfigBtn.disabled = true;
        saveConfigBtn.textContent = 'Salvando...';

        const response = await fetch(`http://localhost:3000/api/templates/${user.company_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('✅ Template organizacional atualizado com sucesso!');
            currentConfig = data;
            currentConfigSection.style.display = 'none';
            
            // Recarregar template atual
            await loadCurrentTemplate();
        } else {
            const error = await response.json();
            alert(`Erro ao salvar: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro ao salvar template:', error);
        alert('Erro ao salvar configuração. Tente novamente.');
    } finally {
        saveConfigBtn.disabled = false;
        saveConfigBtn.textContent = 'Salvar Configuração';
    }
}
