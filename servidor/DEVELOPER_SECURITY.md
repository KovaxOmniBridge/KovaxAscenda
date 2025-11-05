# 🔐 GUIA DE SEGURANÇA - PAINEL DE DESENVOLVEDOR

## ✅ IMPLEMENTAÇÕES REALIZADAS

### 1. **Autenticação Obrigatória para Desenvolvedores**

Todas as rotas do painel `/api/dev/*` agora **REQUEREM AUTENTICAÇÃO**, exceto:
- `POST /api/dev/auth/register` - Criar conta de desenvolvedor
- `POST /api/dev/auth/login` - Fazer login

**Rotas Protegidas (11 endpoints):**
```
✅ GET    /api/dev/auth/verify
✅ GET    /api/dev/auth/users
✅ DELETE /api/dev/auth/clear-all
✅ GET    /api/dev/companies
✅ DELETE /api/dev/companies/:id
✅ GET    /api/dev/table/:tableName
✅ POST   /api/dev/clear-all
✅ POST   /api/dev/impersonate/:userId
✅ GET    /api/dev/audit/logs
```

---

## 🔑 FLUXO DE AUTENTICAÇÃO

### **Passo 1: Registrar Desenvolvedor**

```http
POST /api/dev/auth/register
Content-Type: application/json

{
  "name": "Dev Master",
  "email": "dev@ascenda.app",
  "password": "senha_segura_123",
  "role": "super_admin"  // ou "developer", "admin"
}
```

**Resposta:**
```json
{
  "message": "Desenvolvedor registrado com sucesso",
  "devToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "developer": {
    "id": 1,
    "name": "Dev Master",
    "email": "dev@ascenda.app",
    "role": "super_admin"
  }
}
```

---

### **Passo 2: Fazer Login**

```http
POST /api/dev/auth/login
Content-Type: application/json

{
  "email": "dev@ascenda.app",
  "password": "senha_segura_123"
}
```

**Resposta:**
```json
{
  "devToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "developer": {
    "id": 1,
    "name": "Dev Master",
    "email": "dev@ascenda.app",
    "role": "super_admin"
  }
}
```

**Token Decodificado:**
```json
{
  "devId": 1,
  "email": "dev@ascenda.app",
  "role": "super_admin",
  "isDeveloper": true,  // ← FLAG ESPECIAL
  "iat": 1730832000,
  "exp": 1730918400
}
```

---

### **Passo 3: Usar o Token**

