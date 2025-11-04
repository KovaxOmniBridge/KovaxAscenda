# Ascenda

Uma empresa voltada para servir outras empresas

## 📦 Estrutura do Projeto

Este projeto está organizado em duas partes principais:

### 🎨 CompanyManagement (Frontend)
Interface React para gerenciamento de empresas com listagem, busca e visualização de dados.

**Tecnologias:** React 18, TypeScript, Vite, CSS3

**Porta:** 3000

[Ver documentação detalhada →](./CompanyManagement/README.md)

### 🔧 servidor (Backend)
API REST com Node.js/Express para gerenciamento completo de empresas (CRUD).

**Tecnologias:** Node.js, Express, TypeScript

**Porta:** 3001

[Ver documentação detalhada →](./servidor/README.md)

## 🚀 Como Executar o Projeto Completo

### 1. Instalar Dependências

```bash
# Instalar dependências do servidor
cd servidor
npm install

# Instalar dependências do frontend
cd ../CompanyManagement
npm install
```

### 2. Executar o Servidor (Backend)

```bash
cd servidor
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### 3. Executar o Frontend

Em outro terminal:

```bash
cd CompanyManagement
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📡 API Endpoints

- `GET /api/companies` - Lista todas as empresas
- `GET /api/companies/:id` - Busca empresa por ID
- `GET /api/companies/cnpj/:cnpj` - Busca empresa por CNPJ
- `POST /api/companies` - Cria nova empresa
- `PUT /api/companies/:id` - Atualiza empresa
- `DELETE /api/companies/:id` - Remove empresa

## 🎯 Funcionalidades Implementadas

- ✅ Listagem de empresas com cards responsivos
- ✅ Busca em tempo real (nome fantasia, razão social, CNPJ)
- ✅ API REST completa com CRUD
- ✅ Validação de CNPJ
- ✅ Dados mockados para teste (3 empresas exemplo)
- ✅ Separação frontend/backend
- ✅ Comunicação via Fetch API

## 🔄 Próximas Implementações

1. Formulário de cadastro de empresa
2. Tela de edição de empresa
3. Validações avançadas nos formulários
4. Integração com API da Receita Federal
5. Integração com ViaCEP para endereços
6. Persistência em banco de dados
7. Autenticação e autorização

## 🛠️ Stack Tecnológica

**Frontend:**
- React 18
- TypeScript
- Vite
- CSS3

**Backend:**
- Node.js
- Express
- TypeScript
- CORS

## 📝 Estrutura de Dados

### Interface ICompany
```typescript
{
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  dataAbertura: Date;
  porte: CompanySize;
  naturezaJuridica: string;
  regimeTributario: TaxRegime;
  situacaoCadastral: CompanyStatus;
  endereco: IAddress;
  contatos: IContact[];
  socios?: IPartner[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 👥 Contribuindo

Este é um projeto em desenvolvimento. Contribuições são bem-vindas!
