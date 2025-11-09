# 🚀 Guia de Migração para PostgreSQL

## ✅ Arquivos Criados/Atualizados

### Banco de Dados
- ✅ `server/database/schema.sql` - Schema completo do PostgreSQL
- ✅ `server/database/seed.sql` - Dados iniciais (org, devs, users, tools)
- ✅ `server/database/init-db.js` - Script para inicializar o banco
- ✅ `server/config/database.js` - Configuração do pool de conexões
- ✅ `server/.env.example` - Template de variáveis de ambiente

### Servidor
- ✅ `server/server.js` - Completamente reescrito para PostgreSQL
- ✅ `server/server.js.json-backup` - Backup da versão antiga (JSON)

---

## 📋 Passos para Executar a Migração

### 1. Instalar PostgreSQL

Se ainda não tiver o PostgreSQL instalado:

**Windows:**
```powershell
# Baixar do site oficial
# https://www.postgresql.org/download/windows/
```

**Verificar instalação:**
```powershell
psql --version
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na pasta `server/`:

```bash
# Copiar do exemplo
cd server
Copy-Item .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui_change_in_production

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ascenda_db
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI

# Logs
LOG_LEVEL=info
```

### 3. Criar o Banco de Dados

Execute o script de inicialização:

```powershell
cd server
node database/init-db.js
```

Você verá:
```
🚀 Iniciando configuração do banco de dados PostgreSQL

   Host: localhost:5432
   Database: ascenda_db
   User: postgres

📦 Criando banco de dados "ascenda_db"...
✓ Banco de dados "ascenda_db" criado com sucesso!

📋 Executando schema.sql...
✓ Schema criado com sucesso!

🌱 Executando seed.sql...
✓ Dados iniciais inseridos com sucesso!

📊 Resumo dos dados inseridos:

   Organizações: 1
   Desenvolvedores: 2
   Usuários: 4
   Ferramentas: 0

✨ Banco de dados inicializado com sucesso!

📝 Credenciais de teste:
   Desenvolvedor: dev@ascenda.com / Dev@2024!Super
   Admin: admin@ascenda.com / Admin@2024!Master
   Usuários: ceo@empresa.com, diretor@empresa.com, etc / senha123
```

### 4. Iniciar o Servidor

```powershell
cd server
npm start
```

Você verá:
```
🚀 Iniciando Ascenda Platform Server...

✓ Conexão com PostgreSQL bem-sucedida: 2025-11-09T...
✓ Servidor rodando na porta 3000
✓ API disponível em http://localhost:3000/api
✓ Health check: http://localhost:3000/health

📝 Endpoints disponíveis:
   POST /api/auth/login/client - Login de clientes
   POST /api/auth/login/developer - Login de desenvolvedores
   GET  /api/organizations - Listar organizações (dev)
   GET  /api/users - Listar usuários
   GET  /api/tools - Listar ferramentas
```

### 5. Testar a Aplicação

#### a) Testar Health Check
```powershell
curl http://localhost:3000/health
```

#### b) Testar Login de Cliente
```powershell
curl -X POST http://localhost:3000/api/auth/login/client `
  -H "Content-Type: application/json" `
  -d '{"email":"ceo@empresa.com","password":"senha123"}'
```

#### c) Testar Login de Desenvolvedor
```powershell
curl -X POST http://localhost:3000/api/auth/login/developer `
  -H "Content-Type: application/json" `
  -d '{"email":"dev@ascenda.com","password":"Dev@2024!Super"}'
```

#### d) Testar Frontend
```
Abrir: index.html
Login Cliente: ceo@empresa.com / senha123
```

```
Abrir: desenvolvedor/pages/login.html
Login Developer: dev@ascenda.com / Dev@2024!Super
```

---

## 📊 Credenciais de Teste

### Desenvolvedores (Plataforma Ascenda)
| Email | Senha | Role |
|-------|-------|------|
| dev@ascenda.com | Dev@2024!Super | developer |
| admin@ascenda.com | Admin@2024!Master | admin |

