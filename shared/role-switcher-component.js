/**
 * Componente de Troca de Papel (Role Switcher)
 * Adicione este script em todos os dashboards que suportam multi-role
 * 
 * USO:
 * <script src="/shared/role-switcher-component.js"></script>
 * <div id="roleSwitcherContainer"></div>
 */

(function() {
    'use strict';

    // Mapeamento de níveis
    const ROLES = {
        0: { icon: '👑', title: 'Presidente', color: '#8b5cf6' },
        1: { icon: '⚙️', title: 'Administrador', color: '#3b82f6' },
        2: { icon: '💼', title: 'Diretor', color: '#10b981' },
        3: { icon: '📊', title: 'Gerente', color: '#f59e0b' },
        4: { icon: '📋', title: 'Coordenador', color: '#06b6d4' },
        5: { icon: '👥', title: 'Supervisor', color: '#8b5cf6' },
        6: { icon: '🎯', title: 'Especialista', color: '#ec4899' },
        7: { icon: '🔧', title: 'Operacional', color: '#6366f1' }
    };

    // CSS do componente
    const styles = `
        <style>
            .role-switcher-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }

            .role-switcher-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }

            .role-switcher-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }

            .role-switcher-modal.active {
                display: flex;
            }

            .role-switcher-content {
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }

            .role-switcher-header {
                margin-bottom: 20px;
            }

            .role-switcher-header h2 {
                font-size: 24px;
                color: #2d3748;
                margin-bottom: 10px;
            }

            .role-switcher-header p {
                color: #718096;
                font-size: 14px;
            }

            .role-option {
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid #e2e8f0;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .role-option:hover {
                border-color: #667eea;
                background: #f7fafc;
                transform: translateX(5px);
            }

            .role-option.current {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: #667eea;
            }

            .role-option-icon {
                font-size: 32px;
            }

            .role-option-info {
                flex: 1;
            }

            .role-option-title {
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 3px;
            }

            .role-option-level {
                font-size: 12px;
                opacity: 0.8;
            }

            .role-switcher-close {
                margin-top: 20px;
                width: 100%;
                padding: 12px;
                background: #e2e8f0;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .role-switcher-close:hover {
                background: #cbd5e0;
            }
        </style>
    `;

    // HTML do componente
    function createSwitcherHTML(currentRole, availableRoles) {
        const current = ROLES[currentRole] || { icon: '👤', title: 'Usuário' };
        
        return `
            ${styles}
            <button class="role-switcher-btn" onclick="window.RoleSwitcher.open()">
                <span>${current.icon}</span>
                <span>Papel: ${current.title}</span>
                <span>🔄</span>
            </button>

            <div class="role-switcher-modal" id="roleSwitcherModal">
                <div class="role-switcher-content">
                    <div class="role-switcher-header">
                        <h2>🔄 Trocar de Papel</h2>
                        <p>Selecione qual interface você deseja acessar:</p>
                    </div>
                    
                    <div id="roleOptions">
                        ${availableRoles.map(nivel => {
                            const role = ROLES[nivel];
                            const isCurrent = nivel === currentRole;
                            return `
                                <div class="role-option ${isCurrent ? 'current' : ''}" 
                                     onclick="window.RoleSwitcher.switchTo(${nivel})"
                                     style="cursor: ${isCurrent ? 'default' : 'pointer'}">
                                    <div class="role-option-icon">${role.icon}</div>
                                    <div class="role-option-info">
                                        <div class="role-option-title">${role.title}</div>
                                        <div class="role-option-level">Nível ${nivel}</div>
                                    </div>
                                    ${isCurrent ? '<span>✓ ATUAL</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <button class="role-switcher-close" onclick="window.RoleSwitcher.close()">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
    }

    // Funções públicas
    window.RoleSwitcher = {
        init: function() {
            const userData = localStorage.getItem('userData');
            if (!userData) return;

            const user = JSON.parse(userData);
            const currentRole = parseInt(localStorage.getItem('selectedRole') || user.nivel);
            
            // Obter papéis disponíveis
            let availableRoles = [user.nivel];
            if (user.additional_roles) {
                try {
                    const additional = JSON.parse(user.additional_roles);
                    availableRoles = [...new Set([...availableRoles, ...additional])];
                } catch (e) {
                    console.error('Erro ao parsear additional_roles:', e);
                }
            }

            // Se tem apenas 1 papel, não mostra o switcher
            if (availableRoles.length <= 1) return;

            // Criar container se não existir
            let container = document.getElementById('roleSwitcherContainer');
            if (!container) {
                // Procurar por .header-right ou criar no topo
                const headerRight = document.querySelector('.header-right');
                if (headerRight) {
                    container = document.createElement('div');
                    container.id = 'roleSwitcherContainer';
                    headerRight.insertBefore(container, headerRight.firstChild);
                }
            }

            if (container) {
                container.innerHTML = createSwitcherHTML(currentRole, availableRoles.sort());
            }
        },

        open: function() {
            document.getElementById('roleSwitcherModal').classList.add('active');
        },

        close: function() {
            document.getElementById('roleSwitcherModal').classList.remove('active');
        },

        switchTo: function(nivel) {
            const currentRole = parseInt(localStorage.getItem('selectedRole'));
            if (nivel === currentRole) {
                this.close();
                return;
            }

            // Redirecionar para a página de seleção com o papel já definido
            localStorage.setItem('selectedRole', nivel);
            
            // Obter o path correto
            const paths = {
                0: '/Nivel00-Presidentes/dashboard-presidentes.html',
                1: '/Nivel01-AdministradoresGerais/dashboard-admin.html',
                2: '/Nivel02-DiretoresExecutivos/dashboard-diretores.html',
                3: '/Nivel03-Gerentes/dashboard-gerentes.html',
                4: '/Nivel04-Coordenadores/dashboard-coordenadores.html',
                5: '/Nivel05-Supervisores/dashboard-supervisores.html',
                6: '/Nivel06-Especialistas/dashboard-especialistas.html',
                7: '/Nivel07-Operacional/dashboard-operacional.html'
            };

            window.location.href = paths[nivel] || '/';
        }
    };

    // Auto-inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.RoleSwitcher.init());
    } else {
        window.RoleSwitcher.init();
    }
})();
