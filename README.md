# Ascenda Platform - Gestão Empresarial Multi-Tenant

> Plataforma completa de gestão empresarial com arquitetura multi-tenant, suportando milhares de organizações com isolamento total de dados.

## � Início Rápido

### Instalação Automática (Recomendado)

Execute o script de instalação no PowerShell como **Administrador**:

```powershell
.\install.ps1
```

Este script irá:
- ✅ Verificar/Instalar PostgreSQL
- ✅ Criar database `ascenda_db`
- ✅ Instalar dependências npm
- ✅ Criar schema completo
- ✅ Popular dados iniciais (8 usuários de teste)

### Instalação Manual

Veja instruções detalhadas em: **[GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md)**

---

## 📋 Visão Geral

Sistema de gestão empresarial com **17 ferramentas** organizadas em **7 categorias funcionais**, suportando múltiplas organizações com isolamento completo.

### Categorias de Ferramentas

- 🎯 **Liderança**: Planejamento estratégico, análise de mercado, dashboards executivos
- 📊 **Diretoria**: Gestão de indicadores, compliance, objetivos corporativos
- ⚙️ **Administração**: Controle financeiro, RH, compras, processos administrativos
- 🎓 **Coordenação**: Gestão de projetos, coordenação de equipes, processos
- 📈 **Gerenciamento**: Gestão de recursos, orçamentos, performance
- 👥 **Supervisão**: Monitoramento operacional, relatórios, indicadores
- 🔧 **Operacional**: Execução de tarefas, controle de processos, dia a dia

### Características Principais

✨ **Multi-Tenant**: Suporte para milhares de empresas isoladas  
🔒 **Segurança**: JWT authentication, bcrypt, audit logs  
📊 **Permissões Flexíveis**: Sistema baseado em roles + permissões diretas  
🎨 **Interface Moderna**: Landing page profissional com gradientes  
⚡ **Alta Performance**: PostgreSQL com índices otimizados  
🔄 **Escalável**: Arquitetura preparada para crescimento

---

## 🏗️ Arquitetura do Projeto

```
Ascenda1/
├── client/                    # Frontend (HTML + CSS + JavaScript)
│   ├── css/
│   │   ├── variables.css     # Variáveis CSS (cores, espaçamentos)
│   │   ├── reset.css         # Reset/normalização
│   │   ├── global.css        # Estilos globais (botões, inputs, cards)
│   │   ├── landing.css       # Landing page
│   │   └── dashboard.css     # Dashboard de ferramentas
│   ├── js/
│   │   ├── auth.js          # Autenticação e sessão
│   │   ├── dashboard.js     # Renderização do dashboard
│   │   └── utils/           # Utilitários e constantes
│   └── index.html           # Landing page principal
│
├── server/                   # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js  # Configuração do PostgreSQL
│   │   ├── repositories/    # Padrão Repository (Data Access)
│   │   │   ├── UserRepository.js
│   │   │   ├── OrganizationRepository.js
│   │   │   └── ToolRepository.js
│   │   ├── database/
│   │   │   ├── setup.js     # Script de criação do schema
│   │   │   └── seed.js      # Script de população de dados
│   │   └── index.js         # Servidor Express
│   ├── database/
│   │   ├── schema.sql       # Schema completo do PostgreSQL
│   │   └── seeds.sql        # Dados iniciais
│   ├── routes/
│   │   ├── auth.js          # POST /login, /logout, GET /verify
│   │   ├── users.js         # CRUD de usuários
│   │   └── tools.js         # Listagem de ferramentas/categorias
│   ├── .env.example         # Template de variáveis de ambiente
│   └── package.json         # Dependências e scripts
│
├── install.ps1              # Script de instalação automática
├── GUIA_INSTALACAO.md       # Guia detalhado de instalação
└── README.md                # Este arquivo
```

---

## 💾 Banco de Dados

### Schema Multi-Tenant

O banco PostgreSQL possui **9 módulos principais**:

1. **Organizations**: Organizações isoladas (empresas)
2. **Users**: Usuários vinculados a organizações
3. **Tool Categories**: 7 categorias de ferramentas
4. **Tools**: 17 ferramentas do sistema
5. **Roles**: Papéis/cargos (CEO, Diretor, etc.)
6. **Permissions**: Sistema de permissões flexível
7. **Organizational Structure**: Departamentos, setores, times, squads
8. **Audit Logs**: Rastreamento completo de ações
9. **Views**: Agregações de permissões e categorias

