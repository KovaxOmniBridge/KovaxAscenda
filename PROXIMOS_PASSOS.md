# 🎯 PRÓXIMOS PASSOS - Migração PostgreSQL

## ✅ O que já foi feito:

1. **Schema do banco criado** (`server/database/schema.sql`)
   - Tabelas: organizations, developers, users, tool_categories, tools
   - Relacionamentos com Foreign Keys
   - Índices para performance
   - Triggers para updated_at

2. **Dados iniciais preparados** (`server/database/seed.sql`)
   - 1 organização: Empresa Modelo S.A.
   - 2 desenvolvedores: dev@ascenda.com, admin@ascenda.com
   - 4 usuários de teste: ceo@, diretor@, admin@, dev@ @empresa.com
   - Senhas com bcrypt hash

3. **Script de inicialização** (`server/database/init-db.js`)
   - Cria o banco automaticamente
   - Executa schema.sql
   - Executa seed.sql
   - Mostra resumo dos dados

4. **Servidor atualizado** (`server/server.js`)
   - Substituído JSON por PostgreSQL
   - Pool de conexões otimizado
   - Queries parametrizadas (segurança)
   - Logging completo
   - Graceful shutdown

5. **Arquivos de configuração**
   - `server/config/database.js` - Pool PostgreSQL
   - `server/.env.example` - Template de variáveis

---

## 📋 O QUE VOCÊ PRECISA FAZER AGORA:

### Passo 1: Instalar PostgreSQL

**Se ainda não tiver instalado:**

1. Baixe o PostgreSQL para Windows:
   https://www.postgresql.org/download/windows/

2. Durante a instalação:
   - Defina uma senha para o usuário `postgres`
   - **ANOTE ESSA SENHA!** Você vai precisar dela
   - Porta padrão: 5432
   - Locale: Portuguese, Brazil

3. Verifique a instalação:
   ```powershell
   psql --version
   ```

### Passo 2: Configurar o arquivo .env

1. Navegue até a pasta server:
   ```powershell
   cd server
   ```

2. Crie o arquivo `.env` baseado no `.env.example`:
   ```powershell
   Copy-Item .env.example .env
   ```

3. Edite o arquivo `.env` e **coloque sua senha do PostgreSQL**:
   ```env
   DB_PASSWORD=SUA_SENHA_DO_POSTGRES_AQUI
   ```

### Passo 3: Criar o Banco de Dados

Execute o script de inicialização:

```powershell
node database/init-db.js
```

**O que esse script faz:**
1. Conecta ao PostgreSQL
2. Cria o banco `ascenda_db` (se não existir)
3. Cria todas as tabelas (schema.sql)
4. Insere dados iniciais (seed.sql)
5. Mostra resumo

**Saída esperada:**
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

### Passo 4: Iniciar o Servidor

```powershell
npm start
```

**Saída esperada:**
```
🚀 Iniciando Ascenda Platform Server...

✓ Conexão com PostgreSQL bem-sucedida
✓ Servidor rodando na porta 3000
✓ API disponível em http://localhost:3000/api
✓ Health check: http://localhost:3000/health

📝 Endpoints disponíveis:
   POST /api/auth/login/client
   POST /api/auth/login/developer
   GET  /api/organizations
   GET  /api/users
   GET  /api/tools
```

### Passo 5: Testar a Aplicação

#### Opção A: Pelo navegador

1. Abra `index.html` no navegador
2. Faça login com:
   - Email: `ceo@empresa.com`
   - Senha: `senha123`

3. Para área de desenvolvedor:
   - Abra `desenvolvedor/pages/login.html`
   - Email: `dev@ascenda.com`
   - Senha: `Dev@2024!Super`

#### Opção B: Via curl/PowerShell

**Health check:**
```powershell
curl http://localhost:3000/health
```