**Em TODAS as requisições protegidas:**
```http
GET /api/dev/companies
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎭 ACESSO UNIVERSAL DO DESENVOLVEDOR

### **O que mudou:**

Desenvolvedor **NÃO precisa** personificar usuários para acessar dados!

**Antes:**
```
❌ Dev precisava personificar usuário
❌ Dev não podia acessar /api/users/* diretamente
```

**Agora:**
```
✅ Dev pode usar seu próprio token em QUALQUER rota
✅ Middleware detecta isDeveloper: true
✅ Acesso universal a todas as empresas
```

---

### **Exemplo - Acesso Direto:**

```http
# Desenvolvedor acessando usuários de qualquer empresa
GET /api/users/company/5
Authorization: Bearer <devToken>  ← Token de desenvolvedor!

# Resposta: Lista de usuários da empresa 5
[
  { "id": 42, "name": "João Silva", ... },
  { "id": 43, "name": "Maria Santos", ... }
]
```

**O middleware `authenticateToken` detecta:**
```javascript
if (decoded.devId && decoded.isDeveloper) {
    req.isDeveloper = true;     // Flag ativada
    req.developer = decoded;    // Dados do dev
    req.user = decoded;         // Dev tem acesso universal
    return next();              // ✅ Acesso permitido
}
```

---

## 🎭 PERSONIFICAÇÃO DE USUÁRIOS

### **Quando usar:**

Use personificação quando precisar:
- Testar comportamento específico de um usuário
- Ver exatamente o que aquele usuário vê
- Depurar problemas de permissão
- Simular ações em nome de um usuário

---

### **Como Personificar:**

```http
POST /api/dev/impersonate/42
Authorization: Bearer <devToken>
```

**Resposta:**
```json
{
  "message": "Personificando usuário: João Silva",
  "userToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 42,
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "Administrador Geral",
    "nivel": 1,
    "company": {
      "id": 5,
      "name": "Tech Innovations"
    }
  },
  "warning": "Token de personificação ativo. Use com responsabilidade."
}
```

**Token de Personificação Decodificado:**
```json
{
  "userId": 42,
  "companyId": 5,
  "accessKey": "joao.silva",
  "role": "Administrador Geral",
  "nivel": 1,
  "impersonatedBy": 1,  // ← ID do desenvolvedor que personificou
  "iat": 1730832000,
  "exp": 1730918400
}
```

---

### **Usando Token de Personificação:**

```http
# Agora você É o João Silva
GET /api/auth/profile
Authorization: Bearer <userToken>

# Resposta: Perfil do João
{
  "id": 42,
  "name": "João Silva",
  "company": { "id": 5, "name": "Tech Innovations" }
}
```

---

## 📊 DIFERENÇA: ACESSO UNIVERSAL vs PERSONIFICAÇÃO

| Característica | Acesso Universal (devToken) | Personificação (userToken) |
|----------------|----------------------------|---------------------------|
| **Token usado** | Token de desenvolvedor | Token de usuário gerado |
| **Identificação** | `isDeveloper: true` | `impersonatedBy: <devId>` |
| **Acesso** | Todas as empresas | Apenas empresa do usuário |
| **Perfil** | Perfil de dev (se houver rota) | Perfil do usuário personificado |
| **Logs** | Registra como ação de dev | Registra como ação do usuário |
| **Uso** | Visão geral, administração | Teste específico, debug |

---

## 📝 LOGS DE AUDITORIA

### **O que é logado:**

✅ **Todas as ações de desenvolvedores** são registradas em `logs/dev-audit.log`

**Informações gravadas:**
- Timestamp (ISO 8601)
- ID e email do desenvolvedor
- Método HTTP (GET, POST, DELETE, etc.)
- URL acessada
- Parâmetros e query strings
- IP de origem
- User-Agent
- Status code da resposta
- **Senhas são automaticamente removidas**

---

### **Exemplo de Log:**

```json
{
  "timestamp": "2025-11-05T14:32:15.123Z",
  "developer": {
    "id": 1,
    "email": "dev@ascenda.app",
    "role": "super_admin"
  },
  "request": {
    "method": "DELETE",
    "url": "/api/dev/companies/5",
    "path": "/api/dev/companies/5",
    "ip": "::1",
    "userAgent": "Mozilla/5.0..."
  },
  "params": { "id": "5" },
  "query": {},
  "response": {
    "statusCode": 200,
    "timestamp": "2025-11-05T14:32:15.234Z"
  }
}
```

---

### **Visualizar Logs:**

```http
GET /api/dev/audit/logs?limit=100
Authorization: Bearer <devToken>
```

**Resposta:**
```json
{
  "total": 47,
  "limit": 100,
  "logs": [
    { /* log 1 */ },
    { /* log 2 */ },
    // ... últimos 100 registros
  ]
}
```

---

## 🔒 MIDDLEWARES IMPLEMENTADOS

### **1. `authenticateDevToken`**

**Arquivo:** `src/middlewares/auth.middleware.js`

**O que faz:**
- Valida token JWT de desenvolvedor
- Verifica flag `isDeveloper: true`
- Bloqueia tokens de usuários normais
- Adiciona `req.developer` e `req.isDeveloper`

**Uso:**
```javascript
router.get('/companies', authenticateDevToken, devController.listCompanies);
```

---

### **2. `authenticateToken` (atualizado)**

**Arquivo:** `src/middlewares/auth.middleware.js`

**O que faz:**
- Valida tokens JWT (usuário OU desenvolvedor)
- Se for dev (`isDeveloper: true`), permite acesso universal
- Se for usuário, valida normalmente
- Adiciona `req.user` e opcionalmente `req.isDeveloper`

**Uso:**
```javascript
router.get('/users/:id', authenticateToken, userController.getUser);
// ↑ Aceita token de usuário OU de desenvolvedor
```

---

### **3. `auditLog`**

**Arquivo:** `src/middlewares/audit.middleware.js`

**O que faz:**
- Intercepta requisições de desenvolvedores
- Registra todas as informações em arquivo JSON
- Remove senhas antes de logar
- Grava quando a resposta é enviada

**Uso:**
```javascript
// Aplicado automaticamente em todas as rotas dev protegidas
router.use(authenticateDevToken);
router.use(auditLog);
```

---

## 🎯 CASOS DE USO PRÁTICOS

### **Caso 1: Visualizar dados de todas as empresas**

```bash
# 1. Login
POST /api/dev/auth/login
{ "email": "dev@ascenda.app", "password": "..." }

