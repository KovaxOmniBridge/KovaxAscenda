# 🚀 Servidor Ascenda Flex - API Backend# Servidor API - Ascenda Flex



## 📋 Visão GeralBackend Node.js + Express + SQLite para gerenciamento organizacional híbrido.



API RESTful para gerenciamento organizacional híbrido com autenticação JWT, suporte a squads, chapters e hierarquia de 8 níveis.## ✨ Versão Otimizada (Novembro 2025)



**Stack:** Node.js + Express + SQLite + JWT + bcrypt- ✅ **1.069 linhas** totalmente documentadas

- ✅ **JSDoc-style** em todas as rotas

---- ✅ **50 endpoints** (18 públicos + 32 protegidos)

- ✅ Código limpo sem duplicações

## ⚡ Quick Start- ✅ Validações consistentes

- ✅ Tratamento de erros padronizado

### Instalação

```bash## Stack Tecnológico

npm install

```- **Node.js** v14+

- **Express** 4.18.2

### Iniciar Servidor- **SQLite3** 5.1.6

```bash- **JWT** (jsonwebtoken 9.0.2)

npm start- **bcryptjs** 2.4.3

```- **cors** - Habilitar CORS



O servidor estará disponível em: **http://localhost:3000**## Instalação



---```bash

npm install

## 🗄️ Banco de Dados```



### SQLite## Configuração

- Arquivo: `db/ascenda.db`

- Encoding: UTF-8Criar arquivo `.env` na raiz da pasta `servidor`:

- Auto-criação: Schema inicializado automaticamente

```env

### Tabelas PrincipaisPORT=3000

- `companies` - EmpresasJWT_SECRET=seu_secret_aqui_troque_em_producao

- `users` - Usuários com hierarquia```

- `dev_users` - Desenvolvedores

- `squads` - Squads ágeis## Executar

- `chapters` - Communities of Practice

- `organization_templates` - Templates organizacionais```bash

- `company_requests` - Solicitações de cadastronode server.js

- `approvals` - Aprovações```



---Servidor disponível em: `http://localhost:3000`



## 🔐 Autenticação## Estrutura do Banco de Dados



### JWT Token### 10 Tabelas Principais

- Expiração: 24 horas

- Secret: Definido em `.env`1. **companies** - Empresas cadastradas

- Header: `Authorization: Bearer <token>`2. **users** - Usuários de cada empresa (hierarquia 8 níveis)

3. **organization_templates** - Templates organizacionais

### Endpoints Públicos4. **squads** - Squads ágeis multifuncionais

```5. **squad_members** - Membros dos squads com alocação

POST /api/auth/login          - Login de usuários6. **chapters** - Chapters (comunidades de prática)

POST /api/dev/auth/login      - Login de desenvolvedores7. **chapter_members** - Membros dos chapters

GET  /api/companies           - Listar empresas8. **squad_goals** - Objetivos/metas dos squads

POST /api/companies           - Criar empresa9. **dev_users** - Desenvolvedores do sistema

POST /api/company-requests    - Solicitar cadastro10. **countries** - Países/filiais (deprecated)

```

## API Endpoints

---

### 📂 Rotas Públicas (18 endpoints)

## 📁 Estrutura do Projeto

**Empresas**

```- `GET /api/companies` - Listar empresas

servidor/- `GET /api/companies/:id` - Detalhes da empresa

├── server.js                 # Entry point- `POST /api/companies` - Criar empresa com admins

├── .env                      # Variáveis de ambiente

├── add-dev.js                # Criar desenvolvedor**Autenticação**

├── list-companies.js         # Listar empresas (util)- `POST /api/auth/login` - Login de usuários

├── db/                       # Banco de dados SQLite

│   └── ascenda.db**Painel Desenvolvedor**

└── src/- `POST /api/dev/auth/register` - Registrar desenvolvedor

    ├── app.js                # Configuração Express- `POST /api/dev/auth/login` - Login desenvolvedor

    ├── config/               # Configurações- `GET /api/dev/auth/verify` - Verificar token dev

    ├── controllers/          # Lógica de negócio- `GET /api/dev/auth/users` - Listar desenvolvedores

    ├── middlewares/          # Middlewares- `GET /api/dev/companies` - Listar empresas (dev)

    ├── routes/               # Rotas da API- `GET /api/dev/users/company/:companyId` - Usuários (dev)

    └── database/             # Scripts de banco- `GET /api/dev/squads/company/:companyId` - Squads (dev)

```- `GET /api/dev/chapters/company/:companyId` - Chapters (dev)

- `GET /api/dev/table/:tableName` - Debug de tabelas

---- `POST /api/dev/clear-all` - Limpar dados (dev)

- `DELETE /api/dev/companies/:id` - Deletar empresa (dev)

## 🛠️ Scripts Úteis- `DELETE /api/dev/auth/clear-all` - Limpar devs (dev)



### Criar Desenvolvedor**Info API**