### Usuários de Teste

Após rodar `npm run db:seed`, você terá 8 usuários disponíveis:

| Email | Senha | Cargo | Categorias Permitidas |
|-------|-------|-------|----------------------|
| ceo@empresa.com | senha123 | CEO | Todas (7) |
| diretor@empresa.com | senha123 | Diretor | 6 categorias |
| admin@empresa.com | senha123 | Administrador | 5 categorias |
| coordenador@empresa.com | senha123 | Coordenador | 3 categorias |
| gerente@empresa.com | senha123 | Gerente | 3 categorias |
| supervisor@empresa.com | senha123 | Supervisor | 2 categorias |
| operador@empresa.com | senha123 | Operacional | 1 categoria |
| dev@empresa.com | senha123 | Desenvolvedor | Acesso dev |

---

## 🔧 Tecnologias

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express 4** - Framework web
- **PostgreSQL 12+** - Banco de dados relacional
- **pg** - Cliente PostgreSQL para Node.js
- **jsonwebtoken** - Autenticação JWT
- **bcrypt** - Hash de senhas
- **dotenv** - Variáveis de ambiente

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização (Variáveis CSS, Flexbox, Grid)
- **JavaScript ES6+** - Lógica (Modules, Async/Await, Fetch API)

---

## 📚 API Endpoints

### Autenticação
```http
POST   /api/auth/login      # Login com email/senha
POST   /api/auth/logout     # Logout
GET    /api/auth/verify     # Verificar token JWT
```

### Usuários
```http
GET    /api/users           # Listar usuários da organização
GET    /api/users/:id       # Detalhes de um usuário
GET    /api/users/:id/tools # Ferramentas disponíveis para o usuário
```

### Ferramentas
```http
GET    /api/tools/categories           # Todas as categorias
GET    /api/tools                      # Todas as ferramentas
GET    /api/tools/category/:categoryKey  # Ferramentas por categoria
GET    /api/tools/:toolKey             # Ferramenta específica
```

### Health Check
```http
GET    /health              # Status do servidor e database
GET    /api                 # Informações da API
```

---

## 🎯 Como Usar

### 1. Instalar PostgreSQL

**Download**: https://www.postgresql.org/download/windows/

Ou use o script automático:
```powershell
.\install.ps1
```

### 2. Configurar Banco de Dados

```powershell
cd server

# Criar schema
npm run db:setup

# Popular dados iniciais
npm run db:seed
```

### 3. Iniciar Servidor

```powershell
# Desenvolvimento (auto-reload)
npm run dev

# Produção
npm start
```

Servidor rodando em: **http://localhost:3000**

### 4. Abrir Frontend

**Opção A**: Live Server (VS Code)
- Instale extensão "Live Server"
- Clique direito em `client/index.html`
- "Open with Live Server"

**Opção B**: HTTP Server
```powershell
cd client
python -m http.server 5500
# ou
npx http-server -p 5500
```

Acesse: **http://localhost:5500**

### 5. Fazer Login

Use qualquer usuário de teste:
- **Email**: `ceo@empresa.com`
- **Senha**: `senha123`

---

## 🧪 Testes

### Testar API
```powershell
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"ceo@empresa.com\",\"password\":\"senha123\"}'

# Listar categorias
curl http://localhost:3000/api/tools/categories
```

### Testar Banco de Dados
```sql
-- Conectar
psql -U postgres -d ascenda_db

-- Ver usuários
SELECT id, name, email FROM users;

-- Ver permissões de um usuário
SELECT * FROM user_all_permissions 
WHERE user_id = (SELECT id FROM users WHERE email = 'ceo@empresa.com');
```

---

## 📖 Estrutura de Permissões

### Sistema Híbrido

O sistema usa **Roles + Permissões Diretas**:

1. **Roles**: Definem acesso padrão a categorias
   - Ex: Role "CEO" tem acesso às 7 categorias

2. **Permissões Diretas**: Permissões específicas
   - `can_access_dev`: Acesso à área de desenvolvedor
   - `can_manage_users`: Gerenciar usuários
   - `can_manage_roles`: Gerenciar papéis

3. **Views Agregadas**: 
   - `user_all_permissions`: Todas as permissões do usuário
   - `user_all_tool_categories`: Todas as categorias acessíveis

### Exemplo de Uso no Frontend

```javascript
import { canAccessCategory, hasPermission } from './js/auth.js';

// Verificar se pode acessar categoria
if (canAccessCategory('lideranca')) {
  // Mostrar ferramentas de liderança
}

// Verificar permissão específica
if (hasPermission('can_access_dev')) {
  // Mostrar área de desenvolvedor
}
```

---

## 🚧 Roadmap

### ✅ Concluído
- [x] Schema SQL multi-tenant
- [x] Sistema de autenticação JWT
- [x] Landing page profissional
- [x] Dashboard de ferramentas
- [x] Sistema de permissões
- [x] Repositórios de dados
- [x] API REST completa

### 🔄 Em Progresso
- [ ] Implementação das 17 ferramentas
- [ ] Área administrativa
- [ ] Gestão de usuários (CRUD)

### 📋 Planejado
- [ ] Notificações em tempo real
- [ ] Relatórios e analytics
- [ ] Integração com serviços externos
- [ ] Mobile app (PWA)
- [ ] Testes automatizados
- [ ] Docker deployment
- [ ] CI/CD pipeline

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

## 👨‍💻 Suporte

Para problemas ou dúvidas:
1. Consulte o **[GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md)**
2. Verifique logs do servidor e console do navegador
3. Verifique se PostgreSQL está rodando
4. Verifique configurações no arquivo `.env`

---

**Ascenda Platform** - Gestão Empresarial Inteligente 🚀
│   │   ├── contexts/         # Contextos globais
│   │   ├── utils/            # Funções auxiliares
│   │   ├── styles/           # Estilos globais
│   │   ├── App.tsx           # Componente raiz
│   │   └── main.tsx          # Entry point
│   ├── public/               # Arquivos públicos
│   ├── index.html            # HTML base
│   ├── vite.config.js        # Configuração Vite
│   └── package.json          # Dependências do cliente
│
├── server/                    # Backend (Node.js - Temporário)
│   ├── routes/               # Rotas da API
│   │   ├── auth.js          # Autenticação
│   │   └── users.js         # Usuários
│   ├── data/                 # Dados temporários (JSON)
│   ├── src/
│   │   └── index.js         # Entry point do servidor
│   └── package.json          # Dependências do servidor
│
├── docs/                      # Documentação
│   ├── Estrutura.md          # Organização de arquivos
│   └── Fluxos.md             # Fluxos de funcionamento
│
├── .env.example              # Exemplo de variáveis de ambiente
├── .gitignore                # Arquivos ignorados pelo Git
├── package.json              # Dependências raiz
└── README.md                 # Documentação principal
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca para interfaces
- **Vite**: Build tool moderna e rápida
- **React Router**: Navegação entre páginas
- **Zustand**: Gerenciamento de estado
- **Axios**: Requisições HTTP

### Backend (Temporário)
- **Node.js**: Runtime JavaScript
- **Express**: Framework web minimalista
- **CORS**: Controle de acesso

## 📦 Instalação

### Pré-requisitos
- Node.js 18+

### Instalação Local

1. Clone o repositório (se aplicável):
```bash
cd Ascenda1
```

2. Instale as dependências:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o projeto:
```bash
# Na raiz do projeto
npm run dev
```

## 🎯 Uso

Após iniciar o projeto:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Rotas da Aplicação
- **`/`**: Página inicial (landing page ou login)
- **`/dashboard`**: Interface principal após login (renderização condicional por categoria)
- **`/desenvolvedor`**: Área restrita para desenvolvedores (requer permissão especial)

## 📚 Documentação

Documentação adicional disponível em `/docs`:

- [Estrutura.md](./Estrutura.md) - Organização de arquivos e pastas
- [Fluxos.md](./Fluxos.md) - Fluxos de funcionamento e visualização

## 🔐 Sistema de Categorias

O sistema não utiliza hierarquia rígida, mas categorias funcionais que podem ser combinadas conforme a necessidade do cargo:

```javascript
// Exemplo de usuário com múltiplas categorias
{
  name: "João Silva",
  categories: ["gerenciamento", "supervisao", "operacional"],
  // Pode gerenciar equipe, analisar dados e executar ações diretas
}
```

## 🤝 Contribuição

1. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
3. Push para a branch (`git push origin feature/NovaFuncionalidade`)
4. Abra um Pull Request

## 📝 Licença

ISC

## 👥 Autores

Desenvolvido pela equipe Ascenda

