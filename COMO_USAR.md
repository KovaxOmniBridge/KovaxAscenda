# 🚀 Como Usar a Plataforma Ascenda

## 📋 Visão Geral

A plataforma Ascenda está totalmente configurada e pronta para uso! Este guia mostra como iniciar e utilizar o sistema.

## ⚡ Início Rápido

### 1. Instalar Dependências (Apenas na Primeira Vez)

```powershell
cd server
npm install
```

### 2. Iniciar o Servidor

```powershell
cd server
npm start
```

Ou com modo de desenvolvimento (auto-reload):
```powershell
npm run dev
```

### 3. Abrir a Aplicação

1. **Opção A - Com Live Server (Recomendado)**:
   - Abra o VS Code
   - Clique com botão direito no arquivo `index.html` (na raiz)
   - Selecione "Open with Live Server"

2. **Opção B - Diretamente no navegador**:
   - Abra o arquivo: `file:///C:/Users/diniz/OneDrive/Área de Trabalho/Projetos/Ascenda1/index.html`

## 👥 Usuários de Teste

| Email | Senha | Função | Categorias de Acesso |
|-------|-------|--------|---------------------|
| `ceo@empresa.com` | `senha123` | CEO | 7 categorias (todas exceto Operacional) |
| `diretor@empresa.com` | `senha123` | Diretor | 6 categorias |
| `admin@empresa.com` | `senha123` | Admin | 5 categorias |
| `dev@empresa.com` | `senha123` | Desenvolvedor | Todas + Modo Dev |

## 🎯 Fluxo de Uso

1. **Login**:
   - Acesse `index.html`
   - Digite email e senha de um dos usuários acima
   - Clique em "Entrar"

2. **Dashboard**:
   - Após login, você será redirecionado para `dashboard.html`
   - Verá as ferramentas organizadas por categoria
   - Cada usuário vê apenas as categorias que tem permissão

3. **Ferramentas**:
   - Clique em qualquer ferramenta para abrir
   - Por enquanto, exibe alerta (ferramentas em desenvolvimento)

4. **Logout**:
   - Clique no botão "Sair" no topo direito
   - Voltará para a tela de login

## 📁 Estrutura de Arquivos

```
Ascenda1/
├── index.html                 ← Página de login (RAIZ)
├── dashboard.html             ← Dashboard principal (RAIZ)
├── client/
│   ├── css/                   ← Estilos
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── landing.css
│   │   └── dashboard.css
│   └── js/                    ← Scripts
│       ├── auth.js            ← Autenticação
│       └── dashboard.js       ← Dashboard
└── server/
    ├── server.js              ← Servidor Express
    ├── package.json           ← Dependências
    └── data/                  ← Banco de dados JSON
        ├── organizations.json
        ├── users.json
        └── tools.json
```

## 🔧 Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Banco de Dados**: Arquivos JSON
- **Autenticação**: JWT + bcrypt
- **Frontend**: HTML5, CSS3, JavaScript ES6 Modules

## 🛠️ Comandos Úteis

### Servidor

```powershell
cd server

# Instalar dependências
npm install

# Iniciar servidor
npm start

# Modo desenvolvimento (auto-reload)
npm run dev

# Testar API
curl http://localhost:3000/health
```

### Testar Login via API

```powershell
# PowerShell
$body = @{
    email = "ceo@empresa.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

## 📊 Categorias de Ferramentas

1. **🎯 Liderança** - Planejamento estratégico
2. **📊 Diretoria** - Gestão de indicadores
3. **⚙️ Administração** - Controle administrativo
4. **🎓 Coordenação** - Coordenação de projetos
5. **📈 Gerenciamento** - Gestão de recursos
6. **👥 Supervisão** - Monitoramento
7. **🔧 Operacional** - Execução operacional

## 🔐 Hierarquia de Permissões

```
CEO (7 categorias)
├── Liderança
├── Diretoria
├── Administração
├── Coordenação
├── Gerenciamento
└── Supervisão

Diretor (6 categorias)
├── Diretoria
├── Administração
├── Coordenação
├── Gerenciamento
└── Supervisão

Admin (5 categorias)
├── Administração
├── Coordenação
├── Gerenciamento
└── Supervisão

Desenvolvedor (TODAS)
├── Todas as categorias
└── Modo desenvolvedor ativo
```

## 🐛 Resolução de Problemas

### Servidor não inicia

```powershell
# Verificar se a porta 3000 está livre
netstat -ano | findstr :3000

# Matar processo na porta 3000 (se necessário)
# Encontre o PID e execute:
taskkill /PID <PID> /F
```

### Login não funciona

1. Verifique se o servidor está rodando
2. Abra o Console do navegador (F12)
3. Verifique erros de CORS ou rede
4. Confirme que está usando Live Server (não file://)

### Ferramentas não aparecem

1. Verifique o Console (F12)
2. Confirme que a API `/api/tools` está respondendo
3. Teste: `curl http://localhost:3000/api/tools`

## 📝 Próximos Passos

- [ ] Implementar páginas individuais de ferramentas
- [ ] Adicionar mais usuários e organizações
- [ ] Criar dashboard de administração
- [ ] Implementar relatórios e analytics
- [ ] Migrar para PostgreSQL (opcional, para produção)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este guia primeiro
2. Consulte `server/README.md` para detalhes do servidor
3. Consulte `INICIO_RAPIDO.md` para API e estrutura de dados

---

**Versão**: 1.0.0 - Sistema JSON (Desenvolvimento)  
**Data**: 2024
