/**
 * UI Permission Manager
 * 
 * Gerencia a interface baseado nas permissões do usuário.
 * Elementos sem permissão ficam visíveis mas bloqueados e opacos.
 */

class UIPermissionManager {
    constructor() {
        this.userLevel = null;
        this.permissions = null;
        this.init();
    }

    /**
     * Inicializa o gerenciador de permissões
     */
    init() {
        // Carregar dados do usuário
        const userData = localStorage.getItem('userData');
        const selectedRole = localStorage.getItem('selectedRole');

        if (userData && selectedRole) {
            const user = JSON.parse(userData);
            this.userLevel = parseInt(selectedRole);
            this.loadPermissions();
        }
    }

    /**
     * Carrega permissões do nível atual
     */
    loadPermissions() {
        // Importar do arquivo permissions.js
        if (typeof PERMISSIONS !== 'undefined') {
            this.permissions = PERMISSIONS[this.userLevel];
        }
    }

    /**
     * Aplica permissões a todos os elementos da página
     */
    applyPermissions() {
        if (!this.permissions) return;

        // Processar todos os elementos com atributo data-permission
        this.processPermissionElements();
        
        // Processar botões com atributo data-action
        this.processActionButtons();
        
        // Processar seções com atributo data-view
        this.processViewSections();
    }

    /**
     * Processa elementos com permissões genéricas
     */
    processPermissionElements() {
        const elements = document.querySelectorAll('[data-permission]');
        
        elements.forEach(element => {
            const permission = element.getAttribute('data-permission');
            const permissionType = element.getAttribute('data-permission-type') || 'action';
            
            let hasPermission = false;
            
            if (permissionType === 'view') {
                hasPermission = this.permissions.view[permission] === true;
            } else {
                hasPermission = this.permissions.actions[permission] === true;
            }
            
            if (!hasPermission) {
                this.blockElement(element);
            }
        });
    }

    /**
     * Processa botões de ação
     */
    processActionButtons() {
        const buttons = document.querySelectorAll('[data-action]');
        
        buttons.forEach(button => {
            const action = button.getAttribute('data-action');
            const hasPermission = this.permissions.actions[action] === true;
            
            if (!hasPermission) {
                this.blockButton(button);
            }
        });
    }

    /**
     * Processa seções de visualização
     */
    processViewSections() {
        const sections = document.querySelectorAll('[data-view]');
        
        sections.forEach(section => {
            const viewPermission = section.getAttribute('data-view');
            const hasPermission = this.permissions.view[viewPermission] === true;
            
            if (!hasPermission) {
                this.hideSection(section);
            }
        });
    }

    /**
     * Bloqueia um elemento mantendo-o visível mas inativo
     */
    blockElement(element) {
        element.classList.add('permission-blocked');
        element.style.opacity = '0.4';
        element.style.cursor = 'not-allowed';
        element.style.pointerEvents = 'none';
        
        // Adicionar tooltip explicativo
        const reason = element.getAttribute('data-block-reason') || 
                      'Você não tem permissão para realizar esta ação';
        element.setAttribute('title', reason);
        
        // Se for input/select, desabilitar
        if (element.tagName === 'INPUT' || 
            element.tagName === 'SELECT' || 
            element.tagName === 'TEXTAREA') {
            element.disabled = true;
        }
    }

