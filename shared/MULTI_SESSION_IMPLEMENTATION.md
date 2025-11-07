# Sistema Multi-Sessão - Implementação Completa

## 📋 Visão Geral

O sistema agora suporta **múltiplas sessões simultâneas** na mesma máquina, permitindo que:
- ✅ Múltiplos usuários da mesma empresa façam login simultaneamente
- ✅ Múltiplos usuários de empresas diferentes façam login simultaneamente
- ✅ O mesmo usuário faça login em múltiplas abas (com detecção de conflito disponível)
- ✅ Desenvolvedores mantenham sessão isolada no namespace `dev_*`
- ✅ Cada aba do navegador mantenha sua própria sessão independente

## 🏗️ Arquitetura

### 1. **SessionManager (session-manager.js)**

Sistema de gerenciamento de sessões baseado em:
- **sessionStorage**: Armazenamento específico por aba (isolamento automático)
- **localStorage**: Backup persistente com prefixo `tab_` único
- **Tab ID único**: Cada aba recebe identificador único na primeira carga

```javascript
// Estrutura do Tab ID
'tab_' + Date.now() + '_' + Math.random()
// Exemplo: tab_1234567890123_0.456789
```

### 2. **Namespace Isolation**

Três camadas de isolamento:

#### Normal Users (por aba)
```
sessionStorage:
  - tabId: 'tab_1234567890123_0.456789'
  - token: 'jwt_token_here'
  - userData: '{...}'
  - selectedRole: '3'

localStorage:
  - tab_1234567890123_0.456789_token: 'jwt_token_here' (backup)
  - tab_1234567890123_0.456789_userData: '{...}' (backup)
  - activeTabs: ['tab_123...', 'tab_456...', ...]
```

#### Developer Mode
```
localStorage:
  - dev_token: 'jwt_token_impersonated'
  - dev_userData: '{...}'
  - dev_mode: 'true'
  - dev_impersonatedBy: 'dev@ascenda.com'
  - dev_sessionTimestamp: 1234567890123
  - devToken: 'jwt_token_developer' (credenciais originais)
  - devUser: '{...}' (dados originais do dev)
```

## 🔧 Integração com Sistema Existente

### 1. **Login Flow (script.js)**

```javascript
// Login bem-sucedido
if (window.SessionManager) {
    window.SessionManager.setSession('token', data.token, true);
    window.SessionManager.setSession('userData', JSON.stringify(data.user), true);
    window.SessionManager.setSession('selectedRole', data.user.nivel.toString(), true);
    console.log('💾 Sessão salva via SessionManager (Tab ID:', window.SessionManager.getTabId() + ')');
} else {
    // Fallback para modo compatibilidade
    localStorage.setItem('token', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
}
```

### 2. **Dashboard Initialization (dashboard-common.js)**

```javascript
function initDashboard(requiredLevel) {
    const isDevMode = localStorage.getItem('dev_mode') === 'true';
    
    let token, userData;
    
    if (isDevMode) {
        // Modo desenvolvedor: namespace dev_*
        token = localStorage.getItem('dev_token');
        userData = window.getDevUserData ? window.getDevUserData() : null;
    } else if (window.SessionManager) {
        // Multi-sessão: SessionManager
        token = window.SessionManager.getSession('token');
        userData = window.SessionManager.getSession('userData', true);
        
        // Log de múltiplas sessões
        const sessions = window.SessionManager.getActiveSessions();
        if (sessions.length > 1) {
            console.log(`📊 Múltiplas sessões ativas (${sessions.length}):`, sessions);
        }
    } else {
        // Fallback: localStorage tradicional
        token = localStorage.getItem('token');
        userData = localStorage.getItem('userData');
    }
    
    // Validação e redirecionamento...
}
```

### 3. **Logout Flow**

```javascript
function logout() {
    const isDevMode = localStorage.getItem('dev_mode') === 'true';
    
    if (isDevMode) {
        // Limpa apenas namespace dev_*
        localStorage.removeItem('dev_token');
        localStorage.removeItem('dev_userData');
        // ... outros dev_* keys
        window.location.href = '/desenvolvedor/dev-dashboard.html';
    } else if (window.SessionManager) {
        // Limpa apenas sessão da aba atual
        const sessions = window.SessionManager.getActiveSessions();
        const hasMultipleSessions = sessions.length > 1;
        
        if (confirm(`Deseja sair desta sessão?\n\n(${sessions.length - 1} outra(s) sessão(ões) ativa(s) serão preservadas)`)) {
            window.SessionManager.clearSession();
            window.location.href = '/index.html';
        }
    } else {
        // Fallback: limpa localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/index.html';
    }
}
```

