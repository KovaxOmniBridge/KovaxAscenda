export interface IProduct {
    id: string;
    companyId: string;
    name: string;
    code?: string;
    category: 'ELETRONICOS' | 'ALIMENTOS' | 'VESTUARIO' | 'MOVEIS' | 'COSMETICOS' | 'LIVROS' | 'OUTROS';
    description?: string;
    price: number;
    cost?: number;
    stock: number;
    minStock?: number;
    unit: 'UN' | 'KG' | 'L' | 'M' | 'CX' | 'PC';
    status: 'ATIVO' | 'INATIVO' | 'DESCONTINUADO';
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateProduct {
    name: string;
    code?: string;
    category: string;
    description?: string;
    price: number;
    cost?: number;
    stock: number;
    minStock?: number;
    unit: string;
    status: string;
}

export interface IUpdateProduct {
    name?: string;
    code?: string;
    category?: string;
    description?: string;
    price?: number;
    cost?: number;
    stock?: number;
    minStock?: number;
    unit?: string;
    status?: string;
}
