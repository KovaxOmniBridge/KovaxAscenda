// Configuração da API
const API_URL = 'http://localhost:3000/api';

// Dados locais (cache)
let companies = [];

// Variáveis para o formulário multi-etapas
let currentStep = 1;
let registrationData = {
    company: {},
    admins: []
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadCompanies();
    setupLoginFormEnhancements();
});

// Função para carregar empresas no select
async function loadCompanies() {
    try {
        const response = await fetch(`${API_URL}/companies`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar empresas');
        }
        
        companies = await response.json();
        
        const select = document.getElementById('companySelect');
        if (!select) return; // Proteção se o elemento não existir
        
        select.innerHTML = '<option value="">-- Selecione sua empresa --</option>';
        
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.id;
            option.textContent = company.name;
            select.appendChild(option);
        });
        
        console.log(`✅ ${companies.length} empresas carregadas com sucesso`);
    } catch (error) {
        console.error('❌ Erro ao carregar empresas:', error);
        showMessage('⚠️ Não foi possível conectar ao servidor. Verifique se o servidor está rodando.', 'error');
    }
}

// Melhorias no formulário de login
function setupLoginFormEnhancements() {
    const accessKeyInput = document.getElementById('accessKey');
    const passwordInput = document.getElementById('password');
    const companySelect = document.getElementById('companySelect');
    
    if (!accessKeyInput || !passwordInput || !companySelect) return;
    
    // Formatar chave de acesso automaticamente (maiúsculas)
    accessKeyInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.toUpperCase();
    });
    
    // Validação em tempo real
    accessKeyInput.addEventListener('blur', function(e) {
        const value = e.target.value.trim();
        if (value && !isValidAccessKey(value)) {
            showFieldError(accessKeyInput, 'Formato inválido. Exemplo: TS-0001');
        } else {
            clearFieldError(accessKeyInput);
        }
    });
    
    // Limpar erros ao focar
    [accessKeyInput, passwordInput, companySelect].forEach(field => {
        field.addEventListener('focus', function() {
            clearFieldError(field);
        });
    });
}

// Validar formato de chave de acesso
function isValidAccessKey(key) {
    // Aceita formatos: XX-0000 ou similar
    return /^[A-Z]{2,3}-\d{4}$/.test(key);
}

// Mostrar erro em campo específico
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--error)';
    const errorDiv = document.createElement('small');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = '0.813rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

// Limpar erro de campo
function clearFieldError(field) {
    field.style.borderColor = '';
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.remove();
}

// Navegação entre seções
function showLoginForm() {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('registerSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

function showRegisterForm() {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
    resetRegistrationForm();
}

function showHero() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registerSection').classList.add('hidden');
    document.getElementById('hero').classList.remove('hidden');
}

// Resetar formulário de cadastro
function resetRegistrationForm() {
    currentStep = 1;
    registrationData = {
        company: {},
        president: {},
        admins: []
    };
    
    // Resetar steps visuais
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) step.classList.add('active');
    });
    
    // Resetar form steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index === 0) step.classList.add('active');
    });
    
    // Limpar formulário
    document.getElementById('registerForm').reset();
    document.getElementById('adminsItems').innerHTML = '<div class="empty-state">Nenhum administrador adicionado. Adicione pelo menos um administrador para continuar.</div>';
}

// Função para toggle de campos do presidente
function togglePresidentFields() {
    const isChecked = document.getElementById('iAmPresident').checked;
    // Pode ser usado para pré-preencher alguns campos se necessário
    if (isChecked) {
        console.log('Cadastrando como presidente');
    }
}

