import { ServiceRepository } from '../repositories/ServiceRepository';
import { IService, ICreateService, IUpdateService } from '../interfaces/IService';

export class ServiceService {
    private serviceRepository: ServiceRepository;

    constructor() {
        this.serviceRepository = new ServiceRepository();
    }

    async createService(companyId: string, data: ICreateService): Promise<IService> {
        // Validations
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Nome do serviço é obrigatório');
        }

        if (data.price <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }

        if (data.duration !== undefined && data.duration < 0) {
            throw new Error('Duração não pode ser negativa');
        }

        return this.serviceRepository.create(companyId, data);
    }

    async getServiceById(companyId: string, id: string): Promise<IService> {
        const service = this.serviceRepository.findById(companyId, id);
        
        if (!service) {
            throw new Error('Serviço não encontrado');
        }

        return service;
    }

    async getAllServices(companyId: string): Promise<IService[]> {
        return this.serviceRepository.findAll(companyId);
    }

    async getServicesByCategory(companyId: string, category: string): Promise<IService[]> {
        return this.serviceRepository.findByCategory(companyId, category);
    }

    async getServicesByStatus(companyId: string, status: string): Promise<IService[]> {
        return this.serviceRepository.findByStatus(companyId, status);
    }

    async updateService(companyId: string, id: string, data: IUpdateService): Promise<IService> {
        if (data.price !== undefined && data.price <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }

        if (data.duration !== undefined && data.duration < 0) {
            throw new Error('Duração não pode ser negativa');
        }

        const service = this.serviceRepository.update(companyId, id, data);
        
        if (!service) {
            throw new Error('Serviço não encontrado');
        }

        return service;
    }

    async deleteService(companyId: string, id: string): Promise<void> {
        const deleted = this.serviceRepository.delete(companyId, id);
        
        if (!deleted) {
            throw new Error('Serviço não encontrado');
        }
    }
}
