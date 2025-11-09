# 🚀 Ascenda Server - Banco de Dados JSON

Servidor Express simplificado com banco de dados JSON - **Zero configuração necessária!**

## ⚡ Início Rápido

```powershell
# 1. Instalar dependências
npm install

# 2. Iniciar servidor
node server.js
# OU
npm start
# OU
npm run dev  # com auto-reload
```

**Pronto!** O servidor cria automaticamente os arquivos de dados.

---

## 📂 Estrutura

```
server/
├── server.js          # ⭐ Servidor principal (rode este arquivo)
├── data/             # 📦 Banco de dados JSON (criado automaticamente)
│   ├── organizations.json
│   ├── users.json
│   └── tools.json
├── package.json
└── node_modules/
```

---

## 👥 Usuários Pré-configurados

| Email | Senha | Categorias |
|-------|-------|-----------|
| ceo@empresa.com | senha123 | 7 (todas) |
| diretor@empresa.com | senha123 | 6 |
| admin@empresa.com | senha123 | 5 |
| dev@empresa.com | senha123 | 7 + Dev Mode |

---

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar token

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Detalhes do usuário

### Ferramentas
- `GET /api/tools/categories` - Categorias
- `GET /api/tools` - Todas ferramentas
- `GET /api/tools/category/:key` - Por categoria
- `GET /api/tools/user/:userId` - Por usuário

### Geral
- `GET /health` - Health check
- `GET /api` - Info da API

---

## 💡 Vantagens

✅ **Zero configuração** - Não precisa PostgreSQL  
✅ **Auto-inicialização** - Cria dados na primeira execução  
✅ **Fácil debug** - Arquivos JSON legíveis  
✅ **Portável** - Copie e leve  
✅ **Ideal para desenvolvimento** - Rápido para prototipar  

---

## 📝 Editar Dados

Edite diretamente os arquivos em `data/`:

**Adicionar usuário em `data/users.json`:**
```json
{
  "id": "5",
  "organizationId": "1",
  "email": "novo@empresa.com",
  "password": "$2b$10$...",  // Use bcrypt
  "name": "Novo Usuário",
  "role": "Gerente",
  "permissions": {
    "toolCategories": ["gerenciamento"],
    "canAccessDev": false
  }
}
```

**Resetar dados:**
1. Delete a pasta `data/`
2. Reinicie o servidor

---

## 🔄 Migração Futura

Quando precisar de mais performance/recursos:

1. Os scripts PostgreSQL estão em `src/database/`
2. Repositórios prontos em `src/repositories/`
3. Basta configurar `.env` e usar `npm run db:setup`

---

## 📚 Documentação Completa

Veja **../INICIO_RAPIDO.md** para guia detalhado.

---

**Sistema funcional em 2 comandos!** 🎉
