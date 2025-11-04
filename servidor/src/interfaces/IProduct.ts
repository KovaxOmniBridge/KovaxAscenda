export interface IProduct {
    id: string;
    companyId: string;
    name: string;
    description?: string;
    code?: string;
    barcode?: string;
    qrcode?: string;
    category: 'ELETRONICOS' | 'ALIMENTOS' | 'VESTUARIO' | 'MOVEIS' | 'COSMETICOS' | 'LIVROS' | 'OUTROS';
    tags?: string[];
    price: number;
    status: 'ATIVO' | 'INATIVO' | 'DESCONTINUADO';
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateProduct {
    name: string;
    description?: string;
    code?: string;
    barcode?: string;
    qrcode?: string;
    category: string;
    tags?: string[];
    price: number;
    status: string;
    images?: string[];
}

export interface IUpdateProduct {
    name?: string;
    description?: string;
    code?: string;
    barcode?: string;
    qrcode?: string;
    category?: string;
    tags?: string[];
    price?: number;
    status?: string;
    images?: string[];
}
