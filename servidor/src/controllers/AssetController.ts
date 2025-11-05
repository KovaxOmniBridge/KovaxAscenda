import { Request, Response } from 'express';
import { AssetService } from '../services/AssetService';
import { ICreateAsset, IUpdateAsset, AssetType, AssetStatus } from '../interfaces/IAsset';

export class AssetController {
    private assetService: AssetService;

    constructor() {
        this.assetService = new AssetService();
    }

    createAsset = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: ICreateAsset = req.body;
            const asset = this.assetService.createAsset(data);
            res.status(201).json(asset);
        } catch (error: any) {
            console.error('Error creating asset:', error);
            res.status(400).json({ error: error.message || 'Erro ao criar ativo' });
        }
    };

    getAssetById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const asset = this.assetService.getAssetById(id);
            res.json(asset);
        } catch (error: any) {
            console.error('Error getting asset:', error);
            res.status(404).json({ error: error.message || 'Ativo não encontrado' });
        }
    };

    getAllAssets = async (req: Request, res: Response): Promise<void> => {
        try {
            const assets = this.assetService.getAllAssets();
            res.json(assets);
        } catch (error: any) {
            console.error('Error getting assets:', error);
            res.status(500).json({ error: 'Erro ao buscar ativos' });
        }
    };

    getAssetsByCompany = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const assets = this.assetService.getAssetsByCompany(companyId);
            res.json(assets);
        } catch (error: any) {
            console.error('Error getting company assets:', error);
            res.status(500).json({ error: 'Erro ao buscar ativos da empresa' });
        }
    };

    getAssetsByType = async (req: Request, res: Response): Promise<void> => {
        try {
            const { type } = req.params;
            const { companyId } = req.query;
            
            const assets = this.assetService.getAssetsByType(
                type as AssetType,
                companyId as string | undefined
            );
            res.json(assets);
        } catch (error: any) {
            console.error('Error getting assets by type:', error);
            res.status(500).json({ error: 'Erro ao buscar ativos por tipo' });
        }
    };

    getAssetsByStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status } = req.params;
            const { companyId } = req.query;
            
            const assets = this.assetService.getAssetsByStatus(
                status as AssetStatus,
                companyId as string | undefined
            );
            res.json(assets);
        } catch (error: any) {
            console.error('Error getting assets by status:', error);
            res.status(500).json({ error: 'Erro ao buscar ativos por status' });
        }
    };

    updateAsset = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data: IUpdateAsset = req.body;
            const asset = this.assetService.updateAsset(id, data);
            res.json(asset);
        } catch (error: any) {
            console.error('Error updating asset:', error);
            res.status(400).json({ error: error.message || 'Erro ao atualizar ativo' });
        }
    };

    deleteAsset = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            this.assetService.deleteAsset(id);
            res.status(204).send();
        } catch (error: any) {
            console.error('Error deleting asset:', error);
            res.status(404).json({ error: error.message || 'Erro ao deletar ativo' });
        }
    };

    getAssetStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const stats = this.assetService.getAssetStats(companyId);
            res.json(stats);
        } catch (error: any) {
            console.error('Error getting asset stats:', error);
            res.status(500).json({ error: 'Erro ao buscar estatísticas de ativos' });
        }
    };

    addDocument = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, type, url } = req.body;
            
            const asset = this.assetService.addDocument(id, { name, type, url });
            res.json(asset);
        } catch (error: any) {
            console.error('Error adding document:', error);
            res.status(400).json({ error: error.message || 'Erro ao adicionar documento' });
        }
    };

    removeDocument = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, documentId } = req.params;
            const asset = this.assetService.removeDocument(id, documentId);
            res.json(asset);
        } catch (error: any) {
            console.error('Error removing document:', error);
            res.status(400).json({ error: error.message || 'Erro ao remover documento' });
        }
    };

    addPhoto = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { url } = req.body;
            
            const asset = this.assetService.addPhoto(id, url);
            res.json(asset);
        } catch (error: any) {
            console.error('Error adding photo:', error);
            res.status(400).json({ error: error.message || 'Erro ao adicionar foto' });
        }
    };

    removePhoto = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { url } = req.body;
            
            const asset = this.assetService.removePhoto(id, url);
            res.json(asset);
        } catch (error: any) {
            console.error('Error removing photo:', error);
            res.status(400).json({ error: error.message || 'Erro ao remover foto' });
        }
    };

    addExpense = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { description, amount, category } = req.body;
            
            const asset = this.assetService.addExpense(id, { description, amount, category });
            res.json(asset);
        } catch (error: any) {
            console.error('Error adding expense:', error);
            res.status(400).json({ error: error.message || 'Erro ao adicionar despesa' });
        }
    };

    removeExpense = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, expenseId } = req.params;
            const asset = this.assetService.removeExpense(id, expenseId);
            res.json(asset);
        } catch (error: any) {
            console.error('Error removing expense:', error);
            res.status(400).json({ error: error.message || 'Erro ao remover despesa' });
        }
    };
}
