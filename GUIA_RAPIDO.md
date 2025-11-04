# Guia Rápido - Ascenda

## Início Rápido

### 1. Execute o Exemplo
```bash
python3 exemplo.py
```

### 2. Use em Seu Projeto

```python
from ascenda import GerenciadorAscenda, Setor, Funcionalidade

# Inicialize o gerenciador
gerenciador = GerenciadorAscenda()

# Crie uma empresa
empresa = gerenciador.criar_empresa(
    id="minha_empresa",
    nome="Minha Empresa Ltda",
    cnpj="00.000.000/0001-00"
)

# Adicione um setor
setor_vendas = Setor(
    id="vendas01",
    nome="Vendas",
    descricao="Equipe comercial",
    responsavel="Maria Silva"
)
empresa.adicionar_setor(setor_vendas)

# Adicione funcionalidades ao setor
func_prospeccao = Funcionalidade(
    id="func01",
    nome="Prospecção",
    descricao="Busca de novos clientes"
)
setor_vendas.adicionar_funcionalidade(func_prospeccao)

# Salve os dados
gerenciador.salvar_dados("meus_dados.json")
```

## Operações Comuns

### Listar Todas as Empresas
```python
for empresa in gerenciador.listar_empresas():
    print(f"Empresa: {empresa.nome}")
```

### Buscar uma Empresa Específica
```python
empresa = gerenciador.buscar_empresa("minha_empresa")
```

### Listar Setores de uma Empresa
```python
for setor in empresa.listar_setores():
    print(f"Setor: {setor.nome}")
```

### Buscar um Setor Específico
```python
setor = empresa.buscar_setor("vendas01")
```

### Listar Funcionalidades de um Setor
```python
for func in setor.listar_funcionalidades():
    print(f"- {func.nome}: {func.descricao}")
```

### Remover uma Funcionalidade
```python
setor.remover_funcionalidade("func01")
```

### Remover um Setor
```python
empresa.remover_setor("vendas01")
```

### Remover uma Empresa
```python
gerenciador.remover_empresa("minha_empresa")
```

## Carregar Dados Salvos

```python
gerenciador = GerenciadorAscenda()
gerenciador.carregar_dados("meus_dados.json")

# Agora você pode trabalhar com os dados carregados
empresas = gerenciador.listar_empresas()
```

## Estrutura de Status

As funcionalidades podem ter os seguintes status:
- `"ativa"` - Funcionalidade em operação
- `"inativa"` - Funcionalidade desativada
- `"em desenvolvimento"` - Funcionalidade sendo implementada

```python
func = Funcionalidade(
    id="func02",
    nome="CRM",
    descricao="Sistema de gestão de clientes",
    status="em desenvolvimento"
)
```

## Testes

Execute os testes para verificar se tudo está funcionando:

```bash
python3 -m unittest test_ascenda.py -v
```

## Dicas

1. **IDs Únicos**: Use IDs únicos para empresas, setores e funcionalidades
2. **Persistência**: Chame `salvar_dados()` regularmente para não perder dados
3. **Organização**: Use nomes descritivos para facilitar a gestão
4. **Responsáveis**: Sempre atribua um responsável aos setores

## Exemplo de Estrutura Completa

```
Empresa: TechCorp
├── Setor: TI
│   ├── Funcionalidade: Suporte
│   ├── Funcionalidade: Desenvolvimento
│   └── Funcionalidade: Infraestrutura
├── Setor: RH
│   ├── Funcionalidade: Recrutamento
│   └── Funcionalidade: Treinamento
└── Setor: Financeiro
    ├── Funcionalidade: Contas a Pagar
    ├── Funcionalidade: Contas a Receber
    └── Funcionalidade: Orçamento
```