# 2. Salvar token retornado

# 3. Listar empresas
GET /api/dev/companies
Authorization: Bearer <devToken>

# 4. Ver usuários de qualquer empresa (acesso universal)
GET /api/users/company/5
Authorization: Bearer <devToken>  ← Mesmo token de dev!
```

---

### **Caso 2: Depurar problema de usuário específico**

```bash
# 1. Personificar usuário
POST /api/dev/impersonate/42
Authorization: Bearer <devToken>
→ Retorna userToken

# 2. Usar token do usuário
GET /api/auth/profile
Authorization: Bearer <userToken>  ← Token de personificação

# 3. Ver exatamente o que o usuário vê
GET /api/squads/company/5
Authorization: Bearer <userToken>
```

---

### **Caso 3: Verificar logs de auditoria**

```bash
# Ver últimas 50 ações
GET /api/dev/audit/logs?limit=50
Authorization: Bearer <devToken>

# Exemplo de uso:
# - Quem deletou a empresa X?
# - Quantas vezes acessaram a tabela users?
# - Qual desenvolvedor fez personificação?
```

---

## ⚠️ AVISOS IMPORTANTES

### **🔴 Segurança:**

1. **Token de desenvolvedor dá poder total**
   - Pode ver/deletar qualquer coisa
   - Pode personificar qualquer usuário
   - Mantenha o token seguro!

2. **Logs não podem ser deletados via API**
   - Apenas manualmente no servidor
   - Garantia de rastreabilidade

3. **Personificação é registrada**
   - Campo `impersonatedBy` no token
   - Registrado nos logs de auditoria

---

### **🟡 Produção:**

```javascript
// Recomendação para produção:
if (process.env.NODE_ENV === 'production') {
    // Desabilitar rotas dev completamente
    // OU
    // Adicionar IP whitelist
    // OU
    // Adicionar autenticação adicional (2FA)
}
```

---

## 📚 RESUMO DAS MUDANÇAS

### **✅ Implementado:**

1. ✅ Autenticação obrigatória em rotas `/api/dev/*`
2. ✅ Token de desenvolvedor com flag `isDeveloper: true`
3. ✅ Acesso universal: dev pode usar seu token em rotas normais
4. ✅ Personificação de usuários via `/api/dev/impersonate/:userId`
5. ✅ Logs de auditoria automáticos em `logs/dev-audit.log`
6. ✅ Endpoint para visualizar logs: `/api/dev/audit/logs`
7. ✅ Middleware `authenticateDevToken` criado
8. ✅ Middleware `authenticateToken` atualizado para suportar devs
9. ✅ Middleware `auditLog` para rastreabilidade
10. ✅ Documentação completa em `src/README.md`

---

### **🔒 Segurança Garantida:**

- ❌ Rotas dev não são mais públicas
- ✅ Requer registro + login
- ✅ Tokens JWT com expiração (24h)
- ✅ Todas as ações são auditadas
- ✅ Senhas não aparecem em logs
- ✅ Personificação é rastreável

---

## 🚀 PRÓXIMOS PASSOS (Futuro)

1. **Rate Limiting** - Limitar tentativas de login
2. **IP Whitelist** - Restringir IPs permitidos
3. **2FA** - Autenticação de dois fatores
4. **Sessions** - Gerenciar sessões ativas
5. **Roles granulares** - super_admin, admin, developer
6. **Logs em banco** - SQLite ou MongoDB para logs
7. **Alertas** - Notificar ações críticas via email/slack

---

**Desenvolvido por:** Ascenda Development Team  
**Última atualização:** 05/11/2025  
**Versão:** 2.0.0 (com segurança implementada)
