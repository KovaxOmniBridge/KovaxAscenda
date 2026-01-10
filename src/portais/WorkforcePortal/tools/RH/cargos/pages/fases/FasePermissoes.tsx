import React from "react";
import "./fases.css";

export interface Permissao {
  id: string;
  nome: string;
  descricao?: string;
  habilitada: boolean;
}

interface PermissoesProps {
  permissoes?: Permissao[]; // agora opcional
  onTogglePermissao: (id: string) => void;
}

const Permissoes: React.FC<PermissoesProps> = ({
  permissoes = [], // fallback estratégico
  onTogglePermissao,
}) => {
  const hasPermissoes = permissoes.length > 0;

  return (
    <div className="fase-container">
      <h4 className="fase-title">Permissões</h4>

      <p className="fase-description">
        Configure as permissões padrão associadas a este cargo. Essas permissões
        definem o nível de acesso dos usuários aos módulos e funcionalidades da
        plataforma.
      </p>

      <div className="fase-section">
        <h5 className="fase-section-title">Permissões disponíveis</h5>

        {!hasPermissoes && (
          <div className="fase-alert info">
            Nenhuma permissão disponível no momento.
          </div>
        )}

        {hasPermissoes &&
          permissoes.map((perm) => {
            const inputId = `permissao-${perm.id}`;

            return (
              <div key={perm.id} className="fase-permissao-row">
                <div className="fase-permissao-info">
                  <strong>{perm.nome}</strong>
                  {perm.descricao && (
                    <span className="fase-permissao-descricao">
                      {perm.descricao}
                    </span>
                  )}
                </div>

                {/* Toggle acessível e estável */}
                <label className="fase-toggle" htmlFor={inputId}>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={perm.habilitada}
                    aria-label={`Ativar permissão ${perm.nome}`}
                    onChange={() => onTogglePermissao(perm.id)}
                  />
                  <span
                    className="fase-toggle-slider"
                    aria-hidden="true"
                  />
                </label>
              </div>
            );
          })}
      </div>

      <div className="fase-alert info">
        As permissões configuradas aqui serão aplicadas automaticamente aos
        usuários vinculados a este cargo, respeitando as políticas de governança
        e segurança da plataforma.
      </div>
    </div>
  );
};

export default Permissoes;
