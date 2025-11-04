"""
Testes unitários para o sistema Ascenda.

Execute com: python3 -m unittest test_ascenda.py
"""

import unittest
import os
import json
from datetime import datetime
from ascenda import (
    Funcionalidade, 
    Setor, 
    Empresa, 
    GerenciadorAscenda
)


class TestFuncionalidade(unittest.TestCase):
    """Testes para a classe Funcionalidade."""
    
    def test_criar_funcionalidade(self):
        """Testa a criação de uma funcionalidade."""
        func = Funcionalidade(
            id="func001",
            nome="Teste",
            descricao="Descrição de teste"
        )
        self.assertEqual(func.id, "func001")
        self.assertEqual(func.nome, "Teste")
        self.assertEqual(func.status, "ativa")
    
    def test_funcionalidade_to_dict(self):
        """Testa a conversão de funcionalidade para dicionário."""
        func = Funcionalidade(
            id="func001",
            nome="Teste",
            descricao="Descrição"
        )
        dados = func.to_dict()
        self.assertIn("id", dados)
        self.assertIn("nome", dados)
        self.assertIn("status", dados)
    
    def test_funcionalidade_from_dict(self):
        """Testa a criação de funcionalidade a partir de dicionário."""
        dados = {
            "id": "func001",
            "nome": "Teste",
            "descricao": "Descrição",
            "status": "ativa",
            "data_criacao": datetime.now().isoformat()
        }
        func = Funcionalidade.from_dict(dados)
        self.assertEqual(func.id, "func001")
        self.assertEqual(func.nome, "Teste")


class TestSetor(unittest.TestCase):
    """Testes para a classe Setor."""
    
    def test_criar_setor(self):
        """Testa a criação de um setor."""
        setor = Setor(
            id="setor001",
            nome="TI",
            descricao="Setor de TI"
        )
        self.assertEqual(setor.id, "setor001")
        self.assertEqual(setor.nome, "TI")
        self.assertEqual(len(setor.funcionalidades), 0)
    
    def test_adicionar_funcionalidade(self):
        """Testa a adição de funcionalidade ao setor."""
        setor = Setor(id="s1", nome="TI", descricao="TI")
        func = Funcionalidade(id="f1", nome="Dev", descricao="Dev")
        setor.adicionar_funcionalidade(func)
        self.assertEqual(len(setor.funcionalidades), 1)
    
    def test_remover_funcionalidade(self):
        """Testa a remoção de funcionalidade do setor."""
        setor = Setor(id="s1", nome="TI", descricao="TI")
        func = Funcionalidade(id="f1", nome="Dev", descricao="Dev")
        setor.adicionar_funcionalidade(func)
        resultado = setor.remover_funcionalidade("f1")
        self.assertTrue(resultado)
        self.assertEqual(len(setor.funcionalidades), 0)
    
    def test_remover_funcionalidade_inexistente(self):
        """Testa a remoção de funcionalidade que não existe."""
        setor = Setor(id="s1", nome="TI", descricao="TI")
        resultado = setor.remover_funcionalidade("inexistente")
        self.assertFalse(resultado)
    
    def test_setor_to_dict(self):
        """Testa a conversão de setor para dicionário."""
        setor = Setor(id="s1", nome="TI", descricao="TI")
        dados = setor.to_dict()
        self.assertIn("id", dados)
        self.assertIn("nome", dados)
        self.assertIn("funcionalidades", dados)


class TestEmpresa(unittest.TestCase):
    """Testes para a classe Empresa."""
    
    def test_criar_empresa(self):
        """Testa a criação de uma empresa."""
        empresa = Empresa(
            id="emp001",
            nome="TechCorp",
            cnpj="12.345.678/0001-90"
        )
        self.assertEqual(empresa.id, "emp001")
        self.assertEqual(empresa.nome, "TechCorp")
        self.assertEqual(len(empresa.setores), 0)
    
    def test_adicionar_setor(self):
        """Testa a adição de setor à empresa."""
        empresa = Empresa(id="e1", nome="Corp", cnpj="123")
        setor = Setor(id="s1", nome="TI", descricao="TI")
        empresa.adicionar_setor(setor)
        self.assertEqual(len(empresa.setores), 1)
    
    def test_remover_setor(self):
        """Testa a remoção de setor da empresa."""
        empresa = Empresa(id="e1", nome="Corp", cnpj="123")
        setor = Setor(id="s1", nome="TI", descricao="TI")
        empresa.adicionar_setor(setor)
        resultado = empresa.remover_setor("s1")
        self.assertTrue(resultado)
        self.assertEqual(len(empresa.setores), 0)
    
    def test_buscar_setor(self):
        """Testa a busca de setor na empresa."""
        empresa = Empresa(id="e1", nome="Corp", cnpj="123")
        setor = Setor(id="s1", nome="TI", descricao="TI")
        empresa.adicionar_setor(setor)
        encontrado = empresa.buscar_setor("s1")
        self.assertIsNotNone(encontrado)
        self.assertEqual(encontrado.id, "s1")
    
    def test_buscar_setor_inexistente(self):
        """Testa a busca de setor que não existe."""
        empresa = Empresa(id="e1", nome="Corp", cnpj="123")
        encontrado = empresa.buscar_setor("inexistente")
        self.assertIsNone(encontrado)


