/**
 * ============================================================================
 * PROTEÇÃO DA ÁREA DE DESENVOLVIMENTO
 * ============================================================================
 * Este script DEVE ser o PRIMEIRO a ser carregado em TODAS as páginas
 * da pasta /desenvolvedor/ para bloquear acesso de usuários normais
 * 
 * REGRA FUNDAMENTAL:
 * Apenas desenvolvedores com credenciais específicas podem acessar esta área
 * Usuários de empresas (login normal) NÃO podem acessar de forma alguma
 * ============================================================================
 */

(function() {
    'use strict';
    
    console.log('🛡️ Dev Protection: Verificando acesso à área de desenvolvimento...');
    
    // ========================================================================
    // VERIFICAÇÃO 1: Detectar se é um usuário normal tentando acessar
    // ========================================================================
    
    const hasNormalUserSession = (
        // Tem token de sessão normal
        (window.SessionManager && window.SessionManager.getSession('token')) ||
        localStorage.getItem('token') ||
        // Tem userData de usuário normal (não desenvolvedor)
        localStorage.getItem('userData')
    );
    
    const hasDevSession = (
        localStorage.getItem('devToken') || 
        localStorage.getItem('devUser')
    );
    
    // Se tem sessão de usuário normal mas NÃO tem sessão dev, BLOQUEAR
    if (hasNormalUserSession && !hasDevSession) {
        console.error('🚫 ACESSO NEGADO: Usuários normais não podem acessar a área de desenvolvimento');
        console.error('🔒 Redirecionando para dashboard do usuário...');
        
        alert('🚫 ACESSO NEGADO\n\nA área de desenvolvimento é restrita apenas para desenvolvedores.\n\nVocê será redirecionado para seu dashboard.');
        
        // Redirecionar para o dashboard correto do usuário
        try {
            const userData = window.SessionManager 
                ? window.SessionManager.getSession('userData', true)
                : JSON.parse(localStorage.getItem('userData'));
            
            if (userData && userData.nivel !== undefined) {
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
                
                setTimeout(() => {
                    window.location.href = dashboards[userData.nivel] || '/index.html';
                }, 1000);
            } else {
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            }
        } catch (e) {
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
        }
        
        // Parar execução de qualquer outro script
        throw new Error('Acesso negado: Usuário normal não autorizado na área de desenvolvimento');
    }
    
    // ========================================================================
    // VERIFICAÇÃO 2: Na página de login dev, limpar sessões normais
    // ========================================================================
    
    if (window.location.pathname.includes('/dev-login.html')) {
        console.log('📋 Página de login dev: limpando possíveis sessões normais...');
        
        // Limpar APENAS dados de usuário normal, preservar devToken se existir
        const devToken = localStorage.getItem('devToken');
        const devUser = localStorage.getItem('devUser');
        
        // Limpar sessão normal
        if (window.SessionManager) {
            window.SessionManager.clearSession();
        }
        
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('selectedRole');
        sessionStorage.clear();
        
        // Restaurar credenciais dev se existiam
        if (devToken) localStorage.setItem('devToken', devToken);
        if (devUser) localStorage.setItem('devUser', devUser);
        
        console.log('✅ Sessões normais limpas, área dev protegida');
    }
    
    // ========================================================================
    // VERIFICAÇÃO 3: Em páginas do dashboard dev, validar autenticação dev
    // ========================================================================
    
    if (window.location.pathname.includes('/dev-dashboard.html')) {
        console.log('🔍 Dashboard dev: validando autenticação de desenvolvedor...');
        
        const devToken = localStorage.getItem('devToken');
        const devUser = localStorage.getItem('devUser');
        
        if (!devToken || !devUser) {
            console.error('❌ Sem credenciais de desenvolvedor. Redirecionando para login dev...');
            alert('⚠️ Sessão de desenvolvedor não encontrada.\n\nFaça login como desenvolvedor.');
            setTimeout(() => {
                window.location.href = '/desenvolvedor/dev-login.html';
            }, 500);
            throw new Error('Autenticação de desenvolvedor necessária');
        }
        
        console.log('✅ Desenvolvedor autenticado:', JSON.parse(devUser).email);
    }
    
    // ========================================================================
    // VERIFICAÇÃO 4: Bloquear manipulação via console
    // ========================================================================
    
    // Adicionar observador para detectar tentativas de forjar sessão dev
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Se alguém tentar criar devToken/devUser sem autenticação real
        if ((key === 'devToken' || key === 'devUser') && !window.__devAuthVerified__) {
            console.error('🚫 BLOQUEADO: Tentativa de forjar credenciais de desenvolvedor detectada');
            return;
        }
        return originalSetItem.apply(this, arguments);
    };
    
    console.log('✅ Dev Protection: Proteções ativadas');
    
})();

/**
 * ============================================================================
 * GUIA DE USO
 * ============================================================================
 * 
 * Para adicionar este script em TODAS as páginas do desenvolvedor:
 * 
 * <head>
 *     <meta charset="UTF-8">
 *     <!-- PRIMEIRO SCRIPT - CRÍTICO -->
 *     <script src="dev-protection.js"></script>
 *     <!-- Outros scripts depois... -->
 * </head>
 * 
 * ============================================================================
 */
