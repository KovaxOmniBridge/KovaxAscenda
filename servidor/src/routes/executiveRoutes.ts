import { Router } from 'express';
import { ExecutiveController } from '../controllers/ExecutiveController';

export function createExecutiveRoutes(executiveController: ExecutiveController): Router {
    const router = Router();

    // Dashboard
    router.get('/dashboard/:executiveId', executiveController.getDashboard);

    // Participações
    router.get('/participations/:executiveId', executiveController.getParticipations);
    router.get('/participation/:id', executiveController.getParticipationById);
    router.post('/participations', executiveController.createParticipation);
    router.put('/participation/:id', executiveController.updateParticipation);
    router.delete('/participation/:id', executiveController.deleteParticipation);

    // Verificação de acesso
    router.get('/access/:executiveId/:companyId', executiveController.checkAccess);

    return router;
}
