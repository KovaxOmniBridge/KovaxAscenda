// Interface de Endereço
export interface IAddress {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado: string;
    pais: string;
}

// Interface de Contato
export interface IContact {
    tipo: 'EMAIL' | 'TELEFONE' | 'CELULAR';
    valor: string;
    principal: boolean;
}

// Interface de Sócio/Parceiro
export interface IPartner {
    nome: string;
    cpf: string;
    qualificacao: string;
    dataEntrada: Date;
}

// Interface de Empresa
export interface ICompany {
    id: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    porte: 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE';
    regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
    situacaoCadastral: 'ATIVA' | 'INATIVA' | 'SUSPENSA';
    dataAbertura?: Date;
    endereco: IAddress;
    contatos?: IContact[];
    socios?: IPartner[];
    createdAt: Date;
    updatedAt: Date;
}
