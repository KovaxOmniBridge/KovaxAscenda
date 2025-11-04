// Estado da aplicação
let companies = [];
let editingCompanyId = null;

// Elementos do DOM
const companiesList = document.getElementById('companiesList');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const companyModal = document.getElementById('companyModal');
const companyForm = document.getElementById('companyForm');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const btnNovaEmpresa = document.getElementById('btnNovaEmpresa');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');
const btnEmptyState = document.getElementById('btnEmptyState');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadCompanies();
    setupEventListeners();
    setupMasks();
});

// Configurar event listeners
function setupEventListeners() {
    btnNovaEmpresa.addEventListener('click', () => openModal());
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);
    if (btnEmptyState) {
        btnEmptyState.addEventListener('click', () => openModal());
    }
    companyForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === companyModal) {
            closeModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && companyModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Carregar empresas da API
async function loadCompanies() {
    try {
        showLoading(true);
        companies = await API.getCompanies();
        renderCompanies(companies);
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        showToast('Erro ao carregar empresas. Verifique se o servidor está rodando.', 'error');
    } finally {
        showLoading(false);
    }
}

// Renderizar lista de empresas
function renderCompanies(companiesToRender) {
    companiesList.innerHTML = '';
    
    if (companiesToRender.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    companiesToRender.forEach(company => {
        const card = createCompanyCard(company);
        companiesList.appendChild(card);
    });
}

// Criar card de empresa
function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card';
    
    const statusClass = `status-${company.situacaoCadastral.toLowerCase()}`;
    
    card.innerHTML = `
        <div class="company-header">
            <div class="company-name">
                <h3>${company.nomeFantasia}</h3>
                <p>${company.razaoSocial}</p>
            </div>
            <span class="company-status ${statusClass}">${company.situacaoCadastral}</span>
        </div>
        <div class="company-info">
            <div class="info-row">
                <span class="info-label">CNPJ:</span>
                <span class="info-value">${company.cnpj}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Porte:</span>
                <span class="info-value">${company.porte}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Regime:</span>
                <span class="info-value">${formatRegime(company.regimeTributario)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Cidade:</span>
                <span class="info-value">${company.endereco.cidade}/${company.endereco.estado}</span>
            </div>
        </div>
        <div class="company-actions">
            <button class="btn-action btn-site" onclick="event.stopPropagation(); openSiteEditor('${company.id}')" title="Editar Site">
                🌐 Meu Site
            </button>
            <button class="btn-action btn-edit" onclick="event.stopPropagation(); editCompany('${company.id}')" title="Editar Empresa">
                ✏️ Editar
            </button>
        </div>
    `;
    
    return card;
}

// Buscar empresas
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    const filtered = companies.filter(company => {
        return (
            company.nomeFantasia.toLowerCase().includes(searchTerm) ||
            company.razaoSocial.toLowerCase().includes(searchTerm) ||
            company.cnpj.includes(searchTerm)
        );
    });
    
    renderCompanies(filtered);
}

// Abrir modal para nova empresa ou edição
function openModal(company = null) {
    editingCompanyId = company ? company.id : null;
    modalTitle.textContent = company ? 'Editar Empresa' : 'Nova Empresa';
    
    if (company) {
        fillForm(company);
    } else {
        companyForm.reset();
    }
    
    companyModal.style.display = 'block';
    setTimeout(() => {
        companyModal.classList.add('active');
    }, 10);
}

// Fechar modal
function closeModal() {
    companyModal.classList.remove('active');
    setTimeout(() => {
        companyModal.style.display = 'none';
        companyForm.reset();
        editingCompanyId = null;
    }, 300);
}

// Expor funções globalmente para uso em HTML inline (se necessário)
window.openModal = openModal;
window.closeModal = closeModal;

