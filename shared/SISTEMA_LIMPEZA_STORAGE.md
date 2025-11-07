# 🧹 Sistema de Limpeza Automática de Storage

## 📋 Visão Geral

O sistema Ascenda Flex implementa **limpeza automática e inteligente** do localStorage e sessionStorage para evitar acúmulo de dados, conflitos de sessão e problemas de performance.

---

## 🎯 Objetivos

1. **Prevenir acúmulo de dados**: Remover dados antigos automaticamente
2. **Evitar conflitos**: Limpar sessões anteriores antes de novo login
3. **Preservar sessões ativas**: Não afetar outras abas/usuários ativos
4. **Segurança**: Limpar dados sensíveis ao sair

---

## 🔄 Momentos de Limpeza

### 1. 🚪 Ao Fazer Logout

#### Login Normal (dashboard-common.js)
```javascript
function logout() {
    // Se for a última sessão ativa
    if (!hasMultipleSessions) {
        localStorage.clear();        // Limpa TUDO
        sessionStorage.clear();      // Limpa sessão da aba
        console.log('✅ Todos os dados locais foram removidos');
    } else {
        // Remove apenas dados desta aba
        SessionManager.clearSession();
    }
}
```

**O que limpa:**
- ✅ Token de autenticação
- ✅ Dados do usuário (userData)
- ✅ Papel selecionado (selectedRole)
- ✅ Prefixos de aba (tab_*)
- ✅ sessionStorage completo

**O que preserva:**
- ✅ Sessões de outras abas (se houver)
- ✅ Dados de desenvolvedor (devToken/devUser) se for última aba

---

#### Modo Desenvolvedor (dev-dashboard.js)
```javascript
function logout() {
    // Limpar dados específicos de desenvolvedor
    localStorage.removeItem('devToken');
    localStorage.removeItem('devUser');
    
    // Limpar resíduos de impersonation
    localStorage.removeItem('dev_token');
    localStorage.removeItem('dev_userData');
    localStorage.removeItem('dev_selectedRole');
    // ... todos os dev_*
    
    sessionStorage.removeItem('dev_mode');
}
```

**O que limpa:**
- ✅ devToken (autenticação do dev)
- ✅ devUser (dados do dev)
- ✅ Todos os dados dev_* (impersonation)
- ✅ sessionStorage.dev_mode

---

### 2. 🔐 Antes de Novo Login

#### Login Normal (script.js)
```javascript
async function handleLogin(event) {
    // LIMPEZA PREVENTIVA
    console.log('🧹 Limpando dados de sessões anteriores...');
    
    // 1. Limpar sessionStorage completamente
    sessionStorage.clear();
    
    // 2. Limpar dados de usuário antigos
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedRole');
    
    // 3. Limpar dados dev_* (impersonation antigas)
    localStorage.removeItem('dev_token');
    localStorage.removeItem('dev_userData');
    // ... etc
    
    // 4. Limpar prefixos de abas antigas
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('tab_')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Agora fazer o login...
}
```

**Benefícios:**
- ✅ Evita conflito com sessões antigas
- ✅ Garante estado limpo para novo usuário
- ✅ Remove dados corrompidos

---

#### Login Desenvolvedor (dev-login.js)
```javascript
async function handleLogin(event) {
    // LIMPEZA DE DADOS DEV ANTERIORES
    localStorage.removeItem('devToken');
    localStorage.removeItem('devUser');
    
    // Limpar impersonation antiga
    localStorage.removeItem('dev_token');
    localStorage.removeItem('dev_userData');
    // ... todos dev_*
    
    sessionStorage.removeItem('dev_mode');
    
    // Agora fazer o login...
}
```

---

### 3. 🚪 Ao Fechar Aba/Navegador

