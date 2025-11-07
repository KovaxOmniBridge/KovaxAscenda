/**
 * Session Manager - Gerenciamento de Múltiplas Sessões Simultâneas
 * 
 * Permite que múltiplos usuários (de mesma ou diferentes empresas) 
 * acessem o sistema simultaneamente na mesma máquina usando abas diferentes.
 * 
 * Estratégia:
 * 1. Cada ABA tem seu próprio ID único (sessionStorage)
 * 2. Sessões são armazenadas com prefixo do ID da aba
 * 3. sessionStorage é usado como primário (isolamento por aba)
 * 4. localStorage é usado como backup para persistência
 * 
 * DEVE SER CARREGADO ANTES DE dashboard-common.js e dev-session-handler.js
 */

(function() {
    'use strict';
    
    console.log('🔐 Session Manager - Inicializando sistema multi-sessão...');
    
    // Gerar ou recuperar ID único da aba
    let tabId = sessionStorage.getItem('tabId');
    
    if (!tabId) {
        // Gerar novo ID único para esta aba
        tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('tabId', tabId);
        console.log('🆕 Nova aba detectada. ID:', tabId);
    } else {
        console.log('♻️ Aba existente. ID:', tabId);
    }
    
    // Contador de abas ativas (localStorage compartilhado)
    const activeTabsKey = 'activeTabs';
    let activeTabs = JSON.parse(localStorage.getItem(activeTabsKey) || '[]');
    
    // Adicionar esta aba se não existir
    if (!activeTabs.includes(tabId)) {
        activeTabs.push(tabId);
        localStorage.setItem(activeTabsKey, JSON.stringify(activeTabs));
        console.log(`📊 Abas ativas: ${activeTabs.length}`);
    }
    
    // Limpar abas inativas ao fechar
    window.addEventListener('beforeunload', function() {
        const tabs = JSON.parse(localStorage.getItem(activeTabsKey) || '[]');
        const filtered = tabs.filter(id => id !== tabId);
        localStorage.setItem(activeTabsKey, JSON.stringify(filtered));
        console.log('👋 Aba fechada. ID:', tabId);
    });
    
    /**
     * API de Gerenciamento de Sessão
     */
    const SessionManager = {
        
        /**
         * Obtém o ID único desta aba
         */
        getTabId: function() {
            return tabId;
        },
        
        /**
         * Salva dados da sessão (usa sessionStorage + localStorage como backup)
         * @param {string} key - Chave dos dados
         * @param {any} value - Valor a ser salvo
         * @param {boolean} persistent - Se true, salva também no localStorage
         */
        setSession: function(key, value, persistent = false) {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            
            // Sempre salvar no sessionStorage (específico da aba)
            sessionStorage.setItem(key, stringValue);
            
            // Se persistente, salvar também no localStorage
            if (persistent) {
                const persistentKey = `${tabId}_${key}`;
                localStorage.setItem(persistentKey, stringValue);
                console.log(`💾 Sessão salva (persistente): ${key}`);
            } else {
                console.log(`💾 Sessão salva (aba): ${key}`);
            }
        },
        
        /**
         * Obtém dados da sessão
         * @param {string} key - Chave dos dados
         * @param {boolean} json - Se true, faz parse JSON
         */
        getSession: function(key, json = false) {
            // Tentar obter do sessionStorage primeiro (específico da aba)
            let value = sessionStorage.getItem(key);
            
            // Se não encontrou, tentar localStorage com prefixo do tabId
            if (!value) {
                const persistentKey = `${tabId}_${key}`;
                value = localStorage.getItem(persistentKey);
            }
            
            if (!value) return null;
            
            if (json) {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    console.error('❌ Erro ao parsear JSON:', e);
                    return null;
                }
            }
            
            return value;
        },
        
        /**
         * Remove dados da sessão
         * @param {string} key - Chave dos dados
         */
        removeSession: function(key) {
            sessionStorage.removeItem(key);
            
            // Remover também do localStorage se existir
            const persistentKey = `${tabId}_${key}`;
            localStorage.removeItem(persistentKey);
            
            console.log(`🗑️ Sessão removida: ${key}`);
        },
        
        /**
         * Limpa toda a sessão da aba atual
         */
        clearSession: function() {
            // Limpar sessionStorage
            sessionStorage.clear();
            
            // Limpar localStorage com prefixo desta aba
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(tabId + '_')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            console.log('🧹 Sessão da aba limpa completamente');
        },
        
        /**
         * Lista todas as sessões ativas
         */
        getActiveSessions: function() {
            const tabs = JSON.parse(localStorage.getItem(activeTabsKey) || '[]');
            const sessions = [];
            
            tabs.forEach(tabIdItem => {
                // Procurar userData de cada aba
                const userDataKey = `${tabIdItem}_userData`;
                const userData = localStorage.getItem(userDataKey);
                
                if (userData) {
                    try {
                        const parsed = JSON.parse(userData);
                        sessions.push({
                            tabId: tabIdItem,
                            user: parsed.name,
                            company: parsed.company?.name,
                            nivel: parsed.nivel,
                            isCurrent: tabIdItem === tabId
                        });
                    } catch (e) {
                        // Ignorar dados inválidos
                    }
                }
            });
            
            return sessions;
        },
        
        /**
         * Verifica se há conflito de sessão (mesma empresa/usuário em outra aba)
         */
        checkSessionConflict: function() {
            const currentUser = this.getSession('userData', true);
            if (!currentUser) return null;
            
            const sessions = this.getActiveSessions();
            const conflicts = sessions.filter(s => 
                s.tabId !== tabId && 
                s.user === currentUser.name && 
                s.company === currentUser.company?.name
            );
            
            return conflicts.length > 0 ? conflicts : null;
        },
        
        /**
         * Exibe informações de debug das sessões
         */
        debugSessions: function() {
            console.group('🔍 Debug de Sessões');
            console.log('📍 Aba Atual:', tabId);
            console.log('📊 Sessões Ativas:', this.getActiveSessions());
            console.log('💾 sessionStorage:', Object.keys(sessionStorage));
            console.log('💾 localStorage (desta aba):', 
                Object.keys(localStorage).filter(k => k.startsWith(tabId))
            );
            console.groupEnd();
        }
    };
    
    // Expor API globalmente
    window.SessionManager = SessionManager;
    
    // Debug inicial
    console.log('✅ Session Manager inicializado');
    console.log(`📍 Tab ID: ${tabId}`);
    console.log(`📊 Abas ativas: ${activeTabs.length}`);
    
    // Exibir aviso se houver múltiplas sessões
    if (activeTabs.length > 1) {
        console.warn(`⚠️ Múltiplas abas detectadas (${activeTabs.length}). Sistema multi-sessão ativo.`);
    }
    
})();