// Navegação entre etapas
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 4) {
            // Salvar dados da etapa atual
            saveCurrentStepData();
            
            // Marcar etapa atual como completa
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
            
            // Avançar para próxima etapa
            currentStep++;
            
            // Ativar próxima etapa
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
            
            // Mostrar form step correspondente
            document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            document.getElementById(`step${currentStep}`).classList.add('active');
            
            // Se for a etapa de revisão, gerar conteúdo
            if (currentStep === 3) {
                generateReview();
            }
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Remover completed da etapa atual
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Voltar para etapa anterior
        currentStep--;
        
        // Ativar etapa anterior
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('completed');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
        
        // Mostrar form step correspondente
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step${currentStep}`).classList.add('active');
    }
}

// Validar etapa atual
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

// Validação Etapa 1
function validateStep1() {
    const companyName = document.getElementById('companyName').value.trim();
    const legalName = document.getElementById('companyLegalName').value.trim();
    const foundedYear = document.getElementById('foundedYear').value;
    const size = document.getElementById('companySize').value;
    const industry = document.getElementById('industry').value;
    const description = document.getElementById('companyDescription').value.trim();
    
    if (!companyName || !legalName || !foundedYear || !size || !industry || !description) {
        showMessage('Por favor, preencha todos os campos obrigatórios da etapa 1.', 'error');
        return false;
    }
    
    if (foundedYear < 1800 || foundedYear > 2025) {
        showMessage('Ano de fundação inválido.', 'error');
        return false;
    }
    
    return true;
}

// Validação Etapa 2 (Presidente)
function validateStep2() {
    const name = document.getElementById('presidentName').value.trim();
    const email = document.getElementById('presidentEmail').value.trim();
    const phone = document.getElementById('presidentPhone').value.trim();
    const accessKey = document.getElementById('presidentAccessKey').value.trim();
    const password = document.getElementById('presidentPassword').value;
    const confirmPassword = document.getElementById('presidentConfirmPassword').value;
    
    if (!name || !email || !phone || !accessKey || !password || !confirmPassword) {
        showMessage('Por favor, preencha todos os campos obrigatórios do presidente.', 'error');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Email do presidente inválido.', 'error');
        return false;
    }
    
    // Validar senha
    if (password.length < 8) {
        showMessage('A senha do presidente deve ter no mínimo 8 caracteres.', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showMessage('As senhas do presidente não coincidem.', 'error');
        return false;
    }
    
    return true;
}

// Validação Etapa 3 (Administradores Gerais)
function validateStep3() {
    if (registrationData.admins.length === 0) {
        showMessage('Adicione pelo menos um administrador geral.', 'error');
        return false;
    }
    
    const hasPrimary = registrationData.admins.some(a => a.isPrimary);
    if (!hasPrimary) {
        showMessage('Defina pelo menos um administrador como principal.', 'error');
        return false;
    }
    
    return true;
}

// Salvar dados da etapa atual
function saveCurrentStepData() {
    if (currentStep === 1) {
        const companyName = document.getElementById('companyName').value.trim();
        const sanitizedName = companyName.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .replace(/-+/g, '-') // Remove hífens duplicados
            .trim();
        
        registrationData.company = {
            name: companyName,
            legalName: document.getElementById('companyLegalName').value.trim(),
            foundedYear: parseInt(document.getElementById('foundedYear').value),
            size: document.getElementById('companySize').value,
            industry: document.getElementById('industry').value,
            website: `https://ascenda.app/${sanitizedName}`,
            description: document.getElementById('companyDescription').value.trim()
        };
    } else if (currentStep === 2) {
        // Salvar dados do presidente
        registrationData.president = {
            name: document.getElementById('presidentName').value.trim(),
            email: document.getElementById('presidentEmail').value.trim(),
            phone: document.getElementById('presidentPhone').value.trim(),
            department: document.getElementById('presidentDepartment').value.trim() || 'Presidência',
            accessKey: document.getElementById('presidentAccessKey').value.trim(),
            role: document.getElementById('presidentRole').value.trim() || 'Presidente',
            password: document.getElementById('presidentPassword').value,
            nivel: 0, // Nível 0 = Presidente
            isSelfRegistering: document.getElementById('iAmPresident').checked
        };
    }
}

