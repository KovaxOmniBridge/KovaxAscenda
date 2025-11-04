import { ICompany } from '../interfaces';

export interface ICompanyRepository {
  findAll(): Promise<ICompany[]>;
  findById(id: string): Promise<ICompany | null>;
  findByCnpj(cnpj: string): Promise<ICompany | null>;
  save(company: ICompany): Promise<ICompany>;
  update(id: string, company: Partial<ICompany>): Promise<ICompany>;
  delete(id: string): Promise<void>;
}
