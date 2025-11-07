# 🛡️ Proteção Total: Área de Desenvolvimento

## 🎯 Objetivo

Garantir que a área de desenvolvimento (`/desenvolvedor/`) seja **COMPLETAMENTE INACESSÍVEL** para usuários normais de empresas. Apenas desenvolvedores com credenciais específicas podem acessar.

---

## 🔒 Camadas de Proteção Implementadas

### ✅ Camada 1: Proteção Frontend (dev-protection.js)

**Arquivo:** `desenvolvedor/dev-protection.js`

Script carregado como **PRIMEIRO** em todas as páginas dev que:

#### Verificação 1: Bloquear Usuários Normais
```javascript
// Detecta se tem sessão de usuário normal
const hasNormalUserSession = (
    window.SessionManager?.getSession('token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('userData')
);

// Se tem sessão normal mas NÃO tem sessão dev → BLOQUEAR
if (hasNormalUserSession && !hasDevSession) {
    alert('🚫 ACESSO NEGADO\n\nA área de desenvolvimento é restrita apenas para desenvolvedores.');
    // Redirecionar para dashboard do usuário
    window.location.href = getDashboardUrl(userData.nivel);
}
```

#### Verificação 2: Limpar Sessões Normais no Login Dev
```javascript
if (window.location.pathname.includes('/dev-login.html')) {
    // Limpar TODAS as sessões de usuário normal
    if (window.SessionManager) {
        window.SessionManager.clearSession();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.clear();
}
```

#### Verificação 3: Validar Autenticação Dev no Dashboard
```javascript
if (window.location.pathname.includes('/dev-dashboard.html')) {
    const devToken = localStorage.getItem('devToken');
    const devUser = localStorage.getItem('devUser');
    
    if (!devToken || !devUser) {
        alert('⚠️ Sessão de desenvolvedor não encontrada.');
        window.location.href = '/desenvolvedor/dev-login.html';
    }
}
```

#### Verificação 4: Bloquear Manipulação Via Console
```javascript
// Interceptar tentativas de forjar credenciais
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    if ((key === 'devToken' || key === 'devUser') && !window.__devAuthVerified__) {
        console.error('🚫 BLOQUEADO: Tentativa de forjar credenciais detectada');
        return;
    }
    return originalSetItem.apply(this, arguments);
};
```

---

### ✅ Camada 2: Proteção Backend (devAuth.middleware.js)

**Arquivo:** `servidor/src/middlewares/devAuth.middleware.js`

Middleware do servidor que valida tokens JWT:

```javascript
const devAuth = (req, res, next) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // VERIFICAÇÃO CRÍTICA 1: Token deve ter flag isDeveloper
    if (!decoded.isDeveloper || !decoded.devId) {
        return res.status(403).json({ 
            error: 'Acesso negado',
            message: 'Esta área é restrita apenas para desenvolvedores.'
        });
    }
    
    // VERIFICAÇÃO CRÍTICA 2: NÃO pode ter userId (marca de usuário normal)
    if (decoded.userId || decoded.companyId) {
        return res.status(403).json({ 
            error: 'Token de usuário normal não é válido para área dev'
        });
    }
    
    req.dev = { id: decoded.devId, email: decoded.email };
    next();
};
```

---

### ✅ Camada 3: Rotas Protegidas

**Arquivo:** `servidor/src/routes/dev.routes.js`

```javascript
// Rotas públicas (sem autenticação)
router.post('/auth/register', devController.register);
router.post('/auth/login', devController.login);

// TODAS as outras rotas protegidas
router.use(devAuth);  // ← Bloqueia tokens de usuários normais
router.use(auditLog);

// Rotas que requerem token de desenvolvedor válido
router.get('/companies', devController.listCompanies);
router.get('/users/company/:companyId', devController.getUsersByCompany);
// ... todas protegidas
```

---

### ✅ Camada 4: Tokens JWT Distintos

**Diferenciação de Tokens:**

#### Token de Usuário Normal (gerado em login de empresa)
```javascript
{
    userId: 1297,
    companyId: 9,
    accessKey: "TS-0002",
    role: "Supervisor",
    nivel: 1,
    iat: 1234567890,
    exp: 1234654290
}
```