// Preencher formulário com dados da empresa
function fillForm(company) {
    document.getElementById('cnpj').value = company.cnpj;
    document.getElementById('razaoSocial').value = company.razaoSocial;
    document.getElementById('nomeFantasia').value = company.nomeFantasia;
    document.getElementById('porte').value = company.porte;
    document.getElementById('regimeTributario').value = company.regimeTributario;
    document.getElementById('situacaoCadastral').value = company.situacaoCadastral;
    
    document.getElementById('cep').value = company.endereco.cep;
    document.getElementById('logradouro').value = company.endereco.logradouro;
    document.getElementById('numero').value = company.endereco.numero;
    document.getElementById('complemento').value = company.endereco.complemento || '';
    document.getElementById('bairro').value = company.endereco.bairro || '';
    document.getElementById('cidade').value = company.endereco.cidade;
    document.getElementById('estado').value = company.endereco.estado;
    document.getElementById('pais').value = company.endereco.pais;
}

// Editar empresa
async function editCompany(id) {
    try {
        const company = await API.getCompanyById(id);
        openModal(company);
    } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        showToast('Erro ao carregar dados da empresa.', 'error');
    }
}

// Abrir editor de site
function openSiteEditor(companyId) {
    window.location.href = `site-editor.html?company=${companyId}`;
}

// Submeter formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(companyForm);
    const companyData = {
        cnpj: formData.get('cnpj'),
        razaoSocial: formData.get('razaoSocial'),
        nomeFantasia: formData.get('nomeFantasia'),
        porte: formData.get('porte'),
        regimeTributario: formData.get('regimeTributario'),
        situacaoCadastral: formData.get('situacaoCadastral'),
        endereco: {
            cep: formData.get('cep'),
            logradouro: formData.get('logradouro'),
            numero: formData.get('numero'),
            complemento: formData.get('complemento'),
            bairro: formData.get('bairro'),
            cidade: formData.get('cidade'),
            estado: formData.get('estado'),
            pais: formData.get('pais')
        }
    };
    
    try {
        if (editingCompanyId) {
            await API.updateCompany(editingCompanyId, companyData);
            showToast('Empresa atualizada com sucesso!', 'success');
        } else {
            await API.createCompany(companyData);
            showToast('Empresa cadastrada com sucesso!', 'success');
        }
        
        closeModal();
        loadCompanies();
    } catch (error) {
        console.error('Erro ao salvar empresa:', error);
        showToast('Erro ao salvar empresa. Verifique os dados e tente novamente.', 'error');
    }
}

// Mostrar/ocultar loading
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
    companiesList.style.display = show ? 'none' : 'grid';
}

// Formatar nome do regime tributário
function formatRegime(regime) {
    const regimes = {
        'SIMPLES_NACIONAL': 'Simples Nacional',
        'LUCRO_PRESUMIDO': 'Lucro Presumido',
        'LUCRO_REAL': 'Lucro Real'
    };
    return regimes[regime] || regime;
}

// Configurar máscaras de input
function setupMasks() {
    const cnpjInput = document.getElementById('cnpj');
    const cepInput = document.getElementById('cep');
    
    cnpjInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });
    
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });
    
    // Buscar CEP automaticamente
    cepInput.addEventListener('blur', async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            await buscarCEP(cep);
        }
    });
}

// Buscar CEP na API ViaCEP
async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            document.getElementById('logradouro').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('cidade').value = data.localidade || '';
            document.getElementById('estado').value = data.uf || '';
            showToast('CEP encontrado com sucesso!', 'success');
        } else {
            showToast('CEP não encontrado.', 'error');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showToast('Erro ao buscar CEP.', 'error');
    }
}

// Toast Notification
function showToast(message, type = 'info') {
    // Remove toast anterior se existir
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Criar novo toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Expor funções globalmente para uso em HTML inline
window.showToast = showToast;
window.openSiteEditor = openSiteEditor;
window.editCompany = editCompany;
window.openModal = openModal;
window.closeModal = closeModal;
