import React, { useState } from "react";
import "./styles/dadosGerais.css";

/* =========================
   TIPAGENS
========================= */

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  arquivoUrl: string;
}

interface Usuario {
  id: string;
  foto: string;
  nome: string;
  email: string;
  idade: number;
  cargo: string;
  operacao: string;
  squad?: string;
  documentos: Documento[];
}

/* =========================
   MOCK DE USUÁRIO
========================= */

const MOCK_USUARIO: Usuario = {
  id: "u1",
  foto: "https://via.placeholder.com/120",
  nome: "João Pereira",
  email: "joao.pereira@empresa.com",
  idade: 32,
  cargo: "Analista de Sistemas",
  operacao: "Tecnologia",
  squad: "Plataforma Digital",
  documentos: [
    {
      id: "d1",
      nome: "RG",
      tipo: "Documento de Identidade",
      arquivoUrl: "#",
    },
    {
      id: "d2",
      nome: "Diploma",
      tipo: "Graduação em Sistemas de Informação",
      arquivoUrl: "#",
    },
  ],
};

/* =========================
   COMPONENTE
========================= */

const PerfilUsuario: React.FC = () => {
  const [usuario] = useState<Usuario>(MOCK_USUARIO);

  return (
    <div className="perfil-page">
      {/* HEADER */}
      <header className="perfil-header">
        <div className="perfil-info">
          <img src={usuario.foto} alt={usuario.nome} />
          <div>
            <h2>{usuario.nome}</h2>
            <span>{usuario.email}</span>
          </div>
        </div>
      </header>

      {/* DADOS GERAIS */}
      <section className="perfil-section">
        <h3>Dados do Usuário</h3>

        <div className="perfil-dados-grid">
          <div className="perfil-dado">
            <span>Idade</span>
            <strong>{usuario.idade} anos</strong>
          </div>

          <div className="perfil-dado">
            <span>Cargo</span>
            <strong>{usuario.cargo}</strong>
          </div>

          <div className="perfil-dado">
            <span>Operação</span>
            <strong>{usuario.operacao}</strong>
          </div>

          {usuario.squad && (
            <div className="perfil-dado">
              <span>Squad</span>
              <strong>{usuario.squad}</strong>
            </div>
          )}
        </div>
      </section>

      {/* DOCUMENTOS */}
      <section className="perfil-section">
        <h3>Documentos</h3>

        {usuario.documentos.length === 0 ? (
          <div className="perfil-empty">
            Nenhum documento cadastrado.
          </div>
        ) : (
          <div className="documentos-grid">
            {usuario.documentos.map((doc) => (
              <div key={doc.id} className="documento-card">
                <div className="documento-info">
                  <strong>{doc.nome}</strong>
                  <span>{doc.tipo}</span>
                </div>

                <div className="documento-actions">
                  <a
                    href={doc.arquivoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    Visualizar
                  </a>
                  <button className="btn-secondary">
                    Baixar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PerfilUsuario;
