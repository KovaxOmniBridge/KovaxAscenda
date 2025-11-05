import { AssetRepository } from '../repositories/AssetRepository';
import { IAsset, ICreateAsset, IUpdateAsset, AssetType, AssetStatus, OwnershipType, IAssetStats } from '../interfaces/IAsset';

export class AssetService {
    private assetRepository: AssetRepository;

    constructor() {
        this.assetRepository = new AssetRepository();
    }

    createAsset(data: ICreateAsset): IAsset {
        // Validações
        this.validateAssetData(data);

        // Se currentValue não foi informado, usar purchaseValue
        if (data.purchaseValue && !data.currentValue) {
            data.currentValue = data.purchaseValue;
        }

        // Calcular despesa mensal se não informada
        if (!data.monthlyExpense && data.expenses && data.expenses.length > 0) {
            data.monthlyExpense = this.calculateMonthlyExpense(data.expenses);
        }

        return this.assetRepository.create(data);
    }

    getAssetById(id: string): IAsset {
        const asset = this.assetRepository.findById(id);
        if (!asset) {
            throw new Error('Ativo não encontrado');
        }
        return asset;
    }

    getAllAssets(): IAsset[] {
        return this.assetRepository.findAll();
    }

    getAssetsByCompany(companyId: string): IAsset[] {
        return this.assetRepository.findByCompanyId(companyId);
    }

    getAssetsByType(type: AssetType, companyId?: string): IAsset[] {
        return this.assetRepository.findByType(type, companyId);
    }

    getAssetsByStatus(status: AssetStatus, companyId?: string): IAsset[] {
        return this.assetRepository.findByStatus(status, companyId);
    }

    updateAsset(id: string, data: IUpdateAsset): IAsset {
        // Validações
        if (data.type || data.name || data.status || data.ownershipType) {
            this.validateAssetData(data as ICreateAsset, true);
        }

        // Recalcular despesa mensal se expenses foi atualizado
        if (data.expenses && !data.monthlyExpense) {
            data.monthlyExpense = this.calculateMonthlyExpense(data.expenses);
        }

        return this.assetRepository.update(id, data);
    }

    deleteAsset(id: string): void {
        const asset = this.assetRepository.findById(id);
        if (!asset) {
            throw new Error('Ativo não encontrado');
        }
        this.assetRepository.delete(id);
    }

    getAssetStats(companyId: string): IAssetStats {
        const assets = this.assetRepository.findByCompanyId(companyId);

        const stats: IAssetStats = {
            totalAssets: assets.length,
            totalValue: 0,
            activeAssets: 0,
            inactiveAssets: 0,
            byType: {
                [AssetType.STORE]: 0,
                [AssetType.WAREHOUSE]: 0,
                [AssetType.REAL_ESTATE]: 0,
                [AssetType.CLINIC]: 0,
                [AssetType.VEHICLE]: 0,
                [AssetType.EQUIPMENT]: 0,
                [AssetType.FURNITURE]: 0,
                [AssetType.OTHER]: 0
            },
            byStatus: {
                [AssetStatus.ACTIVE]: 0,
                [AssetStatus.INACTIVE]: 0,
                [AssetStatus.MAINTENANCE]: 0,
                [AssetStatus.RENTED]: 0,
                [AssetStatus.FOR_SALE]: 0,
                [AssetStatus.SOLD]: 0
            },
            byOwnership: {
                [OwnershipType.OWNED]: 0,
                [OwnershipType.RENTED]: 0,
                [OwnershipType.LEASED]: 0,
                [OwnershipType.FINANCED]: 0
            },
            totalMonthlyExpenses: 0
        };

        assets.forEach(asset => {
            // Calcular valor total
            if (asset.currentValue) {
                stats.totalValue += asset.currentValue;
            }

            // Contar ativos/inativos
            if (asset.isActive) {
                stats.activeAssets++;
            } else {
                stats.inactiveAssets++;
            }

            // Contar por tipo
            if (stats.byType[asset.type] !== undefined) {
                stats.byType[asset.type]++;
            }

            // Contar por status
            if (stats.byStatus[asset.status] !== undefined) {
                stats.byStatus[asset.status]++;
            }

            // Contar por tipo de propriedade
            if (stats.byOwnership[asset.ownershipType] !== undefined) {
                stats.byOwnership[asset.ownershipType]++;
            }

            // Somar despesas mensais
            if (asset.monthlyExpense) {
                stats.totalMonthlyExpenses += asset.monthlyExpense;
            }
        });

        return stats;
    }

