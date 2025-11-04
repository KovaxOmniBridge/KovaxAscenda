import { Request, Response } from 'express';
import { CompanySiteService } from '../services/CompanySiteService';

export class CompanySiteController {
    private siteService: CompanySiteService;

    constructor() {
        this.siteService = new CompanySiteService();
    }

    // GET /api/companies/:companyId/site
    show = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const site = await this.siteService.getSiteByCompanyId(companyId);

            if (!site) {
                res.status(404).json({ message: 'Configurações do site não encontradas' });
                return;
            }

            res.json(site);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // POST /api/companies/:companyId/site
    createOrUpdate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const site = await this.siteService.createOrUpdate(companyId, req.body);
            res.json(site);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    // DELETE /api/companies/:companyId/site
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            await this.siteService.deleteSite(companyId);
            res.json({ message: 'Configurações do site removidas com sucesso' });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    // GET /api/sites/:slug
    showBySlug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const site = await this.siteService.getSiteBySlug(slug);

            if (!site) {
                res.status(404).json({ message: 'Site não encontrado' });
                return;
            }

            res.json(site);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // GET /api/sites
    index = async (req: Request, res: Response): Promise<void> => {
        try {
            const sites = await this.siteService.getAllSites();
            res.json(sites);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
