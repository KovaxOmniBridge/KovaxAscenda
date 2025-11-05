# 💼 WealthManagement - Gestão de Patrimônio Físico

Módulo completo para gerenciamento de ativos físicos da empresa, incluindo lojas, estoques, imóveis, clínicas, veículos, equipamentos e mobília.

## 📋 Funcionalidades

### ✅ Gestão de Ativos
- Cadastro completo de ativos físicos
- 8 tipos de ativos suportados
- Controle de valores (compra, atual, estimado)
- Rastreamento de localização com GPS
- Gerenciamento de documentos e fotos
- Controle de despesas
- Sistema de tags para organização

### 📊 Dashboard
- Total de ativos cadastrados
- Valor total do patrimônio
- Ativos ativos/inativos
- Despesas mensais totais
- Filtros por empresa, tipo, status

### 🔍 Filtros e Busca
- Filtrar por empresa
- Filtrar por tipo de ativo
- Filtrar por status
- Busca por nome, descrição e tags

## 🏗️ Tipos de Ativos

| Tipo | Ícone | Descrição |
|------|-------|-----------|
| STORE | 🏪 | Lojas e pontos comerciais |
| WAREHOUSE | 📦 | Estoques e depósitos |
| REAL_ESTATE | 🏢 | Imóveis diversos |
| CLINIC | 🏥 | Clínicas e consultórios |
| VEHICLE | 🚗 | Veículos da frota |
| EQUIPMENT | ⚙️ | Equipamentos e máquinas |
| FURNITURE | 🪑 | Mobília e móveis |
| OTHER | 📋 | Outros ativos |

## 📈 Status Disponíveis

- **ACTIVE** (✅ Ativo) - Em uso normal
- **INACTIVE** (⏸️ Inativo) - Temporariamente fora de operação
- **MAINTENANCE** (🔧 Manutenção) - Em manutenção
- **RENTED** (🔑 Alugado) - Alugado para terceiros
- **FOR_SALE** (💰 À Venda) - Disponível para venda
- **SOLD** (✔️ Vendido) - Já vendido

## 🏷️ Tipos de Propriedade

- **OWNED** - Próprio (quitado)
- **RENTED** - Alugado
- **LEASED** - Arrendado
- **FINANCED** - Financiado

## 🗂️ Estrutura de Arquivos

```
WealthManagement/
├── index.html              # Listagem de ativos
├── add-asset.html          # Cadastro/edição de ativos
├── styles/
│   └── main.css           # Estilos globais
└── scripts/
    ├── api.js             # Funções de API
    ├── utils.js           # Utilitários
    ├── main.js            # Lógica da listagem
    └── add-asset.js       # Lógica do formulário
```

## 🔌 API Endpoints

### Ativos
```
GET    /api/assets                    # Listar todos
GET    /api/assets/:id                # Buscar por ID
GET    /api/assets/company/:companyId # Buscar por empresa
GET    /api/assets/type/:type         # Buscar por tipo
GET    /api/assets/status/:status     # Buscar por status
POST   /api/assets                    # Criar novo
PUT    /api/assets/:id                # Atualizar
DELETE /api/assets/:id                # Deletar
```

### Estatísticas
```
GET /api/assets/stats/:companyId  # Estatísticas da empresa
```

### Documentos
```
POST   /api/assets/:id/documents            # Adicionar documento
DELETE /api/assets/:id/documents/:documentId # Remover documento
```

### Fotos
```
POST   /api/assets/:id/photos    # Adicionar foto
DELETE /api/assets/:id/photos    # Remover foto
```

### Despesas
```
POST   /api/assets/:id/expenses            # Adicionar despesa
DELETE /api/assets/:id/expenses/:expenseId # Remover despesa
```

## 💾 Estrutura de Dados

