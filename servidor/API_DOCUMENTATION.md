# 🚀 API Backend - Documentação Completa

## 📋 Visão Geral

Backend totalmente funcional com arquitetura MVC para o sistema Ascenda Flex.

**Base URL**: `http://localhost:3000/api`

---

## 🔐 Autenticação

Todas as rotas (exceto login/registro) requerem o header:
```
Authorization: Bearer <token>
```

### Endpoints de Autenticação

#### POST `/auth/login`
Login de usuário
```json
Body: {
  "accessKey": "TS-0001",
  "password": "senha123"
}

Response: {
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@empresa.com",
    "nivel": 0,
    "company": {...},
    "additional_roles": [...],
    "can_switch_roles": true
  }
}
```

#### GET `/auth/profile`
Obter perfil do usuário logado
```json
Response: {
  "id": 1,
  "name": "João Silva",
  "email": "joao@empresa.com",
  "company": {...}
}
```

---

## 👥 Usuários

### GET `/users`
Listar todos os usuários da empresa (Níveis 0 e 1 apenas)
```json
Response: [
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@empresa.com",
    "phone": "11999999999",
    "department": "TI",
    "role": "Presidente",
    "nivel": 0,
    "is_primary": 1,
    "company_name": "Tech Solutions"
  }
]
```

### GET `/users/stats/by-level`
Obter estatísticas de usuários por nível hierárquico
```json
Response: [
  { "nivel": 0, "count": 2 },
  { "nivel": 1, "count": 5 },
  { "nivel": 2, "count": 8 }
]
```

### GET `/users/company/:companyId`
Listar usuários de uma empresa específica

### GET `/users/:id`
Obter detalhes de um usuário

### POST `/users`
Criar novo usuário
```json
Body: {
  "companyId": 1,
  "name": "Maria Santos",
  "email": "maria@empresa.com",
  "phone": "11888888888",
  "department": "RH",
  "accessKey": "maria.santos",
  "role": "Gerente",
  "password": "senha123",
  "isPrimary": false,
  "nivel": 3
}

Response: {
  "message": "Usuário criado com sucesso",
  "userId": 10
}
```

### PUT `/users/:id`
Atualizar usuário

### DELETE `/users/:id`
Deletar usuário (não pode deletar administrador principal)

---

## 🚀 Squads

### GET `/squads`
Listar todos os squads da empresa
```json
Response: [
  {
    "id": 1,
    "name": "Squad Alpha",
    "description": "Squad de desenvolvimento frontend",
    "squad_type": "product",
    "status": "active",
    "start_date": "2024-01-01",
    "member_count": 5,
    "created_by_name": "João Silva"
  }
]
```

### GET `/squads/company/:companyId`
Listar squads de uma empresa específica

### POST `/squads`
Criar novo squad
```json
Body: {
  "company_id": 1,
  "name": "Squad Beta",
  "description": "Squad de backend",
  "squad_type": "product",
  "start_date": "2024-01-15",
  "end_date": null
}
```

### PUT `/squads/:id`
Atualizar squad

### DELETE `/squads/:id`
Deletar squad

### GET `/squads/:id/members`
Listar membros do squad

### POST `/squads/:id/members`
Adicionar membro ao squad
```json
Body: {
  "user_id": 5,
  "role": "developer",
  "allocation_percent": 100
}
```

### PUT `/squads/:id/members/:memberId`
Atualizar membro do squad

### DELETE `/squads/:id/members/:memberId`
Remover membro do squad

### GET `/squads/:id/goals`
Listar metas do squad

---

## 📚 Chapters

### GET `/chapters`
Listar todos os chapters da empresa
```json
Response: [
  {
    "id": 1,
    "name": "Frontend Chapter",
    "description": "Comunidade de desenvolvedores frontend",
    "specialty": "React/Vue/Angular",
    "lead_name": "Pedro Costa",
    "member_count": 12
  }
]
```

### GET `/chapters/company/:companyId`
Listar chapters de uma empresa específica

### POST `/chapters`
Criar novo chapter
```json
Body: {
  "company_id": 1,
  "name": "Backend Chapter",
  "description": "Comunidade de desenvolvedores backend",
  "specialty": "Node.js/Python",
  "lead_user_id": 3
}
```

