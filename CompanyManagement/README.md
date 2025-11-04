# Company Management

Módulo frontend responsável pela interface de gerenciamento de empresas (CNPJ, razão social, nome fantasia, endereço, etc.).

## 🚀 Funcionalidades

- ✅ Listagem de empresas cadastradas
- ✅ Busca por nome fantasia, razão social ou CNPJ
- ✅ Visualização em cards com informações principais
- ✅ Integração com API REST
- 🔄 Cadastro de novas empresas (próxima etapa)
- 🔄 Edição de dados da empresa (próxima etapa)

## 📁 Estrutura do Projeto

```
CompanyManagement/
├── src/
│   ├── components/        # Componentes React
│   │   ├── CompanyList.tsx
│   │   └── CompanyList.css
│   ├── interfaces/        # Interfaces TypeScript (compartilhadas)
│   │   ├── ICompany.ts
│   │   ├── IAddress.ts
│   │   ├── IContact.ts
│   │   ├── IPartner.ts
│   │   └── index.ts
│   ├── api/              # Serviços de comunicação com API
│   │   └── CompanyApiService.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **CSS3** - Estilização
- **Fetch API** - Comunicação com backend

## 📦 Instalação

```bash
# Instalar dependências
npm install
```

## ⚠️ Pré-requisitos

O servidor API deve estar rodando antes de iniciar o frontend:

```bash
# Em outro terminal, na pasta servidor/
cd ../servidor
npm run dev
```

## 🎮 Como Executar

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Endpoints Consumidos

O frontend consome a API em `http://localhost:3001/api/companies`:

- `GET /api/companies` - Lista todas as empresas
- `GET /api/companies/:id` - Busca empresa por ID
- `POST /api/companies` - Cria nova empresa
- `PUT /api/companies/:id` - Atualiza empresa
- `DELETE /api/companies/:id` - Remove empresa

## 🔄 Próximos Passos

1. Implementar tela de cadastro de empresa
2. Implementar tela de edição de empresa
3. Adicionar validações avançadas no formulário
4. Implementar paginação na listagem
5. Adicionar filtros avançados
