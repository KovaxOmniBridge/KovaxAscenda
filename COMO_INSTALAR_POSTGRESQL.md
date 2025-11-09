# 🔧 SOLUÇÃO RÁPIDA - PostgreSQL não está instalado

## ⚠️ Problema Detectado

O erro acontece porque o **PostgreSQL não está instalado** no seu sistema.

---

## ✅ SOLUÇÃO 1: Instalar PostgreSQL (RECOMENDADO)

### Opção A: Instalador Oficial (Mais Fácil)

1. **Baixar o instalador:**
   - Acesse: https://www.postgresql.org/download/windows/
   - Ou link direto: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Baixe a versão 16.x para Windows x86-64

2. **Executar o instalador:**
   - Execute o arquivo `.exe` baixado
   - Clique em "Next" até chegar em "Password"
   - **IMPORTANTE:** Defina uma senha (exemplo: `postgres123`)
   - **ANOTE ESSA SENHA!**
   - Porta: deixe `5432` (padrão)
   - Locale: Default locale
   - Clique em "Next" até finalizar

3. **Verificar instalação:**
   ```powershell
   # Abra um NOVO terminal PowerShell e execute:
   psql --version
   ```
   Deve mostrar: `psql (PostgreSQL) 16.x`

4. **Atualizar o .env:**
   ```powershell
   cd C:\Users\diniz\OneDrive\Área de Trabalho\Projetos\Ascenda1\server
   notepad .env
   ```
   
   Altere a linha:
   ```env
   DB_PASSWORD=postgres
   ```
   Para:
   ```env
   DB_PASSWORD=postgres123
   ```
   (ou a senha que você definiu)

5. **Criar o banco de dados:**
   ```powershell
   node database/init-db.js
   ```

6. **Iniciar o servidor:**
   ```powershell
   npm start
   ```

---

### Opção B: Chocolatey (Rápido via linha de comando)

Se você tem o Chocolatey instalado:

```powershell
# Instalar PostgreSQL
choco install postgresql16 -y

# Aguardar instalação (pode levar alguns minutos)

# Configurar senha
# A senha padrão é "postgres"
```

---

## ✅ SOLUÇÃO 2: Usar Docker (Alternativa)

Se você tem Docker instalado:

```powershell
# Baixar e rodar PostgreSQL no Docker
docker run --name ascenda-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  -d postgres:16

# Aguardar alguns segundos para o container iniciar

# Criar o banco
node database/init-db.js

# Iniciar o servidor
npm start
```

---

## ✅ SOLUÇÃO 3: Voltar temporariamente para JSON

Se você quer testar o sistema AGORA sem instalar PostgreSQL:

```powershell
# Renomear o server.js atual
Move-Item server.js server.js.postgresql-backup

# Restaurar a versão JSON
Move-Item server.js.json-backup server.js

# Iniciar servidor (vai usar JSON novamente)
npm start
```

**Depois você pode voltar para PostgreSQL:**
```powershell
Move-Item server.js server.js.json-backup
Move-Item server.js.postgresql-backup server.js
# Aí instala o PostgreSQL e segue os passos da Solução 1
```

---

## 🎯 Qual solução escolher?

| Solução | Quando usar | Tempo |
|---------|------------|-------|
| **Solução 1 - Instalador** | Melhor opção, sistema completo | 10-15 min |
| **Solução 2 - Docker** | Se já tem Docker instalado | 5 min |
| **Solução 3 - Voltar JSON** | Quer testar AGORA, instala depois | 1 min |

---

## 📞 Dicas Importantes

### Após instalar PostgreSQL:

1. **O serviço inicia automaticamente:**
   - O PostgreSQL roda como serviço do Windows
   - Ele vai iniciar toda vez que você ligar o PC

2. **Primeira conexão:**
   ```powershell
   # Testar conexão
   psql -U postgres
   # Digite a senha que você definiu
   # Se conectar, está funcionando!
   # Digite \q para sair
   ```

3. **Se esquecer a senha:**
   - Precisará reinstalar ou editar o `pg_hba.conf`
   - Mais fácil: reinstalar

---

## ⚡ Erro Comum: "psql não é reconhecido"

Se após instalar ainda aparecer erro:

1. **Adicionar ao PATH:**
   ```powershell
   # Encontre onde foi instalado (geralmente):
   # C:\Program Files\PostgreSQL\16\bin
   
   # Adicione ao PATH do sistema:
   $env:Path += ";C:\Program Files\PostgreSQL\16\bin"
   
   # Ou feche e abra um NOVO terminal
   ```

2. **Verificar novamente:**
   ```powershell
   psql --version
   ```

---

## 🚀 Depois de Instalar PostgreSQL

Execute na ordem:

```powershell
# 1. Criar o banco e tabelas
node database/init-db.js

# Saída esperada:
# 🚀 Iniciando configuração do banco de dados PostgreSQL
# ✓ Banco de dados "ascenda_db" criado com sucesso!
# ✓ Schema criado com sucesso!
# ✓ Dados iniciais inseridos com sucesso!
# ✨ Banco de dados inicializado com sucesso!

# 2. Iniciar o servidor
npm start

# Saída esperada:
# 🚀 Iniciando Ascenda Platform Server...
# ✓ Conexão com PostgreSQL bem-sucedida
# ✓ Servidor rodando na porta 3000
```

---

**Qual solução você quer seguir? Posso te ajudar com qualquer uma delas!** 🎯
