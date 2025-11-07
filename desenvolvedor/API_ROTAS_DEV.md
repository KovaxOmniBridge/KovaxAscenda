# 🔌 Rotas da API de Desenvolvedor - Referência Rápida

## 📋 Base URL
```
http://localhost:3000/api/dev
```

---

## 🔐 Autenticação

### Registrar Desenvolvedor
```http
POST /api/dev/auth/register
Content-Type: application/json

Body:
{
  "name": "João Silva",
  "email": "joao@dev.com",
  "password": "senha123",
  "role": "admin"
}

Response: 201
{
  "message": "Desenvolvedor registrado com sucesso",
  "devId": 1
}
```

### Login de Desenvolvedor
```http
POST /api/dev/auth/login
Content-Type: application/json

Body:
{
  "email": "joao@dev.com",
  "password": "senha123"
}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "developer": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@dev.com",
    "role": "admin"
  }
}
```

### Verificar Token
```http
GET /api/dev/auth/verify
Authorization: Bearer {devToken}

Response: 200
{
  "valid": true,
  "developer": { ... }
}
```

---

## 👥 Desenvolvedores

### Listar Desenvolvedores
```http
GET /api/dev/auth/users
Authorization: Bearer {devToken}

Response: 200
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@dev.com",
    "role": "admin",
    "created_at": "2025-11-06T10:00:00Z"
  }
]
```

### Limpar Todos os Desenvolvedores
```http
DELETE /api/dev/auth/clear-all
Authorization: Bearer {devToken}

Response: 200
{
  "message": "Todos os desenvolvedores foram removidos",
  "deleted": 5
}
```

---

## 🏢 Empresas

### Listar Empresas
```http
GET /api/dev/companies
Authorization: Bearer {devToken}

Response: 200
[
  {
    "id": 9,
    "name": "TechStart Inovações",
    "legal_name": "TechStart Inovações Ltda",
    "founded_year": 2020,
    "size": "small",
    "industry": "Tecnologia",
    "website": "techstart.com.br"
  }
]
```

### Atualizar Status da Empresa
```http
PUT /api/dev/companies/:id/status
Authorization: Bearer {devToken}
Content-Type: application/json

Body:
{
  "is_active": true
}

Response: 200
{
  "message": "Status atualizado com sucesso"
}
```

### Deletar Empresa
```http
DELETE /api/dev/companies/:id
Authorization: Bearer {devToken}

Response: 200
{
  "message": "Empresa deletada com sucesso"
}
```

---

## 👤 Usuários por Empresa

### Listar Usuários de uma Empresa
```http
GET /api/dev/users/company/:companyId
Authorization: Bearer {devToken}

Response: 200
[
  {
    "id": 1249,
    "name": "Gabriela Pereira",
    "email": "gabriela.pereira.7058@techstart.com.br",
    "access_key": "TS-0001",
    "role": "Presidente",
    "nivel": 0,
    "department": "Operações"
  }
]
```

---

## 🚀 Squads por Empresa

### Listar Squads de uma Empresa
```http
GET /api/dev/squads/company/:companyId
Authorization: Bearer {devToken}

Response: 200
[
  {
    "id": 1,
    "name": "Squad Alpha",
    "description": "Desenvolvimento de produtos",
    "company_id": 9
  }
]
```

---

## 📚 Chapters por Empresa

### Listar Chapters de uma Empresa
```http
GET /api/dev/chapters/company/:companyId
Authorization: Bearer {devToken}

Response: 200
[
  {
    "id": 1,
    "name": "Backend Developers",
    "description": "Comunidade de desenvolvedores backend",
    "company_id": 9
  }
]
```

---

## 🗃️ Visualização de Tabelas

### Ver Dados de Qualquer Tabela
```http
GET /api/dev/table/:tableName
Authorization: Bearer {devToken}

Exemplos:
- /api/dev/table/companies
- /api/dev/table/users
- /api/dev/table/squads
- /api/dev/table/chapters
- /api/dev/table/developers

Response: 200
{
  "table": "users",
  "count": 1250,
  "data": [ ... ]
}
```

---

## 🧹 Limpeza de Dados

### Limpar Todos os Dados
```http
POST /api/dev/clear-all
Authorization: Bearer {devToken}

⚠️ CUIDADO: Deleta TODOS os dados exceto empresa demonstrativa

Response: 200
{
  "message": "Dados limpos com sucesso. Apenas empresa demonstrativa foi mantida.",
  "deleted": {
    "companies": 10,
    "users": 500,
    "squads": 20,
    "chapters": 15
  }
}
```

