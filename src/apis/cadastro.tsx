import React, { useState } from 'react';

// Função para enviar dados ao backend
async function cadastrarUsuario(dados: any) {
  const response = await fetch('/api/cadastro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Erro ao cadastrar');
  }
  return result; // result pode ser { status: 'existe' } ou { status: 'cadastrado' }
}

// Componente Modal de Cadastro
const ModalCadastro: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [form, setForm] = useState({ nomeEmpresa: '', nomeUsuarioUm: '', emailUsuarioUm: '', senha: '', confirmarSenha: '' });
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    if (form.senha !== form.confirmarSenha) {
      setMensagem('As senhas não coincidem!');
      return;
    }
    setLoading(true);
    try {
      const resultado = await cadastrarUsuario(form);
      if (resultado.status === 'existe') {
        setMensagem('Usuário já cadastrado!');
      } else {
        setMensagem('Cadastro realizado com sucesso!');
        setForm({ nomeEmpresa: '', nomeUsuarioUm: '', emailUsuarioUm: '', senha: '', confirmarSenha: '' });
        setTimeout(onClose, 1500);
      }
    } catch (err: any) {
      setMensagem(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Cadastrar Empresa</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nomeEmpresa" placeholder="Nome da empresa" value={form.nomeEmpresa} onChange={handleChange} required />
          <input type="text" name="nomeUsuarioUm" placeholder="Seu nome" value={form.nomeUsuarioUm} onChange={handleChange} required />
          <input type="email" name="emailUsuarioUm" placeholder="Seu e-mail" value={form.emailUsuarioUm} onChange={handleChange} required />
          <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} required minLength={6} />
          <input type="password" name="confirmarSenha" placeholder="Confirmar senha" value={form.confirmarSenha} onChange={handleChange} required minLength={6} />
          <button type="submit" className="btn-primary-flame" disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
          <button type="button" className="btn-secondary-flame" onClick={onClose} disabled={loading}>Cancelar</button>
        </form>
        {mensagem && <p>{mensagem}</p>}
      </div>
    </div>
  );
};

export default ModalCadastro;
export { cadastrarUsuario };