class TestGerenciadorAscenda(unittest.TestCase):
    """Testes para a classe GerenciadorAscenda."""
    
    def setUp(self):
        """Configuração antes de cada teste."""
        self.gerenciador = GerenciadorAscenda()
        self.arquivo_teste = "test_dados.json"
    
    def tearDown(self):
        """Limpeza após cada teste."""
        if os.path.exists(self.arquivo_teste):
            os.remove(self.arquivo_teste)
    
    def test_criar_empresa(self):
        """Testa a criação de empresa no gerenciador."""
        empresa = self.gerenciador.criar_empresa(
            id="e1",
            nome="Corp",
            cnpj="123"
        )
        self.assertEqual(len(self.gerenciador.empresas), 1)
        self.assertEqual(empresa.nome, "Corp")
    
    def test_remover_empresa(self):
        """Testa a remoção de empresa do gerenciador."""
        self.gerenciador.criar_empresa(id="e1", nome="Corp", cnpj="123")
        resultado = self.gerenciador.remover_empresa("e1")
        self.assertTrue(resultado)
        self.assertEqual(len(self.gerenciador.empresas), 0)
    
    def test_buscar_empresa(self):
        """Testa a busca de empresa no gerenciador."""
        self.gerenciador.criar_empresa(id="e1", nome="Corp", cnpj="123")
        encontrada = self.gerenciador.buscar_empresa("e1")
        self.assertIsNotNone(encontrada)
        self.assertEqual(encontrada.id, "e1")
    
    def test_listar_empresas(self):
        """Testa a listagem de empresas."""
        self.gerenciador.criar_empresa(id="e1", nome="Corp1", cnpj="123")
        self.gerenciador.criar_empresa(id="e2", nome="Corp2", cnpj="456")
        empresas = self.gerenciador.listar_empresas()
        self.assertEqual(len(empresas), 2)
    
    def test_salvar_e_carregar_dados(self):
        """Testa o salvamento e carregamento de dados."""
        # Criar dados de teste
        empresa = self.gerenciador.criar_empresa(
            id="e1",
            nome="TestCorp",
            cnpj="123"
        )
        setor = Setor(id="s1", nome="TI", descricao="TI")
        empresa.adicionar_setor(setor)
        
        # Salvar dados
        self.gerenciador.salvar_dados(self.arquivo_teste)
        self.assertTrue(os.path.exists(self.arquivo_teste))
        
        # Carregar dados em novo gerenciador
        novo_gerenciador = GerenciadorAscenda()
        novo_gerenciador.carregar_dados(self.arquivo_teste)
        
        # Verificar dados carregados
        self.assertEqual(len(novo_gerenciador.empresas), 1)
        empresa_carregada = novo_gerenciador.buscar_empresa("e1")
        self.assertIsNotNone(empresa_carregada)
        self.assertEqual(empresa_carregada.nome, "TestCorp")
        self.assertEqual(len(empresa_carregada.setores), 1)
    
    def test_carregar_arquivo_inexistente(self):
        """Testa o carregamento de arquivo que não existe."""
        # Não deve gerar erro, apenas começa com dados vazios
        self.gerenciador.carregar_dados("arquivo_inexistente.json")
        self.assertEqual(len(self.gerenciador.empresas), 0)


class TestIntegracao(unittest.TestCase):
    """Testes de integração do sistema completo."""
    
    def test_cenario_completo(self):
        """Testa um cenário completo de uso do sistema."""
        # Criar gerenciador
        gerenciador = GerenciadorAscenda()
        
        # Criar empresa
        empresa = gerenciador.criar_empresa(
            id="emp001",
            nome="TechCorp",
            cnpj="12.345.678/0001-90"
        )
        
        # Criar setor
        setor = Setor(
            id="ti001",
            nome="TI",
            descricao="Tecnologia",
            responsavel="João"
        )
        empresa.adicionar_setor(setor)
        
        # Criar funcionalidades
        func1 = Funcionalidade(
            id="f1",
            nome="Desenvolvimento",
            descricao="Dev"
        )
        func2 = Funcionalidade(
            id="f2",
            nome="Suporte",
            descricao="Suporte"
        )
        setor.adicionar_funcionalidade(func1)
        setor.adicionar_funcionalidade(func2)
        
        # Verificações
        self.assertEqual(len(gerenciador.listar_empresas()), 1)
        self.assertEqual(len(empresa.listar_setores()), 1)
        self.assertEqual(len(setor.listar_funcionalidades()), 2)
        
        # Remover funcionalidade
        setor.remover_funcionalidade("f1")
        self.assertEqual(len(setor.listar_funcionalidades()), 1)


if __name__ == '__main__':
    unittest.main()
