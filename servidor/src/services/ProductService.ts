import { ProductRepository } from '../repositories/ProductRepository';
import { IProduct, ICreateProduct, IUpdateProduct } from '../interfaces/IProduct';

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async createProduct(companyId: string, data: ICreateProduct): Promise<IProduct> {
        // Validations
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Nome do produto é obrigatório');
        }

        if (data.price <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }

        if (data.images && data.images.length > 10) {
            throw new Error('Máximo de 10 imagens permitidas');
        }

        return this.productRepository.create(companyId, data);
    }

    async getProductById(companyId: string, id: string): Promise<IProduct> {
        const product = this.productRepository.findById(companyId, id);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        return product;
    }

    async getAllProducts(companyId: string): Promise<IProduct[]> {
        return this.productRepository.findAll(companyId);
    }

    async getProductsByCategory(companyId: string, category: string): Promise<IProduct[]> {
        return this.productRepository.findByCategory(companyId, category);
    }

    async getProductsByStatus(companyId: string, status: string): Promise<IProduct[]> {
        return this.productRepository.findByStatus(companyId, status);
    }

    async getLowStockProducts(companyId: string): Promise<IProduct[]> {
        return this.productRepository.findLowStock(companyId);
    }

    async updateProduct(companyId: string, id: string, data: IUpdateProduct): Promise<IProduct> {
        if (data.price !== undefined && data.price <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }

        if (data.images && data.images.length > 10) {
            throw new Error('Máximo de 10 imagens permitidas');
        }

        const product = this.productRepository.update(companyId, id, data);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        return product;
    }

    async deleteProduct(companyId: string, id: string): Promise<void> {
        const deleted = this.productRepository.delete(companyId, id);
        
        if (!deleted) {
            throw new Error('Produto não encontrado');
        }
    }
}
