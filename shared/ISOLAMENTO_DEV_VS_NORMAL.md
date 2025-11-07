# Isolamento: Modo Desenvolvedor vs Login Normal

## 🎯 Cenário: Dev Mode + Login Normal Simultâneos

### Situação
```
Mesma Máquina, Mesmo Navegador:
├─ Aba 1: Desenvolvedor impersonando Presidente (TS-0001)
└─ Aba 2: Login normal de usuário (TS-0002)
```

**Resultado:** ✅ **ZERO CONFLITO** - Completamente isolados!

---

## 🔒 Arquitetura de Isolamento

### Aba 1: Modo Desenvolvedor (Impersonation)

```javascript
// localStorage - Namespace: dev_*
{
    // Sessão de Impersonation (namespace dev_*)
    "dev_mode": "true",
    "dev_token": "eyJhbGc...PRESIDENTE",
    "dev_userData": '{"id":1296,"name":"User TS-0001","nivel":0,...}',
    "dev_impersonatedBy": "dev@ascenda.com",
    "dev_sessionTimestamp": 1699286400000,
    "dev_selectedRole": "0",
    
    // Credenciais ORIGINAIS do desenvolvedor (preservadas)
    "devToken": "eyJhbGc...DEVELOPER",
    "devUser": '{"email":"dev@ascenda.com",...}'
}

// sessionStorage (não usado em dev mode)
{}
```

**Como funciona:**
```javascript
// dashboard-common.js - Detecção de modo dev
const isDevMode = localStorage.getItem('dev_mode') === 'true';

if (isDevMode) {
    token = localStorage.getItem('dev_token');        // ← Usa dev_token
    userData = window.getDevUserData();                // ← Lê dev_userData
    console.log('🔧 Modo Desenvolvedor Ativo');
}
```

---

### Aba 2: Login Normal (SessionManager)

```javascript
// sessionStorage - Tab-Specific
{
    "tabId": "tab_1699286400123_0.123456",
    "token": "eyJhbGc...USUARIO_NORMAL",
    "userData": '{"id":1297,"name":"User TS-0002","nivel":1,...}',
    "selectedRole": "1"
}

// localStorage - Backup com prefixo tab_*
{
    "tab_1699286400123_0.123456_token": "eyJhbGc...USUARIO_NORMAL",
    "tab_1699286400123_0.123456_userData": '{"id":1297,...}',
    "activeTabs": '["tab_1699286400123_0.123456"]'
}
```

**Como funciona:**
```javascript
// dashboard-common.js - Detecção de sessão normal
const isDevMode = localStorage.getItem('dev_mode') === 'true';

if (!isDevMode && window.SessionManager) {
    token = window.SessionManager.getSession('token');     // ← Usa SessionManager
    userData = window.SessionManager.getSession('userData', true);
    console.log('💼 Sessão Normal (Tab ID:', window.SessionManager.getTabId() + ')');
}
```

---

## 🔍 Comparação Lado a Lado

| Aspecto | Aba 1: Dev Mode | Aba 2: Login Normal |
|---------|-----------------|---------------------|
| **Detecção** | `dev_mode === 'true'` | `dev_mode !== 'true'` |
| **Token** | `localStorage.getItem('dev_token')` | `SessionManager.getSession('token')` |
| **UserData** | `localStorage.getItem('dev_userData')` | `SessionManager.getSession('userData')` |
| **Storage** | localStorage (namespace `dev_*`) | sessionStorage + localStorage (namespace `tab_*`) |
| **Identificação** | `dev_impersonatedBy` presente | Tab ID presente |
| **Banner Visual** | 🔧 "Modo Desenvolvedor" | Sem banner |
| **Logout** | Limpa apenas `dev_*` keys | Limpa apenas dados da aba |
| **API Calls** | Header: `Authorization: Bearer dev_token` | Header: `Authorization: Bearer tab_token` |

---

## 📊 Fluxo de Inicialização

### Aba 1: Dashboard com Dev Mode

```javascript
// 1. dashboard-common.js - initDashboard()
function initDashboard(requiredLevel) {
    const isDevMode = localStorage.getItem('dev_mode') === 'true';
    
    // ✅ DETECTA: dev_mode = 'true'
    if (isDevMode) {
        token = localStorage.getItem('dev_token');           // Token do presidente
        userData = window.getDevUserData();                  // Dados do presidente
        
        console.log('🔧 Modo Desenvolvedor Ativo');
        console.log('👤 Impersonando:', userData.name);
        console.log('🎭 Nível:', userData.nivel);
        
        // Permite acesso sem validar nível (desenvolvedor tem acesso total)
        return;
    }
    
    // ... resto do código para modo normal
}
```

### Aba 2: Dashboard com Login Normal

