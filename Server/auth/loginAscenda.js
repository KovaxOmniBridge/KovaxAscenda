const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Realiza o login de um usuário pelo email e senha (simples, sem hash para exemplo).
 * @param {Object} dados - { email, senha }
 * @returns {Promise<{status: string, usuario?: any, message?: string}>}
 */
async function loginUsuario(dados) {
	const { email, senha } = dados;
	try {
		// Busca usuário pelo email
		const usuario = await prisma.usuario.findUnique({
			where: { email }
		});
		if (!usuario) {
			return { status: 'erro', message: 'Usuário não encontrado' };
		}
		// Aqui você pode comparar a senha (se houver campo de senha no banco)
		// Exemplo: if (usuario.senha !== senha) { ... }
		return { status: 'ok', usuario };
	} catch (err) {
		return { status: 'erro', message: err.message };
	}
}

module.exports = { loginUsuario };