    addDocument(assetId: string, document: { name: string; type: 'contract' | 'deed' | 'photo' | 'invoice' | 'other'; url: string }): IAsset {
        const asset = this.getAssetById(assetId);
        
        const newDocument = {
            id: this.generateId(),
            name: document.name,
            type: document.type,
            url: document.url,
            uploadedAt: new Date().toISOString()
        };

        const documents = asset.documents || [];
        documents.push(newDocument);

        return this.assetRepository.update(assetId, { documents });
    }

    removeDocument(assetId: string, documentId: string): IAsset {
        const asset = this.getAssetById(assetId);
        
        if (!asset.documents) {
            throw new Error('Documento não encontrado');
        }

        const documents = asset.documents.filter(doc => doc.id !== documentId);
        return this.assetRepository.update(assetId, { documents });
    }

    addPhoto(assetId: string, photoUrl: string): IAsset {
        const asset = this.getAssetById(assetId);
        const photos = asset.photos || [];
        photos.push(photoUrl);
        return this.assetRepository.update(assetId, { photos });
    }

    removePhoto(assetId: string, photoUrl: string): IAsset {
        const asset = this.getAssetById(assetId);
        
        if (!asset.photos) {
            throw new Error('Foto não encontrada');
        }

        const photos = asset.photos.filter(photo => photo !== photoUrl);
        return this.assetRepository.update(assetId, { photos });
    }

    addExpense(assetId: string, expense: { description: string; amount: number; category: 'maintenance' | 'tax' | 'insurance' | 'rent' | 'utility' | 'other' }): IAsset {
        const asset = this.getAssetById(assetId);
        
        const newExpense = {
            id: this.generateId(),
            description: expense.description,
            amount: expense.amount,
            date: new Date().toISOString(),
            category: expense.category
        };

        const expenses = asset.expenses || [];
        expenses.push(newExpense);

        // Recalcular despesa mensal
        const monthlyExpense = this.calculateMonthlyExpense(expenses);

        return this.assetRepository.update(assetId, { expenses, monthlyExpense });
    }

    removeExpense(assetId: string, expenseId: string): IAsset {
        const asset = this.getAssetById(assetId);
        
        if (!asset.expenses) {
            throw new Error('Despesa não encontrada');
        }

        const expenses = asset.expenses.filter(exp => exp.id !== expenseId);
        const monthlyExpense = this.calculateMonthlyExpense(expenses);

        return this.assetRepository.update(assetId, { expenses, monthlyExpense });
    }

    private validateAssetData(data: Partial<ICreateAsset>, isUpdate: boolean = false): void {
        if (!isUpdate) {
            if (!data.companyId) {
                throw new Error('ID da empresa é obrigatório');
            }
            if (!data.type) {
                throw new Error('Tipo do ativo é obrigatório');
            }
            if (!data.name) {
                throw new Error('Nome do ativo é obrigatório');
            }
            if (!data.status) {
                throw new Error('Status do ativo é obrigatório');
            }
            if (!data.ownershipType) {
                throw new Error('Tipo de propriedade é obrigatório');
            }
        }

        // Validar tipo
        if (data.type && !Object.values(AssetType).includes(data.type)) {
            throw new Error('Tipo de ativo inválido');
        }

        // Validar status
        if (data.status && !Object.values(AssetStatus).includes(data.status)) {
            throw new Error('Status inválido');
        }

        // Validar tipo de propriedade
        if (data.ownershipType && !Object.values(OwnershipType).includes(data.ownershipType)) {
            throw new Error('Tipo de propriedade inválido');
        }

        // Validar valores
        if (data.purchaseValue !== undefined && data.purchaseValue < 0) {
            throw new Error('Valor de compra não pode ser negativo');
        }
        if (data.currentValue !== undefined && data.currentValue < 0) {
            throw new Error('Valor atual não pode ser negativo');
        }
        if (data.estimatedValue !== undefined && data.estimatedValue < 0) {
            throw new Error('Valor estimado não pode ser negativo');
        }

        // Validar números
        if (data.area !== undefined && data.area < 0) {
            throw new Error('Área não pode ser negativa');
        }
        if (data.capacity !== undefined && data.capacity < 0) {
            throw new Error('Capacidade não pode ser negativa');
        }
        if (data.year !== undefined && (data.year < 1800 || data.year > new Date().getFullYear() + 1)) {
            throw new Error('Ano inválido');
        }
    }

    private calculateMonthlyExpense(expenses: any[]): number {
        if (!expenses || expenses.length === 0) {
            return 0;
        }

        // Categorias que são mensais
        const monthlyCategories = ['rent', 'utility', 'insurance'];
        
        let monthlyTotal = 0;

        expenses.forEach(expense => {
            if (monthlyCategories.includes(expense.category)) {
                monthlyTotal += expense.amount;
            }
        });

        return monthlyTotal;
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
