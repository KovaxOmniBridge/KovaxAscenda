import React from "react";
import "./fases.css";

/* Tipos consolidados */
interface DadosGerais {
  nome?: string;
  descricao?: string;
  codigoInterno?: string;
  nivel?: string;
}

interface DadosFonte {
  fonte?: "interna" | "externa" | null;
  apiUrl?: string;
}

interface Permissao {
  id: string;
  nome: string;
  habilitada: boolean;
}

interface EventoAuditoria {
  id: string;
  nome: string;
  habilitado: boolean;
}

interface Documento {
  id: string;
  nome: string;
  obrigatorio: boolean;
}

interface ResumoProps {
  dadosGerais?: DadosGerais;
  dadosFonte?: DadosFonte;
  permissoes?: Permissao[];
  auditoria?: {
    nivel?: string;
    eventos?: EventoAuditoria[];
  };
  documentos?: Documento[];
}

const Resumo: React.FC<ResumoProps> = ({
  dadosGerais = {},
  dadosFonte = {},
  permissoes = [],
  auditoria = { nivel: "-", eventos: [] },
  documentos = [],
}) => {
  return (
    <div className="fase-container">
      <h4 className="fase-title">Resumo</h4>

      <p className="fase-description">
        Revise todas as configurações do cargo antes de concluir. Esta etapa
        garante consistência, governança e conformidade organizacional.
      </p>

      {/* Dados Gerais */}
      <div className="fase-section">
        <h5 className="fase-section-title">Dados gerais</h5>
        <ul className="fase-resumo-list">
          <li><strong>Nome:</strong> {dadosGerais.nome || "-"}</li>
          <li><strong>Descrição:</strong> {dadosGerais.descricao || "-"}</li>
          <li><strong>Código interno:</strong> {dadosGerais.codigoInterno || "-"}</li>
          <li><strong>Nível:</strong> {dadosGerais.nivel || "-"}</li>
        </ul>
      </div>

      {/* Fonte de dados */}
      <div className="fase-section">
        <h5 className="fase-section-title">Fonte de dados</h5>
        <ul className="fase-resumo-list">
          <li>
            <strong>Tipo:</strong>{" "}
            {dadosFonte.fonte === "interna"
              ? "Banco de dados interno"
              : dadosFonte.fonte === "externa"
              ? "Fonte externa (API)"
              : "-"}
          </li>

          {dadosFonte.fonte === "externa" && (
            <li>
              <strong>API:</strong> {dadosFonte.apiUrl || "-"}
            </li>
          )}
        </ul>
      </div>

      {/* Permissões */}
      <div className="fase-section">
        <h5 className="fase-section-title">Permissões</h5>
        {permissoes.filter(p => p.habilitada).length === 0 ? (
          <div className="fase-alert info">
            Nenhuma permissão habilitada.
          </div>
        ) : (
          <ul className="fase-resumo-list">
            {permissoes
              .filter(p => p.habilitada)
              .map(p => (
                <li key={p.id}>{p.nome}</li>
              ))}
          </ul>
        )}
      </div>

      {/* Auditoria */}
      <div className="fase-section">
        <h5 className="fase-section-title">Auditoria</h5>
        <ul className="fase-resumo-list">
          <li><strong>Nível:</strong> {auditoria.nivel || "-"}</li>

          {auditoria.eventos && auditoria.eventos.filter(e => e.habilitado).length === 0 ? (
            <li>Nenhum evento auditado</li>
          ) : (
            auditoria.eventos
              ?.filter(e => e.habilitado)
              .map(e => (
                <li key={e.id}>{e.nome}</li>
              ))
          )}
        </ul>
      </div>

      {/* Documentos */}
      <div className="fase-section">
        <h5 className="fase-section-title">Documentos</h5>
        {documentos.length === 0 ? (
          <div className="fase-alert info">
            Nenhum documento configurado.
          </div>
        ) : (
          <ul className="fase-resumo-list">
            {documentos.map(d => (
              <li key={d.id}>
                {d.nome}{" "}
                {d.obrigatorio && (
                  <span className="fase-badge danger">Obrigatório</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="fase-alert success">
        Se todas as informações estiverem corretas, finalize para salvar o cargo
        e aplicar as configurações.
      </div>
    </div>
  );
};

export default Resumo;
