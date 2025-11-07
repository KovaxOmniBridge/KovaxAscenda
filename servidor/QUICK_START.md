# 🚀 Quick Start - Backend Ascenda Flex

## 📋 Pré-requisitos
- Node.js instalado
- NPM ou Yarn
- SQLite3

## ⚡ Início Rápido

### 1. Instalar Dependências
```bash
cd servidor
npm install
```

### 2. Iniciar o Servidor
```bash
npm start
```
**Servidor rodando em**: `http://localhost:3000`

### 3. Testar APIs
```bash
node test-api.js
```

## 🔐 Login de Teste

### Presidente (Nível 0)
- **Access Key**: `TS-0001`
- **Password**: `senha123`

### Administrador (Nível 1)
- **Access Key**: `TS-0002`
- **Password**: `senha123`

## 📊 Endpoints Principais

### Base URL
```
http://localhost:3000/api
```

### Exemplos de Uso

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"accessKey": "TS-0001", "password": "senha123"}'
```

#### Listar Usuários (com token)
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### Listar Squads
```bash
curl http://localhost:3000/api/squads \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### Listar Chapters
```bash
curl http://localhost:3000/api/chapters \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### Listar Países
```bash
curl http://localhost:3000/api/countries \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🎯 Dashboard Frontend

### Abrir Dashboard Presidente (Nível 0)
```
file:///C:/Users/diniz/OneDrive/Área%20de%20Trabalho/Projetos/Ascenda/Nivel00-Presidentes/dashboard-presidentes.html
```

### Abrir Dashboard Administrador (Nível 1)
```
file:///C:/Users/diniz/OneDrive/Área%20de%20Trabalho/Projetos/Ascenda/Nivel01-AdministradoresGerais/dashboard-admin.html
```

### Login na Tela Inicial
```
file:///C:/Users/diniz/OneDrive/Área%20de%20Trabalho/Projetos/Ascenda/index.html
```

## 📝 Estrutura de Arquivos

```
servidor/
├── src/
│   ├── controllers/
│   │   ├── user.controller.js       ✅
│   │   ├── squad.controller.js      ✅
│   │   ├── chapter.controller.js    ✅
│   │   ├── country.controller.js    ✅ NOVO!
│   │   ├── auth.controller.js       ✅
│   │   └── ...
│   ├── routes/
│   │   ├── user.routes.js           ✅
│   │   ├── squad.routes.js          ✅
│   │   ├── chapter.routes.js        ✅
│   │   ├── country.routes.js        ✅ NOVO!
│   │   ├── index.js                 ✅
│   │   └── ...
│   ├── middlewares/
│   │   └── auth.middleware.js       ✅
│   └── database/
│       └── schema.js                ✅
├── API_DOCUMENTATION.md             📚
├── BACKEND_COMPLETE.md              📚
├── test-api.js                      🧪
└── server.js                        ✅
```

## 🔧 Comandos Úteis

### Resetar Banco de Dados
```bash
cd servidor/src/database
node reset-and-populate.js
```

### Ver Logs do Servidor
```bash
tail -f servidor/logs/server.log
```

### Testar Endpoint Específico
```bash
# Health Check
curl http://localhost:3000/api/health

# Profile (com autenticação)
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📊 APIs Disponíveis

| Categoria | Endpoints | Status |
|-----------|-----------|--------|
| Auth | 2 | ✅ |
| Users | 7 | ✅ |
| Squads | 10 | ✅ |
| Chapters | 9 | ✅ |
| Countries | 6 | ✅ NOVO! |
| Companies | 2 | ✅ |
| Templates | 3 | ✅ |
| Approvals | 3 | ✅ |

**Total**: 42+ endpoints funcionais

## 🎯 Próximos Passos

1. ✅ **Backend completo** - FEITO!
2. 🔄 **Testar no navegador** - Abrir dashboards
3. 📊 **Verificar dados** - Ver usuários, squads, chapters
4. 🎨 **Personalizar** - Ajustar conforme necessidade
5. 🚀 **Deploy** - Quando estiver pronto

## ⚠️ Troubleshooting

### Servidor não inicia
```bash
# Verificar se porta 3000 está livre
netstat -ano | findstr :3000

# Matar processo na porta 3000 (Windows)
taskkill /PID <PID> /F
```

### Erro de banco de dados
```bash
# Resetar banco
cd servidor/src/database
node reset-and-populate.js
```

### Token expirado
- Fazer login novamente
- Token válido por 24 horas

## 📚 Documentação Completa

- **API Documentation**: `servidor/API_DOCUMENTATION.md`
- **Backend Complete**: `servidor/BACKEND_COMPLETE.md`
- **Developer Security**: `servidor/DEVELOPER_SECURITY.md`

## 💡 Dicas

1. **Debug**: Logs detalhados no console do servidor
2. **Teste**: Use `test-api.js` para validar todas as rotas
3. **Desenvolvimento**: Modo dev com `npm run dev` (nodemon)
4. **Produção**: Use variáveis de ambiente no `.env`

---

## ✅ Checklist de Validação

- [ ] Servidor iniciou sem erros
- [ ] Login funciona (TS-0001)
- [ ] Dashboard carrega dados
- [ ] Usuários aparecem na lista
- [ ] Squads estão visíveis
- [ ] Chapters estão visíveis
- [ ] Países estão visíveis
- [ ] KPIs mostram valores corretos

**Se todos os itens ✅: Backend está 100% funcional! 🎉**

---

**Criado por**: Ascenda Flex Team  
**Data**: Novembro 2025  
**Versão**: 1.0.0 - Production Ready
