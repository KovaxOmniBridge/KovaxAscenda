"""
Ascenda - Sistema de Organização Empresarial

Este módulo contém as classes principais para gerenciar empresas, setores e funcionalidades.
"""

from typing import List, Optional, Dict
from dataclasses import dataclass, field
from datetime import datetime
import json


@dataclass
class Funcionalidade:
    """
    Representa uma funcionalidade ou capacidade dentro de um setor.
    
    Attributes:
        id: Identificador único da funcionalidade
        nome: Nome da funcionalidade
        descricao: Descrição detalhada da funcionalidade
        status: Status atual (ativa, inativa, em desenvolvimento)
        data_criacao: Data de criação da funcionalidade
    """
    id: str
    nome: str
    descricao: str
    status: str = "ativa"
    data_criacao: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """Converte a funcionalidade para dicionário."""
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "status": self.status,
            "data_criacao": self.data_criacao.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Funcionalidade':
        """Cria uma funcionalidade a partir de um dicionário."""
        data_criacao = datetime.fromisoformat(data["data_criacao"]) if "data_criacao" in data else datetime.now()
        return cls(
            id=data["id"],
            nome=data["nome"],
            descricao=data["descricao"],
            status=data.get("status", "ativa"),
            data_criacao=data_criacao
        )


@dataclass
class Setor:
    """
    Representa um setor ou departamento dentro de uma empresa.
    
    Attributes:
        id: Identificador único do setor
        nome: Nome do setor (ex: TI, RH, Financeiro)
        descricao: Descrição do setor
        funcionalidades: Lista de funcionalidades do setor
        responsavel: Nome do responsável pelo setor
    """
    id: str
    nome: str
    descricao: str
    responsavel: Optional[str] = None
    funcionalidades: List[Funcionalidade] = field(default_factory=list)
    
    def adicionar_funcionalidade(self, funcionalidade: Funcionalidade) -> None:
        """Adiciona uma nova funcionalidade ao setor."""
        self.funcionalidades.append(funcionalidade)
    
    def remover_funcionalidade(self, funcionalidade_id: str) -> bool:
        """Remove uma funcionalidade do setor pelo ID."""
        for i, func in enumerate(self.funcionalidades):
            if func.id == funcionalidade_id:
                self.funcionalidades.pop(i)
                return True
        return False
    
    def listar_funcionalidades(self) -> List[Funcionalidade]:
        """Lista todas as funcionalidades do setor."""
        return self.funcionalidades
    
    def to_dict(self) -> Dict:
        """Converte o setor para dicionário."""
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "responsavel": self.responsavel,
            "funcionalidades": [f.to_dict() for f in self.funcionalidades]
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Setor':
        """Cria um setor a partir de um dicionário."""
        funcionalidades = [Funcionalidade.from_dict(f) for f in data.get("funcionalidades", [])]
        return cls(
            id=data["id"],
            nome=data["nome"],
            descricao=data["descricao"],
            responsavel=data.get("responsavel"),
            funcionalidades=funcionalidades
        )


@dataclass
class Empresa:
    """
    Representa uma empresa cliente que utiliza o sistema Ascenda.
    
    Attributes:
        id: Identificador único da empresa
        nome: Nome da empresa
        cnpj: CNPJ da empresa
        setores: Lista de setores da empresa
        data_cadastro: Data de cadastro no sistema
    """
    id: str
    nome: str
    cnpj: str
    setores: List[Setor] = field(default_factory=list)
    data_cadastro: datetime = field(default_factory=datetime.now)
    
    def adicionar_setor(self, setor: Setor) -> None:
        """Adiciona um novo setor à empresa."""
        self.setores.append(setor)
    
    def remover_setor(self, setor_id: str) -> bool:
        """Remove um setor da empresa pelo ID."""
        for i, setor in enumerate(self.setores):
            if setor.id == setor_id:
                self.setores.pop(i)
                return True
        return False
    
    def buscar_setor(self, setor_id: str) -> Optional[Setor]:
        """Busca um setor pelo ID."""
        for setor in self.setores:
            if setor.id == setor_id:
                return setor
        return None
    
    def listar_setores(self) -> List[Setor]:
        """Lista todos os setores da empresa."""
        return self.setores
    
    def to_dict(self) -> Dict:
        """Converte a empresa para dicionário."""
        return {
            "id": self.id,
            "nome": self.nome,
            "cnpj": self.cnpj,
            "setores": [s.to_dict() for s in self.setores],
            "data_cadastro": self.data_cadastro.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Empresa':
        """Cria uma empresa a partir de um dicionário."""
        setores = [Setor.from_dict(s) for s in data.get("setores", [])]
        data_cadastro = datetime.fromisoformat(data["data_cadastro"]) if "data_cadastro" in data else datetime.now()
        return cls(
            id=data["id"],
            nome=data["nome"],
            cnpj=data["cnpj"],
            setores=setores,
            data_cadastro=data_cadastro
        )


class GerenciadorAscenda:
    """
    Classe principal para gerenciar empresas, setores e funcionalidades no sistema Ascenda.
    """
    
    def __init__(self):
        self.empresas: Dict[str, Empresa] = {}
    
    def criar_empresa(self, id: str, nome: str, cnpj: str) -> Empresa:
        """Cria e registra uma nova empresa no sistema."""
        empresa = Empresa(id=id, nome=nome, cnpj=cnpj)
        self.empresas[id] = empresa
        return empresa
    
    def remover_empresa(self, empresa_id: str) -> bool:
        """Remove uma empresa do sistema."""
        if empresa_id in self.empresas:
            del self.empresas[empresa_id]
            return True
        return False
    
    def buscar_empresa(self, empresa_id: str) -> Optional[Empresa]:
        """Busca uma empresa pelo ID."""
        return self.empresas.get(empresa_id)
    
    def listar_empresas(self) -> List[Empresa]:
        """Lista todas as empresas cadastradas."""
        return list(self.empresas.values())
    
    def salvar_dados(self, arquivo: str) -> None:
        """Salva todos os dados em um arquivo JSON."""
        dados = {
            "empresas": [e.to_dict() for e in self.empresas.values()]
        }
        with open(arquivo, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
    
    def carregar_dados(self, arquivo: str) -> None:
        """Carrega dados de um arquivo JSON."""
        try:
            with open(arquivo, 'r', encoding='utf-8') as f:
                dados = json.load(f)
                self.empresas = {
                    e["id"]: Empresa.from_dict(e) 
                    for e in dados.get("empresas", [])
                }
        except FileNotFoundError:
            pass  # Se o arquivo não existir, começa com dados vazios