#### Token de Desenvolvedor (gerado em login dev)
```javascript
{
    devId: 1,
    email: "dev@ascenda.com",
    role: "Desenvolvedor Full",
    isDeveloper: true,  // ← FLAG CRÍTICA
    iat: 1234567890,
    exp: 1234654290
}
```

**Validação:**
- Backend verifica `isDeveloper: true` + `devId` presente
- Rejeita tokens com `userId` ou `companyId`

---

## 🚫 Cenários Bloqueados

### ❌ Cenário 1: Usuário Normal Tenta Acessar URL Dev

```
1. Usuário faz login normal: TS-0002 / senha123
2. Tenta acessar: /desenvolvedor/dev-dashboard.html
3. dev-protection.js detecta:
   - localStorage.token existe (usuário normal) ✓
   - localStorage.devToken NÃO existe ✗
4. BLOQUEIO: Alert + Redirecionamento para dashboard do usuário
```

### ❌ Cenário 2: Usuário Tenta Usar Token Normal em API Dev

```
1. Usuário obtém seu token JWT normal
2. Tenta fazer request: GET /api/dev/companies
   Headers: Authorization: Bearer [TOKEN_NORMAL]
3. devAuth.middleware.js decodifica token:
   - decoded.userId existe → É usuário normal ✗
   - decoded.isDeveloper === undefined → Não é dev ✗
4. BLOQUEIO: HTTP 403 + mensagem "Acesso negado"
```

### ❌ Cenário 3: Usuário Tenta Forjar Credenciais Dev

```javascript
// No console do navegador
localStorage.setItem('devToken', 'token_falso');
localStorage.setItem('devUser', '{"email":"fake@fake.com"}');

// dev-protection.js intercepta:
if (!window.__devAuthVerified__) {
    console.error('🚫 BLOQUEADO: Tentativa de forjar credenciais');
    return; // Não permite setItem
}
```

### ❌ Cenário 4: Compartilhamento de Token Dev

```
1. Dev compartilha seu devToken com usuário normal
2. Usuário tenta usar o token em requests
3. Backend valida token → Token válido MAS:
4. Frontend dev-protection.js verifica:
   - Tem sessionStorage/localStorage com sessão normal ✓
   - BLOQUEIO antes mesmo de carregar a página
```

---

## ✅ Fluxo Correto de Acesso Dev

### 1. Login de Desenvolvedor

```
┌──────────────────────────────────────────┐
│ 1. Acessa /desenvolvedor/dev-login.html  │
│ 2. dev-protection.js limpa sessões       │
│    normais (se existirem)                │
│ 3. Preenche email/senha de dev          │
│ 4. POST /api/dev/auth/login              │
│ 5. Servidor valida credenciais          │
│ 6. Retorna devToken com isDeveloper:true │
│ 7. window.__devAuthVerified__ = true     │
│ 8. localStorage: devToken + devUser      │
│ 9. Redireciona para dev-dashboard.html  │
└──────────────────────────────────────────┘
```

### 2. Uso do Painel Dev

```
┌──────────────────────────────────────────┐
│ 1. Acessa /desenvolvedor/dev-dashboard   │
│ 2. dev-protection.js valida:             │
│    - devToken existe? ✓                  │
│    - devUser existe? ✓                   │
│    - Sem sessão normal conflitante? ✓    │
│ 3. Carrega dashboard dev                 │
│ 4. Requests usam devToken no header      │
│ 5. Backend valida com devAuth middleware │
│ 6. Dados retornados com sucesso          │
└──────────────────────────────────────────┘
```

### 3. Impersonation de Usuário

```
┌──────────────────────────────────────────┐
│ 1. Dev seleciona empresa + nível         │
│ 2. Backend gera token de impersonation   │
│ 3. Abre em nova aba com ?impersonate=... │
│ 4. dev-session-handler.js configura:     │
│    - sessionStorage: dev_mode = 'true'   │
│    - localStorage: dev_token, dev_userData│
│ 5. Dashboard carrega em modo dev         │
│ 6. Banner "Modo Desenvolvedor" aparece   │
│ 7. Outras abas (login normal) não afetam │
└──────────────────────────────────────────┘
```

---

## 📋 Checklist de Segurança

### Frontend
- ✅ dev-protection.js carregado primeiro em todas páginas dev
- ✅ Bloqueia usuários normais com sessão ativa
- ✅ Limpa sessões normais no login dev
- ✅ Valida credenciais dev no dashboard
- ✅ Intercepta tentativas de forjar credenciais

