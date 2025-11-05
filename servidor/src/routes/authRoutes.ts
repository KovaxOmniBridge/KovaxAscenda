import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export function createAuthRoutes(authController: AuthController): Router {
    const router = Router();

    // Login e logout
    router.post('/login', authController.login);
    router.post('/logout', authController.logout);

    // Gerenciamento de token
    router.post('/refresh', authController.refreshToken);
    router.post('/validate-token', authController.validateToken);

    // Usuário atual
    router.get('/me', authController.getMe);

    // Alteração de senha
    router.post('/change-password', authController.changePassword);

    return router;
}