---

## 🎭 Impersonação

### Impersonar Usuário
```http
POST /api/dev/impersonate/:userId
Authorization: Bearer {devToken}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1249,
    "name": "Gabriela Pereira",
    "nivel": 0,
    "company": { ... }
  },
  "devMode": true,
  "impersonatedBy": "joao@dev.com"
}
```

### Criar Sessão de Explorer (God Mode)
```http
POST /api/dev/explorer/auth/:companyId
Authorization: Bearer {devToken}
Content-Type: application/json

Body:
{
  "nivel": 0,
  "name": "Dev Explorer",
  "email": "dev@explorer.com"
}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 999999,
    "name": "Dev Explorer",
    "email": "dev@explorer.com",
    "nivel": 0,
    "company": { ... }
  }
}
```

---

## 📊 Logs de Auditoria

### Visualizar Logs
```http
GET /api/dev/audit/logs?limit=100
Authorization: Bearer {devToken}

Response: 200
{
  "count": 50,
  "limit": 100,
  "logs": [
    {
      "timestamp": "2025-11-06T15:30:00Z",
      "developer": "joao@dev.com",
      "action": "impersonate_user",
      "details": "Impersonou usuário ID 1249",
      "ip": "192.168.1.1"
    }
  ]
}
```

---

## 📬 Pedidos de Cadastro (Rota Pública)

### Listar Pedidos
```http
GET /api/company-requests?status=pending
⚠️ Nota: Não precisa de token dev, é rota pública

Response: 200
[
  {
    "id": 1,
    "company_name": "Nova Empresa Ltda",
    "legal_name": "Nova Empresa Ltda",
    "status": "pending",
    "created_at": "2025-11-05T10:00:00Z"
  }
]
```

---

## 🔒 Segurança

### Tokens
- **Token Normal**: `{ userId, companyId, nivel, role }`
- **Token Dev**: `{ devId, email, role, isDeveloper: true }`

### Middleware de Proteção
```javascript
// Arquivo: servidor/src/middlewares/devAuth.middleware.js

devAuth: function(req, res, next) {
  // Valida se token tem isDeveloper: true
  // REJEITA tokens de usuários normais
  // Retorna HTTP 403 para tokens inválidos
}
```

### Auditoria
Todas as ações de desenvolvedores são registradas:
- Timestamp
- Email do desenvolvedor
- Ação executada
- IP de origem
- Detalhes adicionais

---

## 🛠️ Uso no Frontend

### Exemplo: fetchWithDevAuth
```javascript
// Arquivo: desenvolvedor/dev-dashboard.js

async function fetchWithDevAuth(url, options = {}) {
    const devToken = localStorage.getItem('devToken');
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${devToken}`,
        ...options.headers
    };
    
    return fetch(url, { ...options, headers });
}

// Uso:
const response = await fetchWithDevAuth(`${API_BASE}/dev/companies`);
const companies = await response.json();
```

---

## ⚠️ Erros Comuns

### 1. 404 Not Found
**Problema:** Rota não existe ou está com URL errada  
**Solução:** Verifique se está usando a rota correta:
- ✅ `/api/dev/auth/users` (correto)
- ❌ `/api/dev/developers` (errado)
- ✅ `/api/company-requests` (correto)
- ❌ `/api/dev/company-requests` (errado)

### 2. 403 Forbidden
**Problema:** Token de usuário normal sendo usado em rota dev  
**Solução:** Use token de desenvolvedor (devToken)

### 3. Unexpected token '<'
**Problema:** Tentando parsear HTML como JSON (página de erro)  
**Solução:** Adicione `if (!response.ok)` antes de `.json()`

```javascript
const response = await fetch(url);
if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
}
const data = await response.json();
```

---

## 📝 Checklist de Desenvolvimento

Ao adicionar nova rota de desenvolvedor:

- [ ] Adicionar rota em `servidor/src/routes/dev.routes.js`
- [ ] Criar função no `servidor/src/controllers/dev.controller.js`
- [ ] Aplicar middleware `devAuth` para proteger
- [ ] Adicionar auditoria com `auditLog`
- [ ] Testar com token de desenvolvedor
- [ ] Testar rejeição de token normal
- [ ] Documentar neste arquivo
- [ ] Atualizar frontend se necessário

---

**Última atualização:** 06/11/2025  
**Documentado por:** Equipe de Desenvolvimento Ascenda Flex
