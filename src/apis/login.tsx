import React, { useState } from 'react';

// Função para enviar dados de login ao backend
async function loginUsuario(dados: { email: string; senha: string }) {
	const response = await fetch('/api/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dados),
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || 'Erro ao fazer login');
	}
	return result; // result pode ser { status: 'ok', usuario } ou { status: 'erro' }
}

// Componente Modal de Login
const ModalLogin: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
	const [form, setForm] = useState({ email: '', senha: '' });
	const [mensagem, setMensagem] = useState('');
	const [loading, setLoading] = useState(false);

	if (!open) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMensagem('');
		setLoading(true);
		try {
			const resultado = await loginUsuario(form);
			if (resultado.status === 'ok') {
				setMensagem('Login realizado com sucesso!');
				setTimeout(onClose, 1500);
			} else {
				setMensagem('E-mail ou senha inválidos!');
			}
		} catch (err: any) {
			setMensagem(err.message || 'Erro ao fazer login');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Login</h2>
				<form onSubmit={handleSubmit}>
					<input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
					<input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} required />
					<button type="submit" className="btn-primary-flame" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
					<button type="button" className="btn-secondary-flame" onClick={onClose} disabled={loading}>Cancelar</button>
				</form>
				{mensagem && <p>{mensagem}</p>}
			</div>
		</div>
	);
};

export default ModalLogin;
export { loginUsuario };
