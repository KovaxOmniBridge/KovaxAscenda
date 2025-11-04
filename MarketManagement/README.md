# 📦 MarketManagement - Gerenciamento de Produtos e Serviços

Sistema de gerenciamento de produtos e serviços organizados por empresa.

## 🎯 Funcionalidades

### Produtos
- ✅ Cadastro completo de produtos
- ✅ Controle de estoque com alertas de estoque mínimo
- ✅ Gerenciamento de preços e custos
- ✅ Cálculo automático de margem de lucro
- ✅ Categorização de produtos
- ✅ Código/SKU personalizado
- ✅ Status (Ativo/Inativo/Descontinuado)

### Serviços
- ✅ Cadastro de serviços oferecidos
- ✅ Controle de preços
- ✅ Duração estimada em horas
- ✅ Categorização de serviços
- ✅ Código personalizado
- ✅ Status (Ativo/Inativo/Descontinuado)

### Interface
- ✅ Listagem de empresas com informações básicas
- ✅ Modal detalhado por empresa
- ✅ Tabs separadas para Produtos e Serviços
- ✅ Busca e filtros
- ✅ Formulários de cadastro/edição
- ✅ Design responsivo

## 🚀 Como Usar

### 1. Iniciar o Servidor
```bash
cd servidor
npm start
```

### 2. Abrir a Interface
Abra o arquivo `MarketManagement/index.html` no navegador.

### 3. Workflow
1. **Selecione uma Empresa** - Clique em um card de empresa
2. **Gerencie Produtos** - Use a tab "Produtos" para adicionar/editar/excluir
3. **Gerencie Serviços** - Use a tab "Serviços" para adicionar/editar/excluir
4. **Busque Itens** - Use a busca para filtrar produtos/serviços

## 📊 Estrutura de Dados

### Produto
```typescript
{
  name: string              // Nome do produto *
  code?: string             // Código/SKU
  category: string          // Categoria *
  description?: string      // Descrição
  price: number            // Preço *
  cost?: number            // Custo
  stock: number            // Estoque *
  minStock?: number        // Estoque mínimo
  unit: string             // Unidade (UN, KG, L, M, CX, PC) *
  status: string           // Status (ATIVO, INATIVO, DESCONTINUADO) *
}
```

### Serviço
```typescript
{
  name: string              // Nome do serviço *
  code?: string             // Código
  category: string          // Categoria *
  description?: string      // Descrição
  price: number            // Preço *
  duration?: number        // Duração em horas
  status: string           // Status (ATIVO, INATIVO, DESCONTINUADO) *
}
```

## 🎨 Categorias

### Produtos
- Eletrônicos
- Alimentos
- Vestuário
- Móveis
- Cosméticos
- Livros
- Outros

### Serviços
- Consultoria
- Manutenção
- Instalação
- Treinamento
- Suporte
- Design
- Outros

## 🔧 API Endpoints

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

### Query Parameters
- `?category=CATEGORIA` - Filtrar por categoria
- `?status=STATUS` - Filtrar por status
- `?lowStock=true` - Produtos com estoque baixo (apenas produtos)

## 💡 Recursos Especiais

### Alertas de Estoque
Produtos com estoque igual ou menor que o estoque mínimo são destacados com ⚠️

### Cálculo de Margem
Quando informado custo e preço, a margem de lucro é calculada automaticamente:
```
Margem = ((Preço - Custo) / Preço) × 100
```

### Validações
- ✅ Nome obrigatório
- ✅ Preço maior que zero
- ✅ Estoque não negativo
- ✅ Duração não negativa (serviços)

## 🗄️ Banco de Dados

Os dados são armazenados permanentemente no SQLite:
- **Tabela:** `products`
- **Tabela:** `services`
- **Relacionamento:** Vinculados a empresas via `companyId`
- **Índices:** Otimizado para consultas por empresa, categoria e status

## 📱 Interface Responsiva

A interface se adapta automaticamente para:
- 💻 Desktop (grid de múltiplas colunas)
- 📱 Mobile (layout single column)
- 🖥️ Tablet (layout intermediário)

## 🎯 Próximos Passos

Para expandir o sistema, considere:
- [ ] Upload de imagens de produtos
- [ ] Importação/Exportação em lote (CSV/Excel)
- [ ] Relatórios de estoque
- [ ] Histórico de preços
- [ ] Códigos de barras
- [ ] Integração com notas fiscais
