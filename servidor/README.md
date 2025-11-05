# Servidor API - Ascenda Flex

Backend Node.js + Express + SQLite para gerenciamento organizacional híbrido.

## ✨ Versão Otimizada (Novembro 2025)

- ✅ **1.069 linhas** totalmente documentadas
- ✅ **JSDoc-style** em todas as rotas
- ✅ **50 endpoints** (18 públicos + 32 protegidos)
- ✅ Código limpo sem duplicações
- ✅ Validações consistentes
- ✅ Tratamento de erros padronizado

## Stack Tecnológico

- **Node.js** v14+
- **Express** 4.18.2
- **SQLite3** 5.1.6
- **JWT** (jsonwebtoken 9.0.2)
- **bcryptjs** 2.4.3
- **cors** - Habilitar CORS

## Instalação

```bash
npm install
```

## Configuração

Criar arquivo `.env` na raiz da pasta `servidor`:

```env
PORT=3000
JWT_SECRET=seu_secret_aqui_troque_em_producao
```

## Executar

```bash
node server.js
```

Servidor disponível em: `http://localhost:3000`

## Estrutura do Banco de Dados

### 10 Tabelas Principais

1. **companies** - Empresas cadastradas
2. **users** - Usuários de cada empresa (hierarquia 8 níveis)
3. **organization_templates** - Templates organizacionais
4. **squads** - Squads ágeis multifuncionais
5. **squad_members** - Membros dos squads com alocação
6. **chapters** - Chapters (comunidades de prática)
7. **chapter_members** - Membros dos chapters
8. **squad_goals** - Objetivos/metas dos squads
9. **dev_users** - Desenvolvedores do sistema
10. **countries** - Países/filiais (deprecated)

## API Endpoints

### 📂 Rotas Públicas (18 endpoints)

**Empresas**
- `GET /api/companies` - Listar empresas
- `GET /api/companies/:id` - Detalhes da empresa
- `POST /api/companies` - Criar empresa com admins

**Autenticação**
- `POST /api/auth/login` - Login de usuários

**Painel Desenvolvedor**
- `POST /api/dev/auth/register` - Registrar desenvolvedor
- `POST /api/dev/auth/login` - Login desenvolvedor
- `GET /api/dev/auth/verify` - Verificar token dev
- `GET /api/dev/auth/users` - Listar desenvolvedores
- `GET /api/dev/companies` - Listar empresas (dev)
- `GET /api/dev/users/company/:companyId` - Usuários (dev)
- `GET /api/dev/squads/company/:companyId` - Squads (dev)
- `GET /api/dev/chapters/company/:companyId` - Chapters (dev)
- `GET /api/dev/table/:tableName` - Debug de tabelas
- `POST /api/dev/clear-all` - Limpar dados (dev)
- `DELETE /api/dev/companies/:id` - Deletar empresa (dev)
- `DELETE /api/dev/auth/clear-all` - Limpar devs (dev)

**Info API**
- `GET /` - Documentação da API

### 🔒 Rotas Protegidas (32 endpoints)

**Autenticação**
- `GET /api/auth/profile` - Perfil do usuário logado

**Usuários**
- `GET /api/users/company/:companyId` - Listar usuários
- `GET /api/users/:id` - Detalhes do usuário
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

**Templates Organizacionais**
- `GET /api/templates/:companyId` - Obter template
- `PUT /api/templates/:companyId` - Atualizar template

**Squads (9 endpoints)**
- `GET /api/squads/company/:companyId` - Listar squads
- `POST /api/squads` - Criar squad
- `PUT /api/squads/:id` - Atualizar squad
- `DELETE /api/squads/:id` - Deletar squad
- `GET /api/squads/:id/members` - Listar membros
- `POST /api/squads/:id/members` - Adicionar membro
- `PUT /api/squads/:id/members/:memberId` - Atualizar membro
- `DELETE /api/squads/:id/members/:memberId` - Remover membro
- `GET /api/squads/:id/goals` - Listar metas do squad

**Chapters (9 endpoints)**
- `GET /api/chapters/company/:companyId` - Listar chapters
- `POST /api/chapters` - Criar chapter
- `PUT /api/chapters/:id` - Atualizar chapter
- `DELETE /api/chapters/:id` - Deletar chapter
- `GET /api/chapters/:id/members` - Listar membros
- `POST /api/chapters/:id/members` - Adicionar membro
- `PUT /api/chapters/:id/members/:memberId` - Atualizar membro
- `DELETE /api/chapters/:id/members/:memberId` - Remover membro

## Hierarquia Organizacional

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