### Asset (Ativo)
```typescript
{
  id: string
  companyId: string
  type: AssetType
  name: string
  description?: string
  purchaseValue?: number
  currentValue?: number
  estimatedValue?: number
  purchaseDate?: string
  warrantyExpiryDate?: string
  status: AssetStatus
  ownershipType: OwnershipType
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    latitude?: number
    longitude?: number
  }
  area?: number
  capacity?: number
  rooms?: number
  floors?: number
  parkingSpaces?: number
  brand?: string
  model?: string
  year?: number
  serialNumber?: string
  licensePlate?: string
  documents?: Array<{
    id: string
    name: string
    type: 'contract' | 'deed' | 'photo' | 'invoice' | 'other'
    url: string
    uploadedAt: string
  }>
  photos?: string[]
  expenses?: Array<{
    id: string
    description: string
    amount: number
    date: string
    category: 'maintenance' | 'tax' | 'insurance' | 'rent' | 'utility' | 'other'
  }>
  monthlyExpense?: number
  notes?: string
  tags?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

## 🎯 Casos de Uso

### Cadastrar uma Loja
1. Acesse WealthManagement
2. Clique em "Adicionar Ativo"
3. Selecione empresa e tipo "Loja"
4. Preencha informações (nome, endereço, área, etc.)
5. Adicione valor de compra e aluguel mensal
6. Salve

### Controlar Frota de Veículos
1. Cadastre veículos com tipo "VEHICLE"
2. Preencha marca, modelo, ano, placa
3. Adicione fotos e documentos (licenciamento, seguro)
4. Registre despesas (manutenção, IPVA, seguro)
5. Acompanhe valor e depreciação

### Gerenciar Imóveis
1. Cadastre imóveis com tipo "REAL_ESTATE"
2. Informe área, quartos, andares, vagas
3. Adicione localização com GPS
4. Anexe escritura e contratos
5. Controle despesas (IPTU, condomínio)

### Acompanhar Equipamentos
1. Cadastre equipamentos com tipo "EQUIPMENT"
2. Registre marca, modelo, número de série
3. Defina garantia e data de compra
4. Status "Manutenção" quando necessário
5. Histórico de despesas de manutenção

## 🔧 Backend

### Arquitetura
- **Interface**: `IAsset.ts` - Definições TypeScript
- **Repository**: `AssetRepository.ts` - Acesso ao banco SQLite
- **Service**: `AssetService.ts` - Regras de negócio
- **Controller**: `AssetController.ts` - HTTP handlers
- **Routes**: `assetRoutes.ts` - Endpoints Express

### Banco de Dados
Tabela `assets` no SQLite com 30+ campos:
- Informações básicas (id, companyId, type, name)
- Valores e datas
- Status e propriedade
- Localização (JSON)
- Características físicas
- Documentos e fotos (JSON arrays)
- Despesas (JSON array)
- Metadata (tags, notas)

### Validações
- Campos obrigatórios: companyId, type, name, status, ownershipType
- Valores não podem ser negativos
- Tipos e status devem ser válidos
- Ano entre 1800 e próximo ano
- Cálculo automático de despesa mensal

## 🎨 Frontend

### Páginas
1. **index.html** - Dashboard com cards e listagem
2. **add-asset.html** - Formulário dinâmico de cadastro

### Componentes
- Cards de estatísticas
- Filtros inteligentes
- Cards de ativos com fotos
- Formulário adaptável por tipo
- Toast notifications
- Empty states

### Design
- Design moderno com cards
- Cores por status
- Ícones representativos
- Responsivo (mobile-first)
- Hover effects e transições
- Gradientes e sombras

## 📱 Responsividade

✅ Desktop (1200px+)
✅ Tablet (768px - 1199px)
✅ Mobile (< 768px)

## 🚀 Como Usar

1. **Iniciar o servidor**
```bash
cd servidor
npm start
```

2. **Acessar WealthManagement**
```
Abra: WealthManagement/index.html
```

3. **Criar primeira empresa** (se necessário)
```
Acesse CompanyManagement e cadastre uma empresa
```

4. **Adicionar ativos**
```
Clique em "Adicionar Ativo" e preencha o formulário
```

## 🔐 Validações e Segurança

- ✅ Validação de campos obrigatórios
- ✅ Validação de tipos e enums
- ✅ Validação de valores numéricos
- ✅ Validação de anos
- ✅ Limite de 5MB para imagens Base64
- ✅ Foreign key com companies (CASCADE)

## 📊 Estatísticas Disponíveis

Por empresa:
- Total de ativos
- Valor total (soma de currentValue)
- Ativos ativos vs inativos
- Contagem por tipo (8 tipos)
- Contagem por status (6 status)
- Contagem por propriedade (4 tipos)
- Total de despesas mensais

## 🎯 Próximas Melhorias

- [ ] Upload de fotos e documentos direto pelo formulário
- [ ] Página de detalhes do ativo
- [ ] Gráficos de distribuição (charts.js)
- [ ] Exportar relatórios (PDF/Excel)
- [ ] Histórico de alterações
- [ ] Notificações de vencimentos (garantia, contratos)
- [ ] Integração com Google Maps
- [ ] QR Code para cada ativo
- [ ] App mobile para inventário

## 📝 Exemplos de Uso

### Criar Ativo
```javascript
const novaLoja = {
  companyId: 'company-uuid',
  type: 'STORE',
  name: 'Loja Shopping Center',
  description: 'Loja no 2º piso',
  purchaseValue: 500000,
  currentValue: 550000,
  status: 'ACTIVE',
  ownershipType: 'RENTED',
  location: {
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    country: 'Brasil'
  },
  area: 120,
  monthlyExpense: 15000,
  tags: ['shopping', 'centro'],
  isActive: true
};

await api.createAsset(novaLoja);
```

### Buscar Estatísticas
```javascript
const stats = await api.getAssetStats('company-uuid');
console.log(`Total: ${stats.totalAssets} ativos`);
console.log(`Valor: ${formatCurrency(stats.totalValue)}`);
console.log(`Lojas: ${stats.byType.STORE}`);
```

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador
2. Verifique os logs do servidor
3. Confirme que o servidor está rodando
4. Verifique a conexão com o banco de dados

---

**Versão:** 1.0.0  
**Última atualização:** 2024  
**Desenvolvido para:** Ascenda Platform