// Adicionar administrador
function addAdmin() {
    const name = document.getElementById('adminName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const phone = document.getElementById('adminPhone').value.trim();
    const department = document.getElementById('adminDepartment').value.trim();
    const accessKey = document.getElementById('adminAccessKey').value.trim();
    const password = document.getElementById('adminPassword').value;
    const confirmPassword = document.getElementById('adminConfirmPassword').value;
    const isPrimary = document.getElementById('isPrimaryAdmin').checked;
    
    if (!name || !email || !phone || !department || !accessKey || !password || !confirmPassword) {
        showMessage('Preencha todos os campos do administrador antes de adicionar.', 'error');
        return;
    }
    
    // Validar email
    if (!validateEmail(email)) {
        showMessage('Email inválido.', 'error');
        return;
    }
    
    // Validar senha
    if (password.length < 8) {
        showMessage('A senha deve ter pelo menos 8 caracteres.', 'error');
        return;
    }
    
    // Validar confirmação de senha
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem. Por favor, verifique.', 'error');
        return;
    }
    
    // Verificar chave de acesso duplicada
    if (registrationData.admins.some(a => a.accessKey === accessKey)) {
        showMessage('Este nome de usuário já está em uso.', 'error');
        return;
    }
    
    // Verificar chave de acesso em outras empresas
    // Nota: Esta verificação agora é feita no backend
    
    // Se marcar como primary, desmarcar outros
    if (isPrimary) {
        registrationData.admins.forEach(a => a.isPrimary = false);
    }
    
    const adminData = {
        name,
        email,
        phone,
        department,
        accessKey,
        password,
        isPrimary,
        role: 'Administrador Geral'
    };
    
    registrationData.admins.push(adminData);
    renderAdmins();
    
    // Limpar campos
    document.getElementById('adminName').value = '';
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPhone').value = '';
    document.getElementById('adminDepartment').value = '';
    document.getElementById('adminAccessKey').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    document.getElementById('isPrimaryAdmin').checked = false;
    
    showMessage('Administrador adicionado com sucesso!', 'success');
}

// Renderizar administradores
function renderAdmins() {
    const container = document.getElementById('adminsItems');
    
    if (registrationData.admins.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum administrador adicionado. Adicione pelo menos um administrador para continuar.</div>';
        return;
    }
    
    container.innerHTML = registrationData.admins.map((admin, index) => `
        <div class="admin-card ${admin.isPrimary ? 'primary' : ''}">
            <div class="card-header">
                <div class="card-title">${admin.name}</div>
                ${admin.isPrimary ? '<div class="card-badge primary">Principal</div>' : ''}
            </div>
            <div class="card-content">
                <p><strong>Email:</strong> ${admin.email}</p>
                <p><strong>Telefone:</strong> ${admin.phone}</p>
                <p><strong>Departamento:</strong> ${admin.department}</p>
                <p><strong>Nome de Usuário:</strong> ${admin.accessKey}</p>
            </div>
            <div class="card-actions">
                <button type="button" class="btn-small btn-remove" onclick="removeAdmin(${index})">Remover</button>
            </div>
        </div>
    `).join('');
}

// Remover administrador
function removeAdmin(index) {
    registrationData.admins.splice(index, 1);
    renderAdmins();
    showMessage('Administrador removido.', 'success');
}