### Clientes (Empresa Modelo S.A.)
| Email | Senha | Nome |
|-------|-------|------|
| ceo@empresa.com | senha123 | CEO da Empresa |
| diretor@empresa.com | senha123 | Diretor Executivo |
| admin@empresa.com | senha123 | Administrador Geral |
| dev@empresa.com | senha123 | Desenvolvedor Teste |

---

## 🔄 Mudanças Principais

### Schema do Banco

#### Tabelas Criadas:
1. **organizations** - Organizações/empresas clientes
   - UUID, nome, slug, timestamps
   
2. **developers** - Desenvolvedores da plataforma Ascenda
   - UUID, nome, email (unique), password_hash
   - role, permissions (JSONB), is_active
   
3. **users** - Usuários das organizações clientes
   - UUID, organization_id (FK), nome, email
   - password_hash, is_active, last_login_at
   
4. **tool_categories** - Categorias de ferramentas
   - UUID, key (unique), nome, ícone, descrição
   
5. **tools** - Ferramentas disponíveis
   - UUID, category_id (FK), nome, descrição, ícone

### Server.js

#### Removido:
- ❌ Funções `readData()` e `writeData()`
- ❌ Sistema de arquivos JSON
- ❌ Função `initializeData()`

#### Adicionado:
- ✅ Pool de conexões PostgreSQL
- ✅ Queries parametrizadas (proteção SQL injection)
- ✅ Logging de queries
- ✅ Event listeners do pool
- ✅ Graceful shutdown
- ✅ Health check com status do banco
- ✅ Separação clara de rotas por tipo

#### Rotas Atualizadas:
- `POST /api/auth/login/client` - Query com JOIN
- `POST /api/auth/login/developer` - Query em developers
- `GET /api/organizations` - SELECT com ordenação
- `GET /api/users` - Queries diferentes para dev/client
- `GET /api/tools/*` - JOINs com tool_categories

---

## 🛠️ Comandos Úteis PostgreSQL

### Conectar ao banco
```powershell
psql -U postgres -d ascenda_db
```

### Consultas úteis
```sql
-- Ver todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d organizations

-- Contar registros
SELECT COUNT(*) FROM users;

-- Ver todos os desenvolvedores
SELECT * FROM developers;

-- Ver todos os usuários com organização
SELECT u.name, u.email, o.name as org_name
FROM users u
JOIN organizations o ON u.organization_id = o.id;

-- Sair
\q
```

### Resetar banco (SE NECESSÁRIO)
```sql
DROP DATABASE ascenda_db;
```

Depois execute novamente:
```powershell
node database/init-db.js
```

---

## ⚠️ Troubleshooting

### Erro: "cannot connect to server"
```
Verifique se o PostgreSQL está rodando:
Windows: Services → PostgreSQL
```

### Erro: "password authentication failed"
```
Verifique as credenciais no arquivo .env
DB_USER e DB_PASSWORD devem estar corretos
```

### Erro: "database does not exist"
```
Execute: node database/init-db.js
```

### Erro: "port already in use"
```
Outro servidor está usando a porta 3000
Altere PORT no .env ou mate o processo
```

---

## 📈 Próximos Passos

- [ ] Adicionar mais ferramentas ao seed.sql
- [ ] Criar rotas CRUD para ferramentas
- [ ] Implementar sistema de permissões granulares
- [ ] Adicionar logs de auditoria
- [ ] Implementar refresh tokens
- [ ] Adicionar rate limiting
- [ ] Configurar backup automático do banco

---

## 🎉 Migração Concluída!

O sistema agora está usando **PostgreSQL** em vez de arquivos JSON.

**Benefícios:**
- ✅ Transações ACID
- ✅ Relacionamentos com Foreign Keys
- ✅ Índices para performance
- ✅ Queries complexas otimizadas
- ✅ Escalabilidade
- ✅ Backup/Restore nativo
- ✅ Segurança com queries parametrizadas
