/**
 * Dev Session Handler
 * Detecta e configura sessões de impersonation do modo desenvolvedor
 * DEVE SER CARREGADO ANTES DE dashboard-common.js
 * 
 * IMPORTANTE: Usa namespace isolado (dev_*) para evitar conflito com sessões normais
 */

(function() {
    console.log('🔍 Dev Session Handler - Verificando parâmetros de impersonation...');
    
    // Verificar se há parâmetro de impersonation na URL
    const urlParams = new URLSearchParams(window.location.search);
    const impersonateData = urlParams.get('impersonate');
    
    if (impersonateData) {
        console.log('🎭 Parâmetro de impersonation detectado!');
        
        try {
            // Decodificar Base64 com suporte UTF-8
            const jsonString = decodeURIComponent(escape(atob(impersonateData)));
            const sessionData = JSON.parse(jsonString);
            
            console.log('✅ Dados de sessão decodificados:', {
                user: sessionData.user.name,
                nivel: sessionData.user.nivel,
                company: sessionData.company.name,
                devMode: sessionData.devMode,
                impersonatedBy: sessionData.impersonatedBy
            });
            
            // ⚠️ NAMESPACE ISOLADO: Usar prefixo "dev_" para evitar conflito com sessões normais
            // Isso permite que desenvolvedor e usuário normal acessem simultaneamente
            
            // Preservar devToken original (sem namespace, pois é específico do painel dev)
            const devToken = localStorage.getItem('devToken');
            const devUser = localStorage.getItem('devUser');
            
            // Configurar localStorage com NAMESPACE ISOLADO (dev_*)
            localStorage.setItem('dev_token', sessionData.token);
            localStorage.setItem('dev_userData', JSON.stringify({
                id: sessionData.user.id,
                name: sessionData.user.name,
                email: sessionData.user.email,
                phone: sessionData.user.phone,
                department: sessionData.user.department,
                access_key: sessionData.user.access_key,
                role: sessionData.user.role,
                nivel: sessionData.user.nivel,
                isPrimary: sessionData.user.is_primary,
                company: sessionData.company
            }));
            
            // Marcar que está em modo desenvolvedor
            // IMPORTANTE: Usar sessionStorage (específico da aba) + localStorage (backup)
            sessionStorage.setItem('dev_mode', 'true');  // ← Tab-specific
            localStorage.setItem('dev_mode', 'true');     // ← Backup (compartilhado)
            localStorage.setItem('dev_impersonatedBy', sessionData.impersonatedBy);
            localStorage.setItem('dev_sessionTimestamp', Date.now().toString());
            
            // Restaurar tokens de desenvolvedor se existiam
            if (devToken) {
                localStorage.setItem('devToken', devToken);
            }
            if (devUser) {
                localStorage.setItem('devUser', devUser);
            }
            
            // Limpar URL (remover parâmetro impersonate para evitar reprocessamento)
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            console.log('✅ Sessão de impersonation configurada com sucesso!');
            console.log('🎭 Modo Desenvolvedor ATIVO (namespace isolado: dev_*)');
            console.log(`👤 Personificando: ${sessionData.user.name} (${sessionData.company.name})`);
            console.log(`🧑‍💻 Personificado por: ${sessionData.impersonatedBy}`);
            console.log('ℹ️  Sessão normal do usuário (se existir) não será afetada');
            
        } catch (error) {
            console.error('❌ Erro ao processar dados de impersonation:', error);
            alert('❌ Erro ao configurar sessão de desenvolvedor. Dados inválidos.');
            
            // Redirecionar de volta para o painel dev em caso de erro
            window.location.href = '/desenvolvedor/dev-dashboard.html';
        }
    } else {
        // Não há impersonation - verificar se está em devMode mas sem parâmetro
        const isDevMode = localStorage.getItem('dev_mode') === 'true';
        
        if (isDevMode) {
            console.log('🎭 Modo desenvolvedor detectado no localStorage (namespace: dev_*)');
            console.log(`👤 Personificando: ${getDevUserData()?.name || 'Desconhecido'}`);
            console.log(`🧑‍💻 Personificado por: ${localStorage.getItem('dev_impersonatedBy') || 'Desconhecido'}`);
            
            // Verificar idade da sessão (expirar após 24h)
            const sessionTimestamp = parseInt(localStorage.getItem('dev_sessionTimestamp') || '0');
            const sessionAge = Date.now() - sessionTimestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 horas
            
            if (sessionAge > maxAge) {
                console.warn('⚠️ Sessão de desenvolvedor expirada (>24h). Limpando...');
                clearDevSession();
                alert('⚠️ Sessão de desenvolvedor expirou. Faça impersonation novamente.');
                window.location.href = '/desenvolvedor/dev-dashboard.html';
            }
        }
    }
    
    // Helper para obter userData do NAMESPACE DE DESENVOLVEDOR
    function getDevUserData() {
        try {
            const userDataString = localStorage.getItem('dev_userData');
            if (!userDataString) return null;
            return JSON.parse(userDataString);
        } catch (e) {
            return null;
        }
    }
    
    // Função para limpar sessão de desenvolvedor
    function clearDevSession() {
        localStorage.removeItem('dev_token');
        localStorage.removeItem('dev_userData');
        localStorage.removeItem('dev_mode');
        localStorage.removeItem('dev_impersonatedBy');
        localStorage.removeItem('dev_sessionTimestamp');
        console.log('🧹 Sessão de desenvolvedor limpa');
    }
    
    // Expor funções globalmente para uso em outros scripts
    window.getDevUserData = getDevUserData;
    window.clearDevSession = clearDevSession;
})();