    /**
     * Bloqueia um botão
     */
    blockButton(button) {
        button.classList.add('permission-blocked');
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
        
        const reason = button.getAttribute('data-block-reason') || 
                      'Ação não permitida para seu nível';
        button.setAttribute('title', reason);
        
        // Adicionar ícone de cadeado
        if (!button.querySelector('.permission-lock-icon')) {
            const lockIcon = document.createElement('span');
            lockIcon.className = 'permission-lock-icon';
            lockIcon.innerHTML = ' 🔒';
            lockIcon.style.marginLeft = '5px';
            button.appendChild(lockIcon);
        }
        
        // Remover onclick se existir
        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showPermissionDeniedMessage(button);
        };
    }

    /**
     * Oculta uma seção completamente
     */
    hideSection(section) {
        const hideMode = section.getAttribute('data-hide-mode') || 'remove';
        
        if (hideMode === 'remove') {
            section.style.display = 'none';
        } else if (hideMode === 'blur') {
            section.style.filter = 'blur(8px)';
            section.style.opacity = '0.3';
            section.style.pointerEvents = 'none';
        }
    }

    /**
     * Mostra mensagem de permissão negada
     */
    showPermissionDeniedMessage(element) {
        const action = element.getAttribute('data-action') || 'esta ação';
        const requiredLevel = element.getAttribute('data-required-level');
        
        let message = `Você não tem permissão para: ${action}`;
        
        if (requiredLevel) {
            message += `\n\nNível necessário: ${this.getLevelName(requiredLevel)}`;
            message += `\nSeu nível atual: ${this.getLevelName(this.userLevel)}`;
        }
        
        this.showToast(message, 'warning');
    }

    /**
     * Obtém nome do nível hierárquico
     */
    getLevelName(level) {
        const names = {
            0: 'Presidente/C-Level',
            1: 'Administrador Geral',
            2: 'Diretor Executivo',
            3: 'Gerente',
            4: 'Coordenador',
            5: 'Supervisor',
            6: 'Especialista',
            7: 'Operacional'
        };
        return names[level] || 'Desconhecido';
    }

    /**
     * Mostra toast/notificação
     */
    showToast(message, type = 'info') {
        // Criar toast element
        const toast = document.createElement('div');
        toast.className = `permission-toast permission-toast-${type}`;
        toast.innerHTML = `
            <div class="permission-toast-content">
                <span class="permission-toast-icon">${type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <span class="permission-toast-message">${message}</span>
            </div>
        `;
        
        // Adicionar estilos inline
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'warning' ? '#856404' : '#0c5460'};
            border: 1px solid ${type === 'warning' ? '#ffeaa7' : '#bee5eb'};
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Remover após 4 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    /**
     * Verifica se usuário pode executar ação
     */
    canDo(action) {
        if (!this.permissions) return false;
        return this.permissions.actions[action] === true;
    }

    /**
     * Verifica se usuário pode visualizar
     */
    canView(view) {
        if (!this.permissions) return false;
        return this.permissions.view[view] === true;
    }

    /**
     * Bloqueia dados sensíveis em tabelas/cards
     */
    maskSensitiveData() {
        const sensitiveElements = document.querySelectorAll('[data-sensitive]');
        
        sensitiveElements.forEach(element => {
            const requiredLevel = parseInt(element.getAttribute('data-required-level') || 0);
            
            if (this.userLevel > requiredLevel) {
                // Usuário não tem nível suficiente, mascarar dados
                element.textContent = '•••••';
                element.style.opacity = '0.3';
                element.setAttribute('title', 'Informação restrita');
            }
        });
    }

    /**
     * Adiciona indicador visual de permissões na página
     */
    addPermissionIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'permission-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 12px;
                z-index: 9999;
                display: none;
            ">
                <strong>Nível:</strong> ${this.getLevelName(this.userLevel)}
                <br>
                <small style="opacity: 0.7;">Alguns elementos podem estar bloqueados</small>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Mostrar quando hover em elemento bloqueado
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('permission-blocked')) {
                indicator.firstElementChild.style.display = 'block';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('permission-blocked')) {
                indicator.firstElementChild.style.display = 'none';
            }
        });
    }
}

// Criar instância global
window.PermissionManager = new UIPermissionManager();

// Auto-aplicar quando DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PermissionManager.applyPermissions();
        window.PermissionManager.maskSensitiveData();
        window.PermissionManager.addPermissionIndicator();
    });
} else {
    window.PermissionManager.applyPermissions();
    window.PermissionManager.maskSensitiveData();
    window.PermissionManager.addPermissionIndicator();
}

// CSS para animações
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

    .permission-blocked {
        position: relative;
    }

    .permission-blocked::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(200, 200, 200, 0.1);
        pointer-events: none;
    }

    .permission-toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .permission-toast-icon {
        font-size: 20px;
    }

    .permission-toast-message {
        flex: 1;
        white-space: pre-line;
    }
`;
document.head.appendChild(style);