**Login cliente:**
```powershell
$body = @{
    email = "ceo@empresa.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login/client" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**Login desenvolvedor:**
```powershell
$body = @{
    email = "dev@ascenda.com"
    password = "Dev@2024!Super"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login/developer" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

---

## ⚠️ Problemas Comuns

### Erro: "cannot connect to server"

**Solução:**
1. Verifique se o PostgreSQL está rodando:
   - Windows: Pressione `Win + R`, digite `services.msc`
   - Procure por "postgresql" e inicie o serviço

2. Teste a conexão manual:
   ```powershell
   psql -U postgres
   ```
   Digite sua senha quando solicitado.

### Erro: "password authentication failed"

**Solução:**
1. Verifique o arquivo `.env`:
   ```env
   DB_PASSWORD=sua_senha_correta
   ```

2. Teste a senha manualmente:
   ```powershell
   psql -U postgres -W
   ```

### Erro: "database does not exist"

**Solução:**
Execute o script de inicialização:
```powershell
node database/init-db.js
```

### Erro: "port 3000 already in use"

**Solução:**
1. Encontre o processo usando a porta:
   ```powershell
   netstat -ano | findstr :3000
   ```

2. Mate o processo:
   ```powershell
   taskkill /PID <numero_do_pid> /F
   ```

Ou altere a porta no `.env`:
```env
PORT=3001
```

---

## 📊 Credenciais de Teste

### Desenvolvedores (Plataforma)
| Email | Senha | Descrição |
|-------|-------|-----------|
| dev@ascenda.com | Dev@2024!Super | Desenvolvedor principal |
| admin@ascenda.com | Admin@2024!Master | Administrador |

### Clientes (Empresa Modelo)
| Email | Senha | Cargo |
|-------|-------|-------|
| ceo@empresa.com | senha123 | CEO |
| diretor@empresa.com | senha123 | Diretor |
| admin@empresa.com | senha123 | Admin |
| dev@empresa.com | senha123 | Dev |

---

## 🔍 Verificar se deu certo

### 1. Conectar ao banco via psql

```powershell
psql -U postgres -d ascenda_db
```

### 2. Verificar tabelas criadas

```sql
\dt
```

Deve mostrar:
- developers
- organizations
- tool_categories
- tools
- users

### 3. Verificar dados

```sql
-- Ver desenvolvedores
SELECT name, email, role FROM developers;

-- Ver organizações
SELECT name, slug FROM organizations;

-- Ver usuários
SELECT u.name, u.email, o.name as org_name
FROM users u
JOIN organizations o ON u.organization_id = o.id;

-- Sair
\q
```

---

## ✅ Checklist Final

- [ ] PostgreSQL instalado e rodando
- [ ] Arquivo `.env` criado com senha correta
- [ ] Script `init-db.js` executado com sucesso
- [ ] Banco `ascenda_db` criado
- [ ] Tabelas criadas (organizations, developers, users, etc)
- [ ] Dados iniciais inseridos
- [ ] Servidor iniciado com `npm start`
- [ ] Health check retorna `status: healthy`
- [ ] Login de cliente funciona
- [ ] Login de desenvolvedor funciona
- [ ] Dashboards carregam corretamente

---

## 🎉 Próximos Passos (Após Migração)

1. **Adicionar mais ferramentas:**
   - Editar `seed.sql`
   - Inserir tools com category_id

2. **Criar rotas CRUD:**
   - POST /api/tools (criar ferramenta)
   - PUT /api/tools/:id (atualizar)
   - DELETE /api/tools/:id (deletar)

3. **Implementar permissões:**
   - Sistema de roles granular
   - Permissões por ferramenta

4. **Logs de auditoria:**
   - Tabela de audit_logs
   - Rastrear ações dos usuários

5. **Backup automático:**
   - Script de backup diário
   - Restauração de dados

---

## 📞 Precisa de Ajuda?

Se encontrar algum problema, verifique:

1. **Logs do servidor:**
   - Mensagens de erro no terminal onde rodou `npm start`

2. **Logs do PostgreSQL:**
   - Windows: `C:\Program Files\PostgreSQL\<versão>\data\log`

3. **Variáveis de ambiente:**
   - Verifique se o `.env` está na pasta `server/`
   - Confirme que a senha está correta

---

**Boa sorte! 🚀**
