# Servidor API - Ascenda

Servidor Node.js com Express para gerenciamento de empresas.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **CORS** - Habilitação de requisições cross-origin

## 📁 Estrutura

```
servidor/
├── src/
│   ├── controllers/       # Controladores das rotas
│   │   └── CompanyController.ts
│   ├── routes/           # Definição de rotas
│   │   └── companyRoutes.ts
│   ├── services/         # Lógica de negócio
│   │   └── CompanyService.ts
│   ├── repositories/     # Acesso a dados
│   │   ├── ICompanyRepository.ts
│   │   └── CompanyRepository.ts
│   ├── interfaces/       # Interfaces TypeScript
│   │   ├── ICompany.ts
│   │   ├── IAddress.ts
│   │   ├── IContact.ts
│   │   ├── IPartner.ts
│   │   └── index.ts
│   └── server.ts         # Ponto de entrada
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Instalação

```bash
npm install
```

## 🎮 Como Executar

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start
```

## 🌐 Endpoints da API

### Empresas

- **GET** `/api/companies` - Lista todas as empresas
- **GET** `/api/companies/:id` - Busca empresa por ID
- **GET** `/api/companies/cnpj/:cnpj` - Busca empresa por CNPJ
- **POST** `/api/companies` - Cria nova empresa
- **PUT** `/api/companies/:id` - Atualiza empresa
- **DELETE** `/api/companies/:id` - Remove empresa

## 📝 Exemplo de Requisição

### Listar todas as empresas
```bash
curl http://localhost:3001/api/companies
```

### Criar nova empresa
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "12.345.678/0001-90",
    "razaoSocial": "Minha Empresa Ltda",
    "nomeFantasia": "MinhaEmpresa",
    "porte": "ME",
    "regimeTributario": "SIMPLES_NACIONAL",
    "situacaoCadastral": "ATIVA",
    "endereco": {
      "cep": "01310-100",
      "logradouro": "Avenida Paulista",
      "numero": "1000",
      "cidade": "São Paulo",
      "estado": "SP",
      "pais": "Brasil"
    }
  }'
```

## 🔧 Configuração

O servidor roda por padrão na porta **3001**. Para alterar, crie um arquivo `.env`:

```
PORT=3001
```

## 📊 Dados Mockados

O servidor vem com 3 empresas de exemplo para teste inicial.
