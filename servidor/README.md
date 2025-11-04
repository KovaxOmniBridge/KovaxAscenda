# 🚀 Servidor API - Ascenda

Servidor Node.js com Express e TypeScript para gerenciamento de empresas, produtos, serviços e sites customizados.

## � Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **SQLite (better-sqlite3)** - Banco de dados local otimizado
- **CORS** - Habilitação de requisições cross-origin

## 📦 Comandos Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor em modo desenvolvimento (com hot-reload)
npm run dev

# Porta padrão: http://localhost:3001
```

### Produção
```bash
# Compilar TypeScript para JavaScript
npm run build

# Iniciar servidor em produção
npm start

# Ou fazer tudo de uma vez
npm run start:prod
```

### Manutenção
```bash
# Limpar pasta dist/
npm run clean

# Limpar e recompilar
npm run rebuild

# Executar migrations
npm run migrate

# Popular banco com dados
npm run seed
```

## 🔧 Estrutura de Scripts

| Comando | Descrição | Quando usar |
|---------|-----------|-------------|
| `npm run dev` | Desenvolvimento com hot-reload | **Durante desenvolvimento** ✅ |
| `npm run build` | Compila TS → JS | Antes de produção |
| `npm start` | Inicia servidor compilado | **Em produção** ✅ |
| `npm run start:prod` | Build + Start | Deploy automático |

## 💾 Banco de Dados

O sistema utiliza **SQLite** otimizado para alto desempenho:

- ✅ Suporta **milhares de empresas**
- ✅ Persistência permanente em arquivo
- ✅ Queries otimizadas com índices
- ✅ Write-Ahead Logging (WAL) ativado
- ✅ Cache de 10MB para melhor performance
- ✅ Localização: `data/ascenda.db`

### Capacidades do SQLite:
- **Registros**: Suporta facilmente 100.000+ empresas
- **Tamanho**: Até 281 TB de dados
- **Performance**: ~500.000 SELECT/s em hardware comum
- **Confiabilidade**: Sistema de transações ACID

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
│   ├── repositories/     # Acesso a dados (mock em memória)
│   │   └── CompanyRepository.ts
│   ├── interfaces/       # Interfaces TypeScript
│   │   ├── ICompany.ts
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

## ⚙️ Primeiro Uso

```bash
# 1. Popular banco com dados iniciais (apenas primeira vez)
npm run seed

# 2. Iniciar servidor
npm run dev
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

O servidor estará disponível em: **http://localhost:3001**

## 🌐 Endpoints da API

### Empresas

- **GET** `/api/companies` - Lista todas as empresas
- **GET** `/api/companies/:id` - Busca empresa por ID
- **GET** `/api/companies/cnpj/:cnpj` - Busca empresa por CNPJ
- **POST** `/api/companies` - Cria nova empresa
- **PUT** `/api/companies/:id` - Atualiza empresa
- **DELETE** `/api/companies/:id` - Remove empresa

### Health Check

- **GET** `/health` - Verifica status do servidor

## 📝 Exemplos de Uso

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

### Atualizar empresa
```bash
curl -X PUT http://localhost:3001/api/companies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nomeFantasia": "Novo Nome",
    "situacaoCadastral": "ATIVA"
  }'
```

### Deletar empresa
```bash
curl -X DELETE http://localhost:3001/api/companies/1
```

## 📊 Dados Mockados

O servidor vem com 3 empresas de exemplo para teste inicial:
1. **TechSol** - Tech Solutions Ltda (São Paulo/SP)
2. **DigiShop** - Comércio Digital S.A. (Rio de Janeiro/RJ)
3. **ConsultaBiz** - Consultoria Empresarial ME (Belo Horizonte/MG)

Execute `npm run seed` para popular o banco com esses dados.

## 🔧 Configuração

Por padrão, o servidor roda na porta **3001**. Para alterar, crie um arquivo `.env`:

```bash
PORT=3000
```

### Estrutura de Pastas

```
servidor/
├── data/              # Banco de dados SQLite
│   └── ascenda.db
├── src/
│   ├── database/      # Configuração do banco
│   ├── controllers/   # Controladores
│   ├── services/      # Lógica de negócio
│   ├── repositories/  # Acesso a dados
│   └── routes/        # Rotas da API
└── ...
```

## 🎯 Validações Implementadas

- CNPJ único (não permite duplicatas)
- Campos obrigatórios: cnpj, razaoSocial, nomeFantasia
- Validação de existência ao atualizar/deletar
- Tratamento de erros adequado com códigos HTTP
- Transações ACID para integridade dos dados

## � Performance

O banco de dados está otimizado para:
- ✅ Milhares de empresas cadastradas
- ✅ Queries rápidas com índices otimizados
- ✅ Inserções em lote eficientes
- ✅ Cache inteligente de 10MB
- ✅ Write-Ahead Logging para consistência

## 🔄 Próximos Passos

- [x] Persistência em banco de dados SQLite
- [ ] Implementar autenticação JWT
- [ ] Adicionar validação de CNPJ
- [ ] Implementar paginação
- [ ] Adicionar testes unitários
- [ ] Implementar logs estruturados
- [ ] Sistema de backup automático
