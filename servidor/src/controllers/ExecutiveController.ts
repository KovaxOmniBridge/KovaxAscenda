import { Request, Response } from 'express';
import { ExecutiveService } from '../services/ExecutiveService';
import { ICreateParticipation, IUpdateParticipation, ExecutiveRole, ParticipationStatus } from '../interfaces/IExecutive';

export class ExecutiveController {
    private executiveService: ExecutiveService;

    constructor(executiveService: ExecutiveService) {
        this.executiveService = executiveService;
    }

    /**
     * GET /api/executive/dashboard/:executiveId
     * Busca dashboard executivo consolidado
     */
    getDashboard = async (req: Request, res: Response): Promise<void> => {
        try {
            const { executiveId } = req.params;
            const dashboard = this.executiveService.getExecutiveDashboard(executiveId);
            res.json(dashboard);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/executive/participations/:executiveId
     * Lista participações de um executivo
     */
    getParticipations = async (req: Request, res: Response): Promise<void> => {
        try {
            const { executiveId } = req.params;
            const { activeOnly } = req.query;

            const participations = activeOnly === 'true'
                ? this.executiveService.getActiveParticipations(executiveId)
                : this.executiveService.getExecutiveParticipations(executiveId);

            res.json(participations);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/executive/participation/:id
     * Busca participação por ID
     */
    getParticipationById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const participation = this.executiveService.getParticipationById(id);

            if (!participation) {
                res.status(404).json({ error: 'Participação não encontrada' });
                return;
            }

            res.json(participation);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/executive/participations
     * Cria participação executiva
     */
    createParticipation = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: ICreateParticipation = req.body;

            if (!data.executiveId || !data.companyId || !data.role) {
                res.status(400).json({ error: 'executiveId, companyId e role são obrigatórios' });
                return;
            }

            const participation = this.executiveService.createParticipation(data);
            res.status(201).json(participation);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * PUT /api/executive/participation/:id
     * Atualiza participação
     */
    updateParticipation = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data: IUpdateParticipation = req.body;

            const participation = this.executiveService.updateParticipation(id, data);

            if (!participation) {
                res.status(404).json({ error: 'Participação não encontrada' });
                return;
            }

            res.json(participation);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * DELETE /api/executive/participation/:id
     * Remove participação
     */
    deleteParticipation = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const success = this.executiveService.deleteParticipation(id);

            if (!success) {
                res.status(404).json({ error: 'Participação não encontrada' });
                return;
            }

            res.json({ message: 'Participação removida com sucesso' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/executive/access/:executiveId/:companyId
     * Verifica se executivo tem acesso a empresa
     */
    checkAccess = async (req: Request, res: Response): Promise<void> => {
        try {
            const { executiveId, companyId } = req.params;
            const hasAccess = this.executiveService.hasAccessToCompany(executiveId, companyId);
            res.json({ hasAccess });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