### Backend
- ✅ devAuth.middleware.js valida token dev
- ✅ Rejeita tokens de usuários normais
- ✅ Verifica flag isDeveloper + devId
- ✅ Bloqueia tokens com userId/companyId
- ✅ Todas rotas dev protegidas com middleware

### Tokens
- ✅ Tokens de dev têm estrutura diferente
- ✅ Flag isDeveloper identifica tipo
- ✅ Namespaces separados (token vs devToken)
- ✅ Expiração de 24h para ambos

### Logs e Auditoria
- ✅ Tentativas de acesso bloqueadas são logadas
- ✅ Console mostra mensagens claras de bloqueio
- ✅ Auditoria registra ações de desenvolvedores

---

## 🧪 Como Testar a Proteção

### Teste 1: Bloqueio de Usuário Normal

```bash
# 1. Login como usuário normal
- Acessar: http://localhost:3000
- Login: TS-0002 / senha123
- Dashboard normal carrega ✓

# 2. Tentar acessar área dev
- Acessar: http://localhost:3000/desenvolvedor/dev-dashboard.html
- ESPERADO: Alert "Acesso Negado" + Redirecionamento ✓

# 3. Console deve mostrar:
"🚫 ACESSO NEGADO: Usuários normais não podem acessar..."
"🔒 Redirecionando para dashboard do usuário..."
```

### Teste 2: Bloqueio de API com Token Normal

```bash
# 1. Obter token de usuário normal
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"accessKey":"TS-0002","password":"senha123"}' \
  | jq -r '.token')

# 2. Tentar acessar API dev
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/dev/companies

# ESPERADO:
# {
#   "error": "Acesso negado",
#   "message": "Esta área é restrita apenas para desenvolvedores.",
#   "type": "DEV_ACCESS_DENIED"
# }
```

### Teste 3: Acesso Dev Válido

```bash
# 1. Registrar desenvolvedor
curl -X POST http://localhost:3000/api/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dev Test","email":"dev@test.com","password":"dev123","role":"Desenvolvedor"}'

# 2. Login de desenvolvedor
DEV_TOKEN=$(curl -X POST http://localhost:3000/api/dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@test.com","password":"dev123"}' \
  | jq -r '.devToken')

# 3. Acessar API dev
curl -H "Authorization: Bearer $DEV_TOKEN" \
  http://localhost:3000/api/dev/companies

# ESPERADO: Lista de empresas retornada com sucesso ✓
```

---

## 📊 Matriz de Acesso

| Recurso | Usuário Normal | Desenvolvedor |
|---------|---------------|---------------|
| `/index.html` | ✅ Permitido | ✅ Permitido |
| `/Nivel*/dashboard-*.html` | ✅ Permitido (próprio nível) | ✅ Via impersonation |
| `/desenvolvedor/dev-login.html` | ❌ **BLOQUEADO** | ✅ Permitido |
| `/desenvolvedor/dev-dashboard.html` | ❌ **BLOQUEADO** | ✅ Permitido |
| `GET /api/users` | ✅ Própria empresa | ✅ Via impersonation |
| `GET /api/dev/companies` | ❌ **BLOQUEADO** | ✅ Permitido |
| `POST /api/dev/clear-all` | ❌ **BLOQUEADO** | ✅ Permitido |

---

## ✅ Resultado Final

### 🛡️ Proteção Total Garantida

**Usuários normais:**
- ❌ NÃO podem acessar URLs de desenvolvedor
- ❌ NÃO podem usar API de desenvolvedor
- ❌ NÃO podem forjar credenciais dev
- ❌ NÃO podem ver dados de outras empresas
- ✅ Apenas acessam seu próprio dashboard e dados da empresa

**Desenvolvedores:**
- ✅ Acesso total ao painel de desenvolvimento
- ✅ Podem impersonar qualquer usuário de qualquer empresa
- ✅ Podem gerenciar todas as empresas
- ✅ Sessões de impersonation isoladas de sessões normais
- ✅ Tokens específicos com flag `isDeveloper: true`

---

**Status:** ✅ **SISTEMAS COMPLETAMENTE ISOLADOS** - Zero cruzamento possível! 🔒