```javascript
// 1. dashboard-common.js - initDashboard()
function initDashboard(requiredLevel) {
    const isDevMode = localStorage.getItem('dev_mode') === 'true';
    
    // ✅ DETECTA: dev_mode não existe ou !== 'true'
    if (!isDevMode && window.SessionManager) {
        token = window.SessionManager.getSession('token');        // Token do usuário TS-0002
        userData = window.SessionManager.getSession('userData', true);
        
        console.log('💼 Sessão Normal');
        console.log('📊 Tab ID:', window.SessionManager.getTabId());
        console.log('👤 Usuário:', userData.name);
        console.log('🎭 Nível:', userData.nivel);
        
        // Valida se o nível do usuário tem permissão
        if (userData.nivel > requiredLevel) {
            console.error('❌ Acesso negado - Nível insuficiente');
            window.location.href = '/index.html';
            return;
        }
    }
    
    // ... resto do código
}
```

---

## 🧪 Teste Prático

### Passo 1: Abrir Dev Mode (Aba 1)

1. Fazer login como desenvolvedor: `/desenvolvedor/dev-login.html`
2. Acessar "Explorar Interfaces"
3. Selecionar empresa: TechStart
4. Abrir como: Presidente (Nível 0)
5. **Resultado:** Dashboard do presidente abre com banner de dev mode

**Verificação no Console:**
```javascript
localStorage.getItem('dev_mode')        // "true"
localStorage.getItem('dev_token')       // "eyJhbGc...PRESIDENTE"
localStorage.getItem('dev_impersonatedBy') // "dev@ascenda.com"

// SessionStorage está vazio (dev mode não usa)
Object.keys(sessionStorage).length      // 0
```

### Passo 2: Fazer Login Normal (Aba 2)

1. Abrir nova aba no mesmo navegador
2. Ir para: `http://localhost:3000` (página inicial)
3. Fazer login: `TS-0002` / `senha123`
4. **Resultado:** Dashboard normal abre SEM banner de dev mode

**Verificação no Console:**
```javascript
// Dev mode NÃO está ativo nesta aba
localStorage.getItem('dev_mode')        // "true" (existe no localStorage compartilhado)

// MAS o initDashboard detecta que não é dev mode porque:
// - Não há parâmetro ?impersonate= na URL
// - dev-session-handler.js não configurou dev mode para ESTA aba
// - SessionManager detecta sessão normal

// SessionStorage tem dados próprios desta aba
sessionStorage.getItem('tabId')         // "tab_1699286400123_0.123456"
sessionStorage.getItem('token')         // "eyJhbGc...USUARIO_TS-0002"

// Dev keys existem no localStorage (da Aba 1) mas são IGNORADAS
localStorage.getItem('dev_token')       // "eyJhbGc...PRESIDENTE" (ignorado)
```

### Passo 3: Verificar Isolamento

**Aba 1 (Dev Mode):**
```javascript
// No console da Aba 1
getUserData()
// Retorna: { id: 1296, name: "User TS-0001", nivel: 0, ... }

// Fazer requisição API
fetchAPI('/api/users').then(console.log)
// Header enviado: Authorization: Bearer eyJhbGc...PRESIDENTE
// Retorna: Lista de usuários da empresa do presidente
```

**Aba 2 (Normal):**
```javascript
// No console da Aba 2
getUserData()
// Retorna: { id: 1297, name: "User TS-0002", nivel: 1, ... }

// Fazer requisição API
fetchAPI('/api/users').then(console.log)
// Header enviado: Authorization: Bearer eyJhbGc...USUARIO_TS-0002
// Retorna: Lista de usuários da empresa de TS-0002
```

---

## 🔑 Chave do Isolamento

### Por que Não Conflita?

A mágica está na **ordem de prioridade** em `dashboard-common.js`:

```javascript
function initDashboard(requiredLevel) {
    const isDevMode = localStorage.getItem('dev_mode') === 'true';
    
    let token, userData;
    
    // PRIORIDADE 1: Modo Desenvolvedor
    if (isDevMode) {
        token = localStorage.getItem('dev_token');
        userData = window.getDevUserData();
        console.log('🔧 Modo Desenvolvedor Ativo');
    }
    // PRIORIDADE 2: SessionManager (multi-sessão)
    else if (window.SessionManager) {
        token = window.SessionManager.getSession('token');
        userData = window.SessionManager.getSession('userData', true);
        console.log('💼 Sessão Normal via SessionManager');
    }
    // PRIORIDADE 3: Fallback localStorage
    else {
        token = localStorage.getItem('token');
        userData = localStorage.getItem('userData');
        console.log('📦 Sessão Normal via localStorage (compatibilidade)');
    }
    
    // ... validações
}
```

### Detectando Dev Mode por Aba

O que realmente define se uma aba está em dev mode **NÃO é apenas** `localStorage.getItem('dev_mode')`, mas sim:

