/* =========================================================
   REGISTRO CENTRAL DE MODAIS — PAINEL DE QUALIDADE
========================================================= */

import LucratividadeModal from "./ModalLucratividade";
import EficienciaSistemaModal from "./ModalEficienciaSistema";
import QualidadeOperacionalModal from "./ModalQualidadeOperacional";
import EficienciaSquadsModal from "./ModalEficienciaSquads";
import ModalFactory from "./ModalFactory";


/* =========================================================
   TIPAGEM PADRÃO DE MODAL
========================================================= */

export type QualidadeModalKey =
  | "lucratividade"
  | "eficienciaSistema"
  | "qualidadeOperacional"
  | "eficienciaSquads";

/* =========================================================
   MAPA KPI → MODAL
   (Single Source of Truth)
========================================================= */

export const QUALIDADE_MODAIS: Record<
  QualidadeModalKey,
  React.FC<any>
> = {
  lucratividade: LucratividadeModal,
  eficienciaSistema: EficienciaSistemaModal,
  qualidadeOperacional: QualidadeOperacionalModal,
  eficienciaSquads: EficienciaSquadsModal
};

/* =========================================================
   EXPORTS DIRETOS (OPCIONAL)
========================================================= */

export {
  LucratividadeModal,
  EficienciaSistemaModal,
  QualidadeOperacionalModal,
  EficienciaSquadsModal
};