// Gerar revisão
function generateReview() {
    const container = document.getElementById('reviewContainer');
    
    const sizeLabels = {
        small: 'Pequena (1-50 funcionários)',
        medium: 'Média (51-250 funcionários)',
        large: 'Grande (251-1000 funcionários)',
        enterprise: 'Corporação (1000+ funcionários)'
    };
    
    const industryLabels = {
        technology: 'Tecnologia',
        finance: 'Financeiro',
        healthcare: 'Saúde',
        retail: 'Varejo',
        manufacturing: 'Manufatura',
        services: 'Serviços',
        education: 'Educação',
        logistics: 'Logística',
        energy: 'Energia',
        other: 'Outro'
    };
    
    const html = `
        <div class="review-section">
            <h3 class="review-section-title">📋 Informações da Empresa</h3>
            <div class="review-item">
                <div class="review-label">Nome:</div>
                <div class="review-value">${registrationData.company.name}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Razão Social:</div>
                <div class="review-value">${registrationData.company.legalName}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Ano de Fundação:</div>
                <div class="review-value">${registrationData.company.foundedYear}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Porte:</div>
                <div class="review-value">${sizeLabels[registrationData.company.size]}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Setor:</div>
                <div class="review-value">${industryLabels[registrationData.company.industry]}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Website Ascenda:</div>
                <div class="review-value">${registrationData.company.website}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Descrição:</div>
                <div class="review-value">${registrationData.company.description}</div>
            </div>
        </div>
        
        <div class="review-section">
            <h3 class="review-section-title">� Presidente (Nível 0)</h3>
            <div style="padding: 1rem; background: white; border-radius: 0.5rem; border-left: 4px solid #fbbf24;">
                <h4 style="margin-bottom: 0.5rem;">${registrationData.president.name}</h4>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Email:</strong> ${registrationData.president.email}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Telefone:</strong> ${registrationData.president.phone}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Departamento:</strong> ${registrationData.president.department}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Cargo:</strong> ${registrationData.president.role}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Nome de Usuário:</strong> ${registrationData.president.accessKey}</p>
                ${registrationData.president.isSelfRegistering ? '<p style="margin-top: 0.5rem; color: #10b981; font-weight: 600;">✓ Auto-cadastro (você é o presidente)</p>' : ''}
            </div>
        </div>
        
        <div class="review-section">
            <h3 class="review-section-title">⚙️ Administradores Gerais - Nível 1 (${registrationData.admins.length})</h3>
            ${registrationData.admins.map(admin => `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border-radius: 0.5rem; border-left: 4px solid ${admin.isPrimary ? '#10b981' : '#2563eb'};">
                    <h4 style="margin-bottom: 0.5rem;">${admin.name} ${admin.isPrimary ? '👑 Principal' : ''}</h4>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Email:</strong> ${admin.email}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Telefone:</strong> ${admin.phone}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Departamento:</strong> ${admin.department}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Nome de Usuário:</strong> ${admin.accessKey}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Função de Login
async function handleLogin(event) {
    event.preventDefault();
    
    const companyId = parseInt(document.getElementById('companySelect').value);
    const accessKey = document.getElementById('accessKey').value.trim();
    const password = document.getElementById('password').value;
    
    // Validação
    if (!companyId) {
        showMessage('Por favor, selecione uma empresa.', 'error');
        return;
    }
    if (!accessKey || !password) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Desabilitar botão durante o processamento
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '🔄 Autenticando...';
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyId,
                accessKey,
                password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showMessage(data.error || 'Credenciais inválidas', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }
        
        // Login bem-sucedido
        console.log('✅ Login bem-sucedido:', data.user);
        
        // ============================================================================
        // PROTEÇÃO: Limpar qualquer resquício de dev_mode de outras abas
        // Isso garante que login normal NUNCA seja confundido com dev mode
        // ============================================================================
        sessionStorage.removeItem('dev_mode');  // Limpar desta aba
        // NÃO limpar localStorage.dev_mode pois pode ter outra aba dev ativa
        
        console.log('🔒 Login normal: garantindo que dev_mode não está ativo nesta aba');
        
        // Salvar token e dados do usuário
        // Usar SessionManager se disponível, senão fallback para localStorage
        if (window.SessionManager) {
            window.SessionManager.setSession('token', data.token, true);
            window.SessionManager.setSession('userData', JSON.stringify(data.user), true);
            console.log('💾 Sessão salva via SessionManager (Tab ID:', window.SessionManager.getTabId() + ')');
        } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            console.log('💾 Sessão salva via localStorage (modo compatibilidade)');
        }
        
        // Verificar se o usuário tem múltiplos papéis
        const hasMultipleRoles = data.user.can_switch_roles && data.user.additional_roles;
        
        if (hasMultipleRoles) {
            // Salvar papel selecionado como o principal
            if (window.SessionManager) {
                window.SessionManager.setSession('selectedRole', data.user.nivel.toString(), true);
            } else {
                localStorage.setItem('selectedRole', data.user.nivel.toString());
            }
            showMessage(`Bem-vindo, ${data.user.name}! Você tem acesso a múltiplos níveis.`, 'success');
            
            // Redirecionar para seletor de papéis
            setTimeout(() => {
                window.location.href = '/shared/role-switcher.html';
            }, 1500);
        } else {
            // Usuário com papel único - redirecionar direto para dashboard
            if (window.SessionManager) {
                window.SessionManager.setSession('selectedRole', data.user.nivel.toString(), true);
            } else {
                localStorage.setItem('selectedRole', data.user.nivel.toString());
            }
            showMessage(`Bem-vindo, ${data.user.name}!`, 'success');
            
            setTimeout(() => {
                const dashboardUrl = getDashboardUrl(data.user.nivel);
                window.location.href = dashboardUrl;
            }, 1200);
        }
    } catch (error) {
        console.error('❌ Erro ao fazer login:', error);
        showMessage('Erro ao conectar com o servidor. Verifique sua conexão.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Função auxiliar para obter URL do dashboard baseado no nível
function getDashboardUrl(nivel) {
    const dashboards = {
        0: '/Nivel00-Presidentes/dashboard-presidentes.html',
        1: '/Nivel01-AdministradoresGerais/dashboard-admin.html',
        2: '/Nivel02-DiretoresExecutivos/dashboard-diretores.html',
        3: '/Nivel03-Gerentes/dashboard-gerentes.html',
        4: '/Nivel04-Coordenadores/dashboard-coordenadores.html',
        5: '/Nivel05-Supervisores/dashboard-supervisores.html',
        6: '/Nivel06-Especialistas/dashboard-especialistas.html',
        7: '/Nivel07-Operacional/dashboard-operacional.html'
    };
    
    return dashboards[nivel] || '/Nivel01-AdministradoresGerais/dashboard-admin.html';
}

// Função de Cadastro de Empresa (agora envia pedido)
async function handleRegister(event) {
    event.preventDefault();
    
    // Validação final
    if (!validateStep3()) {
        showMessage('Complete todas as etapas antes de finalizar.', 'error');
        return;
    }

    // Validar documentos
    const documentsInput = document.getElementById('documents');
    if (!documentsInput.files || documentsInput.files.length === 0) {
        showMessage('Por favor, envie pelo menos um documento da empresa.', 'error');
        return;
    }

    if (documentsInput.files.length > 10) {
        showMessage('Máximo de 10 documentos permitidos.', 'error');
        return;
    }
    
    try {
        // Criar FormData para enviar arquivos
        const formData = new FormData();
        
        // Adicionar dados da empresa, presidente e admins como JSON
        formData.append('company', JSON.stringify(registrationData.company));
        formData.append('president', JSON.stringify(registrationData.president));
        formData.append('admins', JSON.stringify(registrationData.admins));
        
        // Adicionar documentos
        for (let i = 0; i < documentsInput.files.length; i++) {
            formData.append('documents', documentsInput.files[i]);
        }

        const response = await fetch(`${API_URL}/company-requests`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showMessage(data.error || 'Erro ao enviar pedido de cadastro', 'error');
            return;
        }
        
        // Mensagem de sucesso
        const successMessage = `✅ Pedido enviado com sucesso!\n\n` +
            `Seu pedido de cadastro foi recebido e está em análise.\n\n` +
            `📧 Você receberá um email em até 3 dias úteis com o resultado da análise.\n\n` +
            `Empresa: ${registrationData.company.name}\n` +
            `Protocolo: #${data.requestId || 'Aguardando'}`;
        
        showMessage(successMessage, 'success');
        
        // Resetar e redirecionar
        setTimeout(() => {
            resetRegistrationForm();
            showHero();
        }, 5000);
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        showMessage('Erro ao conectar com o servidor.', 'error');
    }
}

// Função para exibir mensagens
function showMessage(message, type) {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Criar nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Estilos inline
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        max-width: 400px;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#10b981';
        messageDiv.style.color = 'white';
    } else {
        messageDiv.style.backgroundColor = '#ef4444';
        messageDiv.style.color = 'white';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Validações
function validateCNPJ(cnpj) {
    // Validação básica de formato
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Adicionar animações CSS
