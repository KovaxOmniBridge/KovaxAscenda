# Ascenda
Uma empresa voltada para servir outras empresas

## 📋 Sobre o Projeto

**Ascenda** é um sistema de organização empresarial que permite gerenciar empresas, seus setores e funcionalidades de forma estruturada e eficiente. O sistema foi desenvolvido para ajudar empresas a organizar suas operações internas, departamentos e capacidades de forma clara e hierárquica.

## 🎯 Funcionalidades Principais

- **Gerenciamento de Empresas**: Cadastro e controle de múltiplas empresas cliente
- **Organização de Setores**: Criação e gerenciamento de departamentos dentro de cada empresa
- **Controle de Funcionalidades**: Registro de capacidades e funcionalidades de cada setor
- **Persistência de Dados**: Salvamento e carregamento de dados em formato JSON
- **Interface Simples**: API Python fácil de usar e estender

## 🏗️ Estrutura do Projeto

```
Ascenda/
├── ascenda.py          # Módulo principal com as classes do sistema
├── exemplo.py          # Exemplo de uso do sistema
├── requirements.txt    # Dependências do projeto
├── .gitignore         # Arquivos ignorados pelo Git
└── README.md          # Documentação
```

## 🚀 Como Usar

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Davi658/Ascenda.git
cd Ascenda
```

2. (Opcional) Crie um ambiente virtual:
```bash
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

### Execução do Exemplo

Execute o arquivo de exemplo para ver o sistema em ação:

```bash
python3 exemplo.py
```

### Uso Básico

```python
from ascenda import GerenciadorAscenda, Empresa, Setor, Funcionalidade

# Criar o gerenciador
gerenciador = GerenciadorAscenda()

# Criar uma empresa
empresa = gerenciador.criar_empresa(
    id="emp001",
    nome="Minha Empresa",
    cnpj="12.345.678/0001-90"
)

# Adicionar um setor
setor = Setor(
    id="ti001",
    nome="Tecnologia da Informação",
    descricao="Setor de TI",
    responsavel="João Silva"
)
empresa.adicionar_setor(setor)

# Adicionar uma funcionalidade ao setor
funcionalidade = Funcionalidade(
    id="func001",
    nome="Desenvolvimento",
    descricao="Desenvolvimento de software"
)
setor.adicionar_funcionalidade(funcionalidade)

# Salvar dados
gerenciador.salvar_dados("dados.json")

# Carregar dados
gerenciador.carregar_dados("dados.json")
```

## 📊 Estrutura de Dados

### Empresa
- **id**: Identificador único
- **nome**: Nome da empresa
- **cnpj**: CNPJ da empresa
- **setores**: Lista de setores
- **data_cadastro**: Data de cadastro

### Setor
- **id**: Identificador único
- **nome**: Nome do setor (ex: TI, RH, Financeiro)
- **descricao**: Descrição do setor
- **responsavel**: Nome do responsável
- **funcionalidades**: Lista de funcionalidades

### Funcionalidade
- **id**: Identificador único
- **nome**: Nome da funcionalidade
- **descricao**: Descrição detalhada
- **status**: Status (ativa, inativa, em desenvolvimento)
- **data_criacao**: Data de criação

## 💡 Exemplos de Uso

### Listar Todas as Empresas

```python
empresas = gerenciador.listar_empresas()
for empresa in empresas:
    print(f"Empresa: {empresa.nome}")
```

### Buscar um Setor Específico

```python
setor = empresa.buscar_setor("ti001")
if setor:
    print(f"Setor encontrado: {setor.nome}")
```

### Remover uma Funcionalidade

```python
setor.remover_funcionalidade("func001")
```

## 🛠️ Tecnologias

- Python 3.7+
- Dataclasses (biblioteca padrão)
- JSON (biblioteca padrão)
- Typing (biblioteca padrão)

## 📄 Licença

Este projeto está disponível para uso conforme necessário.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📞 Contato

Para mais informações sobre o projeto Ascenda, entre em contato através do repositório GitHub.