## 📚 API do SessionManager

### Métodos Principais

#### `getTabId()`
Retorna o ID único da aba atual.

```javascript
const tabId = window.SessionManager.getTabId();
// Retorna: 'tab_1234567890123_0.456789'
```

#### `setSession(key, value, persistent = false)`
Salva um valor na sessão da aba.

```javascript
// Apenas sessionStorage (não sobrevive reload)
window.SessionManager.setSession('tempData', 'valor');

// sessionStorage + localStorage (sobrevive reload)
window.SessionManager.setSession('token', 'jwt_token', true);
```

#### `getSession(key, parseJSON = false)`
Recupera um valor da sessão.

```javascript
// String simples
const token = window.SessionManager.getSession('token');

// Parse automático de JSON
const userData = window.SessionManager.getSession('userData', true);
```

#### `removeSession(key)`
Remove um valor da sessão (sessionStorage + localStorage).

```javascript
window.SessionManager.removeSession('token');
```

#### `clearSession()`
Limpa toda a sessão da aba atual.

```javascript
window.SessionManager.clearSession();
```

#### `getActiveSessions()`
Retorna array com todas as sessões ativas.

```javascript
const sessions = window.SessionManager.getActiveSessions();
// Retorna:
[
    {
        tabId: 'tab_123...',
        user: { name: 'João', nivel: 3, ... },
        company: 'TechStart Inovações',
        nivel: 3,
        isCurrent: true
    },
    {
        tabId: 'tab_456...',
        user: { name: 'Maria', nivel: 1, ... },
        company: 'MegaCorporation',
        nivel: 1,
        isCurrent: false
    }
]
```

#### `checkSessionConflict()`
Detecta se o mesmo usuário está logado em outra aba.

```javascript
const conflict = window.SessionManager.checkSessionConflict();
if (conflict) {
    console.warn('⚠️ Mesmo usuário em múltiplas abas:', conflict);
}
// Retorna: { hasConflict: true, conflictingTabId: 'tab_456...', userData: {...} }
```

#### `debugSessions()`
Exibe informações de debug no console.

```javascript
window.SessionManager.debugSessions();
// Console output:
// 🐛 SessionManager Debug
// Tab ID atual: tab_123...
// Tabs ativos: 3
// ...
```

## 🔄 Ordem de Carregamento de Scripts

**CRÍTICO**: A ordem dos scripts é essencial para o funcionamento correto.

```html
<!-- 1. SessionManager (PRIMEIRO - gerencia sessões) -->
<script src="../shared/session-manager.js"></script>

<!-- 2. Dev Session Handler (processa impersonation) -->
<script src="../shared/dev-session-handler.js"></script>

<!-- 3. Dashboard Common (utilitários que usam SessionManager) -->
<script src="../shared/dashboard-common.js"></script>

<!-- 4. Dev Mode Indicator (banner visual) -->
<script src="../shared/dev-mode-indicator.js"></script>

<!-- 5. Dashboard específico (lógica da página) -->
<script src="dashboard-[nivel].js"></script>
```

## 🧪 Testando Multi-Sessão

### Teste 1: Múltiplos Usuários da Mesma Empresa

1. Abra 3 abas do navegador
2. Logue com usuários diferentes:
   - Aba 1: `TS-0001` / `senha123` (Nível 0)
   - Aba 2: `TS-0002` / `senha123` (Nível 1)
   - Aba 3: `TS-0003` / `senha123` (Nível 7)
3. Verifique que cada aba mantém sua própria sessão independente
4. No console, execute: `SessionManager.debugSessions()`
5. Confirme que 3 sessões ativas são mostradas

### Teste 2: Múltiplos Usuários de Empresas Diferentes

1. Abra 2 abas
2. Logue com:
   - Aba 1: `TS-0001` (TechStart)
   - Aba 2: `MC-0001` (MediumCorp)
3. Verifique que os dados de empresa são diferentes em cada aba
4. Execute `SessionManager.getActiveSessions()` em qualquer aba
5. Confirme que ambas as empresas aparecem na lista

### Teste 3: Mesmo Usuário, Múltiplas Abas

1. Abra 2 abas
2. Logue com `TS-0001` em ambas
3. No console: `SessionManager.checkSessionConflict()`
4. Deverá retornar `{ hasConflict: true, ... }`
5. Ambas as abas funcionam normalmente (não há bloqueio)

### Teste 4: Dev Mode + Usuários Normais

