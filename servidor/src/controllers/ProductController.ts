import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    index = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const { category, status, lowStock } = req.query;

            let products;

            if (lowStock === 'true') {
                products = await this.productService.getLowStockProducts(companyId);
            } else if (category) {
                products = await this.productService.getProductsByCategory(companyId, category as string);
            } else if (status) {
                products = await this.productService.getProductsByStatus(companyId, status as string);
            } else {
                products = await this.productService.getAllProducts(companyId);
            }

            res.json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    show = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId, id } = req.params;
            const product = await this.productService.getProductById(companyId, id);
            res.json(product);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    store = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const product = await this.productService.createProduct(companyId, req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId, id } = req.params;
            const product = await this.productService.updateProduct(companyId, id, req.body);
            res.json(product);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId, id } = req.params;
            await this.productService.deleteProduct(companyId, id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
}
