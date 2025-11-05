/**
 * Rotas para Pedidos de Cadastro de Empresas
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const companyRequestController = require('../controllers/companyRequest.controller');

// Configurar multer para upload de documentos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'company-documents');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB por arquivo
        files: 10 // Máximo 10 arquivos
    },
    fileFilter: (req, file, cb) => {
        // Aceitar apenas PDF, JPG, JPEG, PNG
        const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Use PDF, JPG ou PNG.'));
        }
    }
});

// Listar pedidos (filtro por status opcional)
router.get('/', companyRequestController.listRequests);

// Obter detalhes de um pedido específico
router.get('/:id', companyRequestController.getRequest);

// Criar novo pedido de cadastro (com upload de documentos)
router.post('/', upload.array('documents'), companyRequestController.createRequest);

// Aprovar pedido (cria empresa e usuários)
router.patch('/:id/approve', companyRequestController.approveRequest);

// Rejeitar pedido
router.patch('/:id/reject', companyRequestController.rejectRequest);

module.exports = router;
