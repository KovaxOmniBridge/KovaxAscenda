# 🚀 Ascenda - Plataforma de Gestão Empresarial

Sistema completo de gestão empresarial com módulos de gerenciamento de empresas, produtos e serviços.

## 📦 Módulos

### 1. 🏢 CompanyManagement
Sistema de cadastro e gerenciamento de empresas.

**Funcionalidades:**
- ✅ Cadastro completo de empresas (CNPJ, Razão Social, etc.)
- ✅ Gerenciamento de endereços
- ✅ Controle de contatos
- ✅ Informações fiscais (Porte, Regime Tributário)
- ✅ Status cadastral

[Ver documentação completa →](./CompanyManagement/README.md)

### 2. 📦 MarketManagement
Sistema de gerenciamento de produtos e serviços por empresa.

**Funcionalidades:**
- ✅ Cadastro de produtos com controle de estoque
- ✅ Gerenciamento de serviços oferecidos
- ✅ Cálculo de margem de lucro
- ✅ Alertas de estoque baixo
- ✅ Categorização e busca
- ✅ Organização por empresa

[Ver documentação completa →](./MarketManagement/README.md)

## 🛠️ Tecnologias

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Design responsivo
- Interface moderna com modais e tabs

### Backend
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- Arquitetura MVC (Repository → Service → Controller)

### Banco de Dados
- SQLite com otimizações para produção
- WAL mode habilitado
- Índices para performance
- Persistência permanente

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd servidor
npm install
```

### 2. Compilar TypeScript
```bash
npm run build
```

### 3. Iniciar Servidor
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3001`

### 4. Abrir Interfaces

**CompanyManagement:**
Abra `CompanyManagement/index.html` no navegador

**MarketManagement:**
Abra `MarketManagement/index.html` no navegador

## 📡 API Endpoints

### Empresas
```
GET    /api/companies           - Listar empresas
GET    /api/companies/:id       - Buscar empresa
POST   /api/companies           - Criar empresa
PUT    /api/companies/:id       - Atualizar empresa
DELETE /api/companies/:id       - Excluir empresa
```

### Produtos
```
GET    /api/companies/:companyId/products           - Listar produtos
GET    /api/companies/:companyId/products/:id       - Buscar produto
POST   /api/companies/:companyId/products           - Criar produto
PUT    /api/companies/:companyId/products/:id       - Atualizar produto
DELETE /api/companies/:companyId/products/:id       - Excluir produto
```

### Serviços
```
GET    /api/companies/:companyId/services           - Listar serviços
GET    /api/companies/:companyId/services/:id       - Buscar serviço
POST   /api/companies/:companyId/services           - Criar serviço
PUT    /api/companies/:companyId/services/:id       - Atualizar serviço
DELETE /api/companies/:companyId/services/:id       - Excluir serviço
```

## 🗄️ Estrutura do Projeto

```
Ascenda/
├── CompanyManagement/          # Módulo de empresas
│   ├── index.html
│   ├── styles/
│   │   └── main.css
│   └── scripts/
│       ├── api.js
│       └── main.js
├── MarketManagement/           # Módulo de produtos/serviços
│   ├── index.html
│   ├── styles/
│   │   └── main.css
│   └── scripts/
│       ├── api.js
│       └── main.js
└── servidor/                   # Backend API
    ├── src/
    │   ├── controllers/        # Controladores HTTP
    │   ├── services/           # Lógica de negócio
    │   ├── repositories/       # Acesso a dados
    │   ├── interfaces/         # Tipos TypeScript
    │   ├── routes/             # Rotas da API
    │   ├── database/           # Configuração DB
    │   └── server.ts           # Servidor principal
    └── database.db             # Banco SQLite
```

## 💾 Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

- **companies** - Dados das empresas
- **products** - Produtos vinculados a empresas
- **services** - Serviços vinculados a empresas

Todas as tabelas possuem índices otimizados para consultas rápidas mesmo com milhares de registros.

## 🔧 Scripts Disponíveis

```bash
npm run dev    # Modo desenvolvimento (hot reload)
npm run build  # Compilar TypeScript
npm start      # Modo produção
npm run seed   # Popular banco com dados de exemplo
```

## 🎯 Recursos Implementados

- ✅ CRUD completo de empresas
- ✅ CRUD completo de produtos
- ✅ CRUD completo de serviços
- ✅ Validações de dados
- ✅ Persistência permanente
- ✅ Interface responsiva
- ✅ Busca e filtros
- ✅ Controle de estoque
- ✅ Cálculo de margens
- ✅ Organização por categorias
- ✅ Status e situações cadastrais

## 📈 Próximas Funcionalidades

- [ ] Autenticação e autorização
- [ ] Dashboard com gráficos
- [ ] Relatórios em PDF
- [ ] Importação/Exportação CSV
- [ ] Histórico de alterações
- [ ] Backup automático
- [ ] API de notificações
- [ ] Integração com sistemas fiscais

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Sugestões e melhorias são bem-vindas!

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ para gestão empresarial eficiente**
c