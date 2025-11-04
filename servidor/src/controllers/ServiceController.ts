import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';

export class ServiceController {
    private serviceService: ServiceService;

    constructor() {
        this.serviceService = new ServiceService();
    }

    index = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const { category, status } = req.query;

            let services;

            // Se não houver companyId, buscar TODOS os serviços (para GeneralMarket)
            if (!companyId) {
                services = await this.serviceService.getAllServicesGlobal();
                res.json(services);
                return;
            }

            // Buscar serviços de uma empresa específica
            if (category) {
                services = await this.serviceService.getServicesByCategory(companyId, category as string);
            } else if (status) {
                services = await this.serviceService.getServicesByStatus(companyId, status as string);
            } else {
                services = await this.serviceService.getAllServices(companyId);
            }

            res.json(services);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    show = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId, id } = req.params;
            const service = await this.serviceService.getServiceById(companyId, id);
            res.json(service);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    store = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const service = await this.serviceService.createService(companyId, req.body);
            res.status(201).json(service);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId, id } = req.params;
            const service = await this.serviceService.updateService(companyId, id, req.body);
            res.json(service);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId, id } = req.params;
            await this.serviceService.deleteService(companyId, id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
}
