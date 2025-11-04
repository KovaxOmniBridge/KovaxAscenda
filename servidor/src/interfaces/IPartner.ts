export interface IPartner {
  nome: string;
  cpfCnpj: string;
  qualificacao: string;
  percentualParticipacao?: number;
  dataEntrada: Date;
}
