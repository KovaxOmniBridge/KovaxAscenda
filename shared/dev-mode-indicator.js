/**
 * ============================================================================
 * DEV MODE INDICATOR
 * ============================================================================
 * Script para detectar e exibir indicador visual quando em modo desenvolvedor
 * ou quando usuário está sendo impersonado
 * 
 * Inclua este script em todas as interfaces para ativar o indicador
 * ============================================================================
 */

(function() {
    'use strict';
    
    // PRIMEIRO: Verificar se há dados de impersonation na URL
    const urlParams = new URLSearchParams(window.location.search);
    const impersonateData = urlParams.get('impersonate');
    
    if (impersonateData) {
        try {
            // Decodificar e configurar sessão
            const sessionData = JSON.parse(atob(decodeURIComponent(impersonateData)));
            
            // Salvar no localStorage
            localStorage.setItem('token', sessionData.token);
            localStorage.setItem('user', JSON.stringify(sessionData.user));
            localStorage.setItem('company', JSON.stringify(sessionData.company));
            localStorage.setItem('devMode', sessionData.devMode);
            localStorage.setItem('impersonatedBy', sessionData.impersonatedBy);
            
            console.log('✅ Sessão de impersonation configurada');
            console.log('👤 Usuário:', sessionData.user.name);
            console.log('🏢 Empresa:', sessionData.company.name);
            
            // Remover parâmetro da URL e recarregar
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            // Recarregar página para aplicar a sessão
            window.location.reload();
            return;
        } catch (error) {
            console.error('❌ Erro ao configurar sessão de impersonation:', error);
        }
    }
    
    // ============================================================================
    // VERIFICAÇÃO CRÍTICA: Detectar se ESTA ABA está em modo desenvolvedor
    // ============================================================================
    // REGRA 1: Deve ter sessionStorage.dev_mode = 'true' (tab-specific)
    // REGRA 2: NÃO pode ter SessionManager com token normal ativo
    // REGRA 3: Deve ter dados de impersonation válidos
    
    const isThisTabDevMode = sessionStorage.getItem('dev_mode') === 'true';
    const hasDevToken = !!localStorage.getItem('dev_token');
    const hasDevUserData = !!localStorage.getItem('dev_userData');
    const hasNormalSession = window.SessionManager && window.SessionManager.getSession('token');
    
    // PROTEÇÃO 1: Se não tem dev_mode no sessionStorage, NÃO é dev mode
    if (!isThisTabDevMode) {
        console.log('ℹ️  Dev Mode Indicator: Sessão normal detectada (sem dev_mode em sessionStorage)');
        return;
    }
    
    // PROTEÇÃO 2: Se tem SessionManager ativo, é login normal (mesmo com dev_mode no localStorage de outra aba)
    if (hasNormalSession) {
        console.log('ℹ️  Dev Mode Indicator: Login normal detectado (SessionManager ativo)');
        return;
    }
    
    // PROTEÇÃO 3: Validar dados de impersonation
    if (!hasDevToken || !hasDevUserData) {
        console.warn('⚠️  Dev Mode Indicator: dev_mode ativo mas sem dados válidos. Limpando...');
        sessionStorage.removeItem('dev_mode');
        return;
    }
    
    console.log('✅ Dev Mode Indicator: Modo desenvolvedor confirmado (exibindo banner)');
    
    // Aguardar DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        createDevBanner();
        addDevStyles();
        addDevActions();
    }
    
    function createDevBanner() {
        // Obter userData do namespace correto
        const userData = window.getDevUserData ? window.getDevUserData() : null;
        
        const banner = document.createElement('div');
        banner.id = 'dev-mode-banner';
        banner.innerHTML = `
            <div class="dev-banner-content">
                <div class="dev-banner-left">
                    <span class="dev-icon">🛠️</span>
                    <div class="dev-info">
                        <strong>MODO DESENVOLVEDOR</strong>
                        ${userData ? `<span class="dev-user">Visualizando como: <strong>${userData.name}</strong> (Nível ${userData.nivel}) · ${userData.company.name}</span>` : ''}
                        ${impersonatedBy ? `<span class="dev-impersonator">Por: ${impersonatedBy}</span>` : ''}
                        <span class="dev-namespace">🔒 Sessão isolada (namespace: dev_*)</span>
                    </div>
                </div>
                <div class="dev-banner-right">
                    <button class="dev-btn" onclick="window.devModeActions.toggleInfo()">ℹ️ Info</button>
                    <button class="dev-btn" onclick="window.devModeActions.returnToDashboard()">🔙 Voltar</button>
                    <button class="dev-btn dev-btn-danger" onclick="window.devModeActions.exitDevMode()">❌ Sair</button>
                </div>
            </div>
        `;
        
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Adicionar padding ao body para compensar o banner
        document.body.style.paddingTop = '60px';
    }
    
    function addDevStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #dev-mode-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 0.75rem 1.5rem;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideDown 0.3s ease-out;
            }
            
            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .dev-banner-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .dev-banner-left {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .dev-icon {
                font-size: 1.5rem;
            }
            
            .dev-info {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .dev-info strong {
                font-size: 0.9rem;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            
            .dev-user, .dev-impersonator {
                font-size: 0.8rem;
                opacity: 0.95;
            }
            
            .dev-banner-right {
                display: flex;
                gap: 0.5rem;
            }
            
            .dev-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
            }
            
            .dev-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }
            
            .dev-btn-danger {
                background: rgba(220, 53, 69, 0.8);
            }
            
            .dev-btn-danger:hover {
                background: rgba(220, 53, 69, 1);
            }
            
            #dev-info-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            #dev-info-modal.active {
                display: flex;
            }
            
            .dev-info-content {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .dev-info-content h3 {
                margin-top: 0;
                color: #2d3748;
            }
            
            .dev-info-item {
                padding: 0.75rem;
                background: #f8f9fa;
                border-radius: 8px;
                margin-bottom: 0.75rem;
            }
            
            .dev-info-item label {
                display: block;
                font-size: 0.85rem;
                color: #6c757d;
                margin-bottom: 0.25rem;
                font-weight: 600;
            }
            
            .dev-info-item p {
                margin: 0;
                color: #2d3748;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                #dev-mode-banner {
                    padding: 0.5rem 1rem;
                }
                
                .dev-banner-content {
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .dev-banner-right {
                    width: 100%;
                    justify-content: center;
                }
                
                .dev-btn {
                    font-size: 0.75rem;
                    padding: 0.4rem 0.8rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    function addDevActions() {
        window.devModeActions = {
            toggleInfo: function() {
                const modal = document.getElementById('dev-info-modal');
                if (modal) {
                    modal.classList.toggle('active');
                } else {
                    createInfoModal();
                }
            },
            
            returnToDashboard: function() {
                if (confirm('Retornar ao painel de desenvolvedor?')) {
                    window.close(); // Tenta fechar a aba
                    // Se não conseguir fechar, redirecionar
                    setTimeout(() => {
                        window.location.href = '/desenvolvedor/dev-dashboard.html';
                    }, 100);
                }
            },
            
            exitDevMode: function() {
                if (confirm('Sair do modo desenvolvedor e retornar à área de desenvolvimento?')) {
                    // Limpar APENAS namespace de desenvolvedor
                    sessionStorage.removeItem('dev_mode');  // ← Tab-specific (CRÍTICO!)
                    localStorage.removeItem('dev_mode');
                    localStorage.removeItem('dev_impersonatedBy');
                    localStorage.removeItem('dev_token');
                    localStorage.removeItem('dev_userData');
                    localStorage.removeItem('dev_selectedRole');
                    localStorage.removeItem('dev_sessionTimestamp');
                    
                    console.log('✅ Sessão de desenvolvedor encerrada');
                    console.log('🔙 Retornando à área do desenvolvedor...');
                    
                    // Redirecionar para área do desenvolvedor
                    window.location.href = '/desenvolvedor/dev-dashboard.html';
                }
            }
        };
    }
    
    function createInfoModal() {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        const company = localStorage.getItem('company') ? JSON.parse(localStorage.getItem('company')) : null;
        const token = localStorage.getItem('token');
        
        const modal = document.createElement('div');
        modal.id = 'dev-info-modal';
        modal.innerHTML = `
            <div class="dev-info-content">
                <h3>🛠️ Informações da Sessão</h3>
                
                ${user ? `
                    <div class="dev-info-item">
                        <label>👤 Usuário</label>
                        <p>${user.name}</p>
                    </div>
                    <div class="dev-info-item">
                        <label>📧 Email</label>
                        <p>${user.email}</p>
                    </div>
                    <div class="dev-info-item">
                        <label>🏷️ Departamento</label>
                        <p>${user.department || '-'}</p>
                    </div>
                    <div class="dev-info-item">
                        <label>📊 Nível/Role</label>
                        <p>Nível ${user.nivel} - ${user.role}</p>
                    </div>
                    <div class="dev-info-item">
                        <label>🔑 Chave de Acesso</label>
                        <p>${user.access_key}</p>
                    </div>
                ` : ''}
                
                ${company ? `
                    <div class="dev-info-item">
                        <label>🏢 Empresa</label>
                        <p>${company.name}</p>
                    </div>
                    <div class="dev-info-item">
                        <label>🏭 Setor</label>
                        <p>${company.industry || '-'}</p>
                    </div>
                ` : ''}
                
                ${impersonatedBy ? `
                    <div class="dev-info-item">
                        <label>🧑‍💻 Impersonado por</label>
                        <p>${impersonatedBy}</p>
                    </div>
                ` : ''}
                
                ${token ? `
                    <div class="dev-info-item">
                        <label>🎫 Token (primeiros 50 chars)</label>
                        <p>${token.substring(0, 50)}...</p>
                    </div>
                ` : ''}
                
                <button class="dev-btn" onclick="window.devModeActions.toggleInfo()" style="width: 100%; margin-top: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('active');
        
        // Fechar ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    console.log('✅ Dev Mode Indicator carregado');
})();