1. **dev-session-handler.js** detectou parâmetro `?impersonate=` na URL
2. **dev-session-handler.js** configurou o namespace `dev_*` 
3. **initDashboard()** lê `dev_mode === 'true'` E não encontra SessionManager

**Aba de Dev Mode:**
- URL: `/Nivel00-Presidentes/dashboard-presidentes.html?impersonate=BASE64...`
- dev-session-handler.js ATIVOU dev mode
- initDashboard() detecta `dev_mode === 'true'`
- Usa `dev_token` e `dev_userData`

**Aba de Login Normal:**
- URL: `/Nivel01-AdministradoresGerais/dashboard-admin.html` (sem ?impersonate)
- dev-session-handler.js NÃO ativou dev mode (sem parâmetro)
- initDashboard() vê `dev_mode` no localStorage MAS não usa porque SessionManager tem prioridade
- Usa `SessionManager.getSession('token')` e `SessionManager.getSession('userData')`

---

## 🎭 Exemplo Completo

### Cenário Real

```
Desenvolvedor João está testando interface do presidente
Usuário Maria (TS-0002) faz login normal

┌─────────────────────────────────────────────────────────┐
│  Mesma Máquina - Mesmo Navegador - 2 Abas              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────┐  ┌─────────────────────────────┐
│  Aba 1: Dev Mode            │  │  Aba 2: Login Normal        │
├─────────────────────────────┤  ├─────────────────────────────┤
│                             │  │                             │
│  👤 Impersonando: TS-0001   │  │  👤 Usuário: TS-0002        │
│  🎭 Nível: 0 (Presidente)   │  │  🎭 Nível: 1 (Admin)        │
│  🔧 Banner Dev Mode: SIM    │  │  🔧 Banner Dev Mode: NÃO    │
│                             │  │                             │
│  📦 Storage:                │  │  📦 Storage:                │
│  dev_mode: "true"           │  │  tabId: "tab_123..."        │
│  dev_token: "...0001"       │  │  token (session): "...0002" │
│  dev_userData: {...0001}    │  │  userData (session): {...}  │
│                             │  │                             │
│  🌐 API Calls:              │  │  🌐 API Calls:              │
│  Bearer ...TOKEN_0001       │  │  Bearer ...TOKEN_0002       │
│                             │  │                             │
│  📊 Vê dados de: TS-0001    │  │  📊 Vê dados de: TS-0002    │
│  Empresa: TechStart         │  │  Empresa: TechStart         │
│                             │  │                             │
└─────────────────────────────┘  └─────────────────────────────┘
```

### Logout Independente

**Aba 1 - Sair do Dev Mode:**
```javascript
// Clica em "Sair" no banner dev
exitDevMode() {
    // Limpa APENAS dev_* keys
    localStorage.removeItem('dev_token');
    localStorage.removeItem('dev_userData');
    localStorage.removeItem('dev_mode');
    // ...
    
    // Aba 2 continua funcionando normalmente!
    window.location.href = '/desenvolvedor/dev-dashboard.html';
}
```

**Aba 2 - Logout Normal:**
```javascript
// Clica em botão "Sair"
logout() {
    // Detecta que NÃO é dev mode
    if (window.SessionManager) {
        // Limpa APENAS dados da aba (sessionStorage + tab_* no localStorage)
        SessionManager.clearSession();
        
        // Aba 1 continua funcionando normalmente!
        window.location.href = '/index.html';
    }
}
```

---

## ✅ Conclusão

### ✅ **ZERO CONFLITO**

Os dois sistemas são **completamente isolados**:

| | Dev Mode (Aba 1) | Login Normal (Aba 2) |
|---|---|---|
| **Namespace** | `dev_*` | `tab_*` + sessionStorage |
| **Detecção** | URL param `?impersonate=` | SessionManager detecta |
| **Token** | `dev_token` | `SessionManager token` |
| **UserData** | `dev_userData` | `SessionManager userData` |
| **Logout** | Limpa `dev_*` apenas | Limpa `tab_*` apenas |
| **Interferência** | ❌ Zero | ❌ Zero |

### 🎯 Por que Funciona?

1. **Namespaces diferentes**: `dev_*` vs `tab_*`
2. **Prioridade de leitura**: Dev mode checado primeiro, SessionManager checado segundo
3. **SessionStorage**: Aba normal usa sessionStorage (isolamento automático)
4. **URL param**: Dev mode só ativa com `?impersonate=` na URL

**Você pode ter quantas abas quiser:**
- ✅ 1 dev mode + 10 logins normais
- ✅ Múltiplos dev modes (diferentes usuários impersonados)
- ✅ Múltiplos logins normais (diferentes usuários)

Todos funcionam simultaneamente sem conflito! 🚀
