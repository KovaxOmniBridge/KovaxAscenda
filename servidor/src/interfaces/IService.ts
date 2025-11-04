export interface IService {
    id: string;
    companyId: string;
    name: string;
    code?: string;
    category: 'CONSULTORIA' | 'MANUTENCAO' | 'INSTALACAO' | 'TREINAMENTO' | 'SUPORTE' | 'DESIGN' | 'OUTROS';
    description?: string;
    price: number;
    duration?: number; // em horas
    status: 'ATIVO' | 'INATIVO' | 'DESCONTINUADO';
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateService {
    name: string;
    code?: string;
    category: string;
    description?: string;
    price: number;
    duration?: number;
    status: string;
}

export interface IUpdateService {
    name?: string;
    code?: string;
    category?: string;
    description?: string;
    price?: number;
    duration?: number;
    status?: string;
}