#### SessionManager (session-manager.js)
```javascript
window.addEventListener('beforeunload', function() {
    const tabs = JSON.parse(localStorage.getItem('activeTabs') || '[]');
    const filtered = tabs.filter(id => id !== tabId);
    
    // Se for a ÚLTIMA aba
    if (filtered.length === 0) {
        console.log('🧹 Última aba fechando - Limpando localStorage...');
        
        // Preservar apenas dados críticos
        const devToken = localStorage.getItem('devToken');
        const devUser = localStorage.getItem('devUser');
        
        // Limpar tudo
        localStorage.clear();
        
        // Restaurar dados de dev (para não deslogar desenvolvedor)
        if (devToken) {
            localStorage.setItem('devToken', devToken);
            localStorage.setItem('devUser', devUser);
        }
    } else {
        // Limpar apenas dados DESTA aba
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${tabId}_`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
});
```

**Comportamento:**
- **1 aba ativa**: Limpa localStorage (exceto devToken/devUser)
- **Múltiplas abas**: Remove apenas dados da aba que está fechando

---

### 4. 🎭 Ao Sair do Modo Dev

#### Banner Dev (dev-mode-indicator.js)
```javascript
exitDevMode: function() {
    // Limpar APENAS namespace de desenvolvedor
    sessionStorage.removeItem('dev_mode');
    localStorage.removeItem('dev_mode');
    localStorage.removeItem('dev_impersonatedBy');
    localStorage.removeItem('dev_token');
    localStorage.removeItem('dev_userData');
    localStorage.removeItem('dev_selectedRole');
    localStorage.removeItem('dev_sessionTimestamp');
    
    // Redirecionar para área do desenvolvedor
    window.location.href = '/desenvolvedor/dev-dashboard.html';
}
```

**Preserva:**
- ✅ devToken (autenticação do painel dev)
- ✅ devUser (dados do desenvolvedor)
- ✅ Sessões normais de usuários (se houver)

---

## 🗂️ Estrutura de Dados

### Namespaces

```
localStorage:
├── devToken              [Desenvolvedor: Token JWT]
├── devUser               [Desenvolvedor: Dados do dev]
├── dev_token             [Impersonation: Token do usuário]
├── dev_userData          [Impersonation: Dados do usuário]
├── dev_mode              [Impersonation: Flag booleana]
├── dev_selectedRole      [Impersonation: Papel selecionado]
├── dev_impersonatedBy    [Impersonation: Email do dev]
├── dev_sessionTimestamp  [Impersonation: Timestamp]
├── tab_xxx_token         [Usuário Normal: Token da aba xxx]
├── tab_xxx_userData      [Usuário Normal: Dados da aba xxx]
├── token                 [Fallback: Token (modo compatibilidade)]
├── userData              [Fallback: Dados (modo compatibilidade)]
└── activeTabs            [SessionManager: Array de IDs de abas]

sessionStorage:
├── tabId                 [SessionManager: ID único da aba]
├── dev_mode              [Impersonation: Flag (específico da aba)]
├── token                 [Usuário Normal: Token (específico da aba)]
└── userData              [Usuário Normal: Dados (específico da aba)]
```

---

## 🛡️ Estratégias de Preservação

### O que SEMPRE é limpo:
- ❌ Dados de sessões anteriores
- ❌ Tokens expirados
- ❌ Dados de impersonation (dev_*)
- ❌ Prefixos de abas fechadas (tab_*)
- ❌ sessionStorage completo no logout

### O que é PRESERVADO:
- ✅ devToken/devUser (desenvolvedor autenticado)
- ✅ Sessões de outras abas ativas
- ✅ activeTabs (controle de abas)

---

## 🔍 Casos de Uso

### Caso 1: Usuário faz login, trabalha e faz logout
```
1. Login → Limpa dados antigos antes de autenticar
2. Trabalho → Usa sessionStorage + localStorage com prefixo tab_
3. Logout → Limpa TUDO (se for última aba)
```

### Caso 2: Desenvolvedor impersona usuário e depois sai
```
1. Impersonation → Salva em namespace dev_*
2. Trabalho → Banner dev visível, isolamento ativo
3. Sair → Limpa apenas dev_*, preserva devToken/devUser
```

### Caso 3: Múltiplas abas de usuários diferentes
```
Aba 1 (User A):
- tab_xxx_token = tokenA
- tab_xxx_userData = userA

