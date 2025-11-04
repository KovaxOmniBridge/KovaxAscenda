"""
Exemplo de uso do sistema Ascenda.

Este arquivo demonstra como utilizar o sistema para gerenciar empresas,
setores e funcionalidades.
"""

from ascenda import GerenciadorAscenda, Empresa, Setor, Funcionalidade


def exemplo_basico():
    """Exemplo básico de uso do sistema."""
    print("=" * 60)
    print("ASCENDA - Sistema de Organização Empresarial")
    print("=" * 60)
    print()
    
    # Criar o gerenciador
    gerenciador = GerenciadorAscenda()
    
    # 1. Criar uma empresa
    print("1. Criando empresa...")
    empresa = gerenciador.criar_empresa(
        id="emp001",
        nome="TechCorp Solutions",
        cnpj="12.345.678/0001-90"
    )
    print(f"   ✓ Empresa criada: {empresa.nome}")
    print()
    
    # 2. Adicionar setores à empresa
    print("2. Adicionando setores...")
    
    # Setor de TI
    setor_ti = Setor(
        id="ti001",
        nome="Tecnologia da Informação",
        descricao="Setor responsável por toda a infraestrutura tecnológica",
        responsavel="João Silva"
    )
    empresa.adicionar_setor(setor_ti)
    print(f"   ✓ Setor adicionado: {setor_ti.nome}")
    
    # Setor de RH
    setor_rh = Setor(
        id="rh001",
        nome="Recursos Humanos",
        descricao="Setor responsável pela gestão de pessoas",
        responsavel="Maria Santos"
    )
    empresa.adicionar_setor(setor_rh)
    print(f"   ✓ Setor adicionado: {setor_rh.nome}")
    
    # Setor Financeiro
    setor_fin = Setor(
        id="fin001",
        nome="Financeiro",
        descricao="Setor responsável pela gestão financeira",
        responsavel="Carlos Oliveira"
    )
    empresa.adicionar_setor(setor_fin)
    print(f"   ✓ Setor adicionado: {setor_fin.nome}")
    print()
    
    # 3. Adicionar funcionalidades aos setores
    print("3. Adicionando funcionalidades...")
    
    # Funcionalidades do setor de TI
    func_ti1 = Funcionalidade(
        id="func001",
        nome="Suporte Técnico",
        descricao="Atendimento e resolução de problemas técnicos",
        status="ativa"
    )
    setor_ti.adicionar_funcionalidade(func_ti1)
    
    func_ti2 = Funcionalidade(
        id="func002",
        nome="Desenvolvimento de Software",
        descricao="Criação e manutenção de sistemas internos",
        status="ativa"
    )
    setor_ti.adicionar_funcionalidade(func_ti2)
    
    func_ti3 = Funcionalidade(
        id="func003",
        nome="Infraestrutura de Rede",
        descricao="Gestão de servidores e redes",
        status="ativa"
    )
    setor_ti.adicionar_funcionalidade(func_ti3)
    print(f"   ✓ {len(setor_ti.funcionalidades)} funcionalidades adicionadas ao setor de TI")
    
    # Funcionalidades do setor de RH
    func_rh1 = Funcionalidade(
        id="func004",
        nome="Recrutamento",
        descricao="Processo de seleção de novos colaboradores",
        status="ativa"
    )
    setor_rh.adicionar_funcionalidade(func_rh1)
    
    func_rh2 = Funcionalidade(
        id="func005",
        nome="Treinamento",
        descricao="Capacitação e desenvolvimento de colaboradores",
        status="ativa"
    )
    setor_rh.adicionar_funcionalidade(func_rh2)
    print(f"   ✓ {len(setor_rh.funcionalidades)} funcionalidades adicionadas ao setor de RH")
    
    # Funcionalidades do setor Financeiro
    func_fin1 = Funcionalidade(
        id="func006",
        nome="Contas a Pagar",
        descricao="Gestão de pagamentos e fornecedores",
        status="ativa"
    )
    setor_fin.adicionar_funcionalidade(func_fin1)
    
    func_fin2 = Funcionalidade(
        id="func007",
        nome="Contas a Receber",
        descricao="Gestão de recebimentos e clientes",
        status="ativa"
    )
    setor_fin.adicionar_funcionalidade(func_fin2)
    
    func_fin3 = Funcionalidade(
        id="func008",
        nome="Orçamento",
        descricao="Planejamento e controle orçamentário",
        status="ativa"
    )
    setor_fin.adicionar_funcionalidade(func_fin3)
    print(f"   ✓ {len(setor_fin.funcionalidades)} funcionalidades adicionadas ao setor Financeiro")
    print()
    
    # 4. Exibir estrutura completa
    print("4. Estrutura da empresa:")
    print()
    print(f"Empresa: {empresa.nome} (CNPJ: {empresa.cnpj})")
    print(f"Data de Cadastro: {empresa.data_cadastro.strftime('%d/%m/%Y %H:%M')}")
    print()
    
    for setor in empresa.listar_setores():
        print(f"  📁 Setor: {setor.nome}")
        print(f"     Responsável: {setor.responsavel}")
        print(f"     Descrição: {setor.descricao}")
        print(f"     Funcionalidades:")
        for func in setor.listar_funcionalidades():
            print(f"       • {func.nome} - {func.descricao} [{func.status}]")
        print()
    
    # 5. Salvar dados
    print("5. Salvando dados...")
    gerenciador.salvar_dados("dados_ascenda.json")
    print("   ✓ Dados salvos em 'dados_ascenda.json'")
    print()
    
    # 6. Demonstrar carregamento de dados
    print("6. Carregando dados salvos...")
    novo_gerenciador = GerenciadorAscenda()
    novo_gerenciador.carregar_dados("dados_ascenda.json")
    empresas_carregadas = novo_gerenciador.listar_empresas()
    print(f"   ✓ {len(empresas_carregadas)} empresa(s) carregada(s)")
    print()
    
    print("=" * 60)
    print("Demonstração concluída com sucesso!")
    print("=" * 60)


if __name__ == "__main__":
    exemplo_basico()