1. Aba 1: Login como desenvolvedor
2. Aba 1: Use "Explorar Interfaces" para impersonar `TS-0001`
3. Aba 2: Login normal com `MC-0001`
4. Verifique que:
   - Aba 1 tem banner de dev mode (`dev_*` namespace)
   - Aba 2 é sessão normal (SessionManager)
   - Ambas funcionam independentemente

## 🔍 Debugging

### Ver Todas as Sessões Ativas

```javascript
console.table(SessionManager.getActiveSessions());
```

### Ver Dados da Sessão Atual

```javascript
console.log('Token:', SessionManager.getSession('token'));
console.log('User:', SessionManager.getSession('userData', true));
console.log('Role:', SessionManager.getSession('selectedRole'));
```

### Ver Todos os Dados no Storage

```javascript
// sessionStorage da aba atual
console.table(Object.entries(sessionStorage));

// localStorage compartilhado (com prefixos tab_*)
console.table(Object.entries(localStorage));
```

### Limpar Todas as Sessões (Reset Total)

```javascript
// Limpa TODAS as sessões de TODAS as abas
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## ⚠️ Considerações Importantes

### 1. **Cleanup Automático**
- Quando uma aba é fechada, o evento `beforeunload` remove automaticamente o `tabId` da lista `activeTabs`
- Dados em `sessionStorage` são destruídos automaticamente pelo navegador
- Dados em `localStorage` com prefixo `tab_*` permanecem (podem ser limpos manualmente)

### 2. **Sincronização entre Abas**
- Não há sincronização automática entre abas
- Cada aba é completamente independente
- Mudanças em uma aba não afetam outras abas

### 3. **Performance**
- `sessionStorage` é mais rápido que `localStorage`
- Leitura prioriza `sessionStorage` (tab-specific)
- `localStorage` usado apenas como backup persistente

### 4. **Compatibilidade**
- Sistema tem fallback para `localStorage` tradicional
- Se `SessionManager` não estiver disponível, usa modo compatibilidade
- Todos os dashboards funcionam com ou sem SessionManager

## 🎯 Próximos Passos (Opcionais)

### 1. **Indicador Visual de Múltiplas Sessões**
Adicionar componente UI mostrando quantas sessões estão ativas:

```javascript
function showSessionIndicator() {
    const sessions = SessionManager.getActiveSessions();
    if (sessions.length > 1) {
        const indicator = document.createElement('div');
        indicator.className = 'multi-session-indicator';
        indicator.innerHTML = `
            <span>📊 ${sessions.length} sessões ativas</span>
            <button onclick="viewAllSessions()">Ver todas</button>
        `;
        document.body.appendChild(indicator);
    }
}
```

### 2. **Alerta de Conflito de Sessão**
Avisar quando o mesmo usuário loga em múltiplas abas:

```javascript
const conflict = SessionManager.checkSessionConflict();
if (conflict.hasConflict) {
    showWarning('Este usuário já está logado em outra aba');
}
```

### 3. **Seletor de Sessões**
Permitir trocar entre sessões ativas sem fazer logout:

```javascript
function switchToSession(tabId) {
    // Copiar dados da sessão alvo para aba atual
    const targetToken = localStorage.getItem(`${tabId}_token`);
    SessionManager.setSession('token', targetToken, true);
    location.reload();
}
```

## 📝 Resumo dos Arquivos Modificados

### Criados
- ✅ `shared/session-manager.js` - Sistema multi-sessão completo

### Atualizados
- ✅ `shared/dashboard-common.js` - Integração SessionManager (getUserData, fetchAPI, initDashboard, logout)
- ✅ `script.js` - Login flow usa SessionManager.setSession()
- ✅ `index.html` - Carrega session-manager.js
- ✅ `Nivel00-Presidentes/dashboard-presidentes.html` - Scripts atualizados
- ✅ `Nivel01-AdministradoresGerais/dashboard-admin.html` - Scripts atualizados
- ✅ `Nivel02-DiretoresExecutivos/dashboard-diretores.html` - Scripts atualizados
- ✅ `Nivel03-Gerentes/dashboard-gerentes.html` - Scripts atualizados
- ✅ `Nivel04-Coordenadores/dashboard-coordenadores.html` - Scripts atualizados
- ✅ `Nivel05-Supervisores/dashboard-supervisores.html` - Scripts atualizados
- ✅ `Nivel06-Especialistas/dashboard-especialistas.html` - Scripts atualizados
- ✅ `Nivel07-Operacional/dashboard-operacional.html` - Scripts atualizados

---

**Status**: ✅ Sistema multi-sessão totalmente implementado e pronto para testes!
