import { IAddress } from './IAddress';
import { IContact } from './IContact';
import { IPartner } from './IPartner';

export enum CompanySize {
  MEI = 'MEI',
  ME = 'ME',
  EPP = 'EPP',
  MEDIO_PORTE = 'MEDIO_PORTE',
  GRANDE_PORTE = 'GRANDE_PORTE'
}

export enum TaxRegime {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  LUCRO_PRESUMIDO = 'LUCRO_PRESUMIDO',
  LUCRO_REAL = 'LUCRO_REAL'
}

export enum CompanyStatus {
  ATIVA = 'ATIVA',
  SUSPENSA = 'SUSPENSA',
  INAPTA = 'INAPTA',
  BAIXADA = 'BAIXADA'
}

export interface ICompany {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  dataAbertura: Date;
  porte: CompanySize;
  naturezaJuridica: string;
  regimeTributario: TaxRegime;
  situacaoCadastral: CompanyStatus;
  endereco: IAddress;
  contatos: IContact[];
  socios?: IPartner[];
  createdAt: Date;
  updatedAt: Date;
}
