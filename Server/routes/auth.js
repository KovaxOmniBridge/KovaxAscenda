const express = require('express');
const router = express.Router();

const { cadastrarEmpresaEUsuario } = require('../auth/cadastroCompany');
const { loginUsuario } = require('../auth/loginAscenda');

// Rota para cadastro de empresa e primeiro usuário
router.post('/cadastro', async (req, res) => {
	const { nomeUsuarioUm, emailUsuarioUm, nomeEmpresa } = req.body;
	const resultado = await cadastrarEmpresaEUsuario({ nomeUsuarioUm, emailUsuarioUm, nomeEmpresa });
	if (resultado.status === 'erro') {
		return res.status(500).json(resultado);
	}
	res.json(resultado);
});

// Rota para login de usuário
router.post('/login', async (req, res) => {
	const { email, senha } = req.body;
	const resultado = await loginUsuario({ email, senha });
	if (resultado.status === 'erro') {
		return res.status(401).json(resultado);
	}
	res.json(resultado);
});

module.exports = router;