```bash- `GET /` - Documentação da API

node add-dev.js

```### 🔒 Rotas Protegidas (32 endpoints)



### Listar Empresas**Autenticação**

```bash- `GET /api/auth/profile` - Perfil do usuário logado

node list-companies.js

```**Usuários**

- `GET /api/users/company/:companyId` - Listar usuários

### Popular Banco- `GET /api/users/:id` - Detalhes do usuário

```bash- `POST /api/users` - Criar usuário

node src/database/reset-and-populate.js- `PUT /api/users/:id` - Atualizar usuário

```- `DELETE /api/users/:id` - Deletar usuário



---**Templates Organizacionais**

- `GET /api/templates/:companyId` - Obter template

## 🔧 Configuração (.env)- `PUT /api/templates/:companyId` - Atualizar template



```env**Squads (9 endpoints)**

PORT=3000- `GET /api/squads/company/:companyId` - Listar squads

JWT_SECRET=sua_chave_secreta_aqui- `POST /api/squads` - Criar squad

NODE_ENV=development- `PUT /api/squads/:id` - Atualizar squad

```- `DELETE /api/squads/:id` - Deletar squad

- `GET /api/squads/:id/members` - Listar membros

---- `POST /api/squads/:id/members` - Adicionar membro

- `PUT /api/squads/:id/members/:memberId` - Atualizar membro

## 📝 Changelog- `DELETE /api/squads/:id/members/:memberId` - Remover membro

- `GET /api/squads/:id/goals` - Listar metas do squad

### v2.0.0 (08/11/2025)

- ✅ Correção completa UTF-8**Chapters (9 endpoints)**

- ✅ Otimização de middlewares- `GET /api/chapters/company/:companyId` - Listar chapters

- ✅ Logs de debug em autenticação- `POST /api/chapters` - Criar chapter

- ✅ Limpeza e consolidação- `PUT /api/chapters/:id` - Atualizar chapter

- `DELETE /api/chapters/:id` - Deletar chapter

---- `GET /api/chapters/:id/members` - Listar membros

- `POST /api/chapters/:id/members` - Adicionar membro

## 👨‍💻 Desenvolvido por- `PUT /api/chapters/:id/members/:memberId` - Atualizar membro

- `DELETE /api/chapters/:id/members/:memberId` - Remover membro

Equipe Ascenda Flex  

Data: Novembro 2025## Hierarquia Organizacional


O sistema suporta 8 níveis hierárquicos (0-7):

- **Nível 0**: Presidentes (C-Level)
- **Nível 1**: Administradores Gerais (VPs)
- **Nível 2**: Diretores Executivos
- **Nível 3**: Gerentes
- **Nível 4**: Coordenadores
- **Nível 5**: Supervisores
- **Nível 6**: Especialistas
- **Nível 7**: Operacional

## Autenticação

O sistema usa JWT (JSON Web Tokens) com validade de 24 horas.

### Login
```javascript
POST /api/auth/login
{
  "companyId": 1,
  "accessKey": "usuario123",
  "password": "senha123"
}
```

### Usar Token
```javascript
Authorization: Bearer <seu_token_jwt>
```

## 📊 Estatísticas do Servidor

- **Total de linhas**: 1.069
- **Rotas públicas**: 18
- **Rotas protegidas**: 32
- **Tabelas no banco**: 10
- **Níveis hierárquicos**: 8
- **Comentários**: Em todas as rotas e funções

## 🛠️ Padrões de Código

- ✅ Validação de dados em todas as rotas
- ✅ Tratamento de erros com try-catch
- ✅ Logs descritivos com console.log
- ✅ Respostas JSON padronizadas
- ✅ Status codes HTTP corretos
- ✅ Nomes de variáveis em camelCase
- ✅ Comentários JSDoc-style
- ✅ Código em português (comentários e mensagens)

## 🚀 Estrutura do Projeto

```
servidor/
├── server.js              # Servidor Express otimizado (1.069 linhas)
├── database.js            # Schema SQLite + seeds
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências
├── README.md              # Este arquivo
└── ascenda.db             # Banco de dados SQLite
```

## 📝 Notas de Desenvolvimento

### Rotas de Desenvolvedor (/api/dev/*)
As rotas com prefixo `/api/dev/*` não requerem autenticação e são destinadas ao painel de desenvolvimento. **NÃO USAR EM PRODUÇÃO**.

### Seeds (Dados de Teste)
O arquivo `database.js` contém seeds para popular o banco com dados de exemplo. As empresas demo são:
- Tech Startup Brasil (empresa id: 1)

### Níveis Hierárquicos
O campo `nivel` na tabela `users` define a posição na hierarquia (0-7). Quanto menor o número, maior a senioridade.

### Squads e Chapters
- **Squads**: Times multifuncionais temporários para projetos/produtos
- **Chapters**: Comunidades permanentes de especialistas (ex: Chapter de Frontend)