### PUT `/chapters/:id`
Atualizar chapter

### DELETE `/chapters/:id`
Deletar chapter

### GET `/chapters/:id/members`
Listar membros do chapter

### POST `/chapters/:id/members`
Adicionar membro ao chapter
```json
Body: {
  "user_id": 8,
  "role": "member"
}
```

### PUT `/chapters/:id/members/:memberId`
Atualizar membro do chapter

### DELETE `/chapters/:id/members/:memberId`
Remover membro do chapter

---

## 🌍 Países/Operações

### GET `/countries`
Listar todos os países onde a empresa opera
```json
Response: [
  {
    "id": 1,
    "country": "Brasil",
    "tax_id": "12.345.678/0001-90",
    "city": "São Paulo",
    "address": "Av. Paulista, 1000",
    "phone": "11-3333-4444",
    "is_headquarters": 1
  }
]
```

### GET `/countries/stats/count`
Obter contagem de países
```json
Response: {
  "count": 3
}
```

### GET `/countries/:id`
Obter detalhes de um país

### POST `/countries`
Adicionar novo país
```json
Body: {
  "country": "Portugal",
  "tax_id": "PT123456789",
  "city": "Lisboa",
  "address": "Rua Augusta, 100",
  "phone": "+351-21-1234567",
  "is_headquarters": false
}
```

### PUT `/countries/:id`
Atualizar país

### DELETE `/countries/:id`
Deletar país (não pode deletar sede principal)

---

## 🏢 Empresas

### GET `/companies/:id`
Obter detalhes da empresa

### PUT `/companies/:id`
Atualizar informações da empresa

---

## 📋 Templates

### GET `/templates`
Listar templates organizacionais

### POST `/templates`
Criar template

### PUT `/templates/:id`
Atualizar template

---

## ✅ Aprovações

### GET `/approvals`
Listar aprovações pendentes

### POST `/approvals`
Criar solicitação de aprovação

### PUT `/approvals/:id`
Aprovar/rejeitar solicitação

---

## 🔧 Utilitários

### GET `/health`
Verificar saúde da API
```json
Response: {
  "status": "OK",
  "message": "API funcionando",
  "architecture": "MVC Pattern",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎯 Níveis Hierárquicos

| Nível | Nome | Descrição |
|-------|------|-----------|
| 0 | Presidentes | Acesso total ao sistema |
| 1 | Administradores Gerais | Gestão organizacional completa |
| 2 | Diretores Executivos | Gestão de diretoria |
| 3 | Gerentes | Gestão de equipes |
| 4 | Coordenadores | Coordenação de projetos |
| 5 | Supervisores | Supervisão operacional |
| 6 | Especialistas | Especialização técnica |
| 7 | Operacional | Execução de tarefas |

---

## 🔒 Permissões

- **Nível 0-1**: Acesso total a usuários, squads, chapters e países
- **Nível 2-3**: Acesso a squads e chapters do seu departamento
- **Nível 4-7**: Acesso limitado conforme hierarquia

---

## 📊 Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `500` - Erro interno do servidor

---

## 🛠️ Estrutura de Erros

```json
{
  "error": "Descrição do erro"
}
```

---

## 💡 Exemplos de Uso no Frontend

### Buscar todos os usuários
```javascript
const users = await fetchAPI('/users');
```

### Criar novo squad
```javascript
const response = await fetchAPI('/squads', {
  method: 'POST',
  body: JSON.stringify({
    company_id: 1,
    name: 'Squad Gamma',
    description: 'Squad de DevOps',
    squad_type: 'platform',
    start_date: '2024-02-01'
  })
});
```

### Obter estatísticas por nível
```javascript
const stats = await fetchAPI('/users/stats/by-level');
// Retorna: [{ nivel: 0, count: 2 }, { nivel: 1, count: 5 }, ...]
```

---

## ✅ Status da Implementação

- ✅ Autenticação JWT
- ✅ CRUD de Usuários
- ✅ CRUD de Squads
- ✅ CRUD de Chapters
- ✅ CRUD de Países
- ✅ Estatísticas e relatórios
- ✅ Multi-role support
- ✅ Validações e permissões
- ✅ Middleware de autenticação
- ✅ Tratamento de erros

**Backend 100% funcional e pronto para uso!** 🎉
