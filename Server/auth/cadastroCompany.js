
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Cadastra uma nova empresa e o primeiro usuário.
 * @param {Object} dados - { nomeUsuarioUm, emailUsuarioUm, nomeEmpresa }
 * @returns {Promise<{status: string, empresa?: any, message?: string}>}
 */
async function cadastrarEmpresaEUsuario(dados) {
	const { nomeUsuarioUm, emailUsuarioUm, nomeEmpresa } = dados;
	try {
		// Verifica se já existe usuário com esse email
		const usuarioExistente = await prisma.usuario.findUnique({
			where: { email: emailUsuarioUm }
		});
		if (usuarioExistente) {
			return { status: 'existe' };
		}
		// Cria empresa e usuário
		const empresa = await prisma.empresa.create({
			data: {
				nome: nomeEmpresa,
				usuarios: {
					create: {
						nome: nomeUsuarioUm,
						email: emailUsuarioUm
					}
				}
			}
		});
		return { status: 'cadastrado', empresa };
	} catch (err) {
		return { status: 'erro', message: err.message };
	}
}

module.exports = { cadastrarEmpresaEUsuario };