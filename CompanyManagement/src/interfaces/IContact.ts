export enum ContactType {
  EMAIL = 'EMAIL',
  TELEFONE = 'TELEFONE',
  CELULAR = 'CELULAR',
  WHATSAPP = 'WHATSAPP'
}

export interface IContact {
  tipo: ContactType;
  valor: string;
  principal: boolean;
}
