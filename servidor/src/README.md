# Estrutura MVC - Ascenda Flex API

## 📁 Arquitetura

```
src/
├── config/              # Configurações
│   ├── database.js      # Conexão SQLite
│   └── constants.js     # Constantes (níveis, status, etc)
│
├── controllers/         # Lógica de Negócio (6 controllers)
│   ├── auth.controller.js
│   ├── company.controller.js
│   ├── user.controller.js
│   ├── squad.controller.js
│   ├── chapter.controller.js
│   ├── template.controller.js
│   └── dev.controller.js
│
├── routes/              # Rotas da API (7 arquivos)
│   ├── index.js         # Agregador
│   ├── auth.routes.js
│   ├── company.routes.js
│   ├── user.routes.js
│   ├── squad.routes.js
│   ├── chapter.routes.js
│   ├── template.routes.js
│   └── dev.routes.js
│
├── middlewares/         # Middlewares
│   ├── auth.middleware.js    # Autenticação JWT
│   └── error.middleware.js   # Tratamento de erros
│
├── database/            # Banco de Dados
│   ├── schema.js        # Schema (10 tabelas)
│   └── legacy.js        # Backup do database.js antigo
│
├── services/            # Serviços (futuros)
└── utils/               # Utilitários (futuros)
```

## 🎯 Padrão MVC

### Model (Database)
- `src/database/schema.js` - Define estrutura das tabelas
- `src/config/database.js` - Gerencia conexão SQLite

### View (Frontend)
- Interfaces HTML/CSS/JS na raiz do projeto
- Comunicação via API REST

### Controller
- Cada domínio tem seu controller
- Processa requisições e retorna respostas JSON
- Usa o database diretamente (sem ORM)

## 📊 Controllers e Responsabilidades

### AuthController
- `login()` - Autenticação de usuários
- `getProfile()` - Perfil do usuário logado

### CompanyController
- `listCompanies()` - Listar empresas
- `getCompany()` - Detalhes da empresa
- `createCompany()` - Criar empresa com admins

### UserController
- `listUsersByCompany()` - Listar usuários
- `getUser()` - Detalhes do usuário
- `createUser()` - Criar usuário
- `updateUser()` - Atualizar usuário
- `deleteUser()` - Deletar usuário

### SquadController
- `listSquadsByCompany()` - Listar squads
- `createSquad()` - Criar squad
- `updateSquad()` - Atualizar squad
- `deleteSquad()` - Deletar squad
- `listSquadMembers()` - Listar membros
- `addSquadMember()` - Adicionar membro
- `updateSquadMember()` - Atualizar membro
- `removeSquadMember()` - Remover membro
- `listSquadGoals()` - Listar metas

### ChapterController
- `listChaptersByCompany()` - Listar chapters
- `createChapter()` - Criar chapter
- `updateChapter()` - Atualizar chapter
- `deleteChapter()` - Deletar chapter
- `listChapterMembers()` - Listar membros
- `addChapterMember()` - Adicionar membro
- `updateChapterMember()` - Atualizar membro
- `removeChapterMember()` - Remover membro

### TemplateController
- `getTemplate()` - Obter template organizacional
- `updateTemplate()` - Atualizar template

### DevController
- `register()` - Registrar desenvolvedor
- `login()` - Login de desenvolvedor
- `verifyToken()` - Verificar token
- `listDevelopers()` - Listar desenvolvedores
- `listCompanies()` - Listar empresas (sem auth)
- `deleteCompany()` - Deletar empresa
- `clearAllDevelopers()` - Limpar todos devs
- `viewTable()` - Visualizar tabela
- `clearAllData()` - Limpar todos dados

## 🛣️ Rotas da API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil (protegido)

### Empresas
- `GET /api/companies` - Listar
- `GET /api/companies/:id` - Detalhes
- `POST /api/companies` - Criar

### Usuários (Protegido)
- `GET /api/users/company/:companyId` - Listar
- `GET /api/users/:id` - Detalhes
- `POST /api/users` - Criar
- `PUT /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Deletar

### Squads (Protegido)
- `GET /api/squads/company/:companyId` - Listar
- `POST /api/squads` - Criar
- `PUT /api/squads/:id` - Atualizar
- `DELETE /api/squads/:id` - Deletar
- `GET /api/squads/:id/members` - Membros
- `POST /api/squads/:id/members` - Adicionar membro
- `PUT /api/squads/:id/members/:memberId` - Atualizar membro
- `DELETE /api/squads/:id/members/:memberId` - Remover membro
- `GET /api/squads/:id/goals` - Metas

### Chapters (Protegido)
- `GET /api/chapters/company/:companyId` - Listar
- `POST /api/chapters` - Criar
- `PUT /api/chapters/:id` - Atualizar
- `DELETE /api/chapters/:id` - Deletar
- `GET /api/chapters/:id/members` - Membros
- `POST /api/chapters/:id/members` - Adicionar membro
- `PUT /api/chapters/:id/members/:memberId` - Atualizar membro
- `DELETE /api/chapters/:id/members/:memberId` - Remover membro

### Templates (Protegido)
- `GET /api/templates/:companyId` - Obter template
- `PUT /api/templates/:companyId` - Atualizar template

### Desenvolvedor (Público - NÃO USAR EM PRODUÇÃO)
- `POST /api/dev/auth/register` - Registrar dev
- `POST /api/dev/auth/login` - Login dev
- `GET /api/dev/auth/verify` - Verificar token
- `GET /api/dev/auth/users` - Listar devs
- `DELETE /api/dev/auth/clear-all` - Limpar devs
- `GET /api/dev/companies` - Listar empresas
- `DELETE /api/dev/companies/:id` - Deletar empresa
- `GET /api/dev/table/:tableName` - Visualizar tabela
- `POST /api/dev/clear-all` - Limpar dados

## 🔧 Como Adicionar Nova Funcionalidade

1. **Criar Controller** em `src/controllers/nome.controller.js`
2. **Criar Rotas** em `src/routes/nome.routes.js`
3. **Importar em** `src/routes/index.js`
4. **Testar** com Postman ou frontend

## 📚 Convenções de Código

- Nomes de arquivos: `kebab-case.js`
- Nomes de funções: `camelCase`
- Nomes de constantes: `UPPER_SNAKE_CASE`
- Comentários: JSDoc-style
- Exports: `module.exports = { func1, func2 }`
- Imports: `const { func } = require('./module')`

## ✅ Vantagens da Arquitetura MVC

✅ **Separação de responsabilidades** - Código organizado por função
✅ **Manutenibilidade** - Fácil encontrar e modificar código
✅ **Escalabilidade** - Adicionar features sem bagunçar
✅ **Testabilidade** - Controllers podem ser testados isoladamente
✅ **Reusabilidade** - Lógica compartilhada entre rotas
✅ **Colaboração** - Múltiplos devs trabalhando em paralelo
