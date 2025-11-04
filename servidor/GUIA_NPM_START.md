# ⚡ Guia Rápido - npm start

## ✅ Sistema Pronto para Produção!

Agora você pode usar `npm start` para iniciar o servidor em modo produção.

---

## 🎯 Comandos Principais

### Durante Desenvolvimento
```bash
cd servidor
npm run dev
```
✅ **Hot-reload** automático  
✅ TypeScript executado diretamente  
✅ Ideal para desenvolvimento

### Em Produção
```bash
cd servidor

# Opção 1: Manual (2 passos)
npm run build   # Compila TS → JS
npm start       # Inicia servidor

# Opção 2: Automático (1 passo)
npm run start:prod  # Build + Start
```
✅ **Performance máxima**  
✅ JavaScript compilado  
✅ Verificações automáticas  
✅ Carrega .env.production

---

## 📊 O que acontece com cada comando?

### `npm run dev`
```
ts-node-dev
  ↓
Executa src/server.ts diretamente
  ↓
Hot-reload ao salvar arquivos
```

### `npm run build`
```
TypeScript Compiler (tsc)
  ↓
src/ → dist/ (JavaScript)
  ↓
Pasta dist/ criada
```

### `npm start`
```
scripts/start-prod.js
  ↓
Verifica dist/ existe
  ↓
Verifica data/ existe
  ↓
Carrega .env.production
  ↓
Executa dist/server.js
  ↓
🚀 Servidor rodando!
```

---

## 🔍 Verificações Automáticas

O `npm start` agora faz:

1. ✅ **Verifica se código foi compilado**
   - Checa se `dist/` existe
   - Checa se `dist/server.js` existe

2. ✅ **Cria diretório de dados**
   - Cria `data/` se não existir

3. ✅ **Carrega configurações de produção**
   - Usa `.env.production` se disponível
   - Fallback para `.env` padrão

4. ✅ **Inicia servidor**
   - Logs informativos
   - Health check disponível

---

## 🎨 Logs de Inicialização

```
🚀 Iniciando servidor em modo produção...

✅ Verificações concluídas
🔧 Iniciando servidor...

📋 Variáveis de produção carregadas

✅ Banco de dados SQLite inicializado com sucesso!
💾 Otimizado para milhares de registros
🚀 Servidor rodando na porta 3001
📍 API disponível em: http://localhost:3001/api
💚 Health check: http://localhost:3001/health
```

---

## ⚙️ Variáveis de Ambiente

### .env (Desenvolvimento)
```env
PORT=3001
NODE_ENV=development
DB_PATH=./data/database.sqlite
CORS_ORIGIN=*
MAX_PAYLOAD_SIZE=50mb
```

### .env.production (Produção)
```env
PORT=3001
NODE_ENV=production
DB_PATH=./data/database.sqlite
CORS_ORIGIN=*
MAX_PAYLOAD_SIZE=50mb
LOG_LEVEL=info
```

---

## 🐛 Troubleshooting

### Erro: "Código não compilado"
```bash
npm run build
```

### Erro: "server.js não encontrado"
```bash
npm run rebuild
```

### Limpar tudo e recompilar
```bash
npm run clean
npm run build
npm start
```

---

## 📦 Estrutura Gerada

Após `npm run build`:

```
servidor/
├── src/              # TypeScript (original)
├── dist/             # JavaScript (compilado) ✅
│   ├── controllers/
│   ├── database/
│   ├── interfaces/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── server.js     # Ponto de entrada ✅
├── data/             # Banco SQLite
│   └── database.sqlite
├── scripts/
│   └── start-prod.js # Script de produção ✅
├── .env.production   # Config produção ✅
└── package.json
```

---

## 🚀 Deploy Sugerido

### Opção 1: Servidor VPS
```bash
# No servidor
git clone <repo>
cd servidor
npm install --production
npm run build
npm start
```

### Opção 2: PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start npm --name "ascenda-api" -- start
pm2 save
pm2 startup
```

### Opção 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY scripts ./scripts
COPY .env.production ./.env
RUN mkdir -p data
EXPOSE 3001
CMD ["npm", "start"]
```

---

## ✨ Novos Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Compila projeto |
| `npm start` | **Produção** ✅ |
| `npm run start:prod` | Build + Start |
| `npm run clean` | Remove dist/ |
| `npm run rebuild` | Clean + Build |

---

## 🎯 Resumo

✅ **Antes**: Só tinha `npm run dev`  
✅ **Agora**: Sistema completo de produção!

**Para desenvolver**:
```bash
npm run dev
```

**Para produção**:
```bash
npm start
```

**Simples assim!** 🚀

---

*Guia atualizado em 04/11/2025*