Aba 2 (User B):
- tab_yyy_token = tokenB
- tab_yyy_userData = userB

Fechar Aba 1 → Remove tab_xxx_*, preserva tab_yyy_*
Fechar Aba 2 (última) → localStorage.clear()
```

### Caso 4: Dev logado + Login normal simultâneo
```
localStorage:
- devToken = xxx (desenvolvedor)
- devUser = {...}
- tab_aaa_token = yyy (usuário normal na Aba 1)
- tab_aaa_userData = {...}

Logout da Aba 1 (última normal) → Remove tab_aaa_*, preserva devToken/devUser
Logout do painel dev → Remove devToken/devUser, limpa dev_*
```

---

## 📊 Benefícios

### Performance
- ✅ Menos dados no localStorage (< 5MB limite)
- ✅ Queries mais rápidas (menos chaves)
- ✅ Menos memória usada pelo navegador

### Segurança
- ✅ Tokens não ficam armazenados após logout
- ✅ Dados sensíveis removidos
- ✅ Previne reutilização de sessões antigas

### UX
- ✅ Logins sempre começam "limpos"
- ✅ Sem conflitos de sessão
- ✅ Sem mensagens de erro por dados corrompidos

---

## 🧪 Testes

### Teste 1: Logout Normal
```javascript
// ANTES
localStorage: { token: 'xxx', userData: {...}, ... }

// Fazer logout

// DEPOIS
localStorage: { } // Vazio (se última aba)
sessionStorage: { } // Vazio
```

### Teste 2: Logout com Múltiplas Abas
```javascript
// ANTES (2 abas)
localStorage: { 
  tab_aaa_token: 'xxx',
  tab_bbb_token: 'yyy'
}

// Fechar Aba A

// DEPOIS
localStorage: { 
  tab_bbb_token: 'yyy'  // Aba B preservada
}
```

### Teste 3: Novo Login
```javascript
// ANTES (dados antigos)
localStorage: { 
  token: 'expired', 
  userData: {...},
  tab_old_token: 'xxx'
}

// Fazer novo login

// DURANTE (limpeza)
localStorage: { } // Limpo

// DEPOIS (novo login)
localStorage: { 
  tab_new_token: 'yyy',
  tab_new_userData: {...}
}
```

---

## 🔧 Implementação

### Arquivos Modificados

1. **shared/dashboard-common.js**
   - Função `logout()` com limpeza completa

2. **desenvolvedor/dev-dashboard.js**
   - Função `logout()` específica para devs

3. **script.js**
   - Função `handleLogin()` com limpeza preventiva

4. **desenvolvedor/dev-login.js**
   - Função `handleLogin()` com limpeza de dados dev

5. **shared/session-manager.js**
   - Event listener `beforeunload` com limpeza inteligente

6. **shared/dev-mode-indicator.js**
   - Função `exitDevMode()` com limpeza de namespace dev_*

---

## 📝 Checklist de Manutenção

Ao adicionar novo dado no storage:

- [ ] Definir namespace apropriado (dev_*, tab_*, ou raiz)
- [ ] Adicionar limpeza no logout correspondente
- [ ] Adicionar limpeza no login preventivo
- [ ] Testar com múltiplas abas
- [ ] Testar modo dev + modo normal
- [ ] Documentar neste arquivo

---

## ⚠️ Cuidados

### NÃO limpar durante:
- ❌ Navegação entre páginas (usar sessionStorage)
- ❌ Refresh da página (usar localStorage persistente)
- ❌ Enquanto usuário está trabalhando

### SEMPRE preservar:
- ✅ devToken/devUser (desenvolvedor)
- ✅ Sessões de outras abas
- ✅ Dados críticos de configuração

---

**Última atualização:** 06/11/2025  
**Responsável:** Equipe de Desenvolvimento Ascenda Flex
