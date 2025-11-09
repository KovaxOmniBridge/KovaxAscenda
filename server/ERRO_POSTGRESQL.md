# ⚠️ ERRO: PostgreSQL não está disponível

## 🔴 O que aconteceu?

O servidor precisa do **PostgreSQL** para funcionar, mas ele não está instalado no seu sistema.

---

## ✅ ESCOLHA UMA SOLUÇÃO:

### 🎯 OPÇÃO 1: Instalar PostgreSQL (10 minutos)

**Passo 1:** Baixar instalador
- Acesse: https://www.postgresql.org/download/windows/
- Ou link direto: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- Baixe PostgreSQL 16.x para Windows

**Passo 2:** Instalar
1. Execute o instalador `.exe`
2. Siga o wizard (Next, Next...)
3. **IMPORTANTE:** Quando pedir senha, defina: `postgres123`
4. **ANOTE ESSA SENHA!**
5. Porta: `5432` (deixe padrão)
6. Finalize a instalação

**Passo 3:** Configurar
```powershell
# Abra um NOVO terminal e teste:
psql --version

# Deve mostrar: psql (PostgreSQL) 16.x
```

**Passo 4:** Atualizar senha no .env
```powershell
cd C:\Users\diniz\OneDrive\Área de Trabalho\Projetos\Ascenda1\server
notepad .env
```

Altere a linha:
```env
DB_PASSWORD=postgres123
```

**Passo 5:** Criar banco de dados
```powershell
npm run db:init
```

**Passo 6:** Iniciar servidor
```powershell
npm start
```

✅ **PRONTO!** O servidor vai iniciar com PostgreSQL!

---

### 🐳 OPÇÃO 2: Usar Docker (5 minutos)

Se você já tem Docker instalado:

```powershell
# Rodar PostgreSQL no container
docker run --name ascenda-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16

# Aguardar alguns segundos

# Criar banco
npm run db:init

# Iniciar servidor
npm start
```

---

### ⚡ OPÇÃO 3: Voltar para JSON (1 minuto)

Se quiser testar o sistema AGORA e instalar PostgreSQL depois:

```powershell
cd C:\Users\diniz\OneDrive\Área de Trabalho\Projetos\Ascenda1\server

# Salvar versão PostgreSQL
Move-Item server.js server.js.postgresql -Force

# Restaurar versão JSON
Move-Item server.js.json-backup server.js -Force

# Iniciar servidor (vai usar JSON)
npm start
```

**Quando quiser voltar para PostgreSQL:**
```powershell
Move-Item server.js server.js.json-backup -Force
Move-Item server.js.postgresql server.js -Force
# Instale o PostgreSQL seguindo Opção 1
```

---

## 🛠️ Comandos Úteis

```powershell
# Verificar se PostgreSQL está disponível
npm run check

# Criar/resetar banco de dados
npm run db:init

# Iniciar servidor
npm start
```

---

## 📞 Problemas Comuns

### ❌ "psql não é reconhecido"

Após instalar, feche e abra um **NOVO terminal PowerShell**.

Se ainda não funcionar:
```powershell
# Adicionar PostgreSQL ao PATH
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
```

### ❌ "password authentication failed"

A senha no `.env` está errada.

1. Abra o `.env`:
   ```powershell
   notepad .env
   ```

2. Corrija a senha:
   ```env
   DB_PASSWORD=sua_senha_correta
   ```

### ❌ "database does not exist"

Execute:
```powershell
npm run db:init
```

---

## 🎯 Recomendação

**Use a OPÇÃO 1** (Instalar PostgreSQL) porque:
- ✅ Sistema completo e profissional
- ✅ Melhor performance
- ✅ Suporta mais funcionalidades
- ✅ É o que será usado em produção

**Use a OPÇÃO 3** (JSON) apenas se:
- ⚠️ Quer testar rapidamente
- ⚠️ Vai instalar PostgreSQL depois
- ⚠️ É temporário

---

**Qual opção você quer seguir?** 🚀